import connect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Cart from "@/models/cart";
import * as jwt from "jsonwebtoken";
import User from "@/models/user";
import Product from "@/models/product";
export async function GET() {
  try {
    await connect();
    const carts = await Cart.find()
      .populate({
        path: 'userId',
        model: User,
        select: 'username'
      })
      .populate({
        path:'items.productId',
        model: Product,
        select: 'title'
      });
      
    return NextResponse.json({ carts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all carts:", error);
    return NextResponse.json(
      { message: "Error fetching all carts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connect();
    const formData = await request.formData();
    const token = request.headers.get('token')
    console.log(token)
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, 'msl') as { id: string };
    console.log(decodedToken)
    const userId = decodedToken.id;
    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const newCart = new Cart({
    userId:userId,
      items: JSON.parse(formData.get("items") as string),
      path: formData.get("paymentMethod"),
      image: formData.get("receiptImageUrl") as string,
      totalPrice: parseInt(formData.get("totalPrice") as string)
    });
    console.log(newCart)
    await newCart.save();

    return NextResponse.json(
      { message: "Cart created successfully", cart: newCart },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json(
      { message: "Error creating cart"},
      { status: 500 } 
    );
  }
}
