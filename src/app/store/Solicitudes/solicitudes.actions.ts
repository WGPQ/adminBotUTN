
export class PostSolicitudes {
  static readonly type = '[POST] Add';
  constructor(public payload: any[]) {}
}
export class RemoveSolicitud {
  static readonly type = '[POST] Remove';
  constructor(public payload: string) {}
}
