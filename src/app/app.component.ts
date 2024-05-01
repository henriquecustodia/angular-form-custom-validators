import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { delay, Observable, of } from "rxjs";

function isUsernameAlreadyTakenValidator(control: AbstractControl): Observable<ValidationErrors | null> {
  let validationError: ValidationErrors | null = null;

  if (control.value === "henrique") {
    validationError = { usernameIsAlreadyTaken: true };
  }

  return of(validationError).pipe(delay(500));
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form">
      <fieldset>
        <input
          type="text"
          formControlName="username"
          placeholder="Digite seu @username"
        />

        @if (form.get('username')?.touched) {
          @if (form.get('username')?.hasError('required')) {
            <div [ngStyle]="{ color: 'red' }">Por favor, informe um username.</div>
          } 
          
          @if (form.get('username')?.hasError('usernameIsAlreadyTaken')) {
            <div  [ngStyle]="{ color: 'red' }">O username informado já existe.</div>
          }
        }
      </fieldset>
    </form>
  `,
  styles: [],
})
export class AppComponent {
  form = new FormGroup({
    username: new FormControl(
      "",
      Validators.required,
      isUsernameAlreadyTakenValidator
    ),
  });
}
