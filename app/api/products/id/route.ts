import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Product from "@/models/product";
import Category from "@/models/category";
export async function GET(request: Request) {
  try {
    const id = request.url.split("/").pop();
    await connect();
    
    const product = await Product.findById(id).populate({
          path: 'categoryId',
          model: Category,
          select: 'title'
        });
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
     await connect();
    const id = request.headers.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    
    }
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  }catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {
  try {
   
    await connect();
    const id = request.headers.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }
    console.log(id);
    const body = await request.json();
    console.log(body,"body");
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating product", error },
      { status: 500 }
    );
  }
}