import { Validators } from '@angular/forms';

export class RecordarValidador {
    constructor() {
        return [localStorage.getItem('correo')!=null?true:false];
    }
}
