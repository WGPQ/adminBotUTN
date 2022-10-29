import { Validators } from '@angular/forms';

export class HoraValidador {
	constructor() {
		return [
			'',
			Validators.compose(
				[
					Validators.required,
					Validators.maxLength(10)
				],
			),
		];
	}
}
