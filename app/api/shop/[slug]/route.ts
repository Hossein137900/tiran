export async function GET(
  request: Request,
  { params }: { params?: { slug?: string } }
) {
  try {
    if (!params || !params.slug) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing product slug" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const productSlug = params.slug;

    const response = await fetch(
      `https://tiran.shop.hesabroclub.ir/api/web/shop-v1/product/view?slug=${productSlug}&expand=varieties`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();
    console.log(data, "product detail data in api route");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
