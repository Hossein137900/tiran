import DashboardPageContainer from "@/components/static/dashboard-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "  داشبورد | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};
const DashboardPage = () => {
  return (
    <main>
      <DashboardPageContainer />
    </main>
  );
};

export default DashboardPage;
