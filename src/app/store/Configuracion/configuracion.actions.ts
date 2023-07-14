import { Disponibilidad } from 'src/app/interfaces/disponibilidad.interface';

export class SetConfiguracionList {
  static readonly type = '[POST] SetConfiguracion';
  constructor(public payload: Disponibilidad[]) {}
}
export class SetConfiguracion {
  static readonly type = '[UPDATE] UpdateConfiguracion';
  constructor(public payload: Disponibilidad) {}
}
