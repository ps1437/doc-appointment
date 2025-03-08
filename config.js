const CONFIG = {
  orgName: "BodyRestet",
  confirmation: {
    supportAddress: "123 Wellness Street, Health City, India",
    supportPhone: "+91 98765 43210",
    supportEmail: "support@bodyreset.com",
    confirmationText: "Your appointment has been successfully scheduled.",
    stayHealthyMessage: "If you have any questions, please contact our support team. Stay healthy! 💙",
  },
  header: {
    title: "Appointment with",
    subtitle: "Book your slot and start your wellness journey",
  },
  form: {
    title: "Book an Appointment",
    labels: {
      userName: "Patient Name",
      userPhone: "Mobile Number",
      appointmentDate: "Appointment Date",
      appointmentTime: "Available Timings",
      issueDescription: "Reason for Appointment",
    },
    placeholders: {
      userName: "Enter your name",
      userPhone: "Enter your mobile number",
      issueDescription: "Briefly describe your health concern...",
    },
    button: "Pay ₹99 and Book",
  },
  validation: {
    userPhonePattern: "[6-9]{1}[0-9]{9}",
    userPhoneMaxLength: 10,
  },
  razorpay: {
    key: "YOUR_RAZORPAY_KEY",
    amount: 99,
    currency: "INR",
    name: "Doctor Appointment",
    description: "Consultation Fee",
  },
  availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

};



export default CONFIG;  