import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find({}).lean();
  const safeUsers = users.map(({ password, ...u }: any) => u);
  return NextResponse.json({ success: true, users: safeUsers });
}

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    await connectDB();

    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 10)
      : undefined;

    const newUser = {
      id: String(Date.now()),
      name: userData.name,
      username: userData.username,
      email: userData.email,
      role: userData.role || "author",
      password: hashedPassword,
      postsCount: 0,
      lastLogin: "Never",
      active: true,
    };

    await new User(newUser).save();

    const { password, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
