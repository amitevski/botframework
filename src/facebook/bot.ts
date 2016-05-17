import {IBotController, IBotSettings, IBotUser, ITextMessage, IBotReply, IBotReplyListItem} from '../interfaces'
import {IFbResponse, IFbCallback, FB_RESPONSE_ATTACHMENT_PAYLOAD_TYPE, FB_RESPONSE_ATTACHMENT_TYPE, IFbMessaging, FB_ATTACHMENT_TYPE, FB_MESSAGE_TYPE} from './interfaces';
import {FacebookApi} from './api';

export class FacebookReply implements IBotReply {
  constructor(private recipientId: number, private fbApi: FacebookApi) {}
  text(text: string) {
    let response = {
      recipient: {
        id: this.recipientId
      },
      message: {text}
    };
    this.fbApi.sendMessage(response);
  }
  list(elements: Array<IBotReplyListItem>) {
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
    this.fbApi.sendMessage(response);
  }
}

export class FacebookBot {
  fbApi: FacebookApi = null;
  constructor(private settings: IBotSettings, private botController: IBotController) {
    this.fbApi = new FacebookApi(settings);
  }
  
  public receiveMessage(fbMessage: IFbCallback) {
    // console.log('received message ..', JSON.stringify(fbMessage, null, 2));
    if (fbMessage.object !== FB_MESSAGE_TYPE.PAGE) return false;
    for (var entry of fbMessage.entry) {
      // skip messages for other page_id
      if (entry.id.toString() !== this.settings.fb.page_id) {
        console.log('skipping', JSON.stringify(entry, null, 2));
        continue;
      }
      // console.log('messaging ..', JSON.stringify(entry.messaging, null, 2));
      for (var messaging of entry.messaging) {
        this.dispatchSingleMessage(messaging);
      }
    }
    return true;
  }
  
  public dispatchSingleMessage(messaging: IFbMessaging) {
    let reply: FacebookReply = new FacebookReply(messaging.sender.id, this.fbApi);
    // console.log('dispatching..');
    if (messaging.optin) {
      let user = this.getNewUserFromMessage(messaging);
      return this.botController.newUser(user, reply);
      
    }
    if (messaging.message) {
      if (messaging.message.text) {
        let textMessage: ITextMessage =  {
          user: this.getUserFromMessage(messaging),
          text: messaging.message.text
        }
        console.log(JSON.stringify(textMessage));
        return (this.botController.textMessage) ? this.botController.textMessage(textMessage, reply) : null;
      }
      if (messaging.message.attachments) {
        return this.dispatchAttachmentMessage(messaging);
      }
    }
    return (this.botController.catchAll) ? this.botController.catchAll(this.getUserFromMessage(messaging), messaging, reply) : null;
  }
  
  
  private dispatchAttachmentMessage(messaging: IFbMessaging) {
    let user = this.getUserFromMessage(messaging);
    let reply: FacebookReply = new FacebookReply(messaging.sender.id, this.fbApi);
    for ( var attachment of messaging.message.attachments) {
      switch (attachment.type) {
        case FB_ATTACHMENT_TYPE.IMAGE:
          let imageMessage = {
            user, link: {url: attachment.payload.url}
          };
          this.botController.imageMessage(imageMessage, reply) || null;
          break;
        case FB_ATTACHMENT_TYPE.LOCATION:
          let location = {
            user, location: {coordinates: attachment.payload.coordinates}
          };
          (this.botController.locationMessage) ? this.botController.locationMessage(location, reply) : null;
          break;
        case null:
          if (attachment.payload === null) {
            let link = {user, link: {url: attachment.url, title: attachment.title}};
            (this.botController.linkMessage) ? this.botController.linkMessage(link, reply) : null;
          }
          break;
        default:
          (this.botController.catchAll) ? this.botController.catchAll(user, messaging, reply) : null;
          break;
      }
    }
  }
  
  private getNewUserFromMessage(messaging: IFbMessaging): IBotUser {
    // get user details from fb api
    // graph.facebook.com/v2.6/message.sender.id
    //then
    return {
      id: messaging.sender.id.toString(),
      email: messaging.optin.ref
    };
  }
  
  private getUserFromMessage(messaging: IFbMessaging): IBotUser {
    return {
      id: messaging.sender.id.toString()
    };
  }
}



