import * as request from 'request';
import {IBotSettings} from '../interfaces';
import {IFbResponse} from './interfaces';

const BASE_API = 'https://graph.facebook.com/v2.6';

export class FacebookApi {
  
  constructor(private settings: IBotSettings) {}
  
  public sendMessage(msg: IFbResponse) {
    request.post({
      url: `${BASE_API}/me/messages?access_token=${this.settings.fb.access_token}`,
      body: msg, json: true
    }, (err, res, body) => {
      if (err) {
        console.log('could not send msg to fb', JSON.stringify(err, null, 2));
        throw err;
      }
      if (res.statusCode >= 400) {
        throw new Error(`Error sending to fb ${JSON.stringify(res)} ${JSON.stringify(msg)}`);
      }
      console.log('reply sent');
    });
  }
  
  public subscribe() {
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