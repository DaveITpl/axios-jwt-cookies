import CookiesStorage from "../src/cookiesStorage";
import AuthProvider  from '../src'

describe('setAccessToken', () => {
  it('throws an error if there are no tokens stored', () => {
    // GIVEN
    // cookiesStorage is empty
    const storage = new CookiesStorage();
    storage.removeItem()

    // WHEN
    // I call setAccessToken
    // THEN
    // I expect an error to have been thrown
    const authProvider = new AuthProvider()
    expect(() => {
      authProvider.setAccessToken('accesstoken')
    }).toThrow('Unable to update access token since there are not tokens currently stored')
  })

  it('throws an error if the stored tokens cannot be parsed', () => {
    // GIVEN
    // cookiesStorage is empty
    const storage = new CookiesStorage();
    storage.setItem('totallynotjson')

    // WHEN
    // I call setAuthTokens
    // THEN
    // I expect an error to be thrown
    const authProvider = new AuthProvider()
    expect(() => {
      authProvider.setAccessToken('accesstoken')
    }).toThrow('Failed to parse auth tokens: totallynotjson')
  })

  it('stores the tokens in cookiesstorage', () => {
    // GIVEN
    // cookiesStorage is empty
    const tokens = { accessToken: 'accesstoken', refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // WHEN
    // I call setAccessToken
    const authProvider = new AuthProvider()
    authProvider.setAccessToken('newaccesstoken')

    // THEN
    // I expect the stored access token to have been updated
    const storedTokens = storage.getItem() as string
    expect(JSON.parse(storedTokens)).toEqual({ accessToken: 'newaccesstoken', refreshToken: 'refreshtoken' })
  })
})
