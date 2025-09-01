export async function onRequest(context) {
  return new Response(
    JSON.stringify({ github_token: context.env.GIT_TOKEN }),
    { headers: { "Content-Type": "application/json" } }
  );
}
