import ContactContainer from "@/components/static/contact-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};

export default function AboutPage() {
  return (
    <main>
      <ContactContainer />
    </main>
  );
}
