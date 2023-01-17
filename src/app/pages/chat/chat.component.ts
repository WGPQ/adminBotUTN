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
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BibliotecaService } from 'src/app/services/biblioteca.service';
import { BotService } from 'src/app/services/bot.service';
import { ChatService } from 'src/app/services/chat.service';
import { FormsService } from 'src/app/services/forms.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { SetAccountState } from 'src/app/store/Account/account.state';
import { PostSolicitudes } from 'src/app/store/Solicitudes/solicitudes.actions';
import { PostSolicitudesState } from 'src/app/store/Solicitudes/solicitudes.state';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UsuariosComponent } from '../usuarios/usuarios.component';

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
  solicitudes: any[] = [
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|0000003',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|0000004',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|0000005',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|0000006',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|0000007',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|0000008',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|0000009',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|00000010',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|00000011',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
    {
      color: '#EB7181',
      type: 'message',
      accept: false,
      reject: false,
      id: 'DamM237uwi7F0iETW6MjW8-us|00000012',
      timestamp: '2022-12-16T06:52:41.3032109Z',
      channelId: 'webchat',
      from: {
        id: 'bibliochatUTN',
        name: 'Julio Gonzales',
      },
      conversation: {
        id: 'DamM237uwi7F0iETW6MjW8-us',
      },
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'Solicitud',
            subtitle: 'Solicitado por el usuario "User" en el canal "Emulator"',
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
      ],
      entities: [],
    },
  ];
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
    let chat = this.solicitudes.find((s) => s?.id === id && s?.accept);
    if (chat) console.log(`Chat Seleccionad ${id}`);
  }

  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }
  closeChat() {
    try {
      this.alertService.esperando('Cerrando Chat.');
      Swal.showLoading();
      this.loadingStartChat = true;
      this.botService.sendMessage('chao').subscribe((resp: any) => {
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
    this.botService.sendMessage(correo!).subscribe(
      (resp: any) => {
        if (resp) {
          this.sendComandos(1);
          sessionStorage.isInitialized = true;
          this.isInitialized = true;
          this.loadingStartChat = false;
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
    // this.getSolicitudes();
    this.getInteractions();
    this.getAccount();
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

  reaccionarSolicitud(option: boolean, id: string, value: any) {
    const buttons = value?.content?.buttons;
    const message = option ? buttons[0].value : buttons[1].value;
    this.solicitudes = this.solicitudes.map((s) => {
      let req = { ...s };
      if (s?.id === id) {
        if (option) {
          req['accept'] = option;
        }
      }
      return req;
    });
    this.botService.sendMessage(message).subscribe((resp) => {});
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

    this.botService.sendMessage(cmd).subscribe((resp) => {
      console.log('si se envio ');
    });
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
        this.botService.directLine!.activity$.subscribe((activity: any) => {
          if (!this.activities.includes(activity)) {
            if (
              activity.attachments &&
              activity?.attachments[0]?.content?.title === 'Solicitud'
            ) {
              if (!this.solicitudes.includes(activity)) {
                const item = { ...activity };
                const randomIndex = Math.floor(
                  Math.random() * Math.floor(this.colors.length)
                );
                item['color'] = this.colors[randomIndex];
                this.store.dispatch(new PostSolicitudes(item));
                this.solicitudes = [...this.solicitudes, activity];
              }
            } else {
              this.activities = [...this.activities, activity];
            }
          }
        });
        this.botService.sendMessage(message).subscribe((resp: any) => {
          console.log(resp);
        });

        this.mensageForm.disable();
        this.mensageForm.reset();
        this.mensageForm.enable();
        this.txtMessage.nativeElement.focus();
      } catch (error) {
        console.warn(error);
        alert(`Can't send your message`);
      }
    }
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
}
