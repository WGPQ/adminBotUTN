import { Validators } from '@angular/forms';

export class CorreoValidador {
    constructor() {
        return [
            '',
            Validators.compose(
                [
                    Validators.required,
                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                ]
            ),
        ];
    }
}
