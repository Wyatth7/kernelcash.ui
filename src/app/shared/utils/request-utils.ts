import {HttpParams} from '@angular/common/http';

export class RequestUtils {

  public static getQueryParamsFromObject(obj: {[k: string]: any}) {
    let params = new HttpParams();

    for (const key in obj) {
      params = params.append(key, obj[key]);
    }

    return params;
  }

}
