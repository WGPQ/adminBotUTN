import { Injectable } from '@angular/core';
import { DirectLine,ConnectionStatus } from 'botframework-directlinejs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  directLine?: DirectLine;
  constructor(
    private authtService: AuthenticationService,
  ) {
    this.initBotConfig();
    this.statusConnectionBot();
  }
  initBotConfig() {
    this.directLine = new DirectLine({
      secret: '2mQOcWjJgOc.Cu3pkgFaQporkiX2YzFMUYzuMRS5rPM6rJbOE8C9Igo',
      conversationStartProperties: { /* optional: properties to send to the bot on conversation start */
      locale: 'en-US'

  }
    });
    this.directLine.activity$
  }
  statusConnectionBot() {
    this.directLine!.connectionStatus$
      .subscribe(connectionStatus => {
        switch (connectionStatus) {
          case ConnectionStatus.Uninitialized:    // the status when the DirectLine object is first created/constructed
            console.log('Uninitialized');
            break;
          case ConnectionStatus.Connecting:       // currently trying to connect to the conversation
            console.log('Connecting');
            break;
          case ConnectionStatus.Online:           // successfully connected to the converstaion. Connection is healthy so far as we know.
            console.log('Online');
            break;
          case ConnectionStatus.ExpiredToken:     // last operation errored out with an expired token. Your app should supply a new one.
            console.log('ExpiredToken');
            break;
          case ConnectionStatus.FailedToConnect:  // the initial attempt to connect to the conversation failed. No recovery possible.
            console.log('FailedToConnect');
            break;
          case ConnectionStatus.Ended:            // the bot ended the conversation
            console.log('Ended');
            break;
        }
      });
  }

  sendMessage(message: string) {
    return this.directLine!.postActivity({
      from: {
        id: this.authtService.usuario.id!,
        name: this.authtService.usuario.nombre_completo,
        role: "channel"
      },
      type: 'message',
      text: message,
    });
    // .subscribe(
    //   id => console.log("Posted activity, assigned ID ", id),
    //   error => console.log("Error posting activity", error)
    // );
  }
}
