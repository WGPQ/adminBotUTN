import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DirectLine } from 'botframework-directlinejs';
import { Usuario } from '../interfaces/usuarios.interface';
import { SetAccountState } from '../store/Account/account.state';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BotService {
  directLine?: DirectLine;
  usuario?: Usuario;
  constructor(
    private authtService: AuthenticationService,
    private store: Store
  ) {
    this.initBotConfig();
    this.getCurrentUser();
  }
  initBotConfig() {
    this.directLine = new DirectLine({
      secret: '2mQOcWjJgOc.Cu3pkgFaQporkiX2YzFMUYzuMRS5rPM6rJbOE8C9Igo',
      conversationStartProperties: {
        locale: 'en-US',
      },
    });
  }

  sendMessage(message: string, usuario: Usuario) {
    return this.directLine!.postActivity({
      from: {
        id: usuario?.id!,
        name: usuario?.nombre_completo,
        role: 'user',
      },
      type: 'message',
      text: message,
    });
  }
  getCurrentUser() {
    if (sessionStorage?.session) {
      this.store.select(SetAccountState.getAccount).subscribe((user) => {
        console.log('usuario de portal');

        this.usuario = user!;
      });
    }
    if (sessionStorage.getItem('session-blog')) {
      this.store.select(SetAccountState.getAccountBlog).subscribe((user) => {
        console.log('usuario del blog');

        this.usuario = user!;
      });
    }
  }
}
