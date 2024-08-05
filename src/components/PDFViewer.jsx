import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import PDFModal from './PDFModal';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import apis from '../api/apis';
import { toast } from 'sonner';
import { useLoading } from '../context/LoadingContext';
import { FaTowerBroadcast } from 'react-icons/fa6';
const PDFViewer = ({ payloadForDownload={}, download ,setPayloadForDownload,setStartPreviewDownload}) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
 const { setIsLoading , isLoading} = useLoading()

  useEffect(()=>{
    if(download)
      // previewLetter('VIP Darshan')
    downloadPDF()
    },[download])

  const downloadAPicall = async () => {
    setIsLoading(true)
    try {
      
      if (payloadForDownload && payloadForDownload?.pilgrims.length > 0) {
        const response = await apis.downloadLetter(payloadForDownload);
        setIsLoading(false)
        toast.success("Successfully downloaded!")
        console.log("response",response?.data)
        return response?.data;
      }
      setPayloadForDownload({})
      setStartPreviewDownload(false)
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };

  // const previewLetter = async (filename) => {
  //   if(payloadForDownload && download && payloadForDownload?.pilgrims.length>0){try {
  //     const pdfData = await downloadAPicall();
  //     setPdfBlob(new Blob([pdfData], { type: 'application/pdf' }));
  //     setFileName(filename);
  //     setIsModalOpen(true);
  //    // Reset flag
  //   } catch (error) {
  //     console.error('Error previewing PDF:', error);
  //   }
  //   finally{
  //     // setIsModalOpen(false)
 
  //   }
  // }
  // };

  const downloadPDF = async (filename) => {
    try {
      if (download) {
        const pdfData = await downloadAPicall();
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        saveAs(blob, filename);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
    finally{
      setPayloadForDownload({})
    }
  };

  // Handle manual opening of preview
  const handlePreviewClick = () => {
    previewLetter('VIPDarshan');
  };

  // Automatically open the preview if explicitly requested


  return (
    <div>
      {/* <button
        className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-green-700 mr-3 font-mono"
        onClick={handlePreviewClick} // Use handlePreviewClick
      >
        Preview
      </button> */}
      <button
        onClick={() => downloadPDF('VIPBreak.pdf')}
        className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-green-700 font-mono"
      >
        Download PDF
      </button>
      {pdfBlob && (
        <PDFModal
          isOpen={isModalOpen}
          onClose={() => {setIsModalOpen(false)}}
          pdfBlob={pdfBlob}
          fileName={fileName}
        />
      )}
    </div>
  );
};

export default PDFViewer;
