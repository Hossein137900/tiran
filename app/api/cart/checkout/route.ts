import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("address_id");
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const url = `https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/cart/checkout?expand=receives&address_id=${addressId}`;
    console.log(url);
    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

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

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in checkout info API route:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body, "body");
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/cart/checkout",
      {
        method: "POST",
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

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in checkout API route:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
