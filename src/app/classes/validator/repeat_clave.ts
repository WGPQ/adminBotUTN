import { Validators } from '@angular/forms';

export class RepeatClaveValidador {
    constructor() {
        return [
            '',
            Validators.compose(
                [
                    Validators.required,
                ]
            ),
        ];
    }
}