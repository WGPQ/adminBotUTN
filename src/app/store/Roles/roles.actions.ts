import { Rol } from 'src/app/interfaces/rol.interface';

export class SetRolesList {
  static readonly type = '[POST] SetRoles';
  constructor(public payload: Rol[]) {}
}
export class SetRol {
  static readonly type = '[POST] AddRol';
  constructor(public payload: Rol) {}
}
export class RemoveRol {
  static readonly type = '[DELETE] DeleteRol';
  constructor(public payload: string) {}
}
