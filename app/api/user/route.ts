import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const header = req.headers.get("Authorization");
  const token = header?.split(" ")[1]

  console.log(token)
  try {
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/profile?expand=addresses",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log(data)

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data.message || "خطا در دریافت اطلاعات حساب",
          details: data,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Account fetch error:", error);
    return new Response(
      JSON.stringify({
        error: "خطای سرور داخلی",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
