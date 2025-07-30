import { browser } from '$app/environment';

class CookieConsentManager {
  hasUserConsented = $state(
    browser ? localStorage.getItem('boris-cookies-consent') === 'true' : false,
  );

  needsConsentDecision = $state(
    browser ? localStorage.getItem('boris-cookies-consent') === null : false,
  );

  setUserConsent = (hasConsented: boolean): void => {
    localStorage.setItem('boris-cookies-consent', hasConsented.toString());
    this.hasUserConsented = hasConsented;
    this.needsConsentDecision = false;

    if (!hasConsented) {
      this.removeAnalyticsCookies();
    }
  };

  removeAnalyticsCookies = (): void => {
    const cookies = document.cookie.split(';');
    const cookiesToRemove = ['_fbp', '_ga', '_gcl'];
    const domains = ['.beta.gouv.fr', '.incubateur.net', '.scalingo.io'];

    cookies.forEach((cookie) => {
      const cookieName = cookie.split('=')[0];

      if (cookiesToRemove.some((c) => cookieName.includes(c))) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

        domains.forEach((domain) => {
          if (window.location.hostname.endsWith(domain)) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
          }
        });
      }
    });
  };

  getStoredConsentValue = (): string | null => {
    if (browser) {
      return localStorage.getItem('boris-cookies-consent');
    }

    return null;
  };
}

const cookieConsentManager = new CookieConsentManager();

export default cookieConsentManager;
