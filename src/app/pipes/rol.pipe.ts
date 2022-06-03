import { Pipe, PipeTransform } from '@angular/core';
import { Rol } from '../interfaces/rol.interface';

@Pipe({
  name: 'rol'
})
export class RolPipe implements PipeTransform {

  transform(id: string, roles: Rol[], ...args: any[]): string {
    let rol = roles.find(r => r.id == id ? r.nombre : '')?.nombre ?? 'Rol no asignado';
    return rol;
  }

}
