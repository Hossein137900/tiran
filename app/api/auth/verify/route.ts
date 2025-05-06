export async function POST(request: Request) {
  const body = await request.json();
  const { sms_code, username, application } = body;
  try {
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/site/sign-in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sms_code, username, application }),
      }
    );

    const data = await response.json();
    console.log(data , "data")

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.message }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
