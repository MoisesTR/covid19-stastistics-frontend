import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import { AuthService } from '../../core/services/auth/auth.service';
import { StatisticService } from '../../core/services/statistic.service';
import { Statistic } from '../../core/domain/interfaces/statistic';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { groupBy } from '@app/utils/utils';
import { Continent } from '../../core/domain/dtos/continent';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private $findStatisticByCountryName = new Subject();
  private $findStatisticByCountryId = new Subject();

  formCases: FormGroup;
  formDeaths: FormGroup;
  formTests: FormGroup;

  @ViewChild('modalDetailStatistic', { static: true })
  modalDetailStatistic: ModalDirective;

  @ViewChild('modalUpdateStatistic', { static: true })
  modalUpdateStatistic: ModalDirective;

  flagUrl: string;
  countryName: string;
  localStatistic: Statistic;
  statistics: Statistic[];
  continents: Continent[] = [];
  selectedCountry: Statistic;
  countryToUpdate: Statistic;
  flagUrlSelected: string;
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

  headElements = ['#', 'Country', 'Population', 'Action'];

  public chartOptions: any = {
    responsive: true,
  };

  constructor(
    private authService: AuthService,
    private statisticService: StatisticService,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.countryName = this.authService.getUser().country;
    this.flagUrl = findFlagUrlByCountryName(this.countryName);
    this.getStatisticByCountryName();
    this.onGetStatisticByCountryId();
    this.getStatistics();

    this.initForms();
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

  onGetStatisticByCountryId(): void {
    this.$findStatisticByCountryId
      .pipe(
        switchMap(() => {
          return this.statisticService.getStatisticById(this.countryToUpdate.statisticId);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((statistic) => {
        this.updateInformationCards(statistic);
      });
  }

  updateInformationCards(statisticUpdated: Statistic): void {
    this.continents.forEach((continent) => {
      if (continent.name === statisticUpdated.continent) {
        const indexStatisticTable = continent.statistics.findIndex(
          (statistic2) => statistic2.statisticId === statisticUpdated.statisticId
        );

        // Update information of selected country in table
        continent.statistics[indexStatisticTable] = { ...statisticUpdated };

        // If the country updated if the same of the user logged, update the data in the card
        if (statisticUpdated.statisticId === this.localStatistic.statisticId) {
          this.$findStatisticByCountryName.next();
        }

        // Update the 3 totals cards
        const indexStatistic = this.statistics.findIndex(
          (statisticTotals) => statisticTotals.statisticId === statisticUpdated.statisticId
        );

        this.statistics[indexStatistic] = { ...statisticUpdated };
        this.calculateTotals();
      }
    });
  }

  getStatistics(): void {
    this.statisticService
      .getStatistics()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((statistics) => {
        this.statistics = statistics;
        this.createArrayContinents(groupBy<Statistic>(statistics, 'continent'));
        this.calculateTotals();
      });
  }

  createArrayContinents(groupContinents: any): void {
    groupContinents.forEach((statisticsContinent, continent) => {
      if (continent && continent !== 'All') {
        this.continents.push({
          name: continent,
          statistics: statisticsContinent,
        });
      }
    });
  }

  initForms(): void {
    this.formCases = this.formBuilder.group({
      active: new FormControl(0),
      critical: new FormControl(0),
      newCases: new FormControl(0),
      recovered: new FormControl(0),
    });
    this.formTests = this.formBuilder.group({
      newTests: new FormControl(0),
    });
    this.formDeaths = this.formBuilder.group({
      newCases: new FormControl(0),
    });
  }

  updateCases(): void {
    this.statisticService
      .addNewCases({
        statisticId: this.countryToUpdate.statisticId,
        ...this.formCases.value,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((resp) => {
        this.toastService.success(resp.message);
        this.$findStatisticByCountryId.next(this.countryToUpdate.statisticId);
      });
  }

  updateTests(): void {
    this.statisticService
      .addNewTests({
        statisticId: this.countryToUpdate.statisticId,
        ...this.formTests.value,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((resp) => {
        this.toastService.success(resp.message);
        this.$findStatisticByCountryId.next(this.countryToUpdate.statisticId);
      });
  }

  updateDeaths(): void {
    this.statisticService
      .addNewDeaths({
        statisticId: this.countryToUpdate.statisticId,
        ...this.formDeaths.value,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((resp) => {
        this.toastService.success(resp.message);
        this.$findStatisticByCountryId.next(this.countryToUpdate.statisticId);
      });
  }

  syncData(): void {
    this.toastService.info('Synchronizing statistics...');
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

  showDetailCountry(statistic: Statistic): void {
    this.selectedCountry = statistic;
    this.flagUrlSelected = findFlagUrlByCountryName(this.selectedCountry.country);
    this.modalDetailStatistic.show();
  }

  showModalUpdate(statistic: Statistic): void {
    [this.formCases, this.formTests, this.formDeaths].forEach((form) => form.reset());
    this.countryToUpdate = statistic;
    this.modalUpdateStatistic.show();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
