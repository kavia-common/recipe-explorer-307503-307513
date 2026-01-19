/**
 * Runtime configuration.
 *
 * CRA exposes env vars prefixed with REACT_APP_*
 */
export const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  mockUserId: process.env.REACT_APP_MOCK_USER_ID || 'user_1',
};
