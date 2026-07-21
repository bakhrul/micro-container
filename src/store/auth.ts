import { defineStore } from 'pinia'
import { ssoClient } from '../services/ssoClient'
import type { SSOTokens } from '../services/ssoClient'

export interface UserProfile {
  name: string
  email: string
  username: string
  role: string
  roles: string[]
  avatar: string
  issuer: string
  subject: string
}

interface AuthState {
  tokens: SSOTokens | null
  user: UserProfile | null
}

const savedTokensStr = localStorage.getItem('sso_tokens')
let initialTokens: SSOTokens | null = null
let initialUser: UserProfile | null = null

if (savedTokensStr) {
  try {
    initialTokens = JSON.parse(savedTokensStr)
    if (initialTokens && initialTokens.accessToken) {
      const claims = ssoClient.parseJWT(initialTokens.accessToken)
      if (claims) {
        initialUser = {
          name: claims.name,
          email: claims.email,
          username: claims.preferred_username,
          role: claims.realm_access.roles[0] || 'User',
          roles: claims.realm_access.roles,
          avatar: '🔐',
          issuer: claims.iss,
          subject: claims.sub
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse initial SSO tokens', e)
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    tokens: initialTokens,
    user: initialUser
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.tokens?.accessToken && !!state.user,
    accessToken: (state): string | null => state.tokens?.accessToken || null,
    bearerHeader: (state): string => state.tokens?.accessToken ? `Bearer ${state.tokens.accessToken}` : '',
    currentUser: (state): UserProfile | null => state.user,
    userRoles: (state): string[] => state.user?.roles || []
  },

  actions: {
    loginWithSSO(roleChoice: string = 'Admin') {
      ssoClient.loginWithRedirect(roleChoice)
      
      // Reload tokens from storage after SSO redirect flow
      const tokensStr = localStorage.getItem('sso_tokens')
      if (tokensStr) {
        this.tokens = JSON.parse(tokensStr)
        if (this.tokens?.accessToken) {
          const claims = ssoClient.parseJWT(this.tokens.accessToken)
          if (claims) {
            this.user = {
              name: claims.name,
              email: claims.email,
              username: claims.preferred_username,
              role: claims.realm_access.roles[0] || 'User',
              roles: claims.realm_access.roles,
              avatar: '🔐',
              issuer: claims.iss,
              subject: claims.sub
            }
          }
        }
      }
    },

    logoutSSO() {
      ssoClient.logoutWithRedirect()
      this.tokens = null
      this.user = null
    }
  }
})
