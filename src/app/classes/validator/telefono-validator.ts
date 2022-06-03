import { Validators } from '@angular/forms';

export class TelefonoValidador {
	constructor() {
		return [
			'',
			Validators.compose(
				[
					Validators.required,
					Validators.pattern("^[0-9]*$"),
					Validators.minLength(8),
				],
			),
		];
	}
}