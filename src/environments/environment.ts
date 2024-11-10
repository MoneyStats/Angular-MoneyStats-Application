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
  version: '2.1.2',
  hostService: host + subDomain,
  //version: require(baseUrlApp + subDomain + 'package.json').version,

  // Mock Data
  getUserUrl: baseUrlApp + 'assets/core/mock/user.mock.json',
  getDashboardDataUrlMock: baseUrlApp + 'assets/core/mock/dashboard.mock.json',
  mockedGetWalletsDataUrl: baseUrlApp + 'assets/core/mock/wallets.mock.json',
  mockedGetWalletByIdDataUrl:
    baseUrlApp + 'assets/core/mock/walletById.mock.json',
  getResumeDataUrlMock: baseUrlApp + 'assets/core/mock/stats.mock.json',
  getHistoryDataUrlMock: baseUrlApp + 'assets/core/mock/history.mock.json',
  getTemplate: baseUrlApp + 'assets/template/template.json',
  getCryptoDashboardMock: baseUrlApp + 'assets/core/mock/crypto.dash.mock.json',
  getCryptoPriceMock: baseUrlApp + 'assets/core/mock/crypto.price.mock.json',
  getCryptoResumeMock: baseUrlApp + 'assets/core/mock/crypto.stats.mock.json',
  getCryptoAssetsMock: baseUrlApp + 'assets/core/mock/crypto.assets.mock.json',
  getCryptoAssetsDetailsMock:
    baseUrlApp + 'assets/core/mock/crypto.details.mock.json',

  /*
   * Authentication Datas
   */
  registerDataUrl: host + '/v1/auth/sign-up',
  loginDataUrl: host + '/v1/auth/login',
  forgotPasswordUrl: host + '/v1/auth/forgot-password',
  resetPasswordUrl: host + '/v1/auth/reset-password',

  /*
   * Token
   */
  userInfoDataUrl: host + '/v1/oAuth/userInfo',
  refreshTokenUrl: host + '/v1/oAuth/token/refresh',
  refreshTime: 900000,

  updateUserDataUrl: host + '/v1/auth/update/user',
  cleanCacheUrl: host + '/v1/crypto/cache/clean',

  /**
   * @App
   */
  getDashboardDataUrl: host + '/v1/app/dashboard',
  getResumeDataUrl: host + '/v1/app/resume/:year',
  getHistoryDataUrl: host + '/v1/app/history',

  /**
   * @Settings
   */
  openGithubIssues: host + '/v1/settings/report/bug',
  backupDataUrl: host + '/v1/settings/backup',
  restoreDataUrl: host + '/v1/settings/restore',
  contactSupport: host + '/v1/settings/contact',
  /**
   * @Stats
   */
  postStatsDataUrl: host + '/v1/stats',

  /**
   * @Wallets
   */
  getWalletsDataUrl: host + '/v1/wallets',
  getWalletByIdUrl: host + '/v1/wallets/:id',
  postWalletsDataUrl: host + '/v1/wallets',
  updateWalletsDataUrl: host + '/v1/wallets',
  deleteWalletsDataUrl: host + '/v1/wallets/:id',

  /**
   * @Image_Upload
   */
  uploadImageUrl: host + '/v1/attachment/upload',
  imageSizeMax: 2000000,

  /**
   * @MarketData
   */
  getMarketDataUrl: host + '/v1/market-data/:currency',
  importMarketDataUrl: host + '/v1/market-data/import',

  /**
   * @Crypto_Assets
   */
  getCryptoAssetsDataUrl: host + '/v1/crypto/assets',
  getCryptoAssetsDetailsDataUrl: host + '/v1/crypto/assets/:identifier',
  postCryptoAssetDataUrl: host + '/v1/crypto/assets',
  postCryptoAssetsDataUrl: host + '/v1/crypto/assets/list',

  /**
   * @Crypto_Section
   */
  getCryptoDashboardDataUrl: host + '/v1/crypto/dashboard',
  getCryptoResumeDataUrl: host + '/v1/crypto/resume',

  // Cache
  cacheEnable: false,
  cacheTimeout: 180000,

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
