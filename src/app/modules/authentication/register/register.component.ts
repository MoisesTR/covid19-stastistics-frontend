import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { CountryService } from '@core/services/country.service';
import { Country } from '@core/domain/interfaces/country';
import { takeUntil } from 'rxjs/operators';
import { CustomValidator } from '@app/validators/custom-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  formRegister: FormGroup;
  countries: Country[] = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.initFormRegister();
    this.loadCountries();
  }

  initFormRegister(): void {
    this.formRegister = this.formBuilder.group(
      {
        userName: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        passwordConfirm: new FormControl('', Validators.required),
      },
      {
        validator: CustomValidator.passwordMatchValidator,
      }
    );
  }

  loadCountries(): void {
    this.countryService
      .getCountries()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((countries) => {
        this.countries = countries;
        this.formRegister.controls.country.setValue('Nicaragua');
      });
  }

  register(): void {
    this.authService.registerUser(this.formRegister.value).subscribe((user) => {
      this.toastService.success('The user has been registered successfully');
      this.formRegister.reset();
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
