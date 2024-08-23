import axios from "axios";
import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apis from "../../api/apis";
import Swal from "sweetalert2";

const QRCodeScanner = () => {
  const [data, setData] = useState(null);
  const [scanned, setScanned] = useState(false);

  const handleScan = (result) => {
    if (result && !scanned) {
      setScanned(true);
      Swal.fire({
        title: 'Fetching...',
        // text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        showConfirmButton: false,
        // icon: 'success',
        didOpen: () => {
          Swal.showLoading();
        }
      });
      setTimeout(() => {
        try {
          const details = result;
          // console.log(details)
          // console.log(details.text.split("/")[5])
          apis
            .getScanner(details.text.split("/")[5])
            .then((res) => {
              setData(res.data);
              console.log(res.data)
              Swal.update({
                title: 'Approved',
                icon: 'success',
                iconColor: '#3fc3ee',
                showConfirmButton: true,
              });
              Swal.hideLoading()
            })
            .catch((error) => {
              console.error(error);
              // toast.error("Error fetching data!");
              Swal.update({
                icon: 'error',
                title: 'Error!',
                text: 'Invalid QR code format!',
                                
                showConfirmButton: true
              });
              Swal.hideLoading();
              setScanned(false);
            });
        } catch (error) {
          console.error(error);
          // toast.error("Invalid QR code format!");
          Swal.update({
            icon: 'error',
            title: 'Error!',
            text: 'Error fetching data!',
            // text: 'Invalid QR code format!',
            showConfirmButton: true
          });
          Swal.hideLoading();
          setScanned(false);
        }
      }, 2000); 
    }
  };

  const handleError = (error) => {
    console.error(error);
    toast.error("Error while scanning the QR code.");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-2">
      {!scanned ? (
        <h1 className="text-3xl font-mono font-semibold text-black mb-6">
          QR Code Scanner
        </h1>
      ) : (
        <h1 className="text-3xl font-mono font-semibold text-black mb-6">
          Pilgrim Details
        </h1>
      )}
      <div className="w-full max-w-lg bg-white shadow-2xl font-mono rounded-lg p-6">
        {!scanned && (
          <div className="mb-6">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>
        )}
        {data && (
          <div className="mt-4">
            <h2 className="text-2xl font-mono font-semibold text-gray-700 mb-4">
              User Details
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>First Name:</strong> {data.user.first_name}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Last Name:</strong> {data.user.last_name}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Constituency:</strong> {data.user.constituency}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Is MLA:</strong> {data.user.is_mla ? "Yes" : "No"}
            </p>

            <h2 className="text-2xl font-mono font-semibold text-gray-700 mb-4">
              Pilgrim Details
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Pilgrim Name:</strong> {data.pilgrim.pilgrim_name}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Seva:</strong> {data.pilgrim.seva}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Booked Date:</strong>{" "}
              {new Date(data.pilgrim.booked_date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Aadhar Number:</strong> {data.pilgrim.aadhar_number}
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default QRCodeScanner;
