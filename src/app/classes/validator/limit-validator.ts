import { Validators } from '@angular/forms';

export class LimitVlidador {
  constructor() {
    return ['10', Validators.compose([])];
  }
}
