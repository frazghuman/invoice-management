import { ValidatorFn, AbstractControl, ValidationErrors, FormArray } from "@angular/forms";

export function allowLastItemInvalidValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (formArray instanceof FormArray) {
        const controls = formArray.controls;
        let validItemCount = 0;
  
        // Check all items except the last one
        for (let i = 0; i < controls.length - 1; i++) {
          if (controls[i].valid) {
            validItemCount++;
          }
        }
  
        // If there are no valid items (excluding the last one), return an error
        if (validItemCount === 0) {
          return { atLeastOneValidItem: true };
        }
      }
      return null;
    };
  }