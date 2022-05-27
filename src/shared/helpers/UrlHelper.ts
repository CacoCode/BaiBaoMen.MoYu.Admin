export class UrlHelper {
  /**
   * The URL requested, before initial routing.
   */
  static readonly initialUrl = location.href;

  static getQueryParameters(): any {
    return document.location.search
      .replace(/(^\?)/, '')
      .split('&')
      .map(
        function (n) {
          return (n = n.split('=')), (this[n[0]] = n[1]), this;
        }.bind({}),
      )[0];
  }

  static getQueryParametersUsingParameters(search: string): any {
    return search
      .replace(/(^\?)/, '')
      .split('&')
      .map(
        function (n) {
          return (n = n.split('=')), (this[n[0]] = n[1]), this;
        }.bind({}),
      )[0];
  }

  static getInitialUrlParameters(): any {
    const questionMarkIndex = UrlHelper.initialUrl.indexOf('?');
    if (questionMarkIndex >= 0) {
      return UrlHelper.initialUrl.substr(
        questionMarkIndex,
        UrlHelper.initialUrl.length - questionMarkIndex,
      );
    }

    return '';
  }

  static getReturnUrl(): string {
    const queryStringObj = UrlHelper.getQueryParametersUsingParameters(
      UrlHelper.getInitialUrlParameters(),
    );
    if (queryStringObj.returnUrl) {
      return decodeURIComponent(queryStringObj.returnUrl);
    }

    return null;
  }

  static isInstallUrl(url): boolean {
    return url && url.indexOf('app/admin/install') >= 0;
  }
  static ajax(type: string, url: string, customHeaders: any, data: any, success: any) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          success(result);
        } else if (xhr.status !== 0) {
          alert(abp.localization.localize('InternalServerError', 'AbpWeb'));
        }
      }
    };

    xhr.open(type, url, true);

    for (const property in customHeaders) {
      if (customHeaders.hasOwnProperty(property)) {
        xhr.setRequestHeader(property, customHeaders[property]);
      }
    }

    xhr.setRequestHeader('Content-type', 'application/json');
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  }
}
