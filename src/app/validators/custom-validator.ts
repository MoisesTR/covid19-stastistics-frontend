import { AbstractControl } from '@angular/forms';

export class CustomValidator {
  static passwordMatchValidator(control: AbstractControl): any {
    const password: string = control.get('password').value;
    const passwordConfirm: string = control.get('passwordConfirm').value;

    return password === passwordConfirm ? null : { noPasswordMatch: true };
  }
}
