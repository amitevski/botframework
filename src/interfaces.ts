
export interface IBotUser {
  id: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string; //url
  gender?: string;
  timezone?: number;
}

export interface ITextMessage {
  user: IBotUser;
  text: string;
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
  coordinates: ICoordinates;
}

export interface ILinkMessage {
  user: IBotUser;
  link: ILink;
}

export interface ILocationMessage {
  user: IBotUser;
  location: ILocation;
}

export interface IImageMessage {
  user: IBotUser;
  link: IImage;
}


export interface INewUserMessage {
  user: IBotUser;
  ref: string;
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

export interface IBotReply {
  text(text: string): void;
  list(list: Array<IBotReplyListItem>): void;
}

export interface IBotController {
  newUser?(msg: INewUserMessage, reply: IBotReply): void;
  textMessage?(textMessage: ITextMessage, reply: IBotReply): void;
  imageMessage?(imageMessage: IImageMessage, reply: IBotReply): void;
  linkMessage?(linkMessage: ILinkMessage, reply: IBotReply): void;
  locationMessage?(locationMessage: ILocationMessage, reply: IBotReply): void;
  delivered?(user: IBotUser, delivery: Object, reply: IBotReply): void;
  catchAll?(user: IBotUser, msg: Object, reply: IBotReply): void;
}

export interface IBotSettings {
  fb?: IFacebookBotSettings;
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