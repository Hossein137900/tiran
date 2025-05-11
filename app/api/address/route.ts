import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Create a new object for the modified body
    const modifiedBody = { ...body };

    // Convert province_id and city_id to integers for the API
    if (modifiedBody.province_id) {
      modifiedBody.province_id = parseInt(modifiedBody.province_id, 10);
    }

    if (modifiedBody.city_id) {
      modifiedBody.city_id = parseInt(modifiedBody.city_id, 10);
    }

    // Get the authorization token from the request headers
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    console.log("Sending to API:", modifiedBody);

    // Forward the request to the external API with the modified body
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/profile/address",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(modifiedBody),
      }
    );

    // Get the response data
    const data = await response.json();
    console.log("API response:", data);

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in address API route:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
