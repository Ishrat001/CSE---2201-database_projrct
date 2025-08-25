import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { status: "Received", value: 80 },
    { status: "In Transit", value: 25 },
    { status: "Pending", value: 10 },
  ]);
}