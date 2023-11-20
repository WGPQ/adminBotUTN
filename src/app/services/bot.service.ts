import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DirectLine } from 'botframework-directlinejs';
import { Usuario } from '../interfaces/usuario.interface';
import { SetAccountState } from '../store/Account/account.state';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BotService {
  directLinePortal?: DirectLine;
  directLineBlog?: DirectLine;
  usuario?: Usuario;
  constructor(
    private authtService: AuthenticationService,
    private store: Store
  ) {
    this.getCurrentUser();
  }
  initBotConfigPortal() {
    if (sessionStorage.conversationIdPortal) {
      this.directLinePortal = new DirectLine({
        secret: '6sNxJNg3BtA.Eh1wOB3_okbp2ZcSICFiqsYF0hSybjnJ9v08hUEDpHs',
        conversationId: sessionStorage.conversationIdPortal,
        conversationStartProperties: {
          locale: 'en-US',
        },
      });
    } else {
      this.directLinePortal = new DirectLine({
        secret: '6sNxJNg3BtA.Eh1wOB3_okbp2ZcSICFiqsYF0hSybjnJ9v08hUEDpHs',
        conversationStartProperties: {
          locale: 'en-US',
        },
      });
    }
  }

  initBotConfigBlog() {
    try {
      if (sessionStorage.conversationIdBlog) {
        this.directLineBlog = new DirectLine({
          secret: '6sNxJNg3BtA.Eh1wOB3_okbp2ZcSICFiqsYF0hSybjnJ9v08hUEDpHs',
          conversationId: sessionStorage.conversationIdBlog,
          conversationStartProperties: {
            locale: 'en-US',
          },
        });
      } else {
        this.directLineBlog = new DirectLine({
          secret: '6sNxJNg3BtA.Eh1wOB3_okbp2ZcSICFiqsYF0hSybjnJ9v08hUEDpHs',
          conversationStartProperties: {
            locale: 'en-US',
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  reconectarConvresationPortal() {
    if (localStorage.conversationId) {
      this.directLinePortal?.reconnect(localStorage.conversationId);
      this.directLinePortal?.connectionStatus$.subscribe(
        (conection) => {
          console.log('Se conecto', conection);
        },
        (error) => {
          console.log('ocurrio un error al reconectar');
        }
      );
    }
  }
  reconectarConvresationBlog() {
    if (localStorage.conversationIdBlog) {
      this.directLineBlog?.reconnect(localStorage.conversationId);
      this.directLineBlog?.connectionStatus$.subscribe(
        (conection) => {
          console.log('Se conecto', conection);
        },
        (error) => {
          console.log('ocurrio un error al reconectar');
        }
      );
    }
  }

  sendMessagePortal(message: string, usuario: Usuario, session: any) {
    return this.directLinePortal!.postActivity({
      channelData: session || null,
      from: {
        id: usuario?.id!,
        name: usuario?.nombre_completo,
        role: 'user',
      },
      type: 'message',
      text: message,
    });
  }

  sendMessageBlog(message: string, usuario: Usuario, session: any) {
    return this.directLineBlog!.postActivity({
      channelData: session || null,
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
        this.usuario = user!;
      });
    }
    if (sessionStorage.getItem('session-blog')) {
      this.store.select(SetAccountState.getAccountBlog).subscribe((user) => {
        this.usuario = user!;
      });
    }
  }
}
