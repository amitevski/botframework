import * as Promise from 'bluebird';

export interface IBotUser {
  id: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string; //url
  gender?: string;
  timezone?: number;
}


export interface ILink {
  url: string;
  title?: string;
}

export interface IImage {
  url: string;
}


export interface ICoordinates {
  lat: number;
  long: number;
}
export interface ILocation {
  title?: string;
  coordinates: ICoordinates;
}



// enum
// currently very aligned to facebook
export class BOT_REPLY_LIST_ACTION_TYPE {
  static LINK: string = 'web_url';
  static POSTBACK: string = 'postback';
}
export interface IBotReplyListItemAction {
  title: string;
  url?: string;
  payload?: string;
  type: BOT_REPLY_LIST_ACTION_TYPE;
}

export interface IBotReplyListItem {
  title: string;
  image_url?: string;
  subtitle?: string;
  buttons?: Array<IBotReplyListItemAction>; //buttons for facebook
}

// export interface IBotReplyList {
//   elements: Array<IBotReplyListItem>;
// }
export class BOT_REQUEST_TYPE {
  static FACEBOOK = 'facebook';
}

export interface IBotRequest {
  user: IBotUser;
  location?: ILocation;
  link?: ILink;
  ref?: string;
  payload?: string;
  image?: IImage;
  text?: string;
  raw?: any;
  type: BOT_REQUEST_TYPE; // facebook|slack...
}

export interface IBotReply {
  text(text: string): Promise<any>;
  buttons(text: string, buttons: IBotReplyListItemAction[]): Promise<any>;
  list(list: Array<IBotReplyListItem>): Promise<any>;
}

export interface IDeliveryMessage {
  user: IBotUser;
  delivery: any;
}


export interface IUnknownMessage {
  user: IBotUser;
  delivery: any;
}

export interface IBotController {
  newUser?(request: IBotRequest, reply: IBotReply): void;
  postback?(request: IBotRequest, reply: IBotReply): void;
  textMessage?(request: IBotRequest, reply: IBotReply): void;
  imageMessage?(request: IBotRequest, reply: IBotReply): void;
  audioMessage?(request: IBotRequest, reply: IBotReply): void;
  videoMessage?(request: IBotRequest, reply: IBotReply): void;
  linkMessage?(request: IBotRequest, reply: IBotReply): void;
  locationMessage?(request: IBotRequest, reply: IBotReply): void;
  delivered?(request: IBotRequest, reply: IBotReply): void;
  catchAll?(request: IBotRequest, reply: IBotReply): void;
}

export interface IBotSettings {
  fb?: IFacebookBotSettings;
  debug?: boolean;
}

export interface IFacebookBotSettings {
  port: number;
  callback_path: string;
  access_token: string;
  verify_token: string;
  page_id: string;
}

export * from './bot';
export * from './facebook';