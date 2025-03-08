import { createContext, useContext, useState } from "react";
import { fetchBookedSlots } from "../services/appointmentService";

const BookedSlotsContext = createContext();

export const BookedSlotsProvider = ({ children }) => {
  const [bookedSlots, setBookedSlots] = useState([]);

  const updateBookedSlots = async (date) => {
    const slots = await fetchBookedSlots(date);
    console.log("slots", slots);
    setBookedSlots(slots);
  };

  return (
    <BookedSlotsContext.Provider value={{ bookedSlots, updateBookedSlots }}>
      {children}
    </BookedSlotsContext.Provider>
  );
};

export const useBookedSlots = () => useContext(BookedSlotsContext);
