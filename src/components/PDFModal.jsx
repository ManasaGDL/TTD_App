import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFModal = ({ isOpen, onClose, pdfBlob, fileName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Preview of {fileName}</h2>
        <div className="overflow-auto max-h-96">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
            <Viewer fileUrl={URL.createObjectURL(pdfBlob)} />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
