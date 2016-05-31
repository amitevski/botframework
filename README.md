[![Build Status](https://travis-ci.org/amitevski/botframework.svg?branch=master)](https://travis-ci.org/amitevski/botframework)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


# Bot Framework

Bot Framework allows you to write bots for Facebook Messenger. But it has been designed to allow integration of other bots.

## Install
```bash
npm install botframework
```

## Usage

### Plan where you will deploy your bot

In order to setup the Facebook Bot in next step you need to define a

* callback url e.g. https://www.myhost.com/facebook/receive
* verify id e.g. "my-secure-id"

For testing I can recommend [http://localtunnel.me/](http://localtunnel.me/)
 

### Setup your facebook bot
follow https://developers.facebook.com/docs/messenger-platform/quickstart to set up your bot.
Note the access_token. We will need it

### general

### JavaScript

```javascript
var bf = require('../');
var bot = new bf.Bot({
  fb: {
    page_id: <your facebook page id>,
    verify_id: <your verify id>,
    port: 3000,
    callback_path: '/facebook/receive',
    access_token: <access_token from facebook>
  }
}, new ctrl());

function ctrl() {
  this.newUser = function (data) {
    console.log('user'+ JSON.stringify(data));
    reply.text('hi');
  };
  this.textMessage = function(data, reply) {
    reply.text('Servus: ' + data.text);
  };
  // newUser?(msg: INewUserMessage, reply: IBotReply): void;
  // imageMessage?(imageMessage: IImageMessage, reply: IBotReply): void;
  // linkMessage?(linkMessage: ILinkMessage, reply: IBotReply): void;
  // locationMessage?(locationMessage: ILocationMessage, reply: IBotReply): void;
  // catchAll?(user: IBotUser, msg: Object, reply: IBotReply): void;
}
```


### TypeScript

```javascript
import {IBotSettings, , IBotController} from 'botframework';

let botSettings: IBotSettings = {
  fb: {
    page_id: <your facebook page id>,
    verify_id: <your verify id>,
    port: 3000,
    callback_path: '/facebook/receive',
    access_token: <access_token from facebook>
  }
} ;

class BotController implements IBotController {
  textMessage(msg: ITextMessage, reply: IBotReply): any {
    reply.text('hi');
  }
  
  // newUser?(msg: INewUserMessage, reply: IBotReply): void;
  // imageMessage?(imageMessage: IImageMessage, reply: IBotReply): void;
  // linkMessage?(linkMessage: ILinkMessage, reply: IBotReply): void;
  // locationMessage?(locationMessage: ILocationMessage, reply: IBotReply): void;
  // catchAll?(user: IBotUser, msg: Object, reply: IBotReply): void;
}
var bot = new Bot(botSettings, new BotController());
```

### Handling other message types like Location, Image, Authentication

Botframework detects the facebook message type and calls the according handler callback function if its defined.

You can implement more handlers. Following callbacks are currently supported:

```javascript
export interface IBotController {
  newUser?(msg: INewUserMessage, reply: IBotReply): void; // handles facebook Authentication callback
  textMessage?(textMessage: ITextMessage, reply: IBotReply): void; // handles text only messages
  imageMessage?(imageMessage: IImageMessage, reply: IBotReply): void; // handles received images
  linkMessage?(linkMessage: ILinkMessage, reply: IBotReply): void; // handles received links from mobile phone sendTo Plugin
  locationMessage?(locationMessage: ILocationMessage, reply: IBotReply): void; // handles received locations
  catchAll?(user: IBotUser, msg: Object, reply: IBotReply): void;
}
```

### Replying

The Reply interfaces currently supports replying with a simple text message and a list message.

```javascript
// reply with list
let botItems: Array<IBotReplyListItem> =  response.data.map( (obj: Object) => {
  let buttons = [
      {
        title: 'Open Link',
        url: obj.href,
        type: 'web_url'
      }
    ];
  return {
    title: obj.name,
    image_url: obj.img_url
    subtitle: obj.desc || '',
    buttons
  }
});
reply.list(botItems);


//////

//reply with text
reply.text('Hi there');

//reply with buttons
let buttons: IBotReplyListItemAction[] = [
  {
    title: 'Open Link',
    url: obj.href,
    type: 'web_url'
  },
  {
    title: 'Show Updates',
    payload: 'SHOW_UPDATES',
    type: 'postback'
  }
];
reply.buttons('Please choose:', );

```