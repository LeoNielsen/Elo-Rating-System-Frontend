import Keycloak from "keycloak-js";

const baseUrl = process.env.REACT_APP_KEYCLOAK_URL
const realm = process.env.REACT_APP_KEYCLOAK_REALM
const client = process.env.REACT_APP_KEYCLOAK_CLIENT

const KC = new Keycloak({
    realm: realm,
    url: baseUrl,
    clientId: client
})

let isKeycloakInitialized = false;
let isInitialized = false;

const initKeycloak = () => {
  if (isInitialized) return Promise.resolve(KC.authenticated);
  isInitialized = true
  return KC.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  }).then((authenticated) => {
    if (!authenticated) {
      console.log("User is not authenticated.");
    }
    isKeycloakInitialized = true;  // Mark Keycloak as initialized
    return authenticated;
  }).catch((error) => {
    console.error("Keycloak init error:", error);
    isKeycloakInitialized = false;  // Mark Keycloak initialization as failed
    return false;
  });
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
  
  const hasRole = (roles) => {
    if (typeof roles === 'string') {
      return KC.hasRealmRole(roles) || KC.hasResourceRole(roles, client);
    }
    if (Array.isArray(roles)) {
      return roles.some(role => KC.hasRealmRole(role) || KC.hasResourceRole(role, client));
    }
    console.error("hasRole: roles must be a string or array");
    return false;
  };
  
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
    isKeycloakInitialized,
  };
  
  export default UserService;