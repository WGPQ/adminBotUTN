import { SolicitudesStateModel } from './solicitudes.models';

export class PostSolicitudes {
  static readonly type = '[POST] Add';
  constructor(public payload: SolicitudesStateModel) {}
}
export class RemoveSolicitud {
  static readonly type = '[POST] Remove';
  constructor(public payload: string) {}
}
