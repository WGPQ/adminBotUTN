export class Usuario {
    constructor(
        public id?: string,
        public nombres: string = "",
        public apellidos: string = "",
        public correo: string = "",
        public telefono: string = "",
        public clave?: string,
        public rol: string = "",
        public activo: boolean = false,
        public verificado?: boolean,
        public conectado?: boolean,
        public conectedAt?: string
    ) {
    }


}