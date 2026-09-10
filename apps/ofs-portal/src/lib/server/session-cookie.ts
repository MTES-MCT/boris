import { env } from "$env/dynamic/private";
import type { Cookies } from "@sveltejs/kit";

function parseSetCookie(header: string) {
  const parts = header.split(";").map((part) => part.trim());
  const [nameValue, ...attributes] = parts;
  const separatorIndex = nameValue.indexOf("=");

  return {
    name: nameValue.slice(0, separatorIndex),
    value: nameValue.slice(separatorIndex + 1),
    attributes,
  };
}

function isLocalHttpRequest(url: URL) {
  const hostname = url.hostname.toLowerCase();

  return (
    url.protocol === "http:" &&
    (hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]")
  );
}

export function applyBackendSetCookie(
  cookies: Cookies,
  headers: string[],
  requestUrl: URL,
) {
  for (const header of headers) {
    const { name, value, attributes } = parseSetCookie(header);
    const options: {
      path: string;
      domain?: string;
      maxAge?: number;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax" | "none";
    } = {
      path: "/",
    };

    for (const attribute of attributes) {
      const [rawKey, rawValue] = attribute.split("=");
      const key = rawKey.toLowerCase();

      if (key === "domain") options.domain = rawValue;
      if (key === "path") options.path = rawValue;
      if (key === "max-age") options.maxAge = Number(rawValue);
      if (key === "secure") options.secure = true;
      if (key === "httponly") options.httpOnly = true;
      if (key === "samesite")
        options.sameSite = rawValue.toLowerCase() as "strict" | "lax" | "none";
    }

    // Backend cookies are authored for the final shared-parent-domain setup.
    // In local dev, browsers commonly reject `Domain=localhost`, `Secure`, or
    // overly strict same-site settings, so rewrite them into a host-only cookie.
    if (isLocalHttpRequest(requestUrl)) {
      options.domain = undefined;
      options.secure = false;
      options.sameSite = "lax";
    }

    if (options.maxAge === 0 || value === "") {
      cookies.delete(name, {
        path: options.path,
        domain: options.domain,
      });
      continue;
    }

    // Preserve the backend cookie value exactly as received. Express-session
    // already encoded/signed it, and re-encoding here breaks deserialization.
    cookies.set(name, value, {
      ...options,
      encode: (cookieValue) => cookieValue,
    });
  }
}

export function clearSessionCookie(cookies: Cookies) {
  const cookieName = env.SESSION_COOKIE_NAME || "boris.sid";

  cookies.delete(cookieName, {
    path: "/",
    domain: env.SESSION_COOKIE_DOMAIN || undefined,
  });
}
