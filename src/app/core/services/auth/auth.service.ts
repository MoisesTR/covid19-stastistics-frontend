import { Injectable } from '@angular/core';
import { RestService } from '../rest-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@core/domain/interfaces/user';
import { Router } from '@angular/router';
import { LoginResponseDto } from '@core/domain/dtos/login.dto';
import { UserRegisterDto } from '@core/domain/dtos/user.dto';

@Injectable()
export class AuthService extends RestService {
  private relativeUrl = 'auth/';
  private user: User;

  constructor(private httpClient: HttpClient, private router: Router) {
    super(httpClient);
  }

  validateLogin(userName: string, password: string): void {
    if (!userName) {
      throw new Error('Please enter your username');
    }

    if (!password) {
      throw new Error('Please enter your password');
    }
  }

  authenticate(userName: string, password: string): Observable<LoginResponseDto> {
    return this.post(this.relativeUrl + 'signin', {
      userName,
      password,
      returnTokens: false,
    });
  }

  validateRegisterUser(userName: string, password: string): void {
    if (!userName) {
      throw new Error('Please enter your username');
    }

    if (!password) {
      throw new Error('Please enter your password');
    }

    if (!password) {
      throw new Error('Please enter your password');
    }
  }

  registerUser(user: UserRegisterDto): Observable<User> {
    return this.post(this.relativeUrl + 'signup', user);
  }

  me(): Observable<User> {
    return this.get(this.relativeUrl + 'me');
  }

  public getUser(): User {
    return this.user;
  }
  public setUser(user: User): void {
    this.user = user;
    localStorage.setItem('userName', user.userName);
  }

  logout(): void {
    localStorage.clear();
    this.get(this.relativeUrl + 'logout');
    this.router.navigate(['/']);
  }
}
