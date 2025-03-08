import { NextResponse } from "next/server";
import { db, collection, addDoc } from "../../../lib/firebaseConfig";
import twilio from "twilio";
import { serverTimestamp } from "firebase/firestore";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!; 
const twilioWhatsAppNumber = "whatsapp:+14155238886"; 

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  const { userName, userPhone, appointmentDate, appointmentTime, issueDescription , paymentId, messageType } = await req.json();

  try {
    await addDoc(collection(db, "appointments"), { userName, userPhone, appointmentDate, appointmentTime, paymentId ,  issueDescription, createdAt: serverTimestamp()   });

    const recipient = messageType === "whatsapp" ? `whatsapp:+${userPhone}` : `+91${userPhone}`;

    const messageText = `Hello ${userName}, your appointment has been successfully scheduled for ${appointmentDate} at ${appointmentTime}. We look forward to serving you. If you have any questions, feel free to reach out. Thank you!`;

    const message = await client.messages.create({
      body: messageText,
      from: messageType === "whatsapp" ? twilioWhatsAppNumber : twilioPhoneNumber,
      to: recipient,
    });

    return NextResponse.json({
      message: "Appointment booked successfully!",
      smsResult: message.sid,
    });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
