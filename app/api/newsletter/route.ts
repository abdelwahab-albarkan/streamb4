import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models/Subscriber";

export async function POST(request: Request) {
  try {
    const { email, source = "blog" } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    await connectDB();

    const exists = await Subscriber.findOne({ email: email.toLowerCase() }).lean();

    if (exists) {
      return NextResponse.json({ success: false, error: "already_subscribed" });
    }

    const newSubscriber = {
      id: String(Date.now()),
      email: email.toLowerCase(),
      name: "",
      status: "active",
      subscribedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      source,
    };

    await new Subscriber(newSubscriber).save();

    try {
      await sendWelcomeEmail(email);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Subscriber list is sensitive — only expose count publicly.
// Admin reads happen through /api/admin/* routes which are JWT-protected.
export async function GET() {
  await connectDB();
  const count = await Subscriber.countDocuments({ status: "active" });
  return NextResponse.json({ success: true, count });
}
