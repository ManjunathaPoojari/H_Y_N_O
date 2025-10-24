// src/pages/Appointment.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentSuccess from "../components/AppointmentSuccess";
import axios from "axios";
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, hospitals, currencySymbol, user, bookAppointment } =
    useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    name: user?.name || "",
    age: user?.age || "",
    contact: user?.phone || "",
    email: user?.email || "",
    reason: "",
  });
  const [consultationType, setConsultationType] = useState("In-Person");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardDetails, setCardDetails] = useState({
    number: "4111111111111111",
    name: "John Doe",
    expiry: "12/25",
    cvv: "123",
  });
  const [upiId, setUpiId] = useState("john@upi");
  const [upiOtp, setUpiOtp] = useState("123456");
  const [walletProvider, setWalletProvider] = useState("Paytm");
  const [success, setSuccess] = useState(false);
  const [showSMSSuccess, setShowSMSSuccess] = useState(false);

  // New features state
  const [questionnaire, setQuestionnaire] = useState({
    symptoms: "",
    duration: "",
    severity: "Mild",
    allergies: "",
    medications: "",
    previousConditions: "",
  });
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [followUpNeeded, setFollowUpNeeded] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [reminderPreference, setReminderPreference] = useState("Email");
  const [preparationChecklist, setPreparationChecklist] = useState({
    stableInternet: false,
    quietSpace: false,
    cameraReady: false,
    microphoneReady: false,
  });

  // Load doctor info from context if docId is provided
  useEffect(() => {
    if (!doctors.length) return;
    if (docId) {
      const doc = doctors.find((d) => d._id === docId || d.id === docId);
      setDocInfo(doc);
      setSelectedDoctor(doc);
    }
  }, [docId, doctors]);

  // Generate next 7 days slots
  useEffect(() => {
    if (!selectedDoctor) return;

    const slots = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const daySlots = [];
      let hour = 10;
      let minute = 0;
      while (hour < 21) {
        const slotTime = new Date(currentDate);
        slotTime.setHours(hour, minute, 0, 0);
        daySlots.push({
          datetime: new Date(slotTime),
          time: slotTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        minute += 30;
        if (minute === 60) {
          minute = 0;
          hour += 1;
        }
      }
      slots.push(daySlots);
    }
    setDocSlots(slots);
  }, [selectedDoctor]);

  // Send SMS confirmation
  const sendSMS = async () => {
    if (!user?.phone || !selectedSlot) return;
    try {
      await fetch("http://localhost:8080/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.phone,
          message: `Your appointment with Dr. ${selectedDoctor.name} on ${selectedSlot.datetime.toDateString()} at ${selectedSlot.time} is confirmed!`,
        }),
      });
      setShowSMSSuccess(true);
    } catch (err) {
      console.error("SMS failed", err);
    }
  };

  // Handle Next / Confirm button
  const handleNext = async () => {
    if (step === 7) {
      // Check if slot is selected
      if (!selectedSlot) {
