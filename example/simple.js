

var bf = require('../');
var bot = new bf.Bot({
  fb: {
    page_id: 'bar', verify_id:'verify1', port: 3000,
    access_token: 'foo'
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