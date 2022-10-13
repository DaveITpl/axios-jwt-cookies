import CookiesStorage from "../src/cookiesStorage";
import AuthProvider  from '../src'

describe('setAuthTokens', () => {
  it.only('stores the tokens in cookiesstorage', () => {
    // MOCK
    // global.window.location = {
    //   href: 'http://dummy.com?page=1&name=testing',
    //   host: 'dummy.com',
    //   /*
    //   * Other settings
    //   */
    //   toString: () => {
    //     return 'http://dummy.com?page=1&name=testing';
    //   },
    // };
    // GIVEN
    // cookies is empty
    const storage = new CookiesStorage();
    storage.removeItem()

    const authProvider = new AuthProvider();

    // WHEN
    // I call setAuthTokens
    const tokens = { accessToken: 'accesstoken', refreshToken: 'refreshtoken' }
    authProvider.setAuthTokens(tokens)

    // THEN
    // I expect them to have been stored in cookiesstorage
    const storedTokens = storage.getItem() as string
    expect(JSON.parse(storedTokens)).toEqual(tokens)
  })
})
