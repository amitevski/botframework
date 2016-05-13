import {FacebookReply} from './facebook';
export interface IBotUser {
  id: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
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

export interface IBotController {
  newUser?(user: IBotUser): void;
  textMessage?(textMessage: ITextMessage, reply: FacebookReply): void;
  imageMessage?(imageMessage: IImageMessage): void;
  linkMessage?(linkMessage: ILinkMessage): void;
  locationMessage?(locationMessage: ILocationMessage): void;
  catchAll?(user: IBotUser, msg: Object): void;
}

export interface IBotSettings {
  fb?: IFacebookBotSettings;
}

export interface IFacebookBotSettings {
  port: number;
  access_token: string;
  verify_token: string;
  page_id: string;
}