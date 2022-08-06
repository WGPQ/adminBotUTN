export class Cliente {
    constructor(
        public id?: string,
        public nombres: string = "",
        public apellidos: string = "",
        public nombre_completo?: string ,
        public correo: string = "",
        public rol?: string ,
        public conectado?: boolean,
        public conectedAt?: string
    ) {
    }


}