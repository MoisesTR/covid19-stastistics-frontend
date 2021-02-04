import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest-service';
import { Observable } from 'rxjs';
import { Country } from '@core/domain/interfaces/country';

@Injectable()
export class CountryService extends RestService {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>('https://restcountries.eu/rest/v2/all');
  }
}
