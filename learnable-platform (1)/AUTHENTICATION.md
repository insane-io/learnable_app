# Parent Authentication - PocketBase Integration

## ✅ Implementation Complete

### Features Implemented

1. **Parent Registration** (`/register?role=parent` or `/parent/register`)
   - Email and password only (simple form)
   - Creates user in PocketBase `users` collection
   - Sets role as 'parent' automatically
   - Toast notifications for success/error
   - Redirects to login after successful registration

2. **Parent Login** (`/parent/login`)
   - Email and password authentication
   - Uses PocketBase `authWithPassword`
   - Role verification (only parents can access)
   - Auth state managed by PocketBase authStore
   - Redirects to parent dashboard

3. **Parent Dashboard** (`/parent/dashboard`)
   - Protected route - checks authentication
   - Displays current user email
   - Logout button included
   - Auto-redirects to login if not authenticated

### Authentication Flow

#### Registration
\`\`\`typescript
const record = await pb.collection('users').create({
  email: formData.email,
  password: formData.password,
  passwordConfirm: formData.password,
  role: 'parent',
})
\`\`\`

#### Login
\`\`\`typescript
const authData = await pb.collection('users').authWithPassword(
  formData.email,
  formData.password,
)

// Access auth data from authStore
console.log(pb.authStore.isValid)
console.log(pb.authStore.token)
console.log(pb.authStore.record.id)
console.log(pb.authStore.record.email)
console.log(pb.authStore.record.role)
\`\`\`

#### Logout
\`\`\`typescript
pb.authStore.clear()
\`\`\`

### Auth Utility Functions (`lib/auth.ts`)

- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get current user data
- `getAuthToken()` - Get auth token
- `logout()` - Clear auth state
- `hasRole(role)` - Check if user has specific role
- `requireAuth(role?)` - Validate authentication

### Components

1. **LogoutButton** (`components/logout-button.tsx`)
   - Reusable logout button
   - Clears authStore
   - Shows toast notification
   - Redirects to login

### Usage Examples

#### Check Authentication in Component
\`\`\`typescript
import { isAuthenticated, hasRole, getCurrentUser } from '@/lib/auth'

useEffect(() => {
  if (!isAuthenticated() || !hasRole('parent')) {
    router.push('/parent/login')
    return
  }
  
  const user = getCurrentUser()
  console.log('Current user:', user)
}, [])
\`\`\`

#### Add Logout Button
\`\`\`typescript
import LogoutButton from '@/components/logout-button'

<LogoutButton />
\`\`\`

### PocketBase Auth State

The auth state is automatically stored by PocketBase in:
- Cookie storage (if available)
- LocalStorage (fallback)

This means:
- Auth persists across page refreshes
- Auth works across tabs
- No manual localStorage management needed

### Next Steps

1. Create child login/registration
2. Create teacher login/registration  
3. Add password reset functionality
4. Add email verification (optional)
5. Add profile management
