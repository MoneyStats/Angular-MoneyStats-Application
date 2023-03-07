const baseUrlApp: string = '../../';
const host: string = 'http://synologynas.ddns.net:8800';

export const environment = {
  production: true,
  baseUrl: '../../',
  baseUrlHeader: '../../../../',
  baseUrlSettings: '../../../../../',
  baseUrlDashboard: '../../../',
  baseUrlVersion: '../../../../../../',
  version: 'Beta 0.9.10',

  // Mock Data
  getUserUrl: baseUrlApp + 'assets/core/mock/user.mock.json',
  getDashboardDataUrlMock: baseUrlApp + 'assets/core/mock/dashboard.mock.json',
  getWalletDataUrl: baseUrlApp + 'assets/core/mock/wallets.mock.json',
  getResumeDataUrlMock: baseUrlApp + 'assets/core/mock/stats.mock.json',
  getTemplate: baseUrlApp + 'assets/template/template.json',

  // Datas
  registerDataUrl: host + '/v1/auth/sign-up',
  loginDataUrl: host + '/v1/auth/login',
  checkLoginDataUrl: host + '/v1/auth/check-login',
  addUpdateWalletDataUrl: host + '/v1/wallet/insert-update',
  listWalletDataurl: host + '/v1/wallet/list',
  getDashboardDataUrl: host + '/v1/app/dashboard',
  getResumeDataUrl: host + '/v1/app/resume',
  addStatsDataUrl: host + '/v1/app/add/stats',
  openGithubIssues: host + '/v1/app/report/bug',
  updateUserDataUrl: host + '/v1/auth/update/user',
  forgotPassword: false,
};
