import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | STREAMB4",
  description: "Read the STREAMB4 Privacy Policy to understand how we collect, use, and protect your personal data.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
