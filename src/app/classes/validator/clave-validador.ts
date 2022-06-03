import { Validators } from '@angular/forms';

export class ClaveValidador {
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