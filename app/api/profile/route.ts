import type { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/profile?expand=creator%2Cupdater%2Cnumbers%2Ctotal_balance%2Caddresses%2Caddresses%2Ccoins%2Cdiscounts",
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({
        success: true,
        addresses: data.data.addresses || [],
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch addresses",
      });
    }
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
