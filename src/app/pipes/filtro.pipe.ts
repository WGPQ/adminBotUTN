import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {


  transform(lista: any[], page: number = 0): any[] {
    return lista.slice(page, page + 10)
  }

}
