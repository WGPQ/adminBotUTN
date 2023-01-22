import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Interaction } from 'src/app/interfaces/interaction.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { MensageModel } from 'src/app/interfaces/mensaje.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AlertService } from 'src/app/services/alert.service';
import { BibliotecaService } from 'src/app/services/biblioteca.service';
import { BotService } from 'src/app/services/bot.service';
import { ChatService } from 'src/app/services/chat.service';
import { FormsService } from 'src/app/services/forms.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { SetAccountState } from 'src/app/store/Account/account.state';
import { PostSolicitudes } from 'src/app/store/Solicitudes/solicitudes.actions';
import { PostSolicitudesState } from 'src/app/store/Solicitudes/solicitudes.state';
import { environment } from 'src/environments/environment';
import { ConnectionStatus } from 'botframework-directlinejs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMessages') private scrollMessages!: ElementRef;
  @ViewChild('scrollChat') private scrollChat!: ElementRef;
  @ViewChild('txtmessage') private txtMessage!: ElementRef;
  messages: MensageModel[] = [];
  activities: any[] = [];
  interactions: Interaction[] = [];
  isInitialized: boolean = false;
  loadingStartChat: boolean = false;
  showError: boolean = false;
  errorMessage: String =
    'Ocurrion un error desconocido contáctese con el Administrador.';
  solicitudes: any[] = [];
  idBot = '';
  idChat = '';
  usuario?: Usuario;
  public mensageForm: FormGroup;
  loading = false;
  initials = '';
  private colors = [
    '#0DA1E6',
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];

  @HostListener('scroll', ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
  }

  constructor(
    private store: Store,
    private formService: FormsService,
    private botService: BotService,
    private chatService: ChatService,
    private helperService: HelpersService,
    private bibliotecaService: BibliotecaService,
    private alertService: AlertService
  ) {
    this.idBot = environment.id_bot;
    this.loading = true;
    this.mensageForm = formService.crearFormularioMensaje();
    this.isInitialized = Boolean(sessionStorage.isInitialized);
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  selectChat(id: string) {
    let chat = this.solicitudes.find(
      (s) => s?.content?.buttons[0]?.value === id && s?.accept
    );
    if (chat) console.log(`Chat Seleccionad ${id}`);
  }

  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }
  closeChat() {
    try {
      this.alertService.esperando('Cerrando Conección.');
      Swal.showLoading();
      this.loadingStartChat = true;
      this.sendComandos(6);
      this.botService.sendMessage('chao',this.usuario!).subscribe((resp: any) => {
        sessionStorage.removeItem('isInitialized');
        this.isInitialized = false;
        this.loadingStartChat = false;
        Swal.close();
      });
    } catch (error) {
      Swal.close();
    }
  }

  startWorkChat() {
    let correo = this.usuario?.correo;
    this.loadingStartChat = true;
    this.botService.sendMessage(correo!,this.usuario!).subscribe(
      (resp: any) => {
        if (resp) {
          this.sendComandos(1);
          sessionStorage.isInitialized = true;
          this.isInitialized = true;
          this.loadingStartChat = false;
          this.getSolicitudes();
        } else {
          this.isInitialized = false;
          sessionStorage.isInitialized = false;
        }
      },
      (error) => {
        console.log(error);
        this.loadingStartChat = false;
      }
    );
    this.botService.directLine!.activity$.subscribe(
      (activity: any) => {
        if (!this.activities.includes(activity)) {
          this.activities = [...this.activities, activity];
        }
      },
      (error) => {
        console.log(error);
        this.isInitialized = false;
        this.loadingStartChat = false;
        sessionStorage.isInitialized = false;
      }
    );
  }

  scrollToBottom(): void {
    try {
      this.scrollChat.nativeElement.scrollTop =
        this.scrollChat.nativeElement.scrollHeight;
      this.scrollMessages.nativeElement.scrollToBottom =
        this.scrollMessages.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.getInteractions();
    this.getAccount();
    this.statusConnectionBot();
    this.saveRequest();
  }

  saveRequest() {
    const attachments = [
      {
        contentType: 'application/vnd.microsoft.card.hero',
        color: '#0DA1E6',
        timestamp: '2023-01-20T05:27:16.6093237Z',
        content: {
          title: 'Solicitud',
          subtitle: 'Solicitado por:-William Puma ',
          text: 'Aceptar o rechazar la solicitud: digite "@bibliochatUTN AcceptRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat" para aceptar, "@bibliochatUTN RejectRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat" para rechazar o usar los botones si está habilitado.',
          buttons: [
            {
              type: 'imBack',
              title: 'Aceptar',
              value:
                '@bibliochatUTN AcceptRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat',
            },
            {
              type: 'imBack',
              title: 'Rechazar',
              value:
                '@bibliochatUTN RejectRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat',
            },
          ],
        },
      },
    ];
    this.store.dispatch(new PostSolicitudes(attachments));
  }

  getAccount() {
    this.store.select(SetAccountState.getAccount).subscribe((user) => {
      this.usuario = user!;
    });
  }
  getSolicitudes() {
    this.store
      .select(PostSolicitudesState.getSolicitudes)
      .subscribe((requests) => {
        this.solicitudes = requests;
      });
  }

  reaccionarSolicitud(option: boolean, value: string) {
    this.botService.sendMessage(value,this.usuario!).subscribe((resp) => {
      this.solicitudes = this.solicitudes.map((s) => {
        let req = { ...s };
        if (
          (s?.content?.buttons[0]?.value || s?.content?.buttons[1]?.value) ===
          value
        ) {
          if (option) {
            req['accept'] = option;
          }
        }
        return req;
      });
    });
    this.catchMessage();
  }

  sendComandos(comando: number) {
    let cmd = '';
    switch (comando) {
      case 1:
        cmd = `@${this.usuario?.nombres} Watch`;
        break;
      case 2:
        cmd = `@${this.usuario?.nombres} Unwatch`;
        break;
      case 3:
        cmd = `@${this.usuario?.nombres} GetRequests`;
        break;
      case 4:
        cmd = `@${this.usuario?.nombres} AcceptRequest`;
        break;
      case 5:
        cmd = `@${this.usuario?.nombres} RejectRequest`;
        break;
      case 6:
        cmd = `@${this.usuario?.nombres} Disconnect`;
        break;

      default:
        cmd = `@${this.usuario?.nombres} Watch`;
        break;
    }

    this.botService.sendMessage(cmd,this.usuario!).subscribe((resp) => {
      if (comando === 3) {
        this.getSolicitudes();
      }
    });
    this.catchMessage();
  }

  cargarHistorial(idChat: string) {
    const listar: Listar = {
      columna: '',
      search: '',
      offset: 0,
      limit: '100',
      sort: '',
    };
    this.idChat = idChat;
    this.chatService.getMessages(idChat, listar).subscribe((resp) => {
      this.messages = resp;
    });
  }

  cargarMas() {
    var resp = this.bibliotecaService.listarHostorialMensajes();
    this.messages = [...this.messages, ...resp];
  }
  guardarMessage() {
    if (
      this.mensageForm.valid &&
      this.mensageForm.value.message.trim().length > 0
    ) {
      const message = this.mensageForm.value.message.trim();
      try {
        this.botService.sendMessage(message,this.usuario!).subscribe((resp: any) => {
          console.log(resp);
        });
        this.catchMessage();
        this.mensageForm.disable();
        this.mensageForm.reset();
        this.mensageForm.enable();
        this.txtMessage.nativeElement.focus();
      } catch (error) {
        alert(`Can't send your message`);
      }
    }
  }

  catchMessage() {
    try {
      this.botService.directLine!.activity$.subscribe((activity: any) => {
        console.log(activity);

        if (!this.activities.includes(activity)) {
          if (
            activity.attachments &&
            activity.attachments.length > 0 &&
            activity?.attachments[0]?.content?.title === 'Solicitud'
          ) {
            if (
              !this.solicitudes.some((s) => activity['attachments'].includes(s))
            ) {
              const item = { ...activity };
              const listAttachments = [...item['attachments']];
              const listWithColor = listAttachments.map((a) => {
                const solicitud = { ...a };
                const randomIndex = Math.floor(
                  Math.random() * Math.floor(this.colors.length)
                );
                solicitud['timestamp'] = item?.timestamp;
                solicitud['color'] = this.colors[randomIndex];
                return solicitud;
              });
              this.store.dispatch(new PostSolicitudes(listWithColor));
            }
          } else {
            this.activities = [...this.activities, activity];
          }
        }
      });
    } catch (error) {}
  }
  getInteractions() {
    const listar: Listar = {
      columna: '',
      search: '',
      offset: 0,
      limit: '100',
      sort: '',
    };
    this.loading = true;
    this.chatService.getInteractios(listar).subscribe((resp) => {
      this.interactions = resp;
      this.loading = false;
    });
  }
  statusConnectionBot() {
    this.botService.directLine!.connectionStatus$.subscribe(
      (connectionStatus) => {
        switch (connectionStatus) {
          case ConnectionStatus.Uninitialized: // the status when the DirectLine object is first created/constructed
            this.showError = false;
            this.isInitialized = sessionStorage.isInitialized;
            break;
          case ConnectionStatus.Connecting: // currently trying to connect to the conversation
            this.showError = false;
            this.loadingStartChat = true;
            break;
          case ConnectionStatus.Online: // successfully connected to the converstaion. Connection is healthy so far as we know.
            this.showError = false;
            this.isInitialized = true;
            this.loadingStartChat = false;
            this.getSolicitudes();
            break;
          case ConnectionStatus.ExpiredToken: // last operation errored out with an expired token. Your app should supply a new one.
            this.errorMessage =
              'Su conección a finalizado, vuelva a intentarlo por favor.';
            this.isInitialized = false;
            this.showError = true;
            this.loadingStartChat = false;
            sessionStorage.isInitialized = false;
            break;
          case ConnectionStatus.FailedToConnect: // the initial attempt to connect to the conversation failed. No recovery possible.
            this.errorMessage =
              'Ocurrion un error al intentar conectarse al servicio, vuelva a intentarlo por favor.';
            this.isInitialized = false;
            this.showError = true;
            this.loadingStartChat = false;
            sessionStorage.isInitialized = false;
            Swal.close();
            break;
          case ConnectionStatus.Ended: // the bot ended the conversation
            this.errorMessage =
              'Parece que la conección ha finalizado, vuelva a conectarse por favor. ';
            this.showError = true;
            this.isInitialized = false;
            this.loadingStartChat = false;
            sessionStorage.isInitialized = false;
            Swal.close();
            break;
        }
      }
    );
  }
}

