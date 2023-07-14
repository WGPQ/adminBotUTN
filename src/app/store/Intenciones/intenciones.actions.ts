import { Intencion } from 'src/app/interfaces/intencion.interface';

export class SetIntencionesList {
  static readonly type = '[POST] SetIntenciones';
  constructor(public payload: Intencion[]) {}
}

export class SetIntencion {
  static readonly type = '[POST] AddIntencion';
  constructor(public payload: Intencion) {}
}
export class RemoveIntencion {
  static readonly type = '[DELETE] DeleteIntencion';
  constructor(public payload: string) {}
}
