import CookiesStorage from "../src/cookiesStorage";
import AuthProvider  from '../src'

describe('isLoggedIn', () => {
  it('returns false if tokens are not set', () => {
    // GIVEN
    // cookiesStorage is empty
    const storage = new CookiesStorage();
    storage.removeItem()

    // WHEN
    // I call isLoggedIn
    const authProvider = new AuthProvider()
    const result = authProvider.isLoggedIn()

    // THEN
    // I expect the result to be false
    expect(result).toEqual(false)
  })

  it('returns true if refresh token is set', () => {
    // GIVEN
    // Both tokens are stored in cookiesstorage
    const tokens = { accessToken: 'accesstoken', refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // WHEN
    // I call isLoggedIn
    const authProvider = new AuthProvider()
    const result = authProvider.isLoggedIn()

    // THEN
    // I expect the result to be true
    expect(result).toEqual(true)
  })
})
