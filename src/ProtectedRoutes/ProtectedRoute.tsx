import UserService from '../Keycloak/UserService'
import { ReactNode } from 'react'

function ProtectedRoute({ children }:{ children: ReactNode }) {
  
    const isLoggedIn = UserService.isLoggedIn()

    return isLoggedIn ? children : UserService.doLogin()
}

export default ProtectedRoute