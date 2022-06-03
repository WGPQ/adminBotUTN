import { Validators } from '@angular/forms';

export class OffsetVlidador {
    constructor() {
        return [
            0,
            Validators.compose(
                [
                    // Validators.required
                ],
            ),
        ];
    }
}