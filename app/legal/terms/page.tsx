import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service | STREAMB4",
  description: "Read the STREAMB4 Terms of Service to understand the rules and conditions governing use of our IPTV service.",
  alternates: { canonical: "https://streamb4.com/legal/terms" },
};

export default function TermsPage() {
  return <TermsClient />;
}
