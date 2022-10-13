import CookiesStorage from "../src/cookiesStorage";
import AuthProvider  from '../src'

describe('getAccessToken', () => {
  it('returns undefined if tokens are not set', () => {
    // GIVEN
    // cookiesStorage is empty
    const storage = new CookiesStorage();
    storage.removeItem()

    // WHEN
    // I call getAccessToken
    const authProvider = new AuthProvider()
    const result = authProvider.getAccessToken()

    // THEN
    // I expect the result to be undefined
    expect(result).toEqual(undefined)
  })

  it('returns the access token is it is set', () => {
    // GIVEN
    // Both tokens are stored in cookiesstorage
    const tokens = { accessToken: 'accesstoken', refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // WHEN
    // I call getAccessToken
    const authProvider = new AuthProvider()
    const result = authProvider.getAccessToken()

    // THEN
    // I expect the result to be the supplied access token
    expect(result).toEqual('accesstoken')
  })
})
