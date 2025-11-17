import {HttpParams} from '@angular/common/http';

export class RequestUtils {

  public static getQueryParamsFromObject(obj: {[k: string]: any}, filterNullParams: boolean = false) {
    let params = new HttpParams();

    for (const key in obj) {
      const value = obj[key];
      if (filterNullParams && !value)
        continue;

      params = params.append(key, obj[key]);
    }

    return params;
  }

}
