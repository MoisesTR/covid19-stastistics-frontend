import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '@core/guards/module-import.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '@core/guards/auth.guard';
import { HttpInterceptorService } from '@core/http-interceptor/http-interceptor.service';
import { CountryService } from '@core/services/country.service';
import { AuthService } from '@core/services/auth/auth.service';
import { StatisticService } from '@core/services/statistic.service';
import { LoginGuard } from '@core/guards/login.guard';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [
    AuthGuard,
    LoginGuard,
    AuthService,
    StatisticService,
    CountryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
