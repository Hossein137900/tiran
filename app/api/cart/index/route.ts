import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Get the authorization token from the request headers
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    // Forward the request to the external API
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/cart/index",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("External API Error:", errorText);
      return NextResponse.json(
        {
          success: false,
          message: `Error from external API: ${response.status}`,
        },
        { status: response.status }
      );
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { success: false, message: "Invalid JSON response from external API" },
        { status: 500 }
      );
    }

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in cart API route:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
