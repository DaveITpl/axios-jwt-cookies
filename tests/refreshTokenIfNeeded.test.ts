import CookiesStorage from "../src/cookiesStorage";
import AuthProvider  from '../src'
import jwt from 'jsonwebtoken'
import { AxiosError } from 'axios'

function makeAxiosErrorWithStatusCode(statusCode: number) {
  const error = new AxiosError(
    'Server error',
    'ECONNABORTED',
    {},
    {},
    {
      status: statusCode,
      data: {},
      config: {},
      headers: {},
      statusText: '',
    }
  )

  return error
}

describe('refreshTokenIfNeeded', () => {
  it('throws an error if the requestRefresh function threw one', async () => {
    // GIVEN
    // I have an access token that expired an hour ago
    const expiredToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
        data: 'foobar',
      },
      'secret'
    )

    // and this token is stored in cookies storage
    const tokens = { accessToken: expiredToken, refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // and I have a requestRefresh function that throws an error
    const requestRefresh = async () => {
      throw new Error('Server error')
    }

    // and I have an error handler
    const catchFn = jest.fn()

    // WHEN
    // I call refreshTokenIfNeeded
    const authProvider = new AuthProvider()
    await authProvider.refreshTokenIfNeeded(requestRefresh).catch(catchFn)

    // THEN
    // I expect the error handler to have been called with the right error
    expect(catchFn).toHaveBeenLastCalledWith(new Error('Failed to refresh auth token: Server error'))
  })

  it('throws an error and clears the storage if the requestRefresh function throws an error with a 401 status code', async () => {
    // GIVEN
    // I have an access token that expired an hour ago
    const expiredToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
        data: 'foobar',
      },
      'secret'
    )

    // and this token is stored in cookies storage
    const tokens = { accessToken: expiredToken, refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // and I have a requestRefresh function that throws an error
    const requestRefresh = async () => {
      const error = makeAxiosErrorWithStatusCode(401)

      throw error
    }

    // and I have an error handler
    const catchFn = jest.fn()

    // WHEN
    // I call refreshTokenIfNeeded
    const authProvider = new AuthProvider()
    await authProvider.refreshTokenIfNeeded(requestRefresh).catch(catchFn)

    // THEN
    // I expect the error handler to have been called with the right error
    expect(catchFn).toHaveBeenLastCalledWith(new Error('Got 401 on token refresh; clearing both auth tokens'))
    // and the storage to have been cleared
    expect(storage.getItem()).toBe("")
  })

  it('throws an error and clears the storage if the requestRefresh function throws an error with a 422 status code', async () => {
    // GIVEN
    // I have an access token that expired an hour ago
    const expiredToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
        data: 'foobar',
      },
      'secret'
    )

    // and this token is stored in cookies storage
    const tokens = { accessToken: expiredToken, refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // and I have a requestRefresh function that throws an error
    const requestRefresh = async () => {
      const error = makeAxiosErrorWithStatusCode(422)

      throw error
    }

    // and I have an error handler
    const catchFn = jest.fn()

    // WHEN
    // I call refreshTokenIfNeeded
    const authProvider = new AuthProvider()
    await authProvider.refreshTokenIfNeeded(requestRefresh).catch(catchFn)

    // THEN
    // I expect the error handler to have been called with the right error
    expect(catchFn).toHaveBeenLastCalledWith(new Error('Got 422 on token refresh; clearing both auth tokens'))
    // and the storage to have been cleared
    expect(storage.getItem()).toBe("")
  })

  it('refreshes the access token if it does not have an expiration', async () => {
    // GIVEN
    // I have an access token that has no expiration
    const expiredToken = jwt.sign(
      {
        data: 'foobar',
      },
      'secret'
    )

    // and this token is stored in cookies storage
    const tokens = { accessToken: expiredToken, refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // and I have a requestRefresh function that returns an access token
    const requestRefresh = async () => 'newaccesstoken'

    // WHEN
    // I call refreshTokenIfNeeded
    const authProvider = new AuthProvider()
    const result = await authProvider.refreshTokenIfNeeded(requestRefresh)

    // THEN
    // I expect the stored access token to have been updated
    const storedTokens = storage.getItem() as string
    expect(JSON.parse(storedTokens)).toEqual({ accessToken: 'newaccesstoken', refreshToken: 'refreshtoken' })

    // and the result to be the new access token
    expect(result).toEqual('newaccesstoken')
  })

  it('refreshes the access token is it has expired', async () => {
    // GIVEN
    // I have an access token that expired an hour ago
    const expiredToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
        data: 'foobar',
      },
      'secret'
    )

    // and this token is stored in cookies storage
    const tokens = { accessToken: expiredToken, refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // and I have a requestRefresh function that returns an access token
    const requestRefresh = async () => 'newaccesstoken'

    // WHEN
    // I call refreshTokenIfNeeded
    const authProvider = new AuthProvider()
    const result = await authProvider.refreshTokenIfNeeded(requestRefresh)

    // THEN
    // I expect the stored access token to have been updated
    const storedTokens = storage.getItem() as string
    expect(JSON.parse(storedTokens)).toEqual({ accessToken: 'newaccesstoken', refreshToken: 'refreshtoken' })

    // and the result to be the new access token
    expect(result).toEqual('newaccesstoken')
  })

  it('updates both tokens if they are provided', async () => {
    // GIVEN
    // I have an access token that expired an hour ago
    const expiredToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
        data: 'foobar',
      },
      'secret'
    )

    // and this token is stored in cookies storage
    const tokens = { accessToken: expiredToken, refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // and I have a requestRefresh function that returns both tokens
    const requestRefresh = async () => ({ accessToken: 'newaccesstoken', refreshToken: 'newrefreshtoken' })

    // WHEN
    // I call refreshTokenIfNeeded
    const authProvider = new AuthProvider()
    const result = await authProvider.refreshTokenIfNeeded(requestRefresh)

    // THEN
    // I expect both the stord tokens to have been updated
    const storedTokens = storage.getItem() as string
    expect(JSON.parse(storedTokens)).toEqual({ accessToken: 'newaccesstoken', refreshToken: 'newrefreshtoken' })

    // and the result to be the new access token
    expect(result).toEqual('newaccesstoken')
  })

  it('throws an error if requestRefresh returns an invalid response', async () => {
    // GIVEN
    // I have an access token that expired an hour ago
    const expiredToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
        data: 'foobar',
      },
      'secret'
    )

    // and this token is stored in cookies storage
    const tokens = { accessToken: expiredToken, refreshToken: 'refreshtoken' }
    const storage = new CookiesStorage();
    storage.setItem(JSON.stringify(tokens))

    // and I have a requestRefresh function that returns an access token
    const requestRefresh = async () => ({ access_token: 'wrongkey!', refresh_token: 'anotherwrongkey!' })

    // and I have an error handler
    const errorHandler = jest.fn()

    // WHEN
    // I call refreshTokenIfNeeded
    const authProvider = new AuthProvider()
    await authProvider.refreshTokenIfNeeded(requestRefresh as any).catch(errorHandler)

    // THEN
    // I expect the error handler to have been called with the right error
    expect(errorHandler).toHaveBeenLastCalledWith(
      new Error(
        'Failed to refresh auth token: requestRefresh must either return a string or an object with an accessToken'
      )
    )
  })
})
