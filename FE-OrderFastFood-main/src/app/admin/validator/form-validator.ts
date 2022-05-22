import { FormControl, ValidationErrors } from '@angular/forms';

export class FormValidator {

    // whitespace validation
    static notOnlyWhitespace(control: FormControl): ValidationErrors {
        // check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, return error object
            return { notOnlyWhitespace: true };
        }
        else {
            // valid, return null
            return null;
        }
    }


    // whitespace validation
    static DefaultOption(control: FormControl): ValidationErrors {
      // check if string only contains whitespace
        if (control.value === 'Default') {
            // invalid, return error object
            return { DefaultOption: true };
        }
        else {
            // valid, return null
            return null;
        }
    }
}
