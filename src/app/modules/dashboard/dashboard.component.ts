import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import { AuthService } from '../../core/services/auth/auth.service';
import { StatisticService } from '../../core/services/statistic.service';
import { Statistic } from '../../core/domain/interfaces/statistic';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private $findStatisticByCountryName = new Subject();
  flagUrl: string;
  countryName: string;
  localStatistic: Statistic;
  statistics: Statistic[];
  totalDeaths: number;
  totalTests: number;
  totalCases: number;
  public chartType = 'bar';

  public chartDatasets: Array<any> = [{ data: [], label: 'Covid statistics' }];

  public chartLabels: Array<any> = ['Cases', 'Tests', 'Deaths'];
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255,99,132,1)'],
      borderWidth: 2,
    },
  ];

  public chartOptions: any = {
    responsive: true,
  };

  constructor(
    private authService: AuthService,
    private statisticService: StatisticService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.countryName = this.authService.getUser().country;
    this.flagUrl = findFlagUrlByCountryName(this.countryName);
    this.getStatisticByCountryName();
    this.getStatistics();
  }

  getStatisticByCountryName(): void {
    this.$findStatisticByCountryName
      .pipe(
        switchMap(() => {
          return this.statisticService.getStatisticByCountryName(this.countryName);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((statistic) => {
        this.localStatistic = statistic;
        this.chartDatasets[0] = {
          data: [statistic.cases.total, statistic.tests.total, statistic.deaths.total],
          label: 'Covid statistics',
        };
      });

    this.$findStatisticByCountryName.next();
  }

  getStatistics(): void {
    this.statisticService
      .getStatistics()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((statistics) => {
        this.statistics = statistics;
        this.calculateTotals();
      });
  }

  syncData(): void {
    this.statisticService
      .syncData()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((statistics) => {
        this.statistics = statistics;
        this.$findStatisticByCountryName.next();
        this.toastService.success('The statistics was successfully updated.');
        this.calculateTotals();
      });
  }

  calculateTotals(): void {
    this.totalCases = this.statisticService.countTotalCases(this.statistics);
    this.totalTests = this.statisticService.countTotalTests(this.statistics);
    this.totalDeaths = this.statisticService.countTotalDeaths(this.statistics);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
