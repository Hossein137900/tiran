import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Cart from "@/models/cart";
import * as jwt from "jsonwebtoken";
import User from "@/models/user";
import Product from "@/models/product";
export async function GET(request: Request) {
  try {
    await connect();
    const token = request.headers.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "msl") as {
      id: string;
    };
    const userId = decodedToken.id;
 console.log(userId)
    const carts = await Cart.find({ userId:userId })
      .populate({
      path: "userId",
      model: User,
      select: "username  phoneNumber",
    })
    .populate({
      path: "items.productId",
      model: Product,
      select: "title price",
    })
    .exec();
   

    return NextResponse.json({ carts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { message: "Error fetching cart" },
      { status: 500 }
    );
  }
}
export async function PATCH (request: Request) {
  try {
    await connect();
    const id = request.headers.get("id");
   const body = await request.json();
    console.log(body)
    const cart = await Cart.findOneAndUpdate(
      { _id: id }, 
      { 
        status: body.status
      },
      { new: true }
    );
    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { message: "Error updating cart" },
      { status: 500 }
    );
  }
}