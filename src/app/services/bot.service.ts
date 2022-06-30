import { Injectable } from '@angular/core';
import { DirectLine } from 'botframework-directlinejs';
import { ConnectionStatus } from 'botframework-directlinejs';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  directLine?: DirectLine;
  constructor() {
    this.initBotConfig();
    this.statusConnectionBot();
    this.directLine!.activity$.subscribe(activity => console.log(activity));

  }
  initBotConfig() {
    // this.directLine = new DirectLine({
    //   secret: '6PAU52FQpx4.OgspOHu4cqkVO_TDKTMQ2yu6DGyopXfhEb2Z76h-DJQ' /* put your Direct Line secret here */,
    //   token: ''/* or put your Direct Line token here (supply secret OR token, not both) */,
    //   domain: /*'https://webapp-bot-library.azurewebsites.net/api/messages'/* optional: if you are not using the default Direct Line endpoint, e.g. if you are using a region-specific endpoint, put its full URL here */,
    //   webSocket: true/* optional: false if you want to use polling GET to receive messages. Defaults to true (use WebSocket). */,
    //   pollingInterval: 1000/* optional: set polling interval in milliseconds. Defaults to 1000 */,
    //   timeout: 20000/* optional: a timeout in milliseconds for requests to the bot. Defaults to 20000 */,
    //   conversationStartProperties: { /* optional: properties to send to the bot on conversation start */
    //     locale: 'en-US'
    //   }
    // });
    this.directLine = new DirectLine({
      secret: '6PAU52FQpx4.OgspOHu4cqkVO_TDKTMQ2yu6DGyopXfhEb2Z76h-DJQ',
    });
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
    this.directLine!.postActivity({
      from: { id: '344444444444', name: 'William' }, // required (from.name is optional)
      type: 'message',
      text: message
    }).subscribe(
      id => console.log("Posted activity, assigned ID ", id),
      error => console.log("Error posting activity", error)
    );
  }
}
