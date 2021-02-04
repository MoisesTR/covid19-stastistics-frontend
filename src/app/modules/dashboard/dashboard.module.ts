import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from '@modules/dashboard/dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardRoutingModule.components],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
