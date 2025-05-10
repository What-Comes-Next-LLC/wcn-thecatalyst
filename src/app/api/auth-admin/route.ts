import { NextRequest, NextResponse } from 'next/server';

const PASSWORD = process.env.ADMIN_PASSWORD || 'letmein';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin-auth', password, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}