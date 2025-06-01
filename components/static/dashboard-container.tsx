"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/type";
import OrdersPanel from "@/components/static/dashboard/ordersPanel";
import ProfilePanel from "@/components/static/dashboard/profilePanel";
import SecurityPanel from "@/components/static/dashboard/securityPanel";
import AddressesPanel from "@/components/static/dashboard/addressesPanel";
import DashboardSidebar from "@/components/static/dashboard/dashboardSidebar";

const DashboardPageContainer = () => {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState("orders");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await fetch("/api/user", {
          headers: {
            method: "GET",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success && data.data) {
          setUserProfile(data.data);
        } else {
          console.error("Failed to fetch user profile:", data);
          router.push("/auth");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const renderActivePanel = () => {
    switch (activePanel) {
      case "orders":
        return <OrdersPanel />;
      case "profile":
        return <ProfilePanel userProfile={userProfile} />;
      case "security":
        return <SecurityPanel />;
      case "addresses":
        return <AddressesPanel />;
      default:
        return <OrdersPanel />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      dir="rtl"
    >
      <div className="max-w-7xl mt-24 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <DashboardSidebar
              activePanel={activePanel}
              setActivePanel={setActivePanel}
              userProfile={userProfile}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {renderActivePanel()}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPageContainer;
