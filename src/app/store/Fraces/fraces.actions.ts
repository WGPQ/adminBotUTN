import { Frace } from 'src/app/interfaces/frace.interface';

export class SetFracesList {
  static readonly type = '[POST] SetFraces';
  constructor(public payload: Frace[]) {}
}
export class SetFrace {
  static readonly type = '[POST] AddFrace';
  constructor(public payload: Frace) {}
}
export class RemoveFrace {
  static readonly type = '[DELETE] DeleteFrace';
  constructor(public payload: string) {}
}
