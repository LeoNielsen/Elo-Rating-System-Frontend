import Keycloak from "keycloak-js";

const baseUrl = process.env.REACT_APP_KEYCLOAK_URL
console.log(baseUrl)

const KC = new Keycloak({
    realm: 'demo-realm',
    url: baseUrl,
    clientId: 'ELO-Front'
})

const initKeycloak = (onAuthenticatedCallback) => {
    KC.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
      .then((authenticated) => {
        if (!authenticated) {
          console.log("user is not authenticated..!");
        }
        onAuthenticatedCallback();
      })
      .catch(console.error);
  };
  
  const doLogin = KC.login;
  
  const doLogout = KC.logout;
  
  const getToken = () => KC.token;
  
  const getTokenParsed = () => KC.tokenParsed;
  
  const isLoggedIn = () => !!KC.token;
  
  const updateToken = (successCallback) =>
    KC.updateToken(5)
      .then(successCallback)
      .catch(doLogin);
  
  const getUsername = () => KC.tokenParsed?.preferred_username;
  
  const hasRole = (roles) => roles.some((role) => KC.hasRealmRole(role));
  
  const UserService = {
    initKeycloak,
    doLogin,
    doLogout,
    isLoggedIn,
    getToken,
    getTokenParsed,
    updateToken,
    getUsername,
    hasRole,
  };
  
  export default UserService;