export class Cliente {
    constructor(
        public id?: string,
        public nombre: string = "",
        public correo: string = "",
        public rol: string = "",
        public conectado?: boolean,
        public conectedAt?: string
    ) {
    }


}