import { jsPDF } from 'jspdf';
import { Appointment, Doctor } from '../types';

export interface PrescriptionData {
    appointment: Appointment;
    doctor?: Doctor;
    medications: string;
    notes: string;
}

export const generatePrescriptionPDF = (data: PrescriptionData): Blob => {
    const { appointment, doctor, medications, notes } = data;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HYNO HEALTH', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Smart Healthcare Management System', 20, 32);

    // Doctor Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(appointment.doctorName || 'Dr. Medical Professional', 20, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(doctor?.specialization || 'General Physician', 20, 60);
    doc.text(doctor?.qualification || 'MBBS, MD', 20, 65);
    if (doctor?.phone) doc.text(`Phone: ${doctor.phone}`, 20, 70);

    // Date & Rx ID
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`, 150, 55);
    doc.text(`ID: PRE-${appointment.id.substring(0, 8).toUpperCase()}`, 150, 60);

    // Horizontal Line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, 190, 75);

    // Patient Info
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Name:', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(appointment.patientName, 50, 85);

    doc.setFont('helvetica', 'bold');
    doc.text('Type:', 130, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(appointment.type.toUpperCase(), 150, 85);

    // Rx Symbol
    doc.setFontSize(30);
    doc.setTextColor(37, 99, 235);
    doc.text('Rx', 20, 105);

    // Medications Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Medications', 20, 115);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitMeds = doc.splitTextToSize(medications || 'No medications prescribed', 170);
    doc.text(splitMeds, 20, 122);

    // Notes Section
    const medsHeight = splitMeds.length * 5;
    const notesStart = 130 + medsHeight;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Notes', 20, notesStart);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(notes || 'N/A', 170);
    doc.text(splitNotes, 20, notesStart + 7);

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 270, 190, 270);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated prescription from HYNO Health System.', 105, 278, { align: 'center' });
    doc.text('Please verify with your physician if you have any questions.', 105, 282, { align: 'center' });

    return doc.output('blob');
};

export const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
