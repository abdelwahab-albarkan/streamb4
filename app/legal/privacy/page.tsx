import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | STREAMB4",
  description: "Read the STREAMB4 Privacy Policy to understand how we collect, use, and protect your personal data.",
  alternates: { canonical: "https://streamb4.com/legal/privacy" },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
