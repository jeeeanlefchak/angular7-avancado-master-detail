import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
// NG G C SHARED/COMPONENTS/FormFieldError --inline-template
@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;


  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    } else {
      return null
    }
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    let message = '';
    if (this.formControl.errors.required) message = 'Dado obrigatório !'
    else if (this.formControl.errors.minlength) {
      const requireLength = this.formControl.errors.minlength.requiredLength;
      message = `Deve ter no minimo ${requireLength} caracteres`;
    } else if (this.formControl.errors.maxlength) {
      const requireLength = this.formControl.errors.maxlength.requiredLength;
      message = `Deve ter no máximo ${requireLength} caracteres`;
    }
    return message
  }

}
