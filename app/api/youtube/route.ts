import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: false, message: "URL param is required" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data: {
      url,
      streamUrl: url,
    },
  });
}
