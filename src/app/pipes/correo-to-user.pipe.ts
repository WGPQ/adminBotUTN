import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';

@Pipe({
  name: 'correoToUser',
})
export class CorreoToUserPipe implements PipeTransform {
  transform(correo: string, usuarios: Usuario[], ...args: any[]): string {
    const user = usuarios?.find((u) => u?.correo == correo);
    if (user) return `${user?.nombres} ${user?.apellidos}`;
    return correo;
  }
}
