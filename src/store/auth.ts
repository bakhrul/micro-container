import { reactive, computed } from 'vue'

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

// Initial state (loads from localStorage if available)
const savedUser = localStorage.getItem('mf_user')
const savedToken = localStorage.getItem('mf_token')

const state = reactive<AuthState>({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null
})

// Reactive Auth Store Object in HOST Shell
export const authStore = {
  // Readonly reactive getters
  user: computed(() => state.user),
  token: computed(() => state.token),
  isLoggedIn: computed(() => !!state.token && !!state.user),

  // Actions
  login(email: string, role: UserProfile['role'] = 'Admin') {
    const name = email.split('@')[0] || 'User'
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
    
    state.user = {
      name: formattedName === 'Bahrul' ? 'Bahrul Developer' : formattedName,
      email: email,
      role: role,
      avatar: '👨‍💻'
    }
    state.token = `jwt-token-host-${Date.now()}`

    localStorage.setItem('mf_user', JSON.stringify(state.user))
    localStorage.setItem('mf_token', state.token)
  },

  logout() {
    state.user = null
    state.token = null
    localStorage.removeItem('mf_user')
    localStorage.removeItem('mf_token')
  }
}
