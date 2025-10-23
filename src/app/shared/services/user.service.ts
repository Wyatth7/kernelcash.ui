import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {OkApiResponseWithData} from '../models/api-response/ok-api-response-with-data';
import {User} from '../models/users/user';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _http = inject(HttpClient);

  private readonly _baseUrl = `${environment.apiUrl}user/`;

  public async getCurrentUser(): Promise<User> {
    const response = await lastValueFrom<OkApiResponseWithData<User>>(
      this._http.get<OkApiResponseWithData<User>>(this._baseUrl + '/current')
    )

    return response.data;
  }

}
