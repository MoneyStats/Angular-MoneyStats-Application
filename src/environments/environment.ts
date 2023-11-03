// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const baseUrlApp: string = '../../';
//const host: string = 'http://pc-giovanni:8080/moneystats-service';
const host: string = 'http://pc-giovanni:8080';
//const host: string = 'https://prod-moneystats-service.up.railway.app';
const subDomain = '';
//const subDomain = 'moneystats/';

export const environment = {
  envType: 'Local',
  production: false,
  subDomain: subDomain,
  baseUrl: '../../' + subDomain,
  baseUrlHeader: '../../../../' + subDomain,
  baseUrlSettings: '../../../../../' + subDomain,
  baseUrlDashboard: '../../../' + subDomain,
  baseUrlVersion: '../../../../../../' + subDomain,
  version: '1.11.1 (Beta)',

  // Mock Data
  getUserUrl: baseUrlApp + 'assets/core/mock/user.mock.json',
  getDashboardDataUrlMock: baseUrlApp + 'assets/core/mock/dashboard.mock.json',
  getWalletDataUrl: baseUrlApp + 'assets/core/mock/wallets.mock.json',
  getResumeDataUrlMock: baseUrlApp + 'assets/core/mock/stats.mock.json',
  getTemplate: baseUrlApp + 'assets/template/template.json',
  getCryptoDashboardMock: baseUrlApp + 'assets/core/mock/crypto.dash.mock.json',
  getCryptoPriceMock: baseUrlApp + 'assets/core/mock/crypto.price.mock.json',
  getCryptoResumeMock: baseUrlApp + 'assets/core/mock/crypto.stats.mock.json',
  getCryptoAssetsMock: baseUrlApp + 'assets/core/mock/crypto.assets.mock.json',
  getCryptoDetailsMock:
    baseUrlApp + 'assets/core/mock/crypto.details.mock.json',

  // Datas
  registerDataUrl: host + '/v1/auth/sign-up',
  loginDataUrl: host + '/v1/auth/login',
  forgotPasswordUrl: host + '/v1/auth/forgot-password',
  resetPasswordUrl: host + '/v1/auth/reset-password',
  checkLoginDataUrl: host + '/v1/auth/check-login',
  addUpdateWalletDataUrl: host + '/v1/wallet/insert-update',
  uploadImage: host + '/v1/upload/attachment',
  imageSizeMax: 2000000,
  listWalletDataurl: host + '/v1/wallet/list',
  getDashboardDataUrl: host + '/v1/app/dashboard',
  getResumeDataUrl: host + '/v1/app/resume',
  addStatsDataUrl: host + '/v1/app/add/stats',
  openGithubIssues: host + '/v1/app/report/bug',
  contactSupport: host + '/v1/app/contact',
  updateUserDataUrl: host + '/v1/auth/update/user',
  backupDataUrl: host + '/v1/app/backup',
  restoreDataUrl: host + '/v1/app/restore',
  cleanCacheUrl: host + '/v1/crypto/cache/clean',
  marketDataUrl: host + '/v1/crypto/marketData/import',
  forgotPassword: true,

  /*
   * Crypto Section
   */
  addCryptoAssetDataUrl: host + '/v1/crypto/asset/addOrUpdate',
  getCryptoAssetDataUrl: host + '/v1/crypto/asset/getAll',
  getCryptoDetailsDataUrl: host + '/v1/crypto/asset/get',
  getCryptoDashboardDataUrl: host + '/v1/crypto/dashboard',
  getCryptoResumeDataUrl: host + '/v1/crypto/resume',
  getMarketDataUrl: host + '/v1/market-data/get',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
