export async function POST(request: Request) {
  const body = await request.json();
  const { username, sent_sms, application } = body;
  try {
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/site/pre-sign-in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, sent_sms, application }),
      }
    );

    const data = await response.json();

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
