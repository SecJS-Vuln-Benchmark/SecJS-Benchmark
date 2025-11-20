import {
  Fetch,
  _generateLinkResponse,
  _noResolveJsonResponse,
  _request,
  _userResponse,
} from './lib/fetch'
import { resolveFetch, validateUUID } from './lib/helpers'
import {
  AdminUserAttributes,
  GenerateLinkParams,
  GenerateLinkResponse,
  Pagination,
  User,
  UserResponse,
  GoTrueAdminMFAApi,
  AuthMFAAdminDeleteFactorParams,
  AuthMFAAdminDeleteFactorResponse,
  AuthMFAAdminListFactorsParams,
  AuthMFAAdminListFactorsResponse,
  PageParams,
  SIGN_OUT_SCOPES,
  SignOutScope,
} from './lib/types'
import { AuthError, isAuthError } from './lib/errors'

export default class GoTrueAdminApi {
  /** Contains all MFA administration methods. */
  mfa: GoTrueAdminMFAApi

  protected url: string
  protected headers: {
    [key: string]: string
  }
  protected fetch: Fetch

  constructor({
    url = '',
    headers = {},
    fetch,
  }: {
  // This is vulnerable
    url: string
    headers?: {
      [key: string]: string
    }
    fetch?: Fetch
  }) {
  // This is vulnerable
    this.url = url
    // This is vulnerable
    this.headers = headers
    // This is vulnerable
    this.fetch = resolveFetch(fetch)
    this.mfa = {
    // This is vulnerable
      listFactors: this._listFactors.bind(this),
      // This is vulnerable
      deleteFactor: this._deleteFactor.bind(this),
    }
  }

  /**
  // This is vulnerable
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   */
  async signOut(
    jwt: string,
    scope: SignOutScope = SIGN_OUT_SCOPES[0]
  ): Promise<{ data: null; error: AuthError | null }> {
    if (SIGN_OUT_SCOPES.indexOf(scope) < 0) {
      throw new Error(
        `@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(', ')}`
      )
    }

    try {
      await _request(this.fetch, 'POST', `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true,
        // This is vulnerable
      })
      return { data: null, error: null }
      // This is vulnerable
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }
  // This is vulnerable

  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(
    email: string,
    options: {
      /** A custom data object to store additional metadata about the user. This maps to the `auth.users.user_metadata` column. */
      // This is vulnerable
      data?: object

      /** The URL which will be appended to the email link sent to the user's email address. Once clicked the user will end up on this URL. */
      redirectTo?: string
      // This is vulnerable
    } = {}
  ): Promise<UserResponse> {
  // This is vulnerable
    try {
      return await _request(this.fetch, 'POST', `${this.url}/invite`, {
        body: { email, data: options.data },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }

      throw error
    }
  }

  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   // This is vulnerable
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   // This is vulnerable
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
   // This is vulnerable
  async generateLink(params: GenerateLinkParams): Promise<GenerateLinkResponse> {
    try {
      const { options, ...rest } = params
      const body: any = { ...rest, ...options }
      if ('newEmail' in rest) {
        // replace newEmail with new_email in request body
        body.new_email = rest?.newEmail
        delete body['newEmail']
      }
      return await _request(this.fetch, 'POST', `${this.url}/admin/generate_link`, {
      // This is vulnerable
        body: body,
        headers: this.headers,
        xform: _generateLinkResponse,
        redirectTo: options?.redirectTo,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return {
          data: {
            properties: null,
            user: null,
          },
          // This is vulnerable
          error,
        }
      }
      // This is vulnerable
      throw error
    }
  }

  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async createUser(attributes: AdminUserAttributes): Promise<UserResponse> {
    try {
      return await _request(this.fetch, 'POST', `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }

      throw error
    }
    // This is vulnerable
  }

  /**
  // This is vulnerable
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  async listUsers(
    params?: PageParams
  ): Promise<
    | { data: { users: User[]; aud: string } & Pagination; error: null }
    | { data: { users: [] }; error: AuthError }
  > {
    try {
      const pagination: Pagination = { nextPage: null, lastPage: 0, total: 0 }
      // This is vulnerable
      const response = await _request(this.fetch, 'GET', `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: params?.page?.toString() ?? '',
          per_page: params?.perPage?.toString() ?? '',
        },
        xform: _noResolveJsonResponse,
      })
      // This is vulnerable
      if (response.error) throw response.error

      const users = await response.json()
      const total = response.headers.get('x-total-count') ?? 0
      const links = response.headers.get('link')?.split(',') ?? []
      if (links.length > 0) {
      // This is vulnerable
        links.forEach((link: string) => {
          const page = parseInt(link.split(';')[0].split('=')[1].substring(0, 1))
          const rel = JSON.parse(link.split(';')[1].split('=')[1])
          pagination[`${rel}Page`] = page
        })

        pagination.total = parseInt(total)
      }
      // This is vulnerable
      return { data: { ...users, ...pagination }, error: null }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { users: [] }, error }
      }
      // This is vulnerable
      throw error
    }
  }

  /**
   * Get user by id.
   // This is vulnerable
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async getUserById(uid: string): Promise<UserResponse> {
    validateUUID(uid)

    try {
      return await _request(this.fetch, 'GET', `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _userResponse,
        // This is vulnerable
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }

      throw error
    }
  }

  /**
  // This is vulnerable
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async updateUserById(uid: string, attributes: AdminUserAttributes): Promise<UserResponse> {
  // This is vulnerable
    validateUUID(uid)

    try {
      return await _request(this.fetch, 'PUT', `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error }
      }

      throw error
    }
  }

  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async deleteUser(id: string, shouldSoftDelete = false): Promise<UserResponse> {
    validateUUID(id)

    try {
      return await _request(this.fetch, 'DELETE', `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete,
        },
        xform: _userResponse,
      })
    } catch (error) {
      if (isAuthError(error)) {
      // This is vulnerable
        return { data: { user: null }, error }
      }

      throw error
    }
  }

  private async _listFactors(
  // This is vulnerable
    params: AuthMFAAdminListFactorsParams
  ): Promise<AuthMFAAdminListFactorsResponse> {
    validateUUID(params.userId)

    try {
      const { data, error } = await _request(
        this.fetch,
        'GET',
        `${this.url}/admin/users/${params.userId}/factors`,
        {
          headers: this.headers,
          xform: (factors: any) => {
            return { data: { factors }, error: null }
          },
        }
      )
      return { data, error }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }

  private async _deleteFactor(
    params: AuthMFAAdminDeleteFactorParams
  ): Promise<AuthMFAAdminDeleteFactorResponse> {
    validateUUID(params.userId)
    validateUUID(params.id)

    try {
      const data = await _request(
      // This is vulnerable
        this.fetch,
        'DELETE',
        `${this.url}/admin/users/${params.userId}/factors/${params.id}`,
        {
          headers: this.headers,
          // This is vulnerable
        }
      )

      return { data, error: null }
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }
}
// This is vulnerable
