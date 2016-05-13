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
  
  private startWebServer() {
    let server = new Server();
    server.connection({
      host: 'localhost',
      port: this.settings.fb.port
    });
    server.route({
      method: 'GET',
      path: '/facebook/receive',
      handler: this.verifyRequest.bind(this)
    });
    server.route({
      method: 'POST',
      path: '/facebook/receive',
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
    let hub: IFacebookVerifyHubParams = request.query.hub;
    if (hub.mode === FACEBOOK_HUB_MODE.SUBSCRIBE) {
      if (hub.verify_token === this.settings.fb.verify_token) {
        return reply(hub.challenge);
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