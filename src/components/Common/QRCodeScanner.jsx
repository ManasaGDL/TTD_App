import axios from "axios";
import React, { useRef, useState } from "react";
import QrScanner from "react-qr-scanner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apis from "../../api/apis";
import Swal from "sweetalert2";
import { format, parseISO} from "date-fns";


const QRCodeScanner = () => {
  const [data, setData] = useState(null);
  const [scanned, setScanned] = useState(false);
  const qrRef = useRef(null);

  const handleScan = (result) => {
    console.log(result);
    
    if (result) {
      setScanned(true);
      Swal.fire({
        title: "Fetching...",
        // text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        showConfirmButton: false,
        width: "80%",
        // icon: 'success',
        didOpen: () => {
          Swal.showLoading();
        },
      })
      .then((ok) => {
        if (ok.isConfirmed) {
          setScanned(false);
        }
      });
      setTimeout(() => {
        try {
          const details = result;
          apis
            .getScanner(details.text.split("/")[5])
            .then((res) => {
              setData(res.data);
              console.log(res.data);
              const tableRows = res.data.pilgrim
                .map(
                  (item) => `
                <tr class="border-b font-mono">
                  <td class="px-4 py-2">${item.pilgrim_name}</td>
                  <td class="px-4 py-2">${item.seva}</td>
                  <td class="px-4 py-2">${format(parseISO(item.booked_date),'dd-MM-yyyy')}</td>                  
                  <td class="px-4 py-2">${item.aadhar_number}</td>
                </tr>
              `
                )
                .join("");

              const tableHtml = `
              <div class="overflow-x-auto">
                <div class="flex justify-center items-center gap-2 pb-3 font-mono">
           
            <p class="text-gray-600 mb-2">
              <strong>Name:</strong> ${res.data.user.first_name} ${res.data.user.last_name}(MLA)
            </p>
          
            <p class="text-gray-600 mb-2">
              <strong>Constituency:</strong> ${res.data.user.constituency}
            </p>
          
                </div>
                <table class="min-w-full bg-white border">
                  <thead class="bg-gray-200 font-semibold font-mono">
                    <tr >
                      <td class="px-4 py-2 text-nowrap">Pilgrim Name</td>
                      <td class="px-4 py-2 text-nowrap">Seva</td>
                      <td class="px-4 py-2 text-nowrap">Date Of Darshan</td>
                      <td class="px-4 py-2 text-nowrap">Aadhar Number</td>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows}
                  </tbody>
                </table>
              </div>
            `;

              console.log(res.data);
              Swal.update({
                title: "Approved",
                icon: "success",
                iconColor: "#22c55e",
                html: tableHtml,
                width: "80%",
                showConfirmButton: true,
                customClass: {
                  icon: "swal-icon-small",
                  title: "swal-title-custom",
                },
              });

              Swal.hideLoading();
            })
            .catch((error) => {
              console.error(error);
              // toast.error("Error fetching data!");
              Swal.update({
                icon: "error",
                title: "Error!",
                text: "Invalid QR code format!",

                showConfirmButton: true,
              });
              Swal.hideLoading();
              setScanned(false);
            });
        } catch (error) {
          console.error(error);
          // toast.error("Invalid QR code format!");
          Swal.update({
            icon: "error",
            title: "Error!",
            text: "Problem fetching data!",
            // text: 'Invalid QR code format!',
            showConfirmButton: true,
          });
          Swal.hideLoading();
          setScanned(false);
        }
      }, 1000);
    }
  };

  const handleError = (error) => {
    console.error(error);
    toast.error("Error while scanning the QR code.");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-2">
      <h1 className="text-3xl font-mono font-semibold text-gray-700 mb-6">
        QR Code Scanner
      </h1>
      <div className="w-full max-w-lg bg-white shadow-2xl font-mono rounded-lg p-6">
        <div className="mb-6">
          {!scanned && (
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              ref={qrRef}
              style={{ width: "100%" }}
            />
          )}
        </div>

        {/* {data && (
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
            {data.pilgrim.map((eachPilgrim, index) => {
              return (
                <div key={index}>
                  <p className="text-gray-600 mb-2">
                    <strong>Pilgrim Name:</strong> {eachPilgrim.pilgrim_name}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Seva:</strong> {eachPilgrim.seva}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Booked Date:</strong>{" "}
                    {new Date(eachPilgrim.booked_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Aadhar Number:</strong> {eachPilgrim.aadhar_number}
                  </p>
                </div>
              );
            })}
          </div>
        )} */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default QRCodeScanner;
