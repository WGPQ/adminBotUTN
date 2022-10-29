import { Validators } from '@angular/forms';

export class DiaValidador {
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
