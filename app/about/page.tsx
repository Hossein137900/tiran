import AboutContainer from "@/components/static/about-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};

export default function AboutPage() {
  return (
    <main>
      <AboutContainer />
    </main>
  );
}
