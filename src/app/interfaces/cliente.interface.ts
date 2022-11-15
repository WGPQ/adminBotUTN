export class Cliente {
    constructor(
        public id?: string,
        public nombres: string = "",
        public apellidos: string = "",
        public activo: boolean=true,
        public nombre_completo?: string ,
        public correo: string = "",
        public id_rol?: string ,
        public rol?: string,
        public conectado?: boolean,
        public conectedAt?: string
    ) {
    }


}
