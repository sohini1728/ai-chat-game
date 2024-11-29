import { NextResponse } from "next/server";

export function middleware() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new NextResponse("API key not configured", { status: 500 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
