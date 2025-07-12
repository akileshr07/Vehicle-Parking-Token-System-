import React from "react";

const QRCodeImage = ({ qrData, size = "md" }) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center`}
    >
      {qrData ? (
        <img
          src="/src/components/scan_me_qr_code.jpg"
          alt="QR Code"
          className="object-contain w-full h-full p-2"
        />
      ) : (
        <p className="text-xs text-gray-500 text-center">
          QR Code not available
        </p>
      )}
    </div>
  );
};

export default QRCodeImage;
