import { Usuario } from 'src/app/interfaces/usuario.interface';

export class SetUsuariosList {
  static readonly type = '[POST] SetUsers';
  constructor(public payload: Usuario[]) {}
}
export class SetUsuario {
  static readonly type = '[POST] SetUser';
  constructor(public payload: Usuario) {}
}
export class RemoveUsuario {
  static readonly type = '[DELETE] DeleteUser';
  constructor(public payload: string) {}
}
