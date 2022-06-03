import { Validators } from '@angular/forms';

export class DescripcionValidador {
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