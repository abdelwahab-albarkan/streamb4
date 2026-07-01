import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userData = await request.json();
    await connectDB();

    const existing = await User.findOne({ id }).lean() as any;
    if (!existing) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const updateData: any = {
      name: userData.name || existing.name,
      username: userData.username || existing.username,
      email: userData.email || existing.email,
      role: userData.role || existing.role,
      active: userData.active !== undefined ? userData.active : existing.active,
    };

    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { id },
      updateData,
      { new: true }
    ).lean() as any;

    const { password, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const deleted = await User.findOneAndDelete({ id }).lean();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
