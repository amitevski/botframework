import {IBotController, BOT_REQUEST_TYPE, IBotSettings, IBotUser, IBotRequest, IBotReply, IBotReplyListItemAction, IBotReplyListItem} from '../interfaces'
import {IFbResponse, IFbCallback, FB_RESPONSE_ATTACHMENT_PAYLOAD_TYPE, FB_RESPONSE_ATTACHMENT_TYPE, IFbMessaging, FB_ATTACHMENT_TYPE, FB_MESSAGE_TYPE} from './interfaces';
import {FacebookApi, IFacebookProfile} from './api';
import * as Promise from 'bluebird';

export class FacebookReply implements IBotReply {
  constructor(private recipientId: number, private fbApi: FacebookApi) {}

  text(text: string): Promise<any> {
    let response = {
      recipient: {
        id: this.recipientId
      },
      message: {text}
    };
    return this.fbApi.sendMessage(response);
  }

  list(elements: Array<IBotReplyListItem>): Promise<any> {
    let response: IFbResponse = {
      recipient: {
        id: this.recipientId
      },
      message: {
        attachment: {
          type: FB_RESPONSE_ATTACHMENT_TYPE.TEMPLATE,
          payload: {
            template_type: FB_RESPONSE_ATTACHMENT_PAYLOAD_TYPE.GENERIC,
            elements
          }
        }
      }
    };
    return this.fbApi.sendMessage(response);
  }
  
  buttons(text: string, buttons: IBotReplyListItemAction[]): Promise<any> {
    let response: IFbResponse = {
      recipient: {
        id: this.recipientId
      },
      message: {
        attachment: {
          type: FB_RESPONSE_ATTACHMENT_TYPE.TEMPLATE,
          payload: {
            template_type: FB_RESPONSE_ATTACHMENT_PAYLOAD_TYPE.BUTTON,
            text,
            buttons
          }
        }
      }
    };
    return this.fbApi.sendMessage(response);
  }
}

export class FacebookBot {
  profiles: Object = {}; 
  fbApi: FacebookApi = null;
  constructor(private settings: IBotSettings, private botController: IBotController) {
    this.fbApi = new FacebookApi(settings);
  }
  
  public receiveMessage(fbMessage: IFbCallback) {
    var promises: any = [];
    if (this.settings.debug) console.log('received message ..', JSON.stringify(fbMessage, null, 2));
    if (fbMessage.object !== FB_MESSAGE_TYPE.PAGE) return Promise.reject('invalid message type');
    for (var entry of fbMessage.entry) {
      // skip messages for other page_id
      if (entry.id.toString() !== this.settings.fb.page_id) {
        console.log('skipping', JSON.stringify(entry, null, 2));
        continue;
      }
      if (this.settings.debug) console.log('messaging ..', JSON.stringify(entry.messaging, null, 2));
      for (var messaging of entry.messaging) {
        let p = this.getUserFromMessage(messaging)
          .then(this.dispatchSingleMessage.bind(this, messaging))
          .catch( err => {
            console.log(`error retrieving user ${JSON.stringify(err)}`);
            throw err;
          });
        promises.push(p);
      }
    }
    return Promise.all(promises);
  }
  
