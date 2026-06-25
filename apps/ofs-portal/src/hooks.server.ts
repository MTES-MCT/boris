import type { HandleServerError } from "@sveltejs/kit";

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

export const handleError: HandleServerError = ({ error, event, status }) => {
  console.error(
    JSON.stringify({
      marker: "OFS_PORTAL_SERVER_ERROR",
      status,
      routeId: event.route.id,
      method: event.request.method,
      path: event.url.pathname,
      search: event.url.search,
      userAgent: event.request.headers.get("user-agent"),
      host: event.request.headers.get("host"),
      forwardedHost: event.request.headers.get("x-forwarded-host"),
      forwardedProto: event.request.headers.get("x-forwarded-proto"),
      error: serializeError(error),
    }),
  );

  return {
    message: "Une erreur est survenue.",
  };
};
