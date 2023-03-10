// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const baseUrlApp: string = '../../';
const host: string = 'http://192.168.1.19:8080';
//const host: string = 'http://synologynas.ddns.net:8000';

export const environment = {
  production: false,
  baseUrl: '../../',
  baseUrlHeader: '../../../../',
  baseUrlSettings: '../../../../../',
  baseUrlDashboard: '../../../',
  baseUrlVersion: '../../../../../../',
  version: 'Beta 0.9.12.2 (Local)',

  // Mock Data
  getUserUrl: baseUrlApp + 'assets/core/mock/user.mock.json',
  getDashboardDataUrlMock: baseUrlApp + 'assets/core/mock/dashboard.mock.json',
  getWalletDataUrl: baseUrlApp + 'assets/core/mock/wallets.mock.json',
  getResumeDataUrlMock: baseUrlApp + 'assets/core/mock/stats.mock.json',
  getTemplate: baseUrlApp + 'assets/template/template.json',

  // Datas
  registerDataUrl: host + '/v1/auth/sign-up',
  loginDataUrl: host + '/v1/auth/login',
  forgotPasswordUrl: host + '/v1/auth/forgot-password',
  resetPasswordUrl: host + '/v1/auth/reset-password',
  checkLoginDataUrl: host + '/v1/auth/check-login',
  addUpdateWalletDataUrl: host + '/v1/wallet/insert-update',
  listWalletDataurl: host + '/v1/wallet/list',
  getDashboardDataUrl: host + '/v1/app/dashboard',
  getResumeDataUrl: host + '/v1/app/resume',
  addStatsDataUrl: host + '/v1/app/add/stats',
  openGithubIssues: host + '/v1/app/report/bug',
  updateUserDataUrl: host + '/v1/auth/update/user',
  forgotPassword: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
