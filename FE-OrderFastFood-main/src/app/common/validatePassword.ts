import {Subscription} from 'rxjs';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function compareValidator(controlNameToCompare: string): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value === null || c.value.length === 0){
      return null;
    }
    const controlToCompare = c.root.get(controlNameToCompare);
    if (controlToCompare){
      const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
        c.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return controlToCompare && controlToCompare.value !== c.value ? { compare : true} : null;
  };
}
