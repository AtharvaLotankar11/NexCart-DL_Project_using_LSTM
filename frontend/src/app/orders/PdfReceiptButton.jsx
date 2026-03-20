"use client";
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText } from 'lucide-react';

export default function PdfReceiptButton({ order }) {
  const generateOfficialReceiptPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text("NexCart Official Receipt", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Order ID: #${order.razorpay_order_id?.split('_')[1] || '0xFFFF'}`, 14, 30);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 14, 35);
    doc.text(`Status: ${order.status}`, 14, 40);
    
    // Table
    const tableColumn = ["Item Description", "Qty", "Unit Price", "Total"];
    const tableRows = [];

    let grandTotal = 0;
    order.items?.forEach(item => {
      const itemData = [
        item.product?.name || "Product",
        item.quantity,
        `INR ${parseFloat(item.price_at_purchase).toLocaleString()}`,
        `INR ${(item.quantity * parseFloat(item.price_at_purchase)).toLocaleString()}`
      ];
      grandTotal += item.quantity * parseFloat(item.price_at_purchase);
      tableRows.push(itemData);
    });

    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
    });

    const finalY = doc.lastAutoTable.finalY || 50;
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text(`Total Amount: INR ${grandTotal.toLocaleString()}`, 14, finalY + 10);
    
    doc.setFontSize(8);
    doc.text("Thank you for choosing NexCart AI Hub.", 14, finalY + 25);
    doc.text("This receipt is automatically generated and recorded securely.", 14, finalY + 30);
    
    // Open in new tab
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <button onClick={generateOfficialReceiptPDF} className="mt-4 flex items-center justify-center p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100" title="View Official Receipt">
      <FileText className="w-4 h-4" />
    </button>
  );
}
