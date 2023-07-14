import { Validators } from '@angular/forms';

export class ComentarioValidador {
  constructor() {
    return ['', Validators.required];
  }
}
