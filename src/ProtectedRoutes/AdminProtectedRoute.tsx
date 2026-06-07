import UserService from '../Keycloak/UserService'

function AdminProtectedRoute({ children }: { children: JSX.Element }) {
    const isAdmin = UserService.hasRole('admin')

    if (!isAdmin) {
        UserService.doLogin()
        return null
    }

    return children
}

export default AdminProtectedRoute
