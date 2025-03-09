"use server";
import { NextResponse } from "next/server";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req) {
  try {
    const data = await req.json();
    const callbackUrl = `${baseUrl}/api/paystatus?mobileNumber=${encodeURIComponent(data.mobileNumber)}&userName=${encodeURIComponent(data.userName)}&appointmentTime=${encodeURIComponent(data.appointmentTime)}&appointmentDate=${encodeURIComponent(data.appointmentDate)}`;
    const apidata = {
      merchantId: process.env.NEXT_API_MERCHANT_ID,
      merchantTransactionId: data.merchantTransactionId,
      merchantUserId: data.merchantUserId,
      amount: Math.round(+data.amount * 100),
      redirectUrl: callbackUrl,
      redirectMode: "POST",
      callbackUrl: callbackUrl,
      paymentInstrument: {
        type: "UPI_QR",
      },
    };
    const data2 = JSON.stringify(apidata);
    const base64data = Buffer.from(data2).toString("base64");


    const hash = SHA256(base64data + "/pg/v1/pay" + process.env.NEXT_API_MERCHANT_KEY).toString(Hex);

    const verify = hash + "###" + process.env.NEXT_API_MERCHANT_VERSION;

    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      { request: base64data },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": verify,
        },
      }
    );


    
    return NextResponse.json({ message: "Success", data: response.data.data });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
