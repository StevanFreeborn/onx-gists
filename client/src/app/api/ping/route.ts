export async function GET() {
  return await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ping`);
}
