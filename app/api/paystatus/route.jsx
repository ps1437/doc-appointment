import axios from "axios";
import sha256 from "crypto-js/sha256";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseConfig";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 
const twilioWhatsAppNumber = "whatsapp:+14155238886"; 
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const client = twilio(accountSid, authToken);
export async function POST(req) {
  try {
    let data;

    const { searchParams } = new URL(req.url);
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await req.json(); // Parse JSON request body
    } else {
      const formData = await req.formData(); // Parse form data
      data = Object.fromEntries(formData.entries()); // Convert FormData to an object
    }

    // Extract values from request body (data)
    const merchantId = data.merchantId || "";
    const transactionId = data.transactionId || "";
    const amount = data.amount || "";
    const providerReferenceId = data.providerReferenceId || "";

    if (!merchantId || !transactionId) {
      return NextResponse.json({ error: "Missing merchantId or transactionId" }, { status: 400 });
    }

    // Extract values from searchParams (callbackData)
    const appointmentDate = searchParams.get("appointmentDate") || "";
    const userName = searchParams.get("userName") || "";
    const appointmentTime = searchParams.get("appointmentTime") || "";
    const mobileNumber = searchParams.get("mobileNumber") || "";
    const issueDescription = searchParams.get("issueDescription") || "";

    // Validate environment variables
    if (!process.env.NEXT_API_MERCHANT_KEY || !process.env.NEXT_API_MERCHANT_VERSION) {
      return NextResponse.json({ error: "Missing server environment variables" }, { status: 500 });
    }

    // Generate checksum
    const st = `/pg/v1/status/${merchantId}/${transactionId}${process.env.NEXT_API_MERCHANT_KEY}`;
    const dataSha256 = sha256(st).toString();
    const checksum = `${dataSha256}###${process.env.NEXT_API_MERCHANT_VERSION}`;

    // PhonePe API Request
    const response = await axios.get(
      `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );

    // Store transaction details in Firestore
    await addDoc(collection(db, "appointments"), {
      transactionId,
      userName,
      mobileNumber,
      appointmentDate,
      appointmentTime,
      status: response.data.code,
      amount,
      paymentURL: response.data.data?.instrumentResponse?.redirectInfo?.url || null,
      issueDescription,
      createdAt: serverTimestamp(),
    });

    // Redirect based on payment status
    if (response.data.code === "PAYMENT_SUCCESS") {
    
      const messageType = "sms";

      const recipient = messageType === "whatsapp" ? `whatsapp:+${mobileNumber}` : `+91${mobileNumber}`;

      const messageText = `Hello ${userName}, your appointment has been successfully scheduled for ${appointmentDate} at ${appointmentTime}. Payment of ₹{amount} received. Your Payment ID: ${transactionId}. If you have any questions, feel free to reach out. Thank you!`;

      const message = await client.messages.create({
        body: messageText,
        from: messageType === "whatsapp" ? twilioWhatsAppNumber : twilioPhoneNumber,
        to: recipient,
      });
  
      return NextResponse.redirect(
        `${baseUrl}/success?transactionId=${transactionId}&appointmentDate=${appointmentDate}&userName=${userName}&amount=${amount}&providerReferenceId=${providerReferenceId}&appointmentTime=${appointmentTime}`,
        { status: 301 }
      );
    } else {
      return NextResponse.redirect(
        `${baseUrl}/failure?transactionId=${transactionId}&amount=${amount}&providerReferenceId=${providerReferenceId}`,
        { status: 301 }
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
