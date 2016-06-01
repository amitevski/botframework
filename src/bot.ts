import  {FacebookServer, FacebookBot} from './facebook';
import {IBotSettings, IBotController} from './interfaces';

export class Bot {
  facebookBot: FacebookBot = null;
  facebookServer: FacebookServer = null;
  constructor(private settings: IBotSettings, private botController: IBotController) {
    if (settings.fb) {
      this.facebookBot = new FacebookBot(settings, botController);
      this.facebookServer = new FacebookServer(settings, this.facebookBot) ;
    }
  }
  
  setWelcomeMessage(text: string) {
    if (!this.facebookServer) return;
    this.facebookServer.setWelcomeMessage(text);
  }
}