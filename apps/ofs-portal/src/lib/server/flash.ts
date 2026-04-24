import type { Cookies } from "@sveltejs/kit";

const FLASH_COOKIE = "ofs-portal-flash";

export function setFlash(
  cookies: Cookies,
  flash: { type: "success" | "error"; message: string },
) {
  cookies.set(FLASH_COOKIE, JSON.stringify(flash), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30,
  });
}

export function readFlash(
  cookies: Cookies,
): { type: "success" | "error"; message: string } | undefined {
  const raw = cookies.get(FLASH_COOKIE);

  if (!raw) return undefined;

  cookies.delete(FLASH_COOKIE, { path: "/" });

  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
