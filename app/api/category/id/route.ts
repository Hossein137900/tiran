import connect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Category from "@/models/category";

export async function GET(request: Request) {
  try {
    const id = request.headers.get("id");
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ category }, { status: 200 });
    }catch (error) {
      console.error("Error fetching category:", error);
        return NextResponse.json(
          { message: "Error fetching category" },
          { status: 500 }
        );
      }
    }   

export async function DELETE(request: Request) {
    try {
      const id = request.headers.get("id");
      await connect();
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    }catch (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json(
        { message: "Error deleting category" },
        { status: 500 }
      );
    }
  }

export async function PATCH(request: Request) {
    try {
      const id = request.headers.get("id");
      const { name ,children } = await request.json();
      await connect();
      const category = await Category.findByIdAndUpdate(id, { name ,children });
      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
      return NextResponse .json({ message: "Category updated successfully" }, { status: 200 });
    }
    catch (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
        { message: "Error updating category" },
        { status: 500 }
      );
    }
}