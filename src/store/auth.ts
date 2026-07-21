import { defineStore } from 'pinia'

export interface UserProfile {
  name: string
  email: string
  role: 'Admin' | 'Sales Manager' | 'Inventory Specialist' | 'Guest'
  avatar: string
}

interface AuthState {
  user: UserProfile | null
  token: string | null
}

const savedUser = localStorage.getItem('mf_pinia_user')
const savedToken = localStorage.getItem('mf_pinia_token')

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.token && !!state.user,
    currentUser: (state): UserProfile | null => state.user
  },

  actions: {
    login(email: string, role: UserProfile['role'] = 'Admin') {
      const name = email.split('@')[0] || 'User'
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
      
      this.user = {
        name: formattedName === 'Bahrul' ? 'Bahrul Developer' : formattedName,
        email: email,
        role: role,
        avatar: '👨‍💻'
      }
      this.token = `jwt-pinia-token-${Date.now()}`

      localStorage.setItem('mf_pinia_user', JSON.stringify(this.user))
      localStorage.setItem('mf_pinia_token', this.token)
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('mf_pinia_user')
      localStorage.removeItem('mf_pinia_token')
    }
  }
})
