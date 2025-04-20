import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Product from "@/models/product";
import Category from "@/models/category";

export async function GET() {
  try {
    await connect();
    const products = await Product.find().populate({
      path: 'categoryId',
      model: Category,
      select: 'title'
    });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    await connect();

    const newProduct = new Product({
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      image: formData.get("image"),
      properties: JSON.parse(formData.get("properties")?.toString() || "{}"),
      colors: JSON.parse(formData.get("colors")?.toString() || "{}"),
      videoes: JSON.parse(formData.get("videoes")?.toString() || "[]"),
      thumbnails: JSON.parse(formData.get("thumbnails")?.toString() || "[]"),
      categoryId: formData.get("categoryId"),
      categoryChildren: formData.get("categoryChildren")?.toString() || "",
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}
