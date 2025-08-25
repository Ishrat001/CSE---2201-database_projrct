import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { job_title: "Warehouse Worker", count: 12 },
    { job_title: "Supervisor", count: 5 },
    { job_title: "Driver", count: 8 },
  ]);
}