import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AuthenticationRoutingModule.components],
  imports: [AuthenticationRoutingModule, CommonModule, SharedModule],
})
export class AuthenticationModule {}
