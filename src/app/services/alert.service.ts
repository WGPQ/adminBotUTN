import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor() { }

    informacion() {

    }
    correcto(titulo: string = '', mensaje: string) {
        return Swal.fire({
            position: 'top',
            icon: 'success',
            title: titulo.length > 1 ? titulo : mensaje,
            text: titulo.length > 1 ? mensaje : '',
            showConfirmButton: false,
            timer: 1400
        });
    }


    error(titulo: string = '', mensaje: string) {
        return Swal.fire({
            position: 'top',
            icon: 'error',
            title: titulo,
            text: mensaje,
            timer: 3500
        });
    }
    esperando(mensaje: string) {
        return Swal.fire({
            position: 'top',
            icon: 'info',
            text: mensaje,
            allowOutsideClick: false,
        });
    }


}
