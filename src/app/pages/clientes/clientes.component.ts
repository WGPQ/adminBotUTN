import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { MensageModel } from 'src/app/interfaces/mensaje.interface';
import { Session } from 'src/app/interfaces/session.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ChatService } from 'src/app/services/chat.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { FormsService } from 'src/app/services/forms.service';
import { RolService } from 'src/app/services/rol.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { SendChat } from 'src/app/interfaces/sendchat.interface';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm!: FormGroup;
  liatarForm!: FormGroup;
  submitType: string = 'Guardar';
  action = 'Agregar';
  idCliente?: string;
  cliente!: Cliente;
  cargando = false;
  rol!: string;
  position: number = 0;

  showChats: boolean = false;
  usuario!: Cliente;
  sessiones: Session[] = [];
  messages: MensageModel[] = [];
  cargandoMensajes: boolean = false;
  fecha_chat_seleccionado?: Date;
  pagina = 0;
  paginaActiva = 0;
  numeroPaginas = new Array(1);
  previus = false;
  next = true;
  @ViewChild('scrollMessages') private scrollMessages!: ElementRef;
  @ViewChild('scrollChat') private scrollChat!: ElementRef;
  @ViewChild('txtmessage') private txtMessage!: ElementRef;

  @HostListener('scroll', ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
  }
  @ViewChild('closebutton') closebutton: any;
  constructor(
    private clienteService: ClienteService,
    private alertService: AlertService,
    private formService: FormsService,
    private rolService: RolService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.clienteForm = formService.crearFormularioCliente();
    this.liatarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    console.log('cargo una vez', this.clientes);

    this.listarRoles();
  }
  limitar(){
    this.listarClientes();
  }

  previusPage() {
    if (this.pagina > 0) {
      this.pagina -= 10;
      this.paginaActiva -= 1;
    }
    if (this.pagina == 0) {
      this.previus = false;
      this.next = true;
    }
  }
  irPagina(nPagina: number) {
    this.previus = nPagina > 0 ? true : false;
    this.pagina = nPagina * 10;
    this.next = this.pagina + 10 < this.clientes.length ? true : false;
    this.paginaActiva = nPagina;
  }
  nextPage() {
    if (this.clientes.length > this.pagina) {
      this.pagina += 10;
      this.paginaActiva += 1;
      this.previus = true;
      this.next = this.pagina + 10 < this.clientes.length ? true : false;
    }
  }

  agregarRol() {
    this.clienteForm.reset();
    this.action = 'Agregar';
    this.submitType = 'Guardar';
  }
  listarRoles() {
    this.cargando = true;
    const listar: Listar = {
      columna: '',
      search: '',
      offset: 0,
      limit: '0',
      sort: '',
    };
    this.rolService.obtenerRoles(listar).subscribe((resp) => {
      resp.map((r) => (r.nombre == 'Cliente' ? (this.rol = r.id!) : ''));
      if (this.rol != undefined) {
        this.listarClientes();
      }
    });
  }

  get nombresNoValido() {
    return (
      this.clienteForm.get('nombres')?.invalid &&
      this.clienteForm.get('nombres')?.touched
    );
  }
  get apellidosNoValido() {
    return (
      this.clienteForm.get('apellidos')?.invalid &&
      this.clienteForm.get('apellidos')?.touched
    );
  }
  get correoNoValido() {
    return (
      this.clienteForm.get('correo')?.invalid &&
      this.clienteForm.get('correo')?.touched
    );
  }
  onCloseForm() {
    this.closebutton.nativeElement.click();
  }
  guardarCliente() {
    if (this.clienteForm.invalid) {
      return Object.values(this.clienteForm.controls).forEach((contr) => {
        if (contr instanceof FormGroup) {
          Object.values(contr.controls).forEach((contr) =>
            contr.markAllAsTouched()
          );
        } else {
          contr.markAsTouched();
        }
      });
    }

    const cliente: Cliente = {
      id: this.idCliente,
      nombres: this.clienteForm.value.nombres,
      activo: true,
      apellidos: this.clienteForm.value.apellidos,
      correo: this.clienteForm.value.correo,
      id_rol: this.rol,
    };
    if (this.action == 'Agregar') {
      this.clienteService.ingresarCliente(cliente).subscribe((resp) => {
        if (resp.exito) {
          this.alertService
            .correcto(resp.data.nombre, resp.message)
            .then(() => {
              this.closebutton.nativeElement.click();
              this.listarClientes();
            });
        } else {
          console.log('errorl');
          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      console.log(cliente);

      this.clienteService.actualizarCliente(cliente).subscribe((resp) => {
        if (resp.exito) {
          this.alertService
            .correcto(resp.data.nombre, resp.message)
            .then(() => {
              this.closebutton.nativeElement.click();
              this.listarClientes();
            });
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    }
  }
  search() {
    if (this.liatarForm.value.columna != '') {
      this.listarClientes();
    }
  }
  listarClientes() {
    var listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit || 10,
      sort: this.liatarForm.value.sort,
    };

    this.clienteService.obtenerClientes(this.rol, listar).subscribe((resp) => {
      this.clientes = resp;
      this.numeroPaginas = new Array(Math.ceil(this.clientes.length / 10));
      this.cargando = false;
    });
  }

  editarCliente(id?: string) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.idCliente = id;
    this.clienteService.obtenerCliente(id).subscribe((resp) => {
      this.cliente = resp;
      this.clienteForm.patchValue({
        nombres: resp.nombres,
        apellidos: resp.apellidos,
        correo: resp.correo,
      });
    });
  }

  eliminar(cliente: Cliente) {
    if (cliente.id != null) {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Esta seguro que desea borrar a',
        text: `${cliente.nombre_completo}`,
        showConfirmButton: true,
        showCancelButton: true,
      }).then((resp) => {
        if (resp.value) {
          this.clienteService.eliminarCliente(cliente.id).subscribe((resp) => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message).then(() => {
                this.listarClientes();
              });
            } else {
              this.alertService.error('Error', resp.message);
            }
          });
        }
      });
    }
  }

  exportarReporte() {
    const listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit,
      sort: this.liatarForm.value.sort,
    };
    this.clienteService.exportarExcel(this.rol, listar).subscribe((blob) => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }

  getUser(usuario: Cliente) {
    this.usuario = usuario;
  }
  getSessiones(usuario: Cliente) {
    this.position = 0;
    this.showChats = true;
    this.getUser(usuario);
    var listar: Listar = {
      columna: 'createdAt',
      search: '',
      offset: 0,
      limit: '100',
      sort: '',
    };
    this.cargando = true;
    this.chatService.getSessiones(usuario?.id!, listar).subscribe((resp) => {
      this.sessiones = resp;
      this.cargando = false;
    });
  }
  backClients() {
    this.showChats = false;
    this.sessiones = [];
    this.messages = [];
  }
  cragarChat(idSession: string, i: number, fecha: Date) {
    this.fecha_chat_seleccionado = fecha;
    this.messages = [];
    this.position = i;
    this.cargandoMensajes = true;
    this.chatService.getChat(idSession).subscribe((resp) => {
      this.messages = resp;
      this.cargandoMensajes = false;
    });
  }
  enviarChat() {
    html2canvas(document.querySelector('#chat-messages')!).then((canvas) => {
      const data: SendChat = {
        image: canvas.toDataURL(),
        comentario: '',
        usuario: this.usuario,
      };
      this.chatService.sendChatCliente(data).subscribe((resp) => {
        if (resp.exito) {
          this.alertService.correcto('', resp.message);
        } else {
          this.alertService.error('', resp.message);
        }
      });
    });
  }
}
