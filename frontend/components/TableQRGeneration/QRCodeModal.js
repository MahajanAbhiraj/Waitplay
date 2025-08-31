"use client"; // Ensures it runs on the client in Next.js App Router

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const QRCodeModal = ({ qrData, onClose }) => {
  const contentRef = useRef(null);

  const extractTableId = (qrData) => {
    try {
      const url = new URL(qrData);
      return url.searchParams.get("tableId") || "Unknown";
    } catch (error) {
      return "Invalid QR Data";
    }
  };

  const tableId = extractTableId(qrData);

  const handleDownloadPDF = async () => {
    const content = contentRef.current;

    const canvas = await html2canvas(content, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const cw = canvas.width;
    const ch = canvas.height;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [200, 300],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 200, 300);
    pdf.save("QRCode.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white p-4 rounded-lg"
        style={{ width: "300px", maxHeight: "80vh", overflowY: "auto" }}
      >
        <div
          ref={contentRef}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            width: "250px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "5px",
              color: "#FFD700",
            }}
          >
            WAITPLAY
          </h1>

          <p style={{ fontSize: "12px", marginBottom: "15px" }}>
            Every Wait Is Worth It!
          </p>

          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#ffffff",
            }}
          >
            Table ID: {tableId}
          </p>

          <QRCode
            value={qrData}
            size={150}
            style={{
              margin: "0 auto",
              backgroundColor: "#fff",
              padding: "10px",
            }}
          />

          <p style={{ fontSize: "12px", marginTop: "15px", color: "#FFD700" }}>
            Scan · Order · Win
          </p>
          <p style={{ fontSize: "12px", marginTop: "5px", color: "#FFD700" }}>
            Scan · Order · Win
          </p>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleDownloadPDF} // Fixed: Un-commented download function
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
