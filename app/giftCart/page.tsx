import GiftCardsContainer from "@/components/static/gift-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " گیفت کارت | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};

const GiftCardsPage = () => {
  return (
    <main>
      <GiftCardsContainer />
    </main>
  );
};

export default GiftCardsPage;
