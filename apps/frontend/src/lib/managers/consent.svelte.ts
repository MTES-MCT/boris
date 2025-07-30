import { browser } from '$app/environment';

class CookieConsentManager {
  hasUserConsented = $state(
    browser ? localStorage.getItem('cookies-consent') === 'true' : false,
  );

  needsConsentDecision = $state(
    browser ? localStorage.getItem('cookies-consent') === null : false,
  );

  setUserConsent = (hasConsented: boolean): void => {
    localStorage.setItem('cookies-consent', hasConsented.toString());
    this.hasUserConsented = hasConsented;
    this.needsConsentDecision = false;

    if (!hasConsented) {
      this.removeAnalyticsCookies();
    }
  };

  removeAnalyticsCookies = (): void => {
    const cookies = document.cookie.split(';');
    const cookiesToRemove = ['_fbp', '_ga', '_gcl'];

    cookies.forEach((cookie) => {
      const cookieName = cookie.split('=')[0];

      if (cookiesToRemove.some((c) => cookieName.includes(c))) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

        if (window.location.hostname.endsWith('.beta.gouv.fr')) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.beta.gouv.fr;`;
        }

        if (window.location.hostname.endsWith('.incubateur.net')) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.incubateur.net;`;
        }
      }
    });
  };

  getStoredConsentValue = (): string | null => {
    if (browser) {
      return localStorage.getItem('cookies-consent');
    }

    return null;
  };
}

const cookieConsentManager = new CookieConsentManager();

export default cookieConsentManager;
