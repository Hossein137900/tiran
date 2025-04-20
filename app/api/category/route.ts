import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Category from "@/models/category";

export async function GET() {
  try {
    await connect();
    const categories = await Category.find();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, children } = await request.json();
    await connect();

    const newCategory = new Category({
      title,
      children: children || [],
    });

    await newCategory.save();

    return NextResponse.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Error creating category" },
      { status: 500 }
    );
  }
}
