import { Validators } from '@angular/forms';

export class SortValidador {
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