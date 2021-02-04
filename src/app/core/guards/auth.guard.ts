import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@core/domain/interfaces/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private identityService: AuthService) {}

  canActivate(): Observable<boolean> | boolean {
    if (!this.identityService.getUser()) {
      return this.identityService.me().pipe(
        map((user: User) => {
          this.identityService.setUser(user);
          return true;
        })
      );
    }
    return true;
  }
}
