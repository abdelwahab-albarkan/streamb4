import type { Metadata } from "next";
import RefundsClient from "./RefundsClient";

export const metadata: Metadata = {
  title: "Refund Policy | STREAMB4",
  description: "Read the STREAMB4 Refund Policy to understand our refund and cancellation terms.",
  robots: { index: false, follow: false },
};

export default function RefundsPage() {
  return <RefundsClient />;
}
