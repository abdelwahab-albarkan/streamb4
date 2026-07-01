import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const dataFilePath = path.join(process.cwd(), "data", "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userData = await request.json();
    const users = readUsers();
    const idx = users.findIndex((u: any) => u.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const updatedUser = {
      ...users[idx],
      name: userData.name || users[idx].name,
      username: userData.username || users[idx].username,
      email: userData.email || users[idx].email,
      role: userData.role || users[idx].role,
      active: userData.active !== undefined ? userData.active : users[idx].active,
    };

    if (userData.password) {
      updatedUser.password = await bcrypt.hash(userData.password, 10);
    }

    users[idx] = updatedUser;
    writeUsers(users);

    const { password, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const users = readUsers();
    const filtered = users.filter((u: any) => u.id !== id);

    if (users.length === filtered.length) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    writeUsers(filtered);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
