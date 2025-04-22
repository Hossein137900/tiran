import connect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Blog from "@/models/blog";
export async function GET(request: Request) {
  try {
    const id = request.url.split("/").pop();
    console.log(id)
    await connect();

    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);

    return NextResponse.json(
      { message: "Error fetching blog" },
      { status: 500 }
    );
  }
}



