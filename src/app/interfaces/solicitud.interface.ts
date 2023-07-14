export class Solicitud {
  constructor(
    public id?: string,
    public solicitante: string = '',
    public reaccion: string = '',
    public session?: string,
    public accion?: boolean,
    public conectedAt?: string
  ) {}
}
