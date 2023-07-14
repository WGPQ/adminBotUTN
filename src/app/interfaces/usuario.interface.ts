export class Usuario {
  constructor(
    public id?: string,
    public foto?: string,
    public nombres: string = '',
    public apellidos: string = '',
    public nombre_completo?: string,
    public correo: string = '',
    public telefono: string = '',
    public clave?: string,
    public id_rol: string = '',
    public rol?: string,
    public activo: boolean = false,
    public verificado?: boolean,
    public conectado?: boolean,
    public conectedAt?: string
  ) {}
}
