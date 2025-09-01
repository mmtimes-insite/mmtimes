export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);

  // GitHub OAuth URLs
  const authorizeUrl = "https://github.com/login/oauth/authorize";
  const tokenUrl = "https://github.com/login/oauth/access_token";
  const userUrl = "https://api.github.com/user";

  if (url.pathname === "/api/auth") {
    // Step 1: Redirect to GitHub login
    return Response.redirect(
      `${authorizeUrl}?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${url.origin}/api/auth/callback&scope=repo,user:email`,
      302
    );
  }

  if (url.pathname === "/api/auth/callback") {
    const code = url.searchParams.get("code");

    // Step 2: Exchange code for token
    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenJson = await tokenRes.json();
    const token = tokenJson.access_token;

    // Step 3: Fetch user
    const userRes = await fetch(userUrl, {
      headers: { Authorization: `token ${token}` },
    });
    const user = await userRes.json();

    return new Response(JSON.stringify({ token, user }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}
