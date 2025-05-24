import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    console.log("Request body:", body);
    
    // Validate required fields
    if (!body.variety_id || !body.quantity) {
      return NextResponse.json(
        { 
          success: false, 
          message: "variety_id and quantity are required" 
        },
        { status: 422 }
      );
    }

    // Get the authorization token from the request headers
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    // Clean the token (remove 'Bearer ' if it exists)
    const token = authHeader.replace(/^Bearer\s+/i, '');
    
    console.log("Cleaned token:", token ? "exists" : "missing");
    console.log("Sending to external API:", body);

    // Forward the request to the external API
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/cart/index",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log("External API response status:", response.status);

    // Get response text first to debug
    const responseText = await response.text();
    console.log("External API raw response:", responseText);

    // Check if the response is OK
    if (!response.ok) {
      console.error("External API Error:", responseText);
      
      // Try to parse error response
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        return NextResponse.json(
          {
            success: false,
            message: `External API error: ${response.status}`,
          },
          { status: response.status }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: errorData.message || `Error from external API: ${response.status}`,
          data: errorData.data || null,
        },
        { status: response.status }
      );
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { success: false, message: "Invalid JSON response from external API" },
        { status: 500 }
      );
    }

    console.log("External API parsed response:", data);

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
