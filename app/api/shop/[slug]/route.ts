import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const slug = request.headers.get("slug");

    // Validate slug
    if (!slug) {
      return Response.json(
        { success: false, message: "Missing product slug" },
        { status: 400 }
      );
    }

    // Fetch product data
    const response = await fetch(
      `https://tiran.shop.hesabroclub.ir/api/web/shop-v1/product/view?slug=${slug}&expand=varieties,images`
    );

    if (!response.ok) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
