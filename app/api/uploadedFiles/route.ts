import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongoose";
import images from "@/models/images";

const NEXT_BASE_API_URL = process.env.NEXT_BASE_API_URL;

export async function GET() {
  if (!NEXT_BASE_API_URL) {
    return new NextResponse("Missing NEXT_BASE_API_URL env variable", {
      status: 500,
    });
  }
  await connect();
  if (!connect) {
    return new NextResponse("Unable to connect to database", { status: 500 });
  }
  try {
    const allImages = await images.find();
    return new NextResponse(JSON.stringify(allImages), { status: 200 });
  } catch (error) {
    return new NextResponse("Error fetching image documents" + error, {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { files } = await req.json();

    const newImages = files.map(
      (file: { name: string; url: string; type: string }) => ({
        name: file.name,
        url: file.url,
        type: file.type,
      })
    );

    const insertedImages = await images.insertMany(newImages);

    return new NextResponse(JSON.stringify(insertedImages), { status: 200 });
  } catch (error) {
    console.error("Error saving image document:", error);
    return new NextResponse("Error saving image document", { status: 500 });
  }
}
