
import {expect} from 'chai';
import * as sinon from 'sinon';
import {FacebookBot, IFbMessaging} from '../src/facebook';
import {IBotSettings, IBotRequest, IBotReply, IBotUser, IBotController} from '../src/interfaces';

class DummyController implements IBotController {
  cc = {
    newUser: 0,
    postback: 0,
    textMessage: 0,
    imageMessage: 0,
    linkMessage: 0,
    locationMessage: 0,
    location: {},
    delivered: 0,
    catchAll: 0,
  }
  newUser(msg: IBotRequest, reply: IBotReply) {console.log('got new user'); this.cc.newUser++;}
  postback(msg: IBotRequest, reply: IBotReply) {console.log('got new postback'); this.cc.postback++;}
  textMessage(msg: IBotRequest, reply: IBotReply) {console.log('got new textMessage'); this.cc.textMessage++;}
  imageMessage(image: IBotRequest, reply: IBotReply) {console.log('got new imageMessage'); this.cc.imageMessage++;}
  linkMessage(msg: IBotRequest, reply: IBotReply) {console.log('got linkMessage'); this.cc.linkMessage++;}
  locationMessage(msg: IBotRequest, reply: IBotReply) {console.log('got locationMessage'); this.cc.locationMessage++; this.cc.location = msg.location;}
  delivered(msg: IBotRequest, reply: IBotReply) {console.log('got delivered'); this.cc.delivered++;}
  catchAll(msg: IBotRequest, reply: IBotReply) {console.log('got catchAll'); this.cc.catchAll++;}
}



describe('FacebookBot', () => {
    var bot : FacebookBot;
    var ctrl: DummyController;

    beforeEach(function () {
        ctrl = new DummyController();
        bot = new FacebookBot(fbSettings(), ctrl);
        bot.profiles [123] = {
          id: 123,
          firstname: 'Foo',
          lastname: 'Bar'
        };
    });

    describe('receiveMessage', () => {
        it('return false if message type != page', (done) => {
          let expected = 'invalid message type';
          bot.receiveMessage({object: 'foo', entry: []})
          .catch( err => {
            expect(err).to.eql(expected);
            done();
          })
        });
        // it('return true if message has been processed', () => {
        //     expect(bot.receiveMessage({object: 'page', entry: []})).to.eql(true);
        // });
        it('should dispatch each message', (done) => {
          bot.receiveMessage(fakeMessageMixed())
          .then( dispatchResults => {
            expect(dispatchResults.length).to.eql(5);
            expect(ctrl.cc.delivered).to.eql(1);
            expect(ctrl.cc.postback).to.eql(1);
            expect(ctrl.cc.textMessage).to.eql(1);
            expect(ctrl.cc.imageMessage).to.eql(1);
            expect(ctrl.cc.locationMessage).to.eql(1);
            done();
          });
           
          // just console.log testing for now :(
          // if anyone knows a good mocking library for typescript youre welcome :)
        });

        it('should get location title', (done) => {
            bot.receiveMessage(fakeMessageMixed())
            .then( dispatchResults => {
              expect(ctrl.cc.location['title']).to.eql(`Aco's Location`);
              done();
            });
        });
        
    });
   describe('dispatchSingleMessage', () => {
     it('should not dispatch delivery messages to catchAll', () => {
       let fakeMsgs = fakeMessageMixed(),
        message: IFbMessaging = fakeMsgs.entry[0].messaging[0];
       let result = bot.dispatchSingleMessage(message, {id: '1', firstname: 'foo', lastname: 'bar'} );   
       expect(ctrl.cc.delivered).to.eql(1);
       expect(ctrl.cc.catchAll).to.eql(0);
    });
   })
});


function fbSettings(): IBotSettings {
  return {
    fb: {
      page_id: '234',
      access_token: 'at1',
      verify_token: 'vt1',
      callback_path: '/facebook/receive',
      port: 3000
    }
  };
}

function fakeMessageMixed() {
  return {
    "object": "page",
    "entry": [
      {
        "id": 234,
        "time": 1462967781419,
        "messaging": [
          {
               "sender":{
                  "id":123
               },
               "recipient":{
                  "id":234
               },
               "timestamp":1460245672080,
               "delivery":{
                  "mids":[
                     "mid.1458668856218:ed81099e15d3f4f233"
                  ],
                  "watermark":1458668856253,
                  "seq":37
               }
            },
          {
            "sender":{
              "id":123
            },
            "recipient":{
              "id": 234
            },
            "timestamp":1460245672080,
            "message":{
              "mid":"mid.1460245671959:dad2ec9421b03d6f78",
              "seq":216,
              "text":"hello"
            }
          },
          {
            "sender":{
              "id":123
            },
            "recipient":{
              "id": 234
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
          },
          {
            "sender": {
              "id": 123
            },
            "recipient": {
              "id": 234
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
      },
      {
        "id":234,
        "time":1458692752478,
        "messaging":[
          {
            "sender":{
              "id":123
            },
            "recipient":{
              "id":234
            },
            "timestamp":1458692752478,
            "postback":{
              "payload":"USER_DEFINED_PAYLOAD"
            }
          }
        ]
      }
    ]
  };
}