[![Build Status](https://travis-ci.org/amitevski/botframework.svg?branch=master)](https://travis-ci.org/amitevski/botframework)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Bot Framework

Bot Framework allows you to write bots for Facebook Messenger. But it has been designed to allow integration of other bots.

## Install
```bash
npm install botframework
```

## Usage

### JavaScript

```javascript
var bf = require('../');
var bot = new bf.Bot({
  fb: {
    page_id: process.env.FB_PAGE_ID, verify_id: process.env.FB_VERIFY_ID, port: process.env.FB_PORT,
    access_token: process.env.FB_ACCESS_TOKEN
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
  // imageMessage?(imageMessage: IImageMessage): void;
  // linkMessage?(linkMessage: ILinkMessage): void;
  // locationMessage?(locationMessage: ILocationMessage): void;
  // catchAll?(user: IBotUser, msg: Object): void;
}
```


### TypeScript

```javascript
import {IBotSettings, , IBotController} from 'botframework';

let botSettings: IBotSettings = {
  fb: {
    page_id: process.env.FB_PAGE_ID, verify_token: process.env.FB_VERIFY_ID, port: process.env.FB_PORT,
    access_token: process.env.FB_ACCESS_TOKEN
  }
} ;

class BotController implements IBotController {
  textMessage(msg: ITextMessage, reply: IBotReply): any {
    reply.text('hi');
  }
}
var bot = new Bot(botSettings, new BotController());
```