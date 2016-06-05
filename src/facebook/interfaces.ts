import {ICoordinates} from '../interfaces';

// enum
export class FB_MESSAGE_TYPE {
  static PAGE: string = 'page';
}

// enum
export class FB_ATTACHMENT_TYPE {
  static IMAGE: string = 'image';
  static VIDEO: string = 'video';
  static AUDIO: string = 'audio';
  static LOCATION: string = 'location';
  static FALLBACK: string = 'fallback'; //e.g. receiving link
}

export interface IFbMessageUser {
  id: number;
}

export interface IFbMessageAttachmentPayload {
  url?: string;
  coordinates?: ICoordinates;
}

export interface IFbMessageAttachment {
  type: FB_ATTACHMENT_TYPE;
  url?: string;
  title?: string;
  payload?: IFbMessageAttachmentPayload;
}

export interface IFbMessage {
  mid: string;
  seq: number;
  text?: string;
  attachments?: Array<IFbMessageAttachment>;
}

export interface IFbMessageOptin {
  ref: string; // pass through param
}

export interface IFbPostbackPayload {
  payload: string;
}

export interface IFbMessaging {
  sender: IFbMessageUser;
  recipient: IFbMessageUser;
  timestamp: number; //timestamp
  message?: IFbMessage;
  optin?: IFbMessageOptin;
  delivery?: Object; // delivery
  postback?: IFbPostbackPayload; // postback with custom val
}

export interface IFbMessageEntry {
  id: number;
  time: number; //timestamp
  messaging: IFbMessaging[];
}

export interface IFbCallback {
  object: FB_MESSAGE_TYPE;
  entry: IFbMessageEntry[];
}



// enum
export class FB_RESPONSE_ATTACHMENT_TYPE {
  static TEMPLATE: string = 'template';
  static IMAGE: string = 'image';
}

// enum
export class FB_RESPONSE_ATTACHMENT_PAYLOAD_TYPE {
  static GENERIC: string = 'generic';
  static BUTTON: string = 'button';
  static RECEIPT: string = 'receipt';
}

// enum
// currently very aligned to facebook
export class BOT_REPLY_LIST_ACTION_TYPE {
  static LINK: string = 'web_url';
  static POSTBACK: string = 'postback';
}

export interface IFbResponseAttachmentPayloadElementAction {
  title: string;
  url?: string;
  payload?: string;
  type: BOT_REPLY_LIST_ACTION_TYPE;
}

export interface IFbResponseAttachmentPayloadElement {
  title: string;
  item_url?: string;
  image_url?: string;
  subtitle?: string;
  buttons?: Array<IFbResponseAttachmentPayloadElementAction>;
}
export interface IFbResponseAttachmentPayload {
  template_type: FB_RESPONSE_ATTACHMENT_PAYLOAD_TYPE;
  elements?: Array<IFbResponseAttachmentPayloadElement>; // for generic and receipt template_type
  text?: string; // for button template_type
  buttons?: Array<IFbResponseAttachmentPayloadElementAction>; // for button template_type
  // for receipt
  recipient_name?: string;
  order_number?: string;
  currency?: string;
  payment_method?: string;
  timestamp?: string;
  order_url?: string;
  // @todo replace object with types
  address?: Object;
  summary?: Object; 
  adjustments?: Object; 
}
export interface IFbResponseAttachment {
  type: FB_RESPONSE_ATTACHMENT_TYPE;
  payload: IFbResponseAttachmentPayload;
}
export interface IFbResponseMessage {
  text?: string;
  attachment?: IFbResponseAttachment;
}
export interface IFbResponse {
  recipient: IFbMessageUser;
  message?: IFbResponseMessage;
}


/*

send button 

"recipient":{
    "id":"USER_ID"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://petersapparel.parseapp.com",
            "title":"Show Website"
          },
          {
            "type":"postback",
            "title":"Start Chatting",
            "payload":"USER_DEFINED_PAYLOAD"
          }
        ]
      }
    }
  }

Receive a Message
{
  "object":"page",
  "entry":[
    {
      "id":"PAGE_ID",
      "time":1460245674269,
      "messaging":[
        {
          "sender":{
            "id": <USER_ID>
          },
          "recipient":{
            "id": <PAGE_ID>
          },
          "timestamp":1460245672080,
          "message":{
            "mid":"mid.1460245671959:dad2ec9421b03d6f78",
            "seq":216,
            "text":"hello"
          }
        }
      ]
    }
  ]
}

Authentication Callback

{
  "object":"page",
  "entry":[
    {
      "id":PAGE_ID,
      "time":12341,
      "messaging":[
        {
          "sender":{
            "id":USER_ID
          },
          "recipient":{
            "id":PAGE_ID
          },
          "timestamp":1234567890,
          "optin":{
            "ref":"PASS_THROUGH_PARAM"
          }
        }
      ]
    }
  ]
}


with attachment 

{
  "object":"page",
  "entry":[
    {
      "id":PAGE_ID,
      "time":1458696618911,
      "messaging":[
        {
          "sender":{
            "id":USER_ID
          },
          "recipient":{
            "id":PAGE_ID
          },
          "timestamp":1458696618268,
          "message":{
            "mid":"mid.1458696618141:b4ef9d19ec21086067",
            "seq":51,
            "attachments":[
              {
                "type":"image",
                "payload":{
                  "url":"IMAGE_URL"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}

Message delivered
{
   "object":"page",
   "entry":[
      {
         "id":PAGE_ID,
         "time":1458668856451,
         "messaging":[
            {
               "sender":{
                  "id":USER_ID
               },
               "recipient":{
                  "id":PAGE_ID
               },
               "delivery":{
                  "mids":[
                     "mid.1458668856218:ed81099e15d3f4f233"
                  ],
                  "watermark":1458668856253,
                  "seq":37
               }
            }
         ]
      }
   ]
}


receive location
{
  "object": "page",
  "entry": [
    {
      "id": 1442484699367623,
      "time": 1462967781419,
      "messaging": [
        {
          "sender": {
            "id": 10208007577165870
          },
          "recipient": {
            "id": 1442484699367623
          },
          "timestamp": 1462967781299,
          "message": {
            "mid": "mid.1462967780580:bf390766660e264343",
            "seq": 22,
            "attachments": [
              {
                "title": "Aco's Location",
                "url": "https://www.facebook.com/l.php?u=https%3A%2F%2Fwww.bing.com%2Fmaps%2Fdefault.aspx%3Fv%3D2%26pc%3DFACEBK%26mid%3D8100%26where1%3D48.13363694629%252C%2B11.580985066172%26FORM%3DFBKPL1%26mkt%3Den-US&h=8AQHEZDD6&s=1&enc=AZMBYZ1ofKFXoIuqj4JXKovMrSAJydqIqo9bEGYSiKfvDkzzYZfUi0bbkonJZIVul0mE9Annx0aT1orNmgAvbXFDd7Qyz7MVRnnqlVhUCcdzEQ",
                "type": "location",
                "payload": {
                  "coordinates": {
                    "lat": 48.13363694629,
                    "long": 11.580985066172
                  }
                }
              }
            ]
          }
        }
      ]
    }
  ]
}


link received from safari sendTo

{
  "object": "page",
  "entry": [
    {
      "id": 1442484699367623,
      "time": 1462967858595,
      "messaging": [
        {
          "sender": {
            "id": 10208007577165870
          },
          "recipient": {
            "id": 1442484699367623
          },
          "timestamp": 1462967858476,
          "message": {
            "mid": "mid.1462967858030:87813a92d2463da616",
            "seq": 26,
            "attachments": [
              {
                "title": "gutefrage - Google-Suche",
                "url": "https://www.facebook.com/l.php?u=https%3A%2F%2Fwww.google.de%2Fsearch%3Fq%3Dgutefrage%26ie%3DUTF-8%26oe%3DUTF-8%26hl%3Dde-de%26client%3Dsafari&h=IAQGo3-yd&s=1&enc=AZP3XDY97blRRvq76QC52LPHBanc5Pb0END1mBEUAygAS6BQWnTxVD0bCS07dPv_4dD1_RVFrh_EACKbxst9EaFDTQ5sIfObhBLyaK8xZDDRzQ",
                "type": "fallback",
                "payload": null
              }
            ]
          }
        }
      ]
    }
  ]
}


link directly entered by user

{
  "object": "page",
  "entry": [
    {
      "id": 1442484699367623,
      "time": 1462967927623,
      "messaging": [
        {
          "sender": {
            "id": 10208007577165870
          },
          "recipient": {
            "id": 1442484699367623
          },
          "timestamp": 1462967927530,
          "message": {
            "mid": "mid.1462967927428:ab8d3edb6f3d936c28",
            "seq": 33,
            "text": "Http://www.heise.de"
          }
        }
      ]
    }
  ]
}
*/