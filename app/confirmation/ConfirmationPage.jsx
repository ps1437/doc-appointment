"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaCalendarAlt, FaClock, FaReceipt } from "react-icons/fa";
import { useConfig } from "../../context/ConfigContext";

export default function ConfirmationPage() {
    const { config } = useConfig() || {};
    const confirmation = config?.confirmation || null;
    const searchParams = useSearchParams();
    const userName = searchParams.get("userName") || "Guest";
    const appointmentDate = searchParams.get("appointmentDate") || "Unknown Date";
    const appointmentTime = searchParams.get("appointmentTime") || "Unknown Time";
    const paymentId = searchParams.get("paymentId") || "Not Available";

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        window.history.pushState(null, "", window.location.href);

        const handleBackButton = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-400 to-blue-500 px-6 py-10">
            <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg w-full text-center">
                <h2 className="text-2xl font-bold text-teal-600 mb-4">Appointment Confirmed! ✅</h2>
                <p className="text-lg text-gray-700">
                    Thank you, <span className="font-bold">{userName}</span>! {confirmation?.confirmationText}
                </p>

                <div className="mt-5 space-y-4 text-gray-700">
                    <div className="flex items-center justify-start space-x-3 border-b pb-2">
                        <FaCalendarAlt className="text-teal-500 text-lg" />
                        <p className="text-md">
                            <span className="font-semibold">Date:</span> {appointmentDate}
                        </p>
                    </div>
                    <div className="flex items-center justify-start space-x-3 border-b pb-2">
                        <FaClock className="text-teal-500 text-lg" />
                        <p className="text-md">
                            <span className="font-semibold">Time:</span> {appointmentTime}
                        </p>
                    </div>
                    <div className="flex items-center justify-start space-x-3">
                        <FaReceipt className="text-teal-500 text-lg" />
                        <p className="text-md">
                            <span className="font-semibold">Payment ID:</span> {paymentId}
                        </p>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-6 text-center">{confirmation?.stayHealthyMessage}</p>
                <p className="text-sm text-gray-700 mt-2 text-center">📍 Address: {confirmation?.supportAddress}</p>
                <p className="text-sm text-gray-700 mt-1 text-center">📞 Phone: {confirmation?.supportPhone}</p>
                <p className="text-sm text-gray-700 mt-1 text-center">✉️ Email: {confirmation?.supportEmail}</p>
            </div>
        </div>
    );
}
