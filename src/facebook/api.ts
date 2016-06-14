import * as request from 'request';
import {IBotSettings} from '../interfaces';
import {IFbResponse} from './interfaces';
import * as Promise from 'bluebird';

const BASE_API = 'https://graph.facebook.com/v2.6';


export interface IFacebookProfile {
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
  locale?: string;
  timezone?: number;
  gender?: string;
}

export class FacebookApi {
  
  constructor(private settings: IBotSettings) {}
  
  public sendMessage(msg: IFbResponse): Promise<any> {
    return new Promise( (resolve: Function, reject: Function) => {
      request.post({
        url: `${BASE_API}/me/messages?access_token=${this.settings.fb.access_token}`,
        body: msg, json: true
      }, (err, res, body) => {
        if (err) {
          console.log('facebook: could not send msg to fb', JSON.stringify(err, null, 2));
          return reject(err);
        }
        if (res.statusCode >= 400) {
          return reject(new Error(`facebook: Error sending to fb ${JSON.stringify(res)} ${JSON.stringify(msg)}`));
        }
        if (this.settings.debug) console.log(`facebook: reply sent ${JSON.stringify(res)}` );
        return resolve(res);
      });
    });
  }
  
  public getUserDetails(userId: number): Promise<IFacebookProfile> {
    return new Promise( (resolve: Function, reject: Function) => {
      request.get({
        url: `${BASE_API}/${userId}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${this.settings.fb.access_token}`
      }, (err, res, body) => {
        if (err) {
          console.log('facebook: could not get user from facebook', JSON.stringify(err, null, 2));
          reject(err);
        }
        if (res.statusCode >= 400) {
          console.log('facebook: could not get user from facebook', JSON.stringify(body, null, 2));
          reject(new Error(`facebook: Error getting profile for user ${JSON.stringify(body)} ${JSON.stringify(userId)}`));
        }
        var obj = {};
        try {
          obj = JSON.parse(body);
        } catch (e) {
          obj = body;
        }
        return resolve(<any> obj);
      });
    });
    
  }
  
  public subscribe() {
    request.post(`${BASE_API}/me/subscribed_apps?access_token=${this.settings.fb.access_token}`, (err, res, body) => {
      if (err) {
        console.log('facebook: could not subscribe to fb', JSON.stringify(err, null, 2));
        throw err;
      }
      if (res.statusCode >= 400) {
        throw new Error(`facebook: Error connecting to fb ${JSON.stringify(res)}`);
      }
      console.log('facebook: subscribed to fb');
    });
  }
}