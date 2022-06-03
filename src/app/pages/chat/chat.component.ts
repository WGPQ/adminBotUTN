import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Interaction } from 'src/app/interfaces/interaction.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { MensageModel } from 'src/app/interfaces/mensaje.interface';
import { BibliotecaService } from 'src/app/services/biblioteca.service';
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
  interactions: Interaction[] = [];
  idBot = "";
  idChat = "";
  public mensageForm: FormGroup;
  loading = false;


  @HostListener("scroll", ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
    console.log("scroll: ", scrollOffset);
  }


  constructor(private formService: FormsService,
    private chatService: ChatService,
    private bibliotecaService: BibliotecaService) {
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

        this.chatService.newMessage(nuevoMensaje).subscribe(
          (resp: any) => {
            if (resp.exito) {
              nuevoMensaje=resp.data;
              this.messages = [...this.messages, nuevoMensaje];
            }
          }
        );
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
