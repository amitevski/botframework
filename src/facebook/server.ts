import {IBotSettings} from '../interfaces';
import * as request from 'request';
import {Server, Request, IReply} from 'hapi';
import {FacebookBot} from './bot';

const BASE_API = 'https://graph.facebook.com/v2.6';

class FACEBOOK_HUB_MODE {
  static SUBSCRIBE: string = 'subscribe';
}
 
interface IFacebookVerifyHubParams {
  mode: string;
  verify_token: string;
  challenge: string;
}


export class FacebookServer {
  
  constructor(private settings: IBotSettings, private facebookBot: FacebookBot) {
    this.subscribe();
    this.startWebServer();
  }
  
  public setWelcomeMessage(text: string) {
    request.post(
      {
        url: `${BASE_API}/${this.settings.fb.page_id}/thread_settings?access_token=${this.settings.fb.access_token}`,
        body: {
          setting_type:"greeting",
          greeting: {
            text
          }
        },
        json: true
      }, (err, res, body) => {
      if (err) {
        console.log('could not change fb new thread settings', JSON.stringify(err, null, 2));
        throw err;
      }
      if (res.statusCode >= 400) {
        throw new Error(`Error connecting to fb ${JSON.stringify(res)}`);
      }
      console.log('changed fb new thread settings');
    });
  }
  
  private startWebServer() {
    let server = new Server();
    server.connection({
      port: this.settings.fb.port
    });
    server.route({
      method: 'GET',
      path: this.settings.fb.callback_path,
      handler: this.verifyRequest.bind(this)
    });
    server.route({
      method: 'POST',
      path: this.settings.fb.callback_path,
      handler: this.receiveMessage.bind(this)
    });
    server.start((err) => {
      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
    });
  }
  
  private receiveMessage(request: Request, reply: IReply) {
    this.facebookBot.receiveMessage(request.payload);
    reply('OK');
  }
  
  private verifyRequest(request: Request, reply: IReply) {
    let query: any = request.query;
    if (query['hub.mode'] === FACEBOOK_HUB_MODE.SUBSCRIBE) {
      if (query['hub.verify_token'] === this.settings.fb.verify_token) {
        return reply(query['hub.challenge']);
      }
    }
    reply('OK');
  }
  
  private subscribe() {
    request.post(`${BASE_API}/me/subscribed_apps?access_token=${this.settings.fb.access_token}`, (err, res, body) => {
      if (err) {
        console.log('could not subscribe to fb', JSON.stringify(err, null, 2));
        throw err;
      }
      if (res.statusCode >= 400) {
        throw new Error(`Error connecting to fb ${JSON.stringify(res)}`);
      }
      console.log('subscribed to fb');
    });
  }
}