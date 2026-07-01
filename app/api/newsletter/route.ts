import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendWelcomeEmail } from "@/lib/email";


const dataFilePath = path.join(process.cwd(), "data", "subscribers.json");

function readSubscribers() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, "[]", "utf8");
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

function writeSubscribers(subscribers: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(subscribers, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing subscribers:", err);
  }
}

export async function POST(request: Request) {
  try {
    const { email, source = "blog" } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    const subscribers = readSubscribers();
    const exists = subscribers.some((s: any) => s.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return NextResponse.json({ success: false, error: "already_subscribed" });
    }

    const newSubscriber = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      source,
    };

    subscribers.push(newSubscriber);
    writeSubscribers(subscribers);

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
  const subscribers = readSubscribers();
  return NextResponse.json({ success: true, count: subscribers.length });
}
