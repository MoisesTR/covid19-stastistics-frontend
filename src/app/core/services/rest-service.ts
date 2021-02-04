import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

export abstract class RestService {
  protected readonly apiURL: string;

  protected headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  protected constructor(public http: HttpClient) {
    this.apiURL = environment.baseUrl;
  }

  protected get(relativeUrl: string, params = {}): Observable<any> {
    return this.http.get(this.apiURL + relativeUrl, { params });
  }

  protected post(relativeUrl: string, data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.http.post(this.apiURL + relativeUrl, params, {
      headers: this.headers,
    });
  }
}
