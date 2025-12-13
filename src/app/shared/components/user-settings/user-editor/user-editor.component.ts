import {Component, computed, inject, signal} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/users/user';
import {DatePipe} from '@angular/common';
import {SelectedSettingComponent} from "../../settings/selected-setting/selected-setting.component";
import {FormControlComponent} from "../../form/form-control/form-control.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {
  createCurrentUserForm,
  CurrentUserForm,
  getUserFromForm,
  stripCountryCode
} from "../../../forms/users/current-user-form";
import {InputMask} from "primeng/inputmask";
import {UserService} from "../../../services/user.service";
import {PhonePipe} from "../../../pipes/phone-pipe";

@Component({
  selector: 'kc-user-editor',
  imports: [
    DatePipe,
    SelectedSettingComponent,
    FormControlComponent,
    InputMask,
    ReactiveFormsModule,
    PhonePipe
  ],
  templateUrl: 'user-editor.component.html'
})
export class UserEditorComponent {
  protected readonly auth = inject(AuthenticationService);
  private readonly _user = inject(UserService);
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly currentUser = signal<User>({...this.auth.getCurrentUser()});
  protected readonly currentUserForm = computed<FormGroup<CurrentUserForm>>(
    () => createCurrentUserForm(this._formBuilder, this.currentUser())
  );

  protected async updateCurrentUser(): Promise<void> {
    const currentUser = getUserFromForm(this.currentUserForm());
    const updatedUser = await this._user.updateCurrentUser(currentUser);

    this.currentUserForm().reset(updatedUser);
    this.currentUser.set(updatedUser);
    this.auth.setCurrentUser(updatedUser);
  }

  protected reset(): void {
    this.currentUserForm().reset(this.currentUser());
  }

  protected updateCurrentUserFn = this.updateCurrentUser.bind(this);
}
