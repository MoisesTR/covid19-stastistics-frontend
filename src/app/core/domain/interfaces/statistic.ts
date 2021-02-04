import { Case } from './case';
import { Death } from './death';
import { TestCovid } from '@core/domain/interfaces/test-covid';

export interface Statistic {
  statisticId: string;
  continent: string;
  country: string;
  population: number;
  cases: Case;
  deaths: Death;
  tests: TestCovid;
  day: Date;
  time: string;
}
