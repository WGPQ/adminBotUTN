import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Activity } from 'botframework-directlinejs';
import { Interaction } from 'src/app/interfaces/interaction.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { MensageModel } from 'src/app/interfaces/mensaje.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BibliotecaService } from 'src/app/services/biblioteca.service';
import { BotService } from 'src/app/services/bot.service';
import { ChatService } from 'src/app/services/chat.service';
import { FormsService } from 'src/app/services/forms.service';
import { environment } from 'src/environments/environment';
import { UsuariosComponent } from '../usuarios/usuarios.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMessages') private scrollMessages!: ElementRef;
  @ViewChild('scrollChat') private scrollChat!: ElementRef;
  @ViewChild("txtmessage") private txtMessage!: ElementRef;
  messages: MensageModel[] = [];
  activities: any[] = [];
  interactions: Interaction[] = [];
  solicitud: any;
  idBot = "";
  idChat = "";
  usuario?: Usuario;
  public mensageForm: FormGroup;
  loading = false;


  @HostListener("scroll", ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
    console.log("scroll: ", scrollOffset);
  }


  constructor(
    private formService: FormsService,
    private botService: BotService,
    private chatService: ChatService,
    private authService: AuthenticationService,
    private bibliotecaService: BibliotecaService) {
    this.usuario = authService.usuario;
    this.idBot = environment.id_bot
    this.loading = true;
    this.mensageForm = formService.crearFormularioMensaje();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  scrollToBottom(): void {
    try {
      this.scrollChat.nativeElement.scrollTop = this.scrollChat.nativeElement.scrollHeight;
      this.scrollMessages.nativeElement.scrollToBottom = this.scrollMessages.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.getInteractions();
  }



  cargarHistorial(idChat: string) {
    const listar: Listar = {
      columna: "",
      search: "",
      offset: 0,
      limit: 100,
      sort: ""
    }
    this.idChat = idChat;
    this.chatService.getMessages(idChat, listar).subscribe(resp => {
      this.messages = resp;
    });
  }

  cargarMas() {
    var resp = this.bibliotecaService.listarHostorialMensajes();
    this.messages = [...this.messages, ...resp];
  }
  guardarMessage() {
    if (this.mensageForm.valid && this.mensageForm.value.message.trim().length > 0) {
      const message = this.mensageForm.value.message.trim();
      try {
        let nuevoMensaje: MensageModel = {
          chat: this.idChat,
          contenido: (message).trim(),
        };
        this.botService.directLine!.activity$.subscribe((activity: any) => {
          // if (activity.attachments) {
          //   if (activity.attachments.length > 0) {
          //     this.solicitud = activity;
          //   }
          // }
          if (!this.activities.includes(activity)) {
            console.log(activity);
            this.activities = [...this.activities, activity];
          }
        });
        this.botService.sendMessage(message).subscribe(resp => {

          console.log(resp);

        })
        // this.chatService.newMessage(nuevoMensaje).subscribe(
        //   (resp: any) => {
        //     if (resp.exito) {
        //       nuevoMensaje = resp.data;
        //       this.messages = [...this.messages, nuevoMensaje];
        //     }
        //   }
        // );
        this.mensageForm.disable();
        // this.socketService.sendMessage(message);

        this.mensageForm.reset();
        this.mensageForm.enable();
        this.txtMessage.nativeElement.focus()
      } catch (error) {
        console.warn(error);
        alert(`Can't send your message`);
      }
    }
  }
  getInteractions() {
    const listar: Listar = {
      columna: "",
      search: "",
      offset: 0,
      limit: 100,
      sort: ""
    }
    this.loading = true;
    this.chatService.getInteractios(listar).subscribe(resp => {
      this.interactions = resp;
      this.loading = false;

    });
  }

}
