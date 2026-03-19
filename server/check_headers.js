const XLSX = require('xlsx');
const workbook = XLSX.readFile('c:/Users/there/Downloads/SJCETstudent.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
for (let i = 0; i < 5; i++) {
    console.log(`Row ${i}:`, data[i]);
}
process.exit(0);
