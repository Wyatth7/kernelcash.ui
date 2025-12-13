import {Component, computed, inject, signal} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/users/user';
import {DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {InputText} from "primeng/inputtext";
import {SelectedSettingComponent} from "../../settings/selected-setting/selected-setting.component";
import {FormControlComponent} from "../../form/form-control/form-control.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {createCurrentUserForm, CurrentUserForm} from "../../../forms/users/current-user-form";

@Component({
  selector: 'kc-user-editor',
  imports: [
    DatePipe,
    SelectedSettingComponent,
    FormControlComponent
  ],
  templateUrl: 'user-editor.component.html'
})
export class UserEditorComponent {
  protected readonly auth = inject(AuthenticationService);
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly currentUser = signal<User>(this.auth.currentUser);
  protected readonly currentUserForm = computed<FormGroup<CurrentUserForm>>(
    () => createCurrentUserForm(this._formBuilder, this.currentUser())
  );

}
