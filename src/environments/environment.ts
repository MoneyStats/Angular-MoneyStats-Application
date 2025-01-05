// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { version } from 'os';
const baseUrlApp: string = '../../';
//const host: string = 'http://pc-giovanni:8080/moneystats-service';
const service_host: string =
  process.env['MONEYSTATS_SERVICE_URL'] || 'http://pc-giovanni:8080';
const access_host: string =
  process.env['ACCESS_SPHERE_SERVICE_URL'] || 'http://pc-giovanni:8081';
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
  version: require('../../package.json').version + ' Alpha',
  hostService: service_host + subDomain,
  //version: require(baseUrlApp + subDomain + 'package.json').version,

  // Mock Data
  getUserUrl: baseUrlApp + 'assets/core/mock/user.mock.json',
  authorizeUrlMock: baseUrlApp + 'assets/core/mock/authorize.mock.json',
  getDashboardDataUrlMock: baseUrlApp + 'assets/core/mock/dashboard.mock.json',
  mockedGetWalletsDataUrl: baseUrlApp + 'assets/core/mock/wallets.mock.json',
  mockedGetWalletsCryptoDataUrl:
    baseUrlApp + 'assets/core/mock/wallets.crypto.mock.json',
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
  getCryptoHistoryDataUrlMock:
    baseUrlApp + 'assets/core/mock/history.crypto.mock.json',

  /**
   * @Authentication_Datas
   */
  tokenDataUrl: access_host + '/v1/oAuth/2.0/token',
  authorizeUrl: access_host + '/v1/oAuth/2.0/authorize',
  updateUserDataUrl: access_host + '/v1/users/update',
  logoutUrl: access_host + '/v1/oAuth/2.0/logout',
  forgotPasswordUrl: access_host + '/v1/users/change/password/request',
  resetPasswordUrl: access_host + '/v1/users/change/password',
  clientID: 'MONEYSTATS-TEST-01',
  registerDataUrl: service_host + '/v1/auth/sign-up',

  /**
   * @App
   */
  getDashboardDataUrl: service_host + '/v1/app/dashboard',
  getResumeDataUrl: service_host + '/v1/app/resume/:year',
  getHistoryDataUrl: service_host + '/v1/app/history',

  /**
   * @Settings
   */
  openGithubIssues: service_host + '/v1/settings/report/bug',
  backupDataUrl: service_host + '/v1/settings/backup',
  restoreDataUrl: service_host + '/v1/settings/restore',
  contactSupport: service_host + '/v1/settings/contact',
  cleanCacheUrl: service_host + '/v1/settings/cache/clean',
  /**
   * @Stats
   */
  postStatsDataUrl: service_host + '/v1/stats',

  /**
   * @Wallets
   */
  getWalletsDataUrl: service_host + '/v1/wallets',
  getWalletByIdUrl: service_host + '/v1/wallets/:id',
  postWalletsDataUrl: service_host + '/v1/wallets',
  updateWalletsDataUrl: service_host + '/v1/wallets',
  deleteWalletsDataUrl: service_host + '/v1/wallets/:id',
  getWalletsCryptoDataUrl: service_host + '/v1/wallets/crypto',

  /**
   * @Image_Upload
   */
  uploadImageUrl: service_host + '/v1/attachment/upload',
  imageSizeMax: Number(process.env['IMAGE_SIZE']) || 2000000,

  /**
   * @MarketData
   */
  getMarketDataUrl: service_host + '/v1/market-data/:currency',
  importMarketDataUrl: service_host + '/v1/market-data/import',

  /**
   * @Crypto_Assets
   */
  getCryptoAssetsDataUrl: service_host + '/v1/crypto/assets',
  getCryptoAssetsDetailsDataUrl: service_host + '/v1/crypto/assets/:identifier',
  postCryptoAssetDataUrl: service_host + '/v1/crypto/assets',
  putCryptoAssetDataUrl: service_host + '/v1/crypto/assets',
  postCryptoAssetsDataUrl: service_host + '/v1/crypto/assets/list',

  /**
   * @Crypto_Section
   */
  getCryptoDashboardDataUrl: service_host + '/v1/crypto/dashboard',
  getCryptoResumeDataUrl: service_host + '/v1/crypto/resume/:year',
  getCryptoHistoryDataUrl: service_host + '/v1/crypto/history',

  // Cache
  cacheEnable: process.env['CACHE_ENABLE'] || false,
  cacheTimeout: Number(process.env['CACHE_TIMEOUT']) || 180000,

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
