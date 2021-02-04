import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'app-show-errors',
  template: `
    <div *ngIf="shouldShowErrors()">
      <span class="error-message" *ngFor="let error of listOfErrors()">{{ error }}</span>
    </div>
  `,
})
export class ShowErrorsComponent {
  private static readonly errorMessages = {
    required: () => 'This field is required',
    minlength: (params) => params.requiredLength + ' minimum characters',
    maxlength: (params) => params.requiredLength + ' maximum characters ',
    uniqueName: (params) => params.message,
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return this.control && this.control.errors && (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors).map((field) =>
      this.getMessage(field, this.control.errors[field])
    );
  }

  private getMessage(type: string, params: any): string {
    return ShowErrorsComponent.errorMessages[type](params);
  }
}
