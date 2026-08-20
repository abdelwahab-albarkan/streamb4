import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | STREAMB4" },
  description: "Read the STREAMB4 Terms of Service to understand the rules and conditions governing use of our IPTV service.",
  alternates: { canonical: "https://streamb4.com/legal/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <TermsClient />;
}
