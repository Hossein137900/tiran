import HomeContainer from "@/components/static/home-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " صفحه اصلی | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};
export default function Home() {
  return (
    <main>
      <HomeContainer />
    </main>
  );
}
