import { Comentario } from 'src/app/interfaces/comentarios.interface';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';

export class SetChatActual {
  static readonly type = '[POST] SetCurrentChat';
  constructor(public payload: any) {}
}
export class SetComentarios {
  static readonly type = '[POST] SetComentarios';
  constructor(public payload: Comentario[]) {}
}
export class SetMessagesByChat {
  static readonly type = '[POST] SetMessages';
  constructor(public payload: any[]) {}
}
export class SetUsuarioChat {
  static readonly type = '[POST] SetUsuarioChat';
  constructor(public payload: Usuario) {}
}

export class SetInteracciones {
  static readonly type = '[POST] SetInteracciones';
  constructor(public payload: any) {}
}

export class SetSessiones {
  static readonly type = '[POST] SetSessiones';
  constructor(public payload: any[]) {}
}
export class PostSolicitudes {
  static readonly type = '[POST] SetSolicitudes';
  constructor(public payload: any[]) {}
}
export class UpdateSolicitud {
  static readonly type = '[POST] UpdateSolicitud';
  constructor(public payload: any) {}
}
export class RemoveSolicitud {
  static readonly type = '[POST] RemoveSolicitud';
  constructor(public payload: string) {}
}
export class UpdateShowNotification {
  static readonly type = '[UPDATE] UpdateShowNotification';
  constructor(public payload: boolean) {}
}
