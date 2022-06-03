import { Validators } from '@angular/forms';

export class FraceValidador {
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