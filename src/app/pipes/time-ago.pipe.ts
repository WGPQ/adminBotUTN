import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance, parseISO, subMinutes } from 'date-fns';
import esLocale from "date-fns/locale/es";

const localeMap = {
  es: esLocale,
};
@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    return formatDistance(subMinutes(parseISO(value),0), new Date(), {
      locale:localeMap["es"],
      addSuffix: true,
    });
  }
}
