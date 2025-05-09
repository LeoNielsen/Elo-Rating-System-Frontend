import UserService from '../Keycloak/UserService'

function ProtectedRoute({ children }:{ children: JSX.Element }) {
  
    const isLoggedIn = UserService.isLoggedIn()

    return isLoggedIn ? children : UserService.doLogin()
}

export default ProtectedRoute