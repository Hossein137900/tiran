import CorporateGiftsContainer from "@/components/static/Corporate-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " هدایای سازمانی | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};

const CorporateGiftsPage = () => {
  return (
    <main>
      <CorporateGiftsContainer />
    </main>
  );
};

export default CorporateGiftsPage;
