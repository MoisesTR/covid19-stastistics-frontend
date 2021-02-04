import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShowErrorsComponent } from './components/show-errors.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ShowErrorsComponent],
  exports: [
    CommonModule,
    MDBBootstrapModulesPro,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ShowErrorsComponent,
  ],
})
export class SharedModule {}
