import { Validators } from '@angular/forms';

export class RolValidador {
	constructor() {
		return [
			0,
			Validators.compose(
				[
					Validators.required
				],
			),
		];
	}
}