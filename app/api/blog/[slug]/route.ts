// View increment endpoint — no-op on static site.
export async function POST() {
  return new Response(null, { status: 204 });
}
