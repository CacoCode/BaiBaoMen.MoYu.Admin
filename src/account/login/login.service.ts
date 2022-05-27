import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  TokenAuthServiceProxy,
  AuthenticateModel,
  AuthenticateResultModel,
} from '@shared/service-proxies/auth-service-proxies';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';

import * as _ from 'lodash';
import { UtilsService } from '@abp/utils/utils.service';
import { MessageService } from '@abp/message/message.service';
import { LogService } from '@abp/log/log.service';
import { TokenService } from '@abp/auth/token.service';
import { error } from '@angular/compiler/src/util';

@Injectable()
export class LoginService {
  static readonly twoFactorRememberClientTokenName =
    'TwoFactorRememberClientToken';

  authenticateModel: AuthenticateModel;
  authenticateResult: AuthenticateResultModel;

  rememberMe: boolean;

  constructor(
    private _tokenAuthService: TokenAuthServiceProxy,
    private _router: Router,
    private _utilsService: UtilsService,
    private _messageService: MessageService,
    private _tokenService: TokenService,
    private _logService: LogService,
  ) {
    this.clear();
  }

  authenticate(
    finallyCallback?: (success: boolean) => void,
    redirectUrl?: string,
  ): void {
    finallyCallback = finallyCallback || (() => { });

    let success = false;
    this._tokenAuthService
      .authenticate(this.authenticateModel)
      .finally(() => {
        finallyCallback(success);
      })
      .subscribe((result: AuthenticateResultModel) => {
        success = true;
        this.processAuthenticateResult(result, redirectUrl);
      });
  }

  private processAuthenticateResult(
    authenticateResult: AuthenticateResultModel,
    redirectUrl?: string,
  ) {
    this.authenticateResult = authenticateResult;

    if (this.authenticateResult.shouldResetPassword) {
      // 需要重置密码
      this._router.navigate(['account/reset-password'], {
        queryParams: {
          userId: authenticateResult.userId,
          tenantId: abp.session.tenantId,
          resetCode: authenticateResult.passwordResetCode,
        },
      });
      this.clear();
    } else if (authenticateResult.accessToken) {
      // Successfully logged in
      // tslint:disable-next-line:max-line-length
      this.login(
        authenticateResult.accessToken,
        authenticateResult.encryptedAccessToken,
        authenticateResult.expireInSeconds,
        this.rememberMe,
      );
    } else {
      // Unexpected result!

      this._logService.warn('Unexpected authenticateResult!');
      this._router.navigate(['account/login']);
    }
  }

  private login(
    accessToken: string,
    encryptedAccessToken: string,
    expireInSeconds: number,
    rememberMe?: boolean,
  ): void {
    const tokenExpireDate = rememberMe
      ? new Date(new Date().getTime() + 1000 * expireInSeconds)
      : undefined;

    this._tokenService.setToken(accessToken, tokenExpireDate);

    this._utilsService.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      encryptedAccessToken,
      tokenExpireDate,
      abp.appPath,
    );

    let initialUrl = UrlHelper.initialUrl;
    if (initialUrl.indexOf('/login') > 0) {
      initialUrl = AppConsts.appBaseUrl;
    }

    location.href = initialUrl;
  }

  private clear(): void {
    this.authenticateModel = new AuthenticateModel();
    this.authenticateModel.rememberClient = false;
    this.authenticateResult = null;
    this.rememberMe = false;
  }
}
