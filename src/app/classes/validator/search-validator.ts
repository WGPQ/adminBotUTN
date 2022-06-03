import { Validators } from '@angular/forms';

export class SearchValidador {
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