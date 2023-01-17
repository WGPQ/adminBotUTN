import { Usuario } from 'src/app/interfaces/usuarios.interface';

export class SetAccount {
  static readonly type = '[POST] Set';
  constructor(public payload: Usuario) {}
}
