import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import PDFModal from './PDFModal';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import apis from '../api/apis';

const PDFViewer = ({ payloadForDownload, download,setSelectedPilgrims, setMasterPilgrim}) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const downloadAPicall = async () => {
   
    try {
     
      const response = await apis.downloadLetter(payloadForDownload);
      return response.data; // Return the PDF blob data
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }finally{
      // setSelectedPilgrims([])
      // setMasterPilgrim(null)
    }
  };

  const previewLetter = async (filename) => {

    if (download) {
    
      try {
        const pdfData = await downloadAPicall();
        setPdfBlob(new Blob([pdfData], { type: 'application/pdf' }));
        setFileName(filename);
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error previewing PDF:', error);
      }finally{
        // setSelectedPilgrims([])
        // setMasterPilgrim(null)
      }
    }
  };

  const downloadPDF = async (filename) => {
    try {
      if (download) {
        const pdfData = await downloadAPicall();
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        saveAs(blob, filename); // Use file-saver to save the file
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-3"
        onClick={() => {
          previewLetter('VIPDarshan')}}
      >
        Preview
      </button>
      <button
        onClick={() => downloadPDF('VIPBreak.pdf')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
      >
        Download PDF
      </button>
      {pdfBlob && (
        <PDFModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pdfBlob={pdfBlob}
          fileName={fileName}
        />
      )}
    </div>
  );
};

export default PDFViewer;
