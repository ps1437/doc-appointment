import axios from "axios";
import { collection, db, getDocs, query, where } from "../lib/firebaseConfig";

export const fetchBookedSlots = async (date) => {
  const q = query(collection(db, "appointments"), where("appointmentDate", "==", date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().appointmentTime);
};

export const createOrder = async (formData) => {
  const { data } = await axios.post("/api/create-order", formData);
  return data;
};

export const paymentSuccess = async (formData) => {
  const { data } = await axios.post("/api/payment-success", formData);
  return data;
};
export const createPhonePayPayment = async (formData) => {
  try {
    return await axios.post("/api/payrequest", {
      merchantTransactionId: process.env.NEXT_PUBLIC_MERCHANT_TRANSACTION_ID,
      merchantUserId: process.env.NEXT_PUBLIC_MERCHANT_USER_ID,
      mobileNumber: formData.mobileNumber || process.env.NEXT_PUBLIC_MOBILE_NUMBER, // Use user input if provided
      amount: process.env.NEXT_PUBLIC_AMOUNT,
      userName: formData.userName,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      issueDescription: formData.issueDescription,
    });
  } catch (error) {
    console.error("Error in creating phone pay payment:", error);
    throw error; // Re-throw for handling in calling function
  }
};


