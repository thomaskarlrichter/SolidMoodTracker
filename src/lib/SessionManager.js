import { Session } from "@inrupt/solid-client-authn-browser";

const ERROR = {
  MISSING_WEB_ID: 'MISSING_WEB_ID',
  INVALID_WEB_ID: 'INVALID_WEB_ID',
}

// If your Pod is *not* on `solidcommunity.net`, change this to your identity provider.
export const SOLID_IDENTITY_PROVIDER = "https://login.inrupt.com";

const session = new Session();
export const assertAuthenticated = () => {
  return session.info.isLoggedIn;
}
export const getWebId = () => {
  return session.info.webId
}
export const getFetch = () => {
  // you do not need to be  logged in to read the data. 
  // fetch will be undefined for a non-authenticated reads.

  if (assertAuthenticated()) {
    return session.fetch;
  }
}


// When redirected after login, finish the process by retrieving session information.
export async function handleRedirectAfterLogin() {
  console.log('handleRedirectAfterLogin')
  await session.handleIncomingRedirect(window.location.href);
  console.log(session.info)
  if (assertAuthenticated()) {
    console.log(getWebId())
    return getWebId()
  }
}

// #########
// #  Login
// #########
export async function login() {
  if (!assertAuthenticated()) {
    console.log('login')
    await session.login({
      oidcIssuer: SOLID_IDENTITY_PROVIDER,
      clientName: "Inrupt tutorial client app",
      redirectUrl: window.location.href
    });
    return true;
  }
  return true;
}
