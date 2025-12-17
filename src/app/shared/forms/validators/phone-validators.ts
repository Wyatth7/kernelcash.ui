import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Regex} from '../../utils/regex';

/**
 * Input validator for phone numbers.
 *
 * This only validates the concrete phone number, it does not validate country codes.
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = Regex.phone.phone.test(control.value);

    return isValid ? null : {phone: control.value};
  }
}
