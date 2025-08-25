import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { type: "Orders", value: 120 },
    { type: "Returns", value: 15 },
  ]);
}
