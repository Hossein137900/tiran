import connect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Blog from "@/models/blog";
import jwt from "jsonwebtoken";
import User from "@/models/user";

export async function GET() {
  try {
    await connect();
    const blogs = await Blog.find().populate({
      path: "userId",
      model: User,
      select: "username",
    });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { message: "Error fetching blogs" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  const token = request.headers.get("token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  interface JwtPayloadWithId {
    id: string;
  }
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET || "msl"
  ) as JwtPayloadWithId;
  if (!decodedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = decodedToken.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title, description, image, tags, seoTitle, content } =
    await request.json();
  try {
    await connect();
    const newBlog = new Blog({
      title,
      seoTitle,
      content,
      tags,
      description,
      image,
      userId,
      readTime: Math.ceil(content.split(" ").length / 200),
    });

    await newBlog.save();
    return NextResponse.json(
      { message: "Blog created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { message: "Error creating blog" },
      { status: 500 }
    );
  }
}
