import { NextResponse, type NextRequest } from "next/server";

const apiPaths = new Set(["/api/apply", "/api/marketing/subscribe", "/api/paypal/verify", "/api/sms"]);

function secure(response: NextResponse, request: NextRequest, csp: string) {
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  if (request.nextUrl.protocol === "https:") response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  return response;
}

function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    if (originUrl.protocol !== "http:" && originUrl.protocol !== "https:") return false;
    if (process.env.APP_ORIGIN) return originUrl.origin === new URL(process.env.APP_ORIGIN).origin;

    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0].trim();
    const host = forwardedHost ?? request.headers.get("host");
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
    const protocol = forwardedProtocol ? `${forwardedProtocol}:` : request.nextUrl.protocol;
    return Boolean(host) && originUrl.host === host?.toLowerCase() && originUrl.protocol === protocol;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const development = process.env.NODE_ENV === "development";
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self' https://paypal.com https://*.paypal.com",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://paypal.com https://*.paypal.com https://www.paypalobjects.com${development ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: https://paypal.com https://*.paypal.com https://www.paypalobjects.com",
    "font-src 'self' data:",
    `connect-src 'self' https://paypal.com https://*.paypal.com https://www.paypalobjects.com${development ? " ws: wss:" : ""}`,
    "frame-src https://paypal.com https://*.paypal.com",
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api/")) return secure(NextResponse.next({ request: { headers: requestHeaders } }), request, csp);
  if (!apiPaths.has(pathname)) return secure(NextResponse.json({ error: "Not found." }, { status: 404 }), request, csp);

  if (request.method !== "POST") {
    return secure(NextResponse.json({ error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } }), request, csp);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return secure(NextResponse.json({ error: "JSON requests are required." }, { status: 415 }), request, csp);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 8192) {
    return secure(NextResponse.json({ error: "Request body is too large." }, { status: 413 }), request, csp);
  }

  if (pathname !== "/api/sms" && !isSameOriginRequest(request)) {
    return secure(NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 }), request, csp);
  }

  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return secure(NextResponse.json({ error: "Cross-site API requests are not allowed." }, { status: 403 }), request, csp);
  }

  return secure(NextResponse.next({ request: { headers: requestHeaders } }), request, csp);
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };