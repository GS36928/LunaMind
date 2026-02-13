import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = (body.amount * 100 || 1000).toString(); // თეთრებში
    const currency = body.currency || "GEL";
    const order_desc = body.order_desc || "Lesson payment";

    const merchant_id = process.env.FLITT_MERCHANT_ID!;
    const secret = process.env.FLITT_SECRET_KEY!;
    const server_callback_url = `${process.env.NEXTAUTH_URL}/api/flitt/callback`;
    
    // Support both body.extraData and direct body properties for backward compatibility
    const extraData = {
      lessonId: body.extraData?.lessonId || body.lessonId,
      studentId: body.extraData?.studentId || body.studentId,
      teacherProfileId: body.extraData?.teacherProfileId || body.teacherProfileId,
      price: body.extraData?.price || body.price,
    };
    
    // Encode lessonId and studentId in order_id so we can retrieve them in callback
    // Format: order_TIMESTAMP_LESSONID_STUDENTID (last 8 chars of each to keep it short)
    const hasRequiredFields = extraData.lessonId && extraData.studentId && extraData.teacherProfileId;
    const order_id = hasRequiredFields 
      ? `order_${Date.now()}_${extraData.lessonId.slice(-8)}_${extraData.studentId.slice(-8)}`
      : `order_${Date.now()}`;

    // Build params object (excluding signature and empty values)
    const params: Record<string, string> = {
      amount,
      currency,
      merchant_id: merchant_id.toString(),
      order_desc,
      order_id,
      server_callback_url,
    };

    // Filter out empty values (following Flitt's PHP example)
    const filteredParams = Object.entries(params)
      .filter(([, value]) => value && value.toString().trim().length > 0)
      .reduce((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>);

    // Sort alphabetically by key
    const sortedKeys = Object.keys(filteredParams).sort();

    // Build signature string: secret first, then params in alphabetical order
    const signatureString = [secret, ...sortedKeys.map(key => filteredParams[key])].join('|');
    
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex")
      .toLowerCase();

    // Build request body
    const requestBody: {
      request: {
        server_callback_url: string;
        order_id: string;
        currency: string;
        merchant_id: number;
        order_desc: string;
        amount: string;
        signature: string;
      };
    } = {
      request: {
        server_callback_url,
        order_id,
        currency,
        merchant_id: parseInt(merchant_id, 10),
        order_desc,
        amount,
        signature,
      },
    };

    // NOTE: Including merchant_data or reservation_data causes signature validation to fail
    // Solution: lessonId and studentId are encoded in order_id, callback will extract them

    const flittRes = await fetch("https://pay.flitt.com/api/checkout/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await flittRes.json();

    if (data?.response?.checkout_url) {
      return NextResponse.json({
        success: true,
        checkoutUrl: data.response.checkout_url,
        orderId: order_id,
      });
    } else {
      console.error("Flitt API error:", data);
      return NextResponse.json(
        { error: "Failed to create checkout URL", details: data },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("createOrder error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
