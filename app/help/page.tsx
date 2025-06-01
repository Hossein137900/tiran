import HelpContainer from "@/components/static/help-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " راهنما | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};

export default function HelpPage() {
  return (
    <main>
      <HelpContainer />
    </main>
  );
}
