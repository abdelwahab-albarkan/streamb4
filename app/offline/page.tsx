import type { Metadata } from "next";
import OfflineClient from "./OfflineClient";

export const metadata: Metadata = {
  title: "You're Offline | STREAMB4",
  description: "You appear to be offline. Please check your internet connection and try again.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return <OfflineClient />;
}
