import xlsx from "xlsx";

const workbook = xlsx.readFile("./uploads/Guest On Meal Plan (54).xlsx");

const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = xlsx.utils.sheet_to_json(sheet, {
  header: 1,
  defval: "",
});

rows.slice(0, 40).forEach((row, index) => {
  console.log(index, row);
});