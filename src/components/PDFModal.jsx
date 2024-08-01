import React, { useEffect, useState , useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import packageJson from "../../package.json"

const PDFModal = ({ isOpen, onClose, pdfBlob, fileName }) => {
  const [blobUrl, setBlobUrl] = useState(null);
const modalRef = useRef(null);
const pdfjsVersion = packageJson.dependencies['pdfjs-dist'].replace('^', '');
  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Prevent closing modal when clicking inside the modal content
    
        // return ;
        // return;
      }
      else return;
      // onClose(); // Close the modal if clicking outside
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [isOpen, onClose]);
  if (!isOpen || !blobUrl) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 relative"  ref={modalRef}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Preview of {fileName}</h2>
        <div className="overflow-auto max-h-96">
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={blobUrl} />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
