import {Component, inject, output} from '@angular/core';
import {FileUpload} from 'primeng/fileupload';
import {environment} from '../../../../../environments/environment';
import {HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'kc-import-transactions',
  imports: [
    FileUpload
  ],
  templateUrl: 'import-transactions.component.html'
})
export class ImportTransactionsComponent {
  private readonly _authentication = inject(AuthenticationService);

  public readonly uploadStarted = output<void>();
  public readonly uploadComplete = output<void>();

  protected readonly uploadUrl = `${environment.apiUrl}transaction/import`
  protected readonly headers: HttpHeaders;

  constructor() {
    const headers = new HttpHeaders();

    headers.set('Authorization', `Bearer ${this._authentication.token}`);
    this.headers = headers
  }
}
