import { Comentario } from 'src/app/interfaces/comentarios.interface';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';

export class ChatStateModel {
  chatActual: any;
  chatMessages: any[] = [];
  solicitudes: any[] = [];
  interacciones: any;
  anios: any[] = [];
  meses: any[] = [];
  comentarios: Comentario[] = [];
  mostarNotificacion: boolean = false;
  usuarioChat?: Usuario;
  sesiones: any[] = [];
}
