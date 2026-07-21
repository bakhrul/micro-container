declare module 'masterApp/routes' {
  import { RouteRecordRaw } from 'vue-router'
  const routes: RouteRecordRaw[]
  export { routes }
  export default { routes }
}

declare module 'salesApp/routes' {
  import { RouteRecordRaw } from 'vue-router'
  const routes: RouteRecordRaw[]
  export { routes }
  export default { routes }
}

declare module 'uiApp/Button' {
  import { DefineComponent } from 'vue'
  const BaseButton: DefineComponent<{
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    icon?: string
    type?: 'button' | 'submit' | 'reset'
  }>
  export default BaseButton
}

declare module 'uiApp/Card' {
  import { DefineComponent } from 'vue'
  const BaseCard: DefineComponent<{
    title?: string
    subtitle?: string
    glass?: boolean
    hoverable?: boolean
  }>
  export default BaseCard
}

declare module 'uiApp/Badge' {
  import { DefineComponent } from 'vue'
  const BaseBadge: DefineComponent<{
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
    size?: 'sm' | 'md'
    dot?: boolean
  }>
  export default BaseBadge
}

declare module 'uiApp/Input' {
  import { DefineComponent } from 'vue'
  const BaseInput: DefineComponent<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    type?: string
    error?: string
    disabled?: boolean
    icon?: string
  }>
  export default BaseInput
}

declare module 'uiApp/utils' {
  export function formatRupiah(amount: number): string
  export function formatDate(date: string | Date | number): string
  export function truncateText(text: string, maxLength?: number): string
}

declare module 'uiApp/http' {
  export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message: string
    statusCode: number
  }
  export function handleApiError(error: any): ApiResponse<null>
  export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T>
}

declare module 'uiApp/auth' {
  import { ComputedRef } from 'vue'
  export interface UserProfile {
    name: string
    email: string
    role: 'Admin' | 'Sales Manager' | 'Inventory Specialist' | 'Guest'
    avatar: string
  }
  export const authStore: {
    user: ComputedRef<UserProfile | null>
    token: ComputedRef<string | null>
    isLoggedIn: ComputedRef<boolean>
    login: (email: string, role?: UserProfile['role']) => void
    logout: () => void
  }
}
