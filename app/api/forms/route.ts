
import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import forms from "@/models/forms";

const NEXT_BASE_API_URL = process.env.NEXT_BASE_API_URL

export async function GET() {
    if (!NEXT_BASE_API_URL) {
        return new NextResponse('Missing NEXT_BASE_API_URL env variable', { status: 500 })
    }
    await connectToDatabase();
    if (!connectToDatabase) {
        return new NextResponse('Unable to connect to database', { status: 500 })
    }
    try {
        const formDocuments = await forms.find();
        return new NextResponse(JSON.stringify(formDocuments), { status: 200 })

    } catch (error) {
        console.error('Error fetching colors:', error);
        return new NextResponse('Error fetching colors', { status: 500 });
    }

}


export async function POST(req: NextRequest) {
    if (!NEXT_BASE_API_URL) {
        return new NextResponse('Missing NEXT_BASE_API_URL env variable', { status: 500 })
    }
    await connectToDatabase();
    if (!connectToDatabase) {
        return new NextResponse('Unable to connect to database', { status: 500 })
    }
    try {
        const formData = await req.formData();
        const name = formData.get('name');
        const phoneNumber = formData.get('phoneNumber');
        const gustes = formData.get('gustes');
        const weddingdate = new Date(formData.get('weddingDate') as string);
        const reserveddate = new Date(formData.get('reservedDate') as string);
        const menue = formData.get('menue');
        const newForm = new forms({
            name,
            phoneNumber,
            gustes,
            weddingdate,
            reserveddate,
            menue
        });
        console.log(newForm)
        await newForm.save();
        return new NextResponse(JSON.stringify(newForm), { status: 200 })


    } catch (error) {
        console.error('Error fetching data:', error);
        return new NextResponse('Error fetching data', { status: 500 });
    }
}
