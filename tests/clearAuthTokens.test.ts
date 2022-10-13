import CookiesStorage from "../src/cookiesStorage";
import AuthProvider  from '../src'

describe('clearAuthTokens', () => {
  it('removes the tokens from cookiesstorage', () => {
    // GIVEN
    // Tokens are stored in cookiesStorage
    const tokens = { accessToken: 'accesstoken', refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // WHEN
    // I call clearAuthTokens
    const authProvider = new AuthProvider()
    authProvider.clearAuthTokens()

    // THEN
    // I expect the cookiesstorage to be empty
    expect(storage.getItem()).toBe("")
  })
})
