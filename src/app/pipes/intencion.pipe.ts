import { Pipe, PipeTransform } from '@angular/core';
import { Intencion } from '../interfaces/intencion.interface';

@Pipe({
  name: 'intencion'
})
export class IntencionPipe implements PipeTransform {

  transform(id: string, intenciones: Intencion[], ...args: any[]): string {
    let rol = intenciones.find(r => r.id == id ? r.nombre : '')?.nombre ?? 'Intencion no asignado';
    return rol;
  }

}
