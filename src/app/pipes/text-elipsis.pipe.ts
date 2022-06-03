import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textElipsis'
})
export class TextElipsisPipe implements PipeTransform {

  transform(value: string, limit:number, ...args: unknown[]): string {
    return value.trim().length>limit?value.slice(0,limit)+" ...":value;
  }

}
