import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'magicodes-captcha',
  templateUrl: './captcha.component.html',
  styles: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CaptchaComponent),
    multi: true
  }]
})
export class CaptchaComponent implements OnInit, ControlValueAccessor {

  /**
   * 验证码类型
   */
  @Input() type: number;

  /**
  * 验证码的地址(不填)
  */
  @Input() captchaUrl: string;


  private _oldKey: string;
  private _key: string;
  /**
   * 验证码key
   */
  @Input()
  set key(val: string) {
    this._key = val;
  }

  /**
   * 占位字符
   */
  @Input() placeholder: string;

  private _value = '';

  /**
   * 输入的验证码的值
   */
  set value(val: string) {
    this._value = val;
    if (this.onModelChange) {
      this.onModelChange(this._value);
    }
  }

  /**
  * 输入的验证码的值
  */
  get value(): string {
    return this._value;
  }

  onModelChange: Function = () => { };

  constructor(
    private appSession: AppSessionService
  ) {

  }

  ngOnInit() {
  }


  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
  }
  registerOnChange(fn: any): void {
    // 页面值改变时，调用该方法，传入新值实现回传
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  /**
   * 初始化验证码图片
   */
  initImg(): void {
    if (!this._key || this._key === '' || this.captchaUrl || this.checkKey()) {
      return;
    }
    this.clearimg();
  }


  /**
   * 清空图片
   */
  clearimg(): void {
    if (!this._key || this._key === '') {
      // 未输入验证码key
      return;
    }

    let tid: any = this.appSession.tenantId;
    if (!tid) {
      tid = '';
    }

    this._oldKey = this._key;
    const timestamp = new Date().getTime();
    this.captchaUrl =
      `${AppConsts.remoteServiceBaseUrl}/api/Verification/GenerateCaptcha?name=${this._key}&t=${this.type}&tid=${tid}&timestamp=${timestamp}`;
  }


  /**
 * 检查验证码请求key是否相等
 */
  checkKey(): boolean {
    // 如果 _oldKey 不为空,并且 _oldKey 不等于key，那么表示是新key
    return this._oldKey && this._oldKey === this._key;
  }
}
