import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator for password complexity
export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const isValid = hasUpperCase && hasNumber && hasSpecialChar && isValidLength;
    return !isValid ? { passwordComplexity: true } : null;
  };
}

// Validator for matching passwords
export function matchingPasswordsValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const areMatching = passwordControl.value === confirmPasswordControl.value;
    return !areMatching ? { passwordsNotMatching: true } : null;
  };
}
