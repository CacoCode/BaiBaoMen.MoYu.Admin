import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

// Got from: https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2

@Directive({
  selector:
    '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EqualValidator),
      multi: true,
    },
  ],
})
export class EqualValidator implements Validator {

  constructor(
    @Attribute('validateEqual') public validateEqual: string,
    @Attribute('reverse') public reverse: string,
  ) { }

  private get isReverse() {
    if (!this.reverse) {
      return false;
    }

    return this.reverse === 'true';
  }

  validate(control: AbstractControl): { [key: string]: any } {


    // 对比的控件
    let confirmControl = control.root.get(this.validateEqual);
    if (!confirmControl) {
      return null;
    }

    // 当前控件的值
    const currtenControlValue = control.value;
    // 对比控件的值
    const confirmControlValue = confirmControl.value;

    if (!currtenControlValue || !confirmControlValue) {
      return null;
    }


    // 如果当前控件是主控件
    if (this.isReverse) {
      // 当前控件值等于确认控件值,
      if (currtenControlValue === confirmControlValue) {

        confirmControl.updateValueAndValidity();

      } else {// 当前控件值不等于确认控件值
        confirmControl.setErrors({
          validateEqual: true
        });
      }
    }
    else {// 如果当前值不是主控件
      if (currtenControlValue !== confirmControlValue) {
        return {
          validateEqual: true
        }
      } else {
        return {};
      }
    }
  }
}
