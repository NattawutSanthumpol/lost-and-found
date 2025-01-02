import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// import axios from "axios";

// // ฟังก์ชันเพื่อแปลงภาพจาก URL เป็น Base64
// const fetchImageAsBase64 = async (url: string): Promise<string> => {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     const buffer = Buffer.from(response.data, 'binary');
//     return `data:image/png;base64,${buffer.toString('base64')}`;
//   };

export const exportToExcel = async (
  data: any[],
  fileName: string,
  sheetName: string
) => {
  // สร้าง workbook และ worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // เพิ่ม header
  const headers = Object.keys(data[0]).map(
    (header) => header.charAt(0).toUpperCase() + header.slice(1)
  );
  worksheet.addRow(headers);

//   // เพิ่มข้อมูล
//     data.forEach((row) => worksheet.addRow(Object.values(row)));

     // เพิ่มข้อมูล และแทรก Link
  data.forEach((row) => {
    const rowValues = Object.values(row);
    worksheet.addRow(rowValues);

    // ตรวจสอบคอลัมน์ที่มี URL และเปลี่ยนเป็นลิงก์
    rowValues.forEach((cellValue, colIndex) => {
      if (typeof cellValue === "string" && cellValue.startsWith("http")) {
        // แปลงข้อความในเซลล์เป็นลิงก์
        if (worksheet.lastRow) {
          const cell = worksheet.getCell(worksheet.lastRow.number, colIndex + 1);
          cell.value = { text: cellValue, hyperlink: cellValue };
        }
      }
    });
  });

//   // เพิ่มข้อมูล และแทรกรูปภาพ
//   for (const row of data) {
//     const rowValues = Object.values(row);
//     worksheet.addRow(rowValues);

//     // ตรวจสอบคอลัมน์ที่มี URL ของภาพและแทรกรูปภาพ
//     for (let colIndex = 0; colIndex < rowValues.length; colIndex++) {
//       const cellValue = rowValues[colIndex];

//       // ถ้าเจอ URL ของรูปภาพในคอลัมน์
//       if (typeof cellValue === "string" && cellValue.startsWith("http")) {
//         const imageBase64 = await fetchImageAsBase64(cellValue);

//         // เพิ่มภาพลงใน Excel
//         const imageId = workbook.addImage({
//           base64: imageBase64,
//           extension: "png",
//         });

//         worksheet.addImage(imageId, {
//           tl: { col: colIndex, row: (worksheet.lastRow ? worksheet.lastRow.number - 1 : 0) },
//           ext: { width: 50, height: 50 },
//         });
//       }
//     }
//   }

  // จัดรูปแบบทุกเซลล์
  worksheet.eachRow((row, rowIndex) => {
    row.eachCell((cell) => {
      cell.font = { size: 14 }; // ขนาดฟอนต์ 14
    });
  });

  worksheet.getColumn(1).eachCell((cell) => {
    cell.alignment = { horizontal: "center" }; // จัดชิดซ้ายแนวนอนและแนวตั้ง
  });

  // จัดรูปแบบ header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { size: 16, bold: true }; // ขนาดฟอนต์ 16 และตัวหนา
    cell.alignment = { horizontal: "center", vertical: "middle" }; // จัดกึ่งกลางแนวนอนและแนวตั้ง
  });

  // คำนวณความกว้างคอลัมน์
  const columnWidths = headers.map((header, colIndex) => {
    // ตรวจสอบค่าของแต่ละคอลัมน์
    const columnValues = worksheet.getColumn(colIndex + 1).values;
    // console.log(`Column ${header} values: `, columnValues);

    let tempLengthValue = 0;
    columnValues.forEach((value) => {
      if (value !== undefined && value !== null) {
        const length = value.toString().length;
        if (length > tempLengthValue) {
          tempLengthValue = length;
        }
      }
    });

    if (
      header.toLowerCase() === "createdat" ||
      header.toLowerCase() === "updatedat"
    ) {
      tempLengthValue = 20;
    }

    if (header.toLowerCase() === "img") {
      tempLengthValue = 20;
    }

    const maxLength = Math.max(
      header.length, // ความยาวของ Header
      tempLengthValue
    );

    // console.log(`Max length for column ${header}: `, maxLength);

    return { width: maxLength + 10 }; // เพิ่มความกว้างเผื่อ
  });

//   console.log("Column widths: ", columnWidths);

  // กำหนดความกว้างของคอลัมน์
  worksheet.columns = columnWidths;

  // บันทึกไฟล์และดาวน์โหลด
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
