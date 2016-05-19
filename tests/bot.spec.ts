
import {expect} from 'chai';
import * as sinon from 'sinon';
import {FacebookBot} from '../src/facebook';
import {IBotSettings, INewUserMessage, IBotUser, IBotController} from '../src/interfaces';

class DummyController implements IBotController {
  newUser(msg: INewUserMessage) {console.log('got new user');}
  textMessage(textMessage: any) {console.log('got new textMessage');}
  imageMessage(image: any) {console.log('got new imageMessage');}
  linkMessage(link: any) {console.log('got linkMessage');}
  locationMessage(link: any) {console.log('got locationMessage');}
  catchAll(anything: any) {console.log('got catchAll');}
}



describe('FacebookBot', () => {
    var bot : FacebookBot;
    var ctrl: DummyController;

    beforeEach(function () {
        ctrl = new DummyController();
        bot = new FacebookBot(fbSettings(), ctrl);
    });

    describe('receiveMessage', () => {
        it('return false if message type != page', () => {
            expect(bot.receiveMessage({object: 'foo', entry: []})).to.eql(false);
        });
        it('return true if message has been processed', () => {
            expect(bot.receiveMessage({object: 'page', entry: []})).to.eql(true);
        });
        it('should dispatch each message', () => {
          bot.receiveMessage(fakeMessageMixed());
          // just console.log testing for now :(
          // if anyone knows a good mocking library for typescript youre welcome :)
          expect(true).to.eql(true);
        });
    });
});


function fbSettings(): IBotSettings {
  return {
    fb: {
      page_id: '1442484699367623',
      access_token: 'at1',
      verify_token: 'vt1',
      port: 3000
    }
  };
}

function fakeMessageMixed() {
  return {
    "object": "page",
    "entry": [
      {
        "id": 1442484699367623,
        "time": 1462967781419,
        "messaging": [
          {
            "sender":{
              "id":10208007577165870
            },
            "recipient":{
              "id": 1442484699367623
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
              "id":10208007577165870
            },
            "recipient":{
              "id": 1442484699367623
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
  };
}