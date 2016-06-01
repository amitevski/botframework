[![Build Status](https://travis-ci.org/amitevski/botframework.svg?branch=master)](https://travis-ci.org/amitevski/botframework)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


# Bot Framework

Bot Framework allows you to write bots for Facebook Messenger implementing MVC like controllers.
But it has been designed to allow integration of other bots in future.

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

bot.setWelcomeMessage('Hello There'); // sets up the message on the facebook welcome screen for new users

function ctrl() {
  this.newUser = function (data) {
    console.log('user'+ JSON.stringify(data));
    reply.text('hi');
  };
  this.textMessage = function(data, reply) {
    reply.text('Servus: ' + data.text);
  };

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
  textMessage(msg: IBotRequest, reply: IBotReply): any {
    reply.text('hi');
  }

}
var bot = new Bot(botSettings, new BotController());
bot.setWelcomeMessage('Hello There'); // sets up the message on the facebook welcome screen for new users
```

### Handling other message types like Location, Image, Authentication

Botframework detects the facebook message type and calls the according handler callback function if its defined.

You can implement more handlers. Following callbacks are currently supported:

```javascript
export interface IBotController {
  newUser?(request: IBotRequest, reply: IBotReply): void; // handles facebook Authentication callback
  textMessage?(request: IBotRequest, reply: IBotReply): void; // handles plain text messages
  imageMessage?(request: IBotRequest, reply: IBotReply): void; // image received
  linkMessage?(request: IBotRequest, reply: IBotReply): void; // link received through e.g. safari sendTo Messenger plugin
  locationMessage?(request: IBotRequest, reply: IBotReply): void; // user sent his location
  delivered?(request: IBotRequest, reply: IBotReply): void; // facebook delivery message
  catchAll?(request: IBotRequest, reply: IBotReply): void; // everything unhandled goes here
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
reply.buttons('Please choose:', buttons);

```