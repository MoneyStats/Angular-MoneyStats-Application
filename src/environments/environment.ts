// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const baseUrlApp: string = '../../';
const host: string = 'http://192.168.1.26:8080';

export const environment = {
  production: false,
  baseUrl: '../../',
  version: '1.0.0',

  getUserUrl: baseUrlApp + 'assets/core/mock/user.mock.json',
  getDashboardDataUrl: baseUrlApp + 'assets/core/mock/dashboard.mock.json',
  getWalletDataUrl: baseUrlApp + 'assets/core/mock/wallets.mock.json',
  getResumeDataUrl: baseUrlApp + 'assets/core/mock/stats.mock.json',

  registerDataUrl: host + '/v1/auth/sign-up',
  loginDataUrl: host + '/v1/auth/login',
  addWalletDataUrl: host + '/v1/wallet/insert',
  forgotPassword: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
