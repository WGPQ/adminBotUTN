import { Usuario } from 'src/app/interfaces/usuario.interface';

export class SetAccount {
  static readonly type = '[POST] SetAccountPortal';
  constructor(public payload: Usuario) {}
}
export class SetAccountBlog {
  static readonly type = '[POST] SetAccountBlog';
  constructor(public payload: Usuario) {}
}
export class RemoveAccount {
  static readonly type = '[POST] RemoveAccount';
  constructor(public payload: Usuario) {}
}
export class RemoveAccountBlog {
  static readonly type = '[POST] RemoveAccountBlog';
  constructor(public payload: any) {}
}
export class SetBotPortal {
  static readonly type = '[POST] SetBotPortal';
  constructor(public payload: Usuario) {}
}
