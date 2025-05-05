import { NextRequest, NextResponse } from "next/server";

interface CommentChild {
  id: number;
  name: string;
  title: string;
  comment: string;
  can_edit: boolean;
  childs: CommentChild[];
}

interface CommentItem {
  id: number;
  name: string;
  title: string;
  comment: string;
  can_edit: boolean;
  childs: CommentChild[];
}

interface CommentResponse {
  success: boolean;
  data: {
    items: CommentItem[];
    _links: {
      self: { href: string };
      first: { href: string };
      last: { href: string };
    };
    _meta: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number;
    };
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get the product slug from the URL query parameters
    const searchParams = request.nextUrl.searchParams;
    const productSlug = searchParams.get("product_slug");

    // Check if product_slug is provided
    if (!productSlug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    // Fetch comments from the external API
    const apiUrl = `https://tiran.shop.hesabroclub.ir/api/web/shop/product/get-comments?product_slug=${productSlug}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        // Add any required authorization headers if needed
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      cache: "no-store", // Disable caching to always get fresh data
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch comments from external API" },
        { status: response.status }
      );
    }

    const commentsData: CommentResponse = await response.json();

    // Return the comments data
    return NextResponse.json(commentsData);
  } catch (error) {
    console.error("Error fetching product comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get authorization token from request headers
    const token = request.headers.get("Authorization");

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!body.product_id || !body.comment) {
      return NextResponse.json(
        { error: "Product ID and comment are required" },
        { status: 400 }
      );
    }

    // Prepare the request payload
    const commentData = {
      product_id: body.product_id,
      rate: body.rate || 5, // Default to 5 if not provided
      name: body.name || "", // Optional
      title: body.title || "", // Optional
      comment: body.comment,
      parent_id: body.parent_id || null, // Optional, for replies
    };

    // Send the comment to the external API
    const apiUrl =
      "https://tiran.shop.hesabroclub.ir/api/web/shop/product/comment";

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: "Failed to submit comment to external API",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error submitting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
