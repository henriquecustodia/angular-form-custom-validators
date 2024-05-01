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

function cannotStartWithValidator(value: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.trim().startsWith(value) ? { cannotStartWith: true } : null;
  };
}

function isUsernameAlreadyTakenAsyncValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  let validationError: ValidationErrors | null = null;

  if (control.value.trim() === "henrique") {
    validationError = { usernameIsAlreadyTaken: true };
  }

  return of(validationError).pipe(delay(500));
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styles: `
    .validation-error {
      color: red;
    }
  `,
  template: `
    <form [formGroup]="form">
      <fieldset>
        <input
          type="text"
          formControlName="username"
          placeholder="Digite seu @username"
        />

        <!-- @if (form.get("username")?.touched) { -->
          @if (form.get("username")?.hasError("required")) {
            <div class="validation-error">
              Por favor, informe um username.
            </div>
          }
          
          @if (form.get("username")?.hasError("cannotStartWith")) {
            <div class="validation-error">
              O username não pode começar com &#64;.
            </div>
          }

          @if (form.get("username")?.hasError("usernameIsAlreadyTaken")) {
            <div class="validation-error">
              O username informado já existe.
            </div>
          }
        <!-- }   -->
      </fieldset>
    </form>
  `,
})
export class AppComponent {
  form = new FormGroup({
    username: new FormControl("", {
      validators: [Validators.required, cannotStartWithValidator("@")],
      asyncValidators: [isUsernameAlreadyTakenAsyncValidator],
    }),
  });
}
