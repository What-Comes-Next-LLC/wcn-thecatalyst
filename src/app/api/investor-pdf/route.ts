import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { join } from "path";

const PDF_PATH = join(process.cwd(), "private", "investor-memo.pdf");
const PASSWORD = process.env.INVESTOR_MEMO_PASSWORD || "changeme"; // Set your password in .env

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (password !== PASSWORD) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Check if file exists
    let stat;
    try {
      stat = statSync(PDF_PATH);
    } catch {
      return new NextResponse("File not found", { status: 404 });
    }
    // Stream the PDF file
    const stream = createReadStream(PDF_PATH);
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=investor-memo.pdf",
        "Content-Length": stat.size.toString(),
      },
    });
  } catch (err) {
    return new NextResponse("Server error", { status: 500 });
  }
} 