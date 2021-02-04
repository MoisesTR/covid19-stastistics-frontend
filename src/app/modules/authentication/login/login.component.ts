import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Subject } from 'rxjs';
import { ToastService } from 'ng-uikit-pro-standard';
import { takeUntil } from 'rxjs/operators';
import { LoginResponseDto } from '@core/domain/dtos/login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private identityService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login(): void {
    const userName = this.formLogin.value.userName;
    const password = this.formLogin.value.password;

    try {
      this.identityService.validateLogin(userName, password);
      this.identityService
        .authenticate(userName, password)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(({ user }: LoginResponseDto) => {
          this.identityService.setUser(user);
          this.router.navigate(['dashboard']);
        });
    } catch (e) {
      this.toastService.info(e.message);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
