import {User} from '../../models/users/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {phoneValidator} from '../validators/phone-validators';
import {Regex} from '../../utils/regex';

export function createCurrentUserForm(builder: FormBuilder, defaultCurrentUser?: User): FormGroup<CurrentUserForm> {
  return builder.group<CurrentUserForm>({
    nameFirst: new FormControl(defaultCurrentUser?.nameFirst ?? '', Validators.required),
    nameLast: new FormControl(defaultCurrentUser?.nameLast ?? '', Validators.required),
    phone: new FormControl(stripCountryCode(defaultCurrentUser?.phone), [Validators.required, phoneValidator()])
  })
}

/**
 * Removes the country code from a phone number.
 * @param phone The phone number.
 */
export function stripCountryCode(phone?: string): string {
  if (!phone) return '';

  return phone.replace(Regex.phone.removeCountryCode, '');
}

export function getUserFromForm(form: FormGroup<CurrentUserForm>): Partial<User> {
  const values = form.getRawValue();

  return {
    nameFirst: values.nameFirst ?? '',
    nameLast: values.nameLast ?? '',
    phone: values.phone ?`+1 ${values.phone.replace(Regex.numeric, '')}` : ''
  }
}

export interface CurrentUserForm {
  nameFirst: FormControl<string | null>;
  nameLast: FormControl<string | null>;
  phone: FormControl<string | null>;
}
