import { Validators } from '@angular/forms';

export class IntencionValidador {
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