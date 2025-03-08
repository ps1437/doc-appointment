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
