export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname !== "/index.html") return new Response("Not found", { status: 404 });
    return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
  }
};
