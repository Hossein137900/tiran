import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Blog from "@/models/blog";
export async function DELETE(request: Request) {
    try {
      const id = request.headers.get("id"); 
      await connect();
  
      const blog = await Blog.findByIdAndDelete(id);
  
      if (!blog) {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        { message: "Blog deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting blog:", error);
      return NextResponse.json(
        { message: "Error deleting blog" },
        { status: 500 }
      );
    }
  }
  export async function PATCH(request: Request) {
    try {
      const id = request.headers.get("id");
      const { title, content, seoTitle, image, description, tags } =
        await request.json();
      await connect();
  
      const blog = await Blog.findByIdAndUpdate(
        id,
        { title, content, seoTitle, image, description, tags },
        { new: true }
      );
  
      if (!blog) {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        { message: "Blog updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating blog:", error);
      return NextResponse.json(
        { message: "Error updating blog" },
        { status: 500 }
      );
    }
  }