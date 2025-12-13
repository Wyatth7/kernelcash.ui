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
  private readonly _currentUserUrl = `${this._baseUrl}current`

  public async getCurrentUser(): Promise<User> {
    const response = await lastValueFrom<OkApiResponseWithData<User>>(
      this._http.get<OkApiResponseWithData<User>>(this._currentUserUrl)
    )

    return response.data;
  }

  public async updateCurrentUser(currentUser: Partial<User>): Promise<User> {
    const response = await lastValueFrom<OkApiResponseWithData<User>>(
      this._http.put<OkApiResponseWithData<User>>(this._currentUserUrl, currentUser)
    )

    return response.data;
  }

}
