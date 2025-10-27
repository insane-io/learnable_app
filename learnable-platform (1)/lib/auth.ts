import pb from './pb'

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid 
}

/**
 * Get current user data
 */
export function getCurrentUser() {
  if (!pb.authStore.isValid) {
    return null
  }
  
  return {
    id: pb.authStore.record?.id,
    email: pb.authStore.record?.email,
    role: pb.authStore.record?.role,
    name: pb.authStore.record?.name,
  }
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  return pb.authStore.token || null
}

/**
 * Logout user
 */
export function logout() {
  pb.authStore.clear()
  console.log('User logged out')
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: 'parent' | 'child' | 'teacher'): boolean {
  if (!pb.authStore.isValid) {
    return false
  }
  
  return pb.authStore.record?.role === role
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export function requireAuth(role?: 'parent' | 'child' | 'teacher') {
  if (!pb.authStore.isValid) {
    return false
  }
  
  if (role && pb.authStore.record?.role !== role) {
    return false
  }
  
  return true
}
