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
import {BotController} from './bot_controller';

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