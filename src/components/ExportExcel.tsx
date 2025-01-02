"use client";

import { exportToExcel } from "@/lib/exportToExcel";
import { RiFileExcel2Line } from "react-icons/ri";

const ExportExcel = ({
  data,
  fileName,
  sheetName,
}: {
  data: any[];
  fileName: string;
  sheetName: string;
}) => {
    
  const handleExportExcel = async () => {
    console.log(data);
    exportToExcel(data, fileName, sheetName);
  }

  return (<RiFileExcel2Line size={22} color="#107c41" onClick={handleExportExcel} />)
};

export default ExportExcel;
