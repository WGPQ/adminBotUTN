import { Validators } from '@angular/forms';

export class ColumnaValidador {
    constructor() {
        return [
            '',
            Validators.compose(
                [
                    // Validators.required
                ],
            ),
        ];
    }
}