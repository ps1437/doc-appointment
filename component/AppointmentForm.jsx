"use client";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBookedSlots } from "../context/BookedSlotsProvider";
import { useConfig } from "../context/ConfigContext";
import { createOrder, paymentSuccess } from "../services/appointmentService";
import  Alert  from "./Alert";

export default function AppointmentForm() {
  const router = useRouter();
  const { config } = useConfig();
  const { bookedSlots, updateBookedSlots } = useBookedSlots();
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [isError, setError] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    appointmentDate: "",
    appointmentTime: "",
    issueDescription: "",
  });

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      if (formData.appointmentDate) {
        updateBookedSlots(formData.appointmentDate);
      }
    }, 500);

    debouncedUpdate();

    return () => {
      debouncedUpdate.cancel();
    };
  }, [formData.appointmentDate]);

  const handleChange = (e) => {
    setError(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setIsDateSelected(!!dateValue);

    setFormData((prevFormData) => ({
      ...prevFormData,
      appointmentDate: dateValue,
      appointmentTime: "",
    }));

    updateBookedSlots([]);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = await createOrder(formData);
      const options = {
        key: config.razorpay.key,
        amount: config.razorpay.amount,
        currency: config.razorpay.currency,
        name: config.razorpay.name,
        description: config.razorpay.description,
        order_id: orderData.orderId,
        handler: (response) => {
          setLoading(false);
          router.push(
            `/confirmation?userName=${formData.userName}&userPhone=${formData.userPhone}&appointmentDate=${formData.appointmentDate}&appointmentTime=${formData.appointmentTime}&paymentId=${response.razorpay_payment_id}`
          );
        },
      };
      new window.Razorpay(options).open();
    } catch (error) {

      const failedPaymentData = {
        ...formData,
        paymentId: formData.paymentId || "PAYMENT_FAILED_" + Date.now(),
      };
      await paymentSuccess(failedPaymentData);
      setLoading(false);
      // setError(true); 
      router.push(
        `/confirmation?userName=${formData.userName}&userPhone=${formData.userPhone}&appointmentDate=${formData.appointmentDate}&appointmentTime=${formData.appointmentTime}&paymentId=${failedPaymentData.paymentId}`
      );
    }
  };

  if (config === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-500 to-blue-600 text-white text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-500 to-blue-600 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          <div className="text-yellow-300"> {config.orgName}</div>
          {config.form.title}
        </h2>
        {isError && <Alert message="Something went wrong"/> }
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">{config.form.labels.userName}</label>
            <input
              type="text"
              name="userName"
              placeholder={config.form.placeholders.userName}
              onChange={handleChange}
              required
              className="w-full p-2  text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">{config.form.labels.userPhone}</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
              <span className="text-gray-600 mr-2">+91</span>
              <input
                type="tel"
                name="userPhone"
                placeholder={config.form.placeholders.userPhone}
                onChange={handleChange}
                required
                pattern={config.validation.userPhonePattern}
                maxLength={config.validation.userPhoneMaxLength}
                className="w-full outline-none  text-black"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700 font-semibold mb-1">{config.form.labels.appointmentDate}</label>
              <input
                type="date"
                name="appointmentDate"
                min={new Date().toISOString().split("T")[0]}
                onChange={handleDateChange}
                required
                className="w-full p-2 border  text-black border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <label className="block text-gray-700 font-semibold mb-1">{config.form.labels.appointmentTime}</label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                disabled={!isDateSelected}
                onChange={handleChange}
                required
                className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">{config.form.labels.appointmentTime}</option>
                {config?.availableSlots.map((slot) => (
                  <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                    {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">{config.form.labels.issueDescription}</label>
            <textarea
              name="issueDescription"
              placeholder={config.form.placeholders.issueDescription}
              rows="2"
              onChange={handleChange}
              className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            ></textarea>
          </div>

          <motion.button
            type="submit"
            className={`w-full bg-teal-600 cursor-pointer text-white py-3 rounded-md font-bold text-lg flex justify-center items-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></svg>
            ) : (
              config.form.button
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
