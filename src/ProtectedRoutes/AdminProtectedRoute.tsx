import UserService from '../Keycloak/UserService'

function AdminProtectedRoute({ children }:{ children: JSX.Element }) {
    const isAdmin = UserService.hasRole('admin')

    return isAdmin ? children : UserService.doLogin()
}

export default AdminProtectedRoute