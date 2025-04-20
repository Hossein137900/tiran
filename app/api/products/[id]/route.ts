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
  