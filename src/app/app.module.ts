import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule } from 'ng-uikit-pro-standard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { AuthenticationLayoutComponent } from '@app/layout/authentication-layout/authentication-layout.component';
import { ContentLayoutComponent } from '@app/layout/content-layout/content-layout.component';
import { HeaderComponent } from '@app/layout/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationLayoutComponent,
    HeaderComponent,
    ContentLayoutComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot({
      opacity: 1,
      preventDuplicates: false,
      maxOpened: 3,
      autoDismiss: true,
      timeOut: 7000,
    }),
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
  ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent],
})
export class AppModule {}