  public dispatchSingleMessage(messaging: IFbMessaging, user: IBotUser) {
    let reply: FacebookReply = new FacebookReply(messaging.sender.id, this.fbApi);
    if (messaging.delivery) {
      let request = {
        user, delivery: messaging.delivery, type: BOT_REQUEST_TYPE.FACEBOOK
      };
      return (this.botController.delivered) ? this.botController.delivered(request, reply) : null;
    }
    if (this.settings.debug) console.log('dispatching..');
    if (messaging.optin) {
      return (this.botController.newUser) ? this.botController.newUser({
        user, ref: messaging.optin.ref,
        type: BOT_REQUEST_TYPE.FACEBOOK
      }, reply) : null;
    }
    if (messaging.postback) {
      return (this.botController.postback) ? this.botController.postback({
        user, payload: messaging.postback.payload,
        type: BOT_REQUEST_TYPE.FACEBOOK
      }, reply) : null;
    }
    if (messaging.message) {
      if (messaging.message.text) {
        let textMessage: IBotRequest =  {
          user,
          text: messaging.message.text,
          type: BOT_REQUEST_TYPE.FACEBOOK
        }
        if (this.settings.debug) console.log(JSON.stringify(textMessage));
        return (this.botController.textMessage) ? this.botController.textMessage(textMessage, reply) : null;
      }
      if (messaging.message.attachments) {
        return this.dispatchAttachmentMessage(messaging, user);
      }
    }
    let request = {
      user, raw: messaging,
      type: BOT_REQUEST_TYPE.FACEBOOK
    }
    return (this.botController.catchAll) ? this.botController.catchAll(request, reply) : null;
  }
  
  
  private dispatchAttachmentMessage(messaging: IFbMessaging, user: IBotUser) {
    let reply: FacebookReply = new FacebookReply(messaging.sender.id, this.fbApi);
    for ( var attachment of messaging.message.attachments) {
      switch (attachment.type) {
        case FB_ATTACHMENT_TYPE.IMAGE:
          let imageMessage = {
            user, link: {url: attachment.payload.url},
            type: BOT_REQUEST_TYPE.FACEBOOK
          };
          this.botController.imageMessage(imageMessage, reply) || null;
          break;
        case FB_ATTACHMENT_TYPE.AUDIO:
          let audioMessage = {
            user, link: {url: attachment.payload.url},
            type: BOT_REQUEST_TYPE.FACEBOOK
          };
          this.botController.audioMessage(audioMessage, reply) || null;
          break;
        case FB_ATTACHMENT_TYPE.VIDEO:
          let videoMessage = {
            user, link: {url: attachment.payload.url},
            type: BOT_REQUEST_TYPE.FACEBOOK
          };
          this.botController.videoMessage(videoMessage, reply) || null;
          break;
        case FB_ATTACHMENT_TYPE.LOCATION:
          let location: IBotRequest = {
            user, location: {coordinates: attachment.payload.coordinates}, type: BOT_REQUEST_TYPE.FACEBOOK
          };
          if (attachment.title) {
            location.location.title = attachment.title;
          }
          (this.botController.locationMessage) ? this.botController.locationMessage(location, reply) : null;
          break;
        case FB_ATTACHMENT_TYPE.FALLBACK:
          if (attachment.payload === null) {
            let link = {user, link: {url: attachment.url, title: attachment.title}, type: BOT_REQUEST_TYPE.FACEBOOK };
            (this.botController.linkMessage) ? this.botController.linkMessage(link, reply) : null;
          }
          break;
        default:
          let request = {user, raw: messaging, type: BOT_REQUEST_TYPE.FACEBOOK};
          (this.botController.catchAll) ? this.botController.catchAll(request, reply) : null;
          break;
      }
    }
  }
  
  
  private getUserProfile(userId: number): Promise<IFacebookProfile> {
    if (this.profiles[userId]) {
      return Promise.resolve(this.profiles[userId]);
    }
    return this.fbApi.getUserDetails(userId)
    .then( (profile: IFacebookProfile) => {
      this.profiles[userId] = profile;
      return profile;
    })
    .catch( (err: any) => {
      console.log('facebook: could not get profile, returning empty');
      return {};
    })
  }
  
  private getUserFromMessage(messaging: IFbMessaging): Promise<IBotUser> {
    return this.getUserProfile(messaging.sender.id)
    .then( (profile: IFacebookProfile) => {
      return {
        id: messaging.sender.id.toString(),
        firstname: profile.first_name || null,
        lastname: profile.last_name || null,
        avatar: profile.profile_pic || null,
        gender: profile.gender || null,
        timezone: profile.timezone || null,
      };
    });
  }
}



