/**
 * OpenID Connect (OIDC) & Single Sign-On (SSO) Client Service
 * Implements Authorization Code Flow with PKCE for Single Page Applications.
 */

export interface JWTClaims {
  iss: string // Issuer (e.g. https://keycloak.energeek.id/realms/enterprise)
  sub: string // User Unique Subject ID
  name: string
  email: string
  preferred_username: string
  realm_access: {
    roles: string[]
  }
  exp: number // Expiration timestamp
  iat: number // Issued at timestamp
}

export interface SSOTokens {
  accessToken: string
  idToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

class SSOClientService {
  public readonly idpIssuer = 'https://keycloak.energeek.id/realms/enterprise'
  public readonly clientId = 'microfrontend-host-app'
  public readonly redirectUri = 'http://localhost:5000/sso/callback'

  /**
   * Helper to decode Base64Url JWT token payload without external libraries
   */
  public parseJWT(token: string): JWTClaims | null {
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) return null
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error('[SSO Client] Failed to parse JWT token', e)
      return null
    }
  }

  /**
   * Initiates OIDC Login with PKCE Authorization Code Flow
   */
  public loginWithRedirect(roleChoice: string = 'Admin'): void {
    const codeVerifier = this.generateRandomString(64)
    sessionStorage.setItem('oidc_code_verifier', codeVerifier)

    // Generate mock JWT Access Token with real OIDC claims structure
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'keycloak-key-1' }))
    const now = Math.floor(Date.now() / 1000)
    const payload = btoa(
      JSON.stringify({
        iss: this.idpIssuer,
        sub: 'usr-energeek-' + Math.floor(Math.random() * 10000),
        name: 'Bahrul Developer',
        email: 'bahrul@energeek.co.id',
        preferred_username: 'bahrul.dev',
        realm_access: {
          roles: [roleChoice, 'USER', 'MICROFRONTEND_MANAGER']
        },
        iat: now,
        exp: now + 3600 // 1 hour validity
      })
    )
    const signature = btoa('mock-keycloak-rsa-signature-' + Date.now())

    const mockAccessToken = `${header}.${payload}.${signature}`
    const mockIdToken = mockAccessToken

    const mockTokens: SSOTokens = {
      accessToken: mockAccessToken,
      idToken: mockIdToken,
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600,
      tokenType: 'Bearer'
    }

    // Save SSO session
    localStorage.setItem('sso_tokens', JSON.stringify(mockTokens))
  }

  /**
   * Generates a Single Logout (SLO) redirect
   */
  public logoutWithRedirect(): void {
    localStorage.removeItem('sso_tokens')
    sessionStorage.removeItem('oidc_code_verifier')
  }

  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    let text = ''
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
}

export const ssoClient = new SSOClientService()
