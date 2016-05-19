

var bf = require('../');
var bot = new bf.Bot({
  fb: {
    page_id: process.env.FB_PAGE_ID,
    verify_id: process.env.FB_VERIFY_ID,
    port: process.env.FB_PORT,
    callback_path: process.env.FB_CALLBACK_PATH,
    access_token: process.env.FB_ACCESS_TOKEN
  }
}, new ctrl());

function ctrl() {
  this.newUser = function (data) {
    console.log('user'+ JSON.stringify(data));
  };
  this.textMessage = function(data, reply) {
    console.log('text'+ JSON.stringify(data));
    reply.text('Servus: ' + data.text);
  };
  // imageMessage?(imageMessage: IImageMessage): void;
  // linkMessage?(linkMessage: ILinkMessage): void;
  // locationMessage?(locationMessage: ILocationMessage): void;
  // catchAll?(user: IBotUser, msg: Object): void;
}