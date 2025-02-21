const baseUrlApp: string = '../../';
const service_host: string =
  process.env['MONEYSTATS_SERVICE_URL'] ||
  'https://stg.moneystats.service.giovannilamarmora.com';
const access_host: string =
  process.env['ACCESS_SPHERE_SERVICE_URL'] ||
  'https://access.sphere.service.stg.giovannilamarmora.com';
//const subDomain = 'stg-moneystats/';
const subDomain = '';

export const environment = {
  envType: 'STG',
  production: false,
  subDomain: subDomain,
  baseUrl: '../../' + subDomain,
  baseUrlHeader: '../../../../' + subDomain,
  baseUrlSettings: '../../../../../' + subDomain,
  baseUrlDashboard: '../../../' + subDomain,
  baseUrlVersion: '../../../../../../' + subDomain,
  version: require('../../package.json').version + ' Beta',
  hostService: service_host + subDomain,

  /**
   * @Mock_Data
   */
  getUserUrl: baseUrlApp + 'assets/core/mock/settings/user.mock.json',
  authorizeUrlMock:
    baseUrlApp + 'assets/core/mock/settings/authorize.mock.json',
  getDashboardDataUrlMock:
    baseUrlApp + 'assets/core/mock/app.dashboard.mock.json',
  mockedGetWalletsDataUrl:
    baseUrlApp + 'assets/core/mock/app.wallets.mock.json',
  mockedGetWalletsCryptoDataUrl:
    baseUrlApp + 'assets/core/mock/crypto.wallets.mock.json',
  mockedGetWalletByIdDataUrl:
    baseUrlApp + 'assets/core/mock/wallets/app.wallet_by_id_#ID#.mock.json',
  getResumeDataUrlMock:
    baseUrlApp + 'assets/core/mock/app.resume_#YEAR#.mock.json',
  getHistoryDataUrlMock: baseUrlApp + 'assets/core/mock/app.history.mock.json',
  getTemplate: baseUrlApp + 'assets/template/template.json',
  getCryptoDashboardMock:
    baseUrlApp + 'assets/core/mock/crypto.dashboard.mock.json',
  getCryptoPriceMock:
    baseUrlApp + 'assets/core/mock/crypto.marketData.mock.json',
  getCryptoResumeMock:
    baseUrlApp + 'assets/core/mock/crypto.resume_#YEAR#.mock.json',
  getCryptoAssetsMock: baseUrlApp + 'assets/core/mock/crypto.assets.mock.json',
  getCryptoAssetsDetailsMock:
    baseUrlApp + 'assets/core/mock/assets/crypto.asset_#IDENTIFIER#.mock.json',
  getCryptoHistoryDataUrlMock:
    baseUrlApp + 'assets/core/mock/crypto.history.mock.json',

  /**
   * @Authentication_Datas
   */
  tokenDataUrl: access_host + '/v1/oAuth/2.0/token',
  exchangeTokenDataUrl: access_host + '/v1/oAuth/2.0/token/exchange',
  taxCalculatorClientID: 'TAX-CALCULATOR-TEST-01',
  taxCalculatorUrl: 'https://tax-calculator.giovannilamarmora.com',
  authorizeUrl: access_host + '/v1/oAuth/2.0/authorize',
  updateUserDataUrl: access_host + '/v1/users/update',
  logoutUrl: access_host + '/v1/oAuth/2.0/logout',
  forgotPasswordUrl: access_host + '/v1/users/change/password/request',
  resetPasswordUrl: access_host + '/v1/users/change/password',
  clientID: 'MONEYSTATS-TEST-01',
  redirectUri: 'https://stg.moneystats.app.giovannilamarmora.com',
  registerDataUrl: access_host + '/v1/users/register',
  checkTokenDataUrl: service_host + '/v1/auth/code',

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
  imageSizeMax: Number(process.env['IMAGE_SIZE']) || 1000000,

  /**
   * @MarketData
   */
  getMarketDataUrl: service_host + '/v1/market-data/:currency',
  importMarketDataUrl: service_host + '/v1/market-data/import',

  /**
   * @Crypto_Section
   */
  getCryptoDashboardDataUrl: service_host + '/v1/crypto/dashboard',
  getCryptoResumeDataUrl: service_host + '/v1/crypto/resume/:year',
  getCryptoHistoryDataUrl: service_host + '/v1/crypto/history',

  /**
   * @Crypto_Assets
   */
  getCryptoAssetsDataUrl: service_host + '/v1/crypto/assets',
  getCryptoAssetsDetailsDataUrl: service_host + '/v1/crypto/assets/:identifier',
  postCryptoAssetDataUrl: service_host + '/v1/crypto/assets',
  putCryptoAssetDataUrl: service_host + '/v1/crypto/assets',
  postCryptoAssetsDataUrl: service_host + '/v1/crypto/assets/list',

  // Cache
  cacheEnable: process.env['CACHE_ENABLE'] || false,
  cacheTimeout: Number(process.env['CACHE_TIMEOUT']) || 180000,

  forgotPassword: true,
};
