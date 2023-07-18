import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Interaction } from 'src/app/interfaces/interaction.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { MensageModel } from 'src/app/interfaces/mensaje.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AlertService } from 'src/app/services/alert.service';
import { BibliotecaService } from 'src/app/services/biblioteca.service';
import { BotService } from 'src/app/services/bot.service';
import { ChatService } from 'src/app/services/chat.service';
import { FormsService } from 'src/app/services/forms.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { SetAccountState } from 'src/app/store/Account/account.state';
import {
  SetChatActual,
  PostSolicitudes,
  UpdateShowNotification,
  UpdateSolicitud,
  SetUsuarioChat,
  SetMessagesByChat,
} from 'src/app/store/Chat/chat.actions';
import { environment } from 'src/environments/environment';
import { ConnectionStatus } from 'botframework-directlinejs';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { ChatState } from 'src/app/store/Chat/chat.state';
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMessages') private scrollMessages!: ElementRef;
  @ViewChild('scrollChat') private scrollChat!: ElementRef;
  @ViewChild('txtmessage') private txtMessage!: ElementRef;
  messages: MensageModel[] = [];
  activities: any[] = [];
  messagesSolicitud: any[] = [];
  interactions: Interaction[] = [];
  isInitialized: boolean = false;
  loadingStartChat: boolean = false;
  showError: boolean = false;
  botName: string = 'BiblioChat UTN';
  chatActual: any;
  solicitudPendiente: boolean = false;
  infoChat: boolean = true;
  errorMessage: String =
    'Ocurrion un error desconocido contáctese con el Administrador.';
  solicitudes: any[] = [];
  idBot = '';
  bot?: Usuario;
  idChat = '';
  usuario?: Usuario;
  public mensageForm: FormGroup;
  loading = false;
  initials = '';
  refInterval: any;
  usuarioChat?: Usuario;
  colorChat: string = '#dd3333';
  public audio = new Audio('assets/tonos/nueva_solicitud.mp3');

  private colors = [
    '#FF6F18',
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
    private usuarioService: UsuarioService,
    private bibliotecaService: BibliotecaService,
    private alertService: AlertService
  ) {
    this.idBot = environment.id_bot;
    this.loading = true;
    this.mensageForm = formService.crearFormularioMensaje();
    this.isInitialized = Boolean(sessionStorage.isInitialized);
    this.store.select(ChatState.getChatActual).subscribe((chat) => {
      this.chatActual = chat!;
    });
    this.store
      .select(ChatState.getMessagesConversation)
      .subscribe((messages) => {
        this.messagesSolicitud = messages!;
      });
    this.store.select(SetAccountState.getBot).subscribe((bot) => {
      this.bot = bot!;
    });
  }
  ngOnDestroy(): void {
    this.handleNotificaciones(true);
  }
  handleNotificaciones(value: boolean) {
    this.store.dispatch(new UpdateShowNotification(value));
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  selectChat(chat: any) {
    if (chat) {
      this.chatActual = chat;
    }
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
      this.botService
        .sendMessagePortal('chao', this.usuario!, '')
        .subscribe((resp: any) => {
          sessionStorage.removeItem('isInitialized');
          sessionStorage.removeItem('conversationIdPortal');
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
    this.botService.sendMessagePortal(correo!, this.usuario!, '').subscribe(
      (resp: any) => {
        if (!sessionStorage.conversationIdPortal) {
          sessionStorage.conversationIdPortal = resp.split('|')[0];
        }
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
    this.catchMessage();
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
    this.botService.initBotConfigPortal();
    this.statusConnectionBot();
    this.getSolicitudes();
    this.handleNotificaciones(false);
    this.getFetchUserChat();
  }
  getFetchUserChat() {
    const userId = sessionStorage.getItem('usuarioChat');
    if (userId) {
      this.fetchUserChat(userId);
    }
  }
  getAccount() {
    this.store.select(SetAccountState.getAccount).subscribe((user) => {
      this.usuario = user!;
    });
  }
  getSolicitudes() {
    this.store.select(ChatState.getSolicitudes).subscribe((requests) => {
      this.solicitudes = requests;
    });
  }

  reaccionarSolicitud(option: boolean, value: any) {
    const message = value?.content?.buttons[option ? 0 : 1]?.value;
    this.botService
      .sendMessagePortal(message, this.usuario!, '')
      .subscribe((resp) => {
        this.chatService
          .aceptarSolicitud(value.session?.solicitud, this.usuario?.id!, option)
          .subscribe((resp) => {
            if (resp.exito) {
              let solicitud = { ...value };
              solicitud['accept'] = option;
              if (option) {
                this.chatActual = solicitud;
                this.colorChat = this.chatActual.color;
                this.store.dispatch(new SetChatActual(solicitud));
              }
              this.solicitudPendiente = false;
              this.store.dispatch(new UpdateSolicitud(solicitud));
            }
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

    this.botService
      .sendMessagePortal(cmd, this.usuario!, '')
      .subscribe((resp) => {
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
        this.botService
          .sendMessagePortal(message, this.usuario!, this.chatActual?.session)
          .subscribe((resp: any) => {});
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
  finalizarChat() {
    Swal.fire({
      position: 'center',
      icon: 'question',
      title: 'Esta seguro que desea finalizar el chat con:',
      text: this.usuarioChat?.nombre_completo,
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        try {
          this.sendComandos(6);
          sessionStorage.removeItem('usuarioChat');
        } catch (error) {}
      }
    });
  }

  catchMessage() {
    try {
      this.botService.directLinePortal!.activity$.subscribe((activity: any) => {
        if (!this.activities?.some((act) => act?.id === activity?.id)) {
          if (activity.attachments && activity.attachments.length > 0) {
            let nuevasSolicitudes: any = [];
            activity['attachments']?.forEach((item: any) => {
              let existe = this.solicitudes?.some(
                (sf: any) => sf?.content?.text === item?.content?.text
              );

              if (!existe && item?.content?.title === 'Solicitud') {
                const solicitud = { ...item };
                const randomIndex = Math.floor(
                  Math.random() * Math.floor(this.colors.length)
                );
                solicitud['timestamp'] = activity?.timestamp;
                solicitud['color'] = this.colors[randomIndex];
                solicitud['session'] = {
                  solicitud: solicitud?.content?.text?.split(' ')[2] || '',
                  chat: solicitud?.content?.text?.split(' ')[0] || '',
                  session: solicitud?.content?.text?.split(' ')[1] || '',
                };
                solicitud['name'] =
                  solicitud?.content?.subtitle.split('-')[1] || '';
                solicitud['id'] = uuidv4();
                nuevasSolicitudes.push(solicitud);
              }
            });

            if (nuevasSolicitudes.length > 0) {
              this.solicitudPendiente = true;
              this.notificarSolicitudNueva();
              this.audio.play();
              this.store.dispatch(new PostSolicitudes(nuevasSolicitudes));
            }
          } else {
            if (activity.text.length > 0) {
              if (activity.text.includes('@connected with:')) {
                let userId = activity.text.split(':')[1];
                if (userId != null) {
                  sessionStorage.setItem('usuarioChat', userId);
                  this.fetchUserChat(userId);
                }
              } else {
                let actv = { ...activity, color: this.colorChat };
                if (
                  this.usuarioChat != null &&
                  activity?.from?.id != this.usuario?.id
                ) {
                  actv = {
                    ...actv,
                    from: {
                      id: this.usuarioChat?.id,
                      name: this.usuarioChat?.nombre_completo,
                    },
                  };
                  actv.text = actv?.text.replace(
                    `${this.usuarioChat.nombre_completo}:`,
                    ''
                  );
                }
                this.activities = [...this.activities, actv];
                this.store.dispatch(
                  new SetMessagesByChat({
                    chatId: this.chatActual?.id,
                    activity: actv,
                  })
                );
              }
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchUserChat(userId: string) {
    this.usuarioService.obtenerUsuario(userId).subscribe((user: Usuario) => {
      if (user) {
        this.usuarioChat = user;
        this.store.dispatch(new SetUsuarioChat(user));
      }
    });
  }
  localDate(date: any) {
    let utcDate = new Date(date);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset());
  }

  notificarSolicitudNueva() {
    this.refInterval = setInterval(() => {
      if (this.solicitudPendiente) {
        this.audio.play();
      }
      if (!this.solicitudPendiente) {
        clearInterval(this.refInterval);
      }
    }, 60000);
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
    this.botService.directLinePortal!.connectionStatus$.subscribe(
      (connectionStatus) => {
        switch (connectionStatus) {
          case ConnectionStatus.Uninitialized: // the status when the directLinePortal object is first created/constructed
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
            sessionStorage.removeItem('conversationIdPortal');
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
