import { ReactNode } from 'react'
import UserService from '../Keycloak/UserService'

function AdminProtectedRoute({ children }: { children: ReactNode }) {
    const isAdmin = UserService.hasRole('admin')

    if (!isAdmin) {
        UserService.doLogin()
        return null
    }

    return children
}

export default AdminProtectedRoute
