"use client";
import AppointmentForm from "../component/AppointmentForm";
import { BookedSlotsProvider } from "../context/BookedSlotsProvider";

export default function Home() {
  return (
      <BookedSlotsProvider>
        <AppointmentForm />
      </BookedSlotsProvider>
  )
}
