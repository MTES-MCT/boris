import type { Handle, HandleServerError, RequestEvent } from "@sveltejs/kit";

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

function requestContext(event: RequestEvent) {
  return {
    routeId: event.route.id,
    method: event.request.method,
    path: event.url.pathname,
    search: event.url.search,
    userAgent: event.request.headers.get("user-agent"),
    host: event.request.headers.get("host"),
    forwardedHost: event.request.headers.get("x-forwarded-host"),
    forwardedProto: event.request.headers.get("x-forwarded-proto"),
  };
}

export const handle: Handle = async ({ event, resolve }) => {
  try {
    const response = await resolve(event);

    if (response.status >= 500) {
      console.error(
        JSON.stringify({
          marker: "OFS_PORTAL_5XX_RESPONSE",
          status: response.status,
          ...requestContext(event),
        }),
      );
    }

    return response;
  } catch (error) {
    console.error(
      JSON.stringify({
        marker: "OFS_PORTAL_RESOLVE_ERROR",
        ...requestContext(event),
        error: serializeError(error),
      }),
    );

    throw error;
  }
};

export const handleError: HandleServerError = ({ error, event, status }) => {
  console.error(
    JSON.stringify({
      marker: "OFS_PORTAL_SERVER_ERROR",
      status,
      ...requestContext(event),
      error: serializeError(error),
    }),
  );

  return {
    message: "Une erreur est survenue.",
  };
};
