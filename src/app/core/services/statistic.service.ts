import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from './rest-service';
import { AddNewCaseDto, AddNewDeathDto, AddNewTestDto } from '@core/domain/dtos/statistic';
import { Statistic } from '@core/domain/interfaces/statistic';

@Injectable()
export class StatisticService extends RestService {
  private relativeUrl = 'statistics/';

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  syncData(): Observable<Statistic[]> {
    return this.get('sync');
  }

  getStatistics(): Observable<Statistic[]> {
    return this.get(this.relativeUrl);
  }

  getStatisticById(statisticId: string): Observable<Statistic> {
    return this.get(this.relativeUrl + statisticId);
  }

  countTotalCases(statistics: Statistic[]): number {
    return statistics
      .map((statistic) => statistic.cases.total)
      .reduce((total1, total2) => total1 + total2, 0);
  }

  countTotalDeaths(statistics: Statistic[]): number {
    return statistics
      .map((statistic) => statistic.deaths.total)
      .reduce((total1, total2) => total1 + total2, 0);
  }

  countTotalTests(statistics: Statistic[]): number {
    return statistics
      .map((statistic) => statistic.tests.total)
      .reduce((total1, total2) => total1 + total2, 0);
  }

  getStatisticByCountryName(countryName: string): Observable<Statistic> {
    return this.get(this.relativeUrl + `country-name/${countryName}`);
  }

  addNewCases(addNewCaseDto: AddNewCaseDto): Observable<any> {
    const { statisticId, ...data } = addNewCaseDto;
    return this.post(this.relativeUrl + `new-cases/${statisticId}`, data);
  }

  addNewDeaths(addNewDeathDto: AddNewDeathDto): Observable<any> {
    const { statisticId, ...data } = addNewDeathDto;
    return this.post(this.relativeUrl + `new-deaths/${statisticId}`, data);
  }

  addNewTests(addNewTestDto: AddNewTestDto): Observable<any> {
    const { statisticId, ...data } = addNewTestDto;
    return this.post(this.relativeUrl + `new-tests/${statisticId}`, data);
  }
}