// {
//   "type": "message",
//   "id": "2gSxQmQwHF5Gbq0TTnAaI9-us|0000004",
//   "timestamp": "2023-01-20T05:27:16.6093237Z",
//   "channelId": "webchat",
//   "from": {
//       "id": "bibliochatUTN",
//       "name": "bibliochatUTN"
//   },
//   "conversation": {
//       "id": "2gSxQmQwHF5Gbq0TTnAaI9-us"
//   },
//   "text": "",
//   "attachments": [
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"User\" en el canal \"Emulator\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest 48ef5358-1eab-44e2-b9cb-83ffc39a5f0c 02333d40-7d0e-11ed-a63a-3743987e816e|livechat\" para aceptar, \"@bibliochatUTN RejectRequest 48ef5358-1eab-44e2-b9cb-83ffc39a5f0c 02333d40-7d0e-11ed-a63a-3743987e816e|livechat\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest 48ef5358-1eab-44e2-b9cb-83ffc39a5f0c 02333d40-7d0e-11ed-a63a-3743987e816e|livechat"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest 48ef5358-1eab-44e2-b9cb-83ffc39a5f0c 02333d40-7d0e-11ed-a63a-3743987e816e|livechat"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"User\" en el canal \"Emulator\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest cb2f12d5-dc1f-4643-a1b3-48146f384f3a 171ed290-915f-11ed-a84b-f3c8f6a6f242|livechat\" para aceptar, \"@bibliochatUTN RejectRequest cb2f12d5-dc1f-4643-a1b3-48146f384f3a 171ed290-915f-11ed-a84b-f3c8f6a6f242|livechat\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest cb2f12d5-dc1f-4643-a1b3-48146f384f3a 171ed290-915f-11ed-a84b-f3c8f6a6f242|livechat"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest cb2f12d5-dc1f-4643-a1b3-48146f384f3a 171ed290-915f-11ed-a84b-f3c8f6a6f242|livechat"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"User\" en el canal \"Emulator\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat\" para aceptar, \"@bibliochatUTN RejectRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest 8d3bc141-fef2-40a6-a8cc-6f5b197b81b1 331742d0-7d0e-11ed-a63a-3743987e816e|livechat"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"(no user name)\" en el canal \"Webchat\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 6YQzwOGY5hhDfdEjSOW8ek-us\" para aceptar, \"@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 6YQzwOGY5hhDfdEjSOW8ek-us\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 6YQzwOGY5hhDfdEjSOW8ek-us"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 6YQzwOGY5hhDfdEjSOW8ek-us"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"User\" en el canal \"Emulator\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest aa28ee0e-d0b8-4b56-b1d0-0b87e64f7dd7 7d7a9e10-9309-11ed-a8e6-65ad54b3f1f9|livechat\" para aceptar, \"@bibliochatUTN RejectRequest aa28ee0e-d0b8-4b56-b1d0-0b87e64f7dd7 7d7a9e10-9309-11ed-a8e6-65ad54b3f1f9|livechat\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest aa28ee0e-d0b8-4b56-b1d0-0b87e64f7dd7 7d7a9e10-9309-11ed-a8e6-65ad54b3f1f9|livechat"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest aa28ee0e-d0b8-4b56-b1d0-0b87e64f7dd7 7d7a9e10-9309-11ed-a8e6-65ad54b3f1f9|livechat"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"(no user name)\" en el canal \"Webchat\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 8niU539O31mEPi549ButZP-us\" para aceptar, \"@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 8niU539O31mEPi549ButZP-us\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 8niU539O31mEPi549ButZP-us"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 8niU539O31mEPi549ButZP-us"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"User\" en el canal \"Emulator\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest 219f6e76-5870-4b3d-ac0c-5ca194fe110e 9fc7ed40-7d0d-11ed-a63a-3743987e816e|livechat\" para aceptar, \"@bibliochatUTN RejectRequest 219f6e76-5870-4b3d-ac0c-5ca194fe110e 9fc7ed40-7d0d-11ed-a63a-3743987e816e|livechat\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest 219f6e76-5870-4b3d-ac0c-5ca194fe110e 9fc7ed40-7d0d-11ed-a63a-3743987e816e|livechat"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest 219f6e76-5870-4b3d-ac0c-5ca194fe110e 9fc7ed40-7d0d-11ed-a63a-3743987e816e|livechat"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"(no user name)\" en el canal \"Webchat\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 GcjTCT9Dnn36YRdJLb9v9T-us\" para aceptar, \"@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 GcjTCT9Dnn36YRdJLb9v9T-us\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 GcjTCT9Dnn36YRdJLb9v9T-us"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 GcjTCT9Dnn36YRdJLb9v9T-us"
//                   }
//               ]
//           }
//       },
//       {
//           "contentType": "application/vnd.microsoft.card.hero",
//           "content": {
//               "title": "Solicitud",
//               "subtitle": "Solicitado por el usuario \"(no user name)\" en el canal \"Webchat\"",
//               "text": "Aceptar o rechazar la solicitud: digite \"@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 XfuK5HymaXIgv7gmVjLEI-us\" para aceptar, \"@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 XfuK5HymaXIgv7gmVjLEI-us\" para rechazar o usar los botones si está habilitado.",
//               "buttons": [
//                   {
//                       "type": "imBack",
//                       "title": "Aceptar",
//                       "value": "@bibliochatUTN AcceptRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 XfuK5HymaXIgv7gmVjLEI-us"
//                   },
//                   {
//                       "type": "imBack",
//                       "title": "Rechazar",
//                       "value": "@bibliochatUTN RejectRequest 9db5b90c-44d9-4051-a29c-9e4d070e40b5 XfuK5HymaXIgv7gmVjLEI-us"
//                   }
//               ]
//           }
//       }
//   ],
//   "entities": [],
//   "channelData": "[{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"48ef5358-1eab-44e2-b9cb-83ffc39a5f0c\",\"name\":\"User\",\"aadObjectId\":null,\"role\":\"user\"},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"02333d40-7d0e-11ed-a63a-3743987e816e|livechat\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"emulator\",\"locale\":null,\"serviceUrl\":\"http://localhost:55435\"},\"ConnectionRequestTime\":\"2022-12-16T06:51:24.53396Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"cb2f12d5-dc1f-4643-a1b3-48146f384f3a\",\"name\":\"User\",\"aadObjectId\":null,\"role\":\"user\"},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"171ed290-915f-11ed-a84b-f3c8f6a6f242|livechat\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"emulator\",\"locale\":null,\"serviceUrl\":\"http://localhost:64534\"},\"ConnectionRequestTime\":\"2023-01-11T03:22:19.875538Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"8d3bc141-fef2-40a6-a8cc-6f5b197b81b1\",\"name\":\"User\",\"aadObjectId\":null,\"role\":\"user\"},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"331742d0-7d0e-11ed-a63a-3743987e816e|livechat\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"emulator\",\"locale\":null,\"serviceUrl\":\"http://localhost:55435\"},\"ConnectionRequestTime\":\"2022-12-16T06:52:37.860666Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"9db5b90c-44d9-4051-a29c-9e4d070e40b5\",\"name\":\"\",\"aadObjectId\":null,\"role\":null},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"6YQzwOGY5hhDfdEjSOW8ek-us\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"webchat\",\"locale\":null,\"serviceUrl\":\"https://webchat.botframework.com/\"},\"ConnectionRequestTime\":\"2023-01-10T05:40:00.2592618Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"aa28ee0e-d0b8-4b56-b1d0-0b87e64f7dd7\",\"name\":\"User\",\"aadObjectId\":null,\"role\":\"user\"},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"7d7a9e10-9309-11ed-a8e6-65ad54b3f1f9|livechat\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"emulator\",\"locale\":null,\"serviceUrl\":\"http://localhost:49286\"},\"ConnectionRequestTime\":\"2023-01-13T06:18:30.257432Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"9db5b90c-44d9-4051-a29c-9e4d070e40b5\",\"name\":\"\",\"aadObjectId\":null,\"role\":null},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"8niU539O31mEPi549ButZP-us\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"webchat\",\"locale\":null,\"serviceUrl\":\"https://webchat.botframework.com/\"},\"ConnectionRequestTime\":\"2023-01-20T05:13:08.527809Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"219f6e76-5870-4b3d-ac0c-5ca194fe110e\",\"name\":\"User\",\"aadObjectId\":null,\"role\":\"user\"},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"9fc7ed40-7d0d-11ed-a63a-3743987e816e|livechat\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"emulator\",\"locale\":null,\"serviceUrl\":\"http://localhost:55435\"},\"ConnectionRequestTime\":\"2022-12-16T06:48:37.493665Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"9db5b90c-44d9-4051-a29c-9e4d070e40b5\",\"name\":\"\",\"aadObjectId\":null,\"role\":null},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"GcjTCT9Dnn36YRdJLb9v9T-us\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"webchat\",\"locale\":null,\"serviceUrl\":\"https://webchat.botframework.com/\"},\"ConnectionRequestTime\":\"2023-01-20T05:16:06.2910546Z\"},{\"Requestor\":{\"activityId\":null,\"user\":{\"id\":\"9db5b90c-44d9-4051-a29c-9e4d070e40b5\",\"name\":\"\",\"aadObjectId\":null,\"role\":null},\"bot\":null,\"conversation\":{\"isGroup\":null,\"conversationType\":null,\"id\":\"XfuK5HymaXIgv7gmVjLEI-us\",\"name\":null,\"aadObjectId\":null,\"role\":null,\"tenantId\":null},\"channelId\":\"webchat\",\"locale\":null,\"serviceUrl\":\"https://webchat.botframework.com/\"},\"ConnectionRequestTime\":\"2023-01-10T05:35:17.4319341Z\"}]",
//   "replyToId": "2gSxQmQwHF5Gbq0TTnAaI9-us|0000003"
// }
