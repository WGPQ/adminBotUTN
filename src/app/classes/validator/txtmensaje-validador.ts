import { Validators } from '@angular/forms';

export class MensajeValidador {
	constructor() {
		return [
			'',
			Validators.compose(
				[
					Validators.required
				],
			),
		];
	}
}
