import {User} from '../../models/users/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

export function createCurrentUserForm(builder: FormBuilder, defaultCurrentUser?: User): FormGroup<CurrentUserForm> {
  return builder.group<CurrentUserForm>({
    nameFirst: new FormControl(defaultCurrentUser?.nameFirst ?? '', Validators.required),
    nameLast: new FormControl(defaultCurrentUser?.nameLast ?? '', Validators.required),
    phone: new FormControl(defaultCurrentUser?.phone ?? '', Validators.required)
  })
}

export interface CurrentUserForm {
  nameFirst: FormControl<string | null>;
  nameLast: FormControl<string | null>;
  phone: FormControl<string | null>;
}
