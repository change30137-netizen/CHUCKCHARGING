const RAGIC_SOURCES = {
  "7": {
    server: "ap13",
    path: "ChuckChargingCC/ragicproject-management/7",
  },
  "23": {
    server: "ap13",
    path: "ChuckChargingCC/ragicproject-management/23",
  },
};

function buildCorsHeaders(env, requestOrigin) {
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";
  const origin =
    allowedOrigin === "*" ? "*" : requestOrigin || allowedOrigin;

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin");
    const corsHeaders = buildCorsHeaders(env, requestOrigin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
    }

    if (!env.RAGIC_API_KEY) {
      return jsonResponse(
        { error: "Missing RAGIC_API_KEY secret" },
        500,
        corsHeaders
      );
    }

    const url = new URL(request.url);
    const formId = url.searchParams.get("form");
    const source = RAGIC_SOURCES[formId];

    if (!source) {
      return jsonResponse({ error: "Unknown form" }, 400, corsHeaders);
    }

    const upstreamUrl = new URL(
      `https://${source.server}.ragic.com/${source.path}`
    );
    upstreamUrl.searchParams.set("api", "");
    upstreamUrl.searchParams.set("naming", "EID");
    upstreamUrl.searchParams.set("APIKey", env.RAGIC_API_KEY);

    const upstreamRes = await fetch(upstreamUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    const payload = await upstreamRes.text();

    return new Response(payload, {
      status: upstreamRes.status,
      headers: {
        ...corsHeaders,
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
};
