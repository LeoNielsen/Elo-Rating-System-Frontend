import React from 'react'
import UserService from '../Keycloak/UserService'

function PRoute({ children }:{ children: JSX.Element }) {
  
    const isLoggedIn = UserService.isLoggedIn()
    const getToken = UserService.getToken()
    const getUsername = UserService.getUsername()

    console.log(isLoggedIn)
    console.log(getToken)
    console.log(getUsername)

    return isLoggedIn ? children : UserService.doLogin()


}

export default PRoute