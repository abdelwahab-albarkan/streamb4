import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const dataFilePath = path.join(process.cwd(), "data", "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

function writeUsers(users: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing users:", err);
  }
}

export async function GET() {
  const users = readUsers().map(({ password, ...u }: any) => u);
  return NextResponse.json({ success: true, users });
}

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const users = readUsers();

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

    users.push(newUser);
    writeUsers(users);

    const { password, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
