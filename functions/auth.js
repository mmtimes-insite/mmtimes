export async function onRequest(context) {
  if (context.env.GITHUB_TOKEN) {
    return new Response(JSON.stringify({ token: context.env.GITHUB_TOKEN }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response("Unauthorized", { status: 401 });
}
