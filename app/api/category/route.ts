export async function GET() {
  try {
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/category/index?expand=children",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return an error response instead of null
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
