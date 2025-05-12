// Get checkout information based on address ID
export const getCheckoutInfo = async (addressId:number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("لطفا وارد حساب کاربری خود شوید");
    }

    const response = await fetch(
      `/api/cart/checkout`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`خطا در دریافت اطلاعات ارسال: ${response.status}`);
    }

    // Try to parse the response as JSON
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("خطا در پردازش پاسخ سرور");
    }

    if (!result.success) {
      throw new Error(result.message || "خطا در دریافت اطلاعات ارسال");
    }

    return result.data;
  } catch (error: any) {
    console.error("Checkout Info Error:", error);
    throw new Error(error.message || "خطا در دریافت اطلاعات ارسال");
  }
};

// Add item to cart
export const addToCart = async (varietyId: number, quantity: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("لطفا وارد حساب کاربری خود شوید");
    }

    const response = await fetch(
      "/api/cart/index",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variety_id: varietyId.toString(),
          quantity: quantity.toString(),
          unit_id: 1,
        }),
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`خطا در افزودن به سبد خرید: ${response.status}`);
    }

    // Try to parse the response as JSON
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("خطا در پردازش پاسخ سرور");
    }

    if (!result.success) {
      throw new Error(result.message || "خطا در افزودن به سبد خرید");
    }

    return result.data;
  } catch (error: any) {
    console.error("Add to Cart Error:", error);
    throw new Error(error.message || "خطا در افزودن به سبد خرید");
  }
};

// Complete checkout process
export const completeCheckout = async (
  addressId: number,
  sendMethodId: number,
  payMethodId: number,
  receiveDate: string
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("لطفا وارد حساب کاربری خود شوید");
    }

    const response = await fetch(
      "/api/cart/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address_id: addressId,
          send_method_id: sendMethodId,
          pay_method_id: payMethodId,
          callback_url: "https://example.com",
          receive_date: receiveDate,
          description: "توضیحات",
          credit_deduction: 1,
        }),
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`خطا در تکمیل سفارش: ${response.status}`);
    }

    // Try to parse the response as JSON
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("خطا در پردازش پاسخ سرور");
    }

    if (!result.success) {
      throw new Error(result.message || "خطا در تکمیل سفارش");
    }

    return result.data;
  } catch (error: any) {
    console.error("Complete Checkout Error:", error);
    throw new Error(error.message || "خطا در تکمیل سفارش");
  }
};
