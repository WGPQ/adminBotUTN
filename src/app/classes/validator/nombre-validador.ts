import { Validators } from '@angular/forms';

export class NombreValidador {
	constructor() {
		return [
			'',
			Validators.compose(
				[
					Validators.required,
					Validators.maxLength(50)
				],
			),
		];
	}
}