import xlsx from "xlsx";

export const parseGuestExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  //---------------------------------------
  // Find Header Row
  //---------------------------------------

  let headerIndex = -1;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map((cell) =>
      String(cell).trim()
    );

    if (
      row.includes("Plan") &&
      row.includes("Room No") &&
      row.includes("Guest")
    ) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    throw new Error("Unable to find Guest Table.");
  }

  //---------------------------------------
  // Column Indexes
  //---------------------------------------

  const headers = rows[headerIndex].map((h) =>
    String(h).trim()
  );

  const roomCol = headers.findIndex((h) =>
    h.includes("Room")
  );

  const guestCol = headers.findIndex((h) =>
    h.includes("Guest")
  );

  const paxCol = headers.findIndex((h) =>
    h.includes("Pax")
  );

  if (
    roomCol === -1 ||
    guestCol === -1 ||
    paxCol === -1
  ) {
    throw new Error("Required columns not found.");
  }

  //---------------------------------------
  // Guests
  //---------------------------------------

  const guests = [];
  const unassignedGuests = [];

  let foundFirstRoom = false;

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];

    const guestName = String(
      row[guestCol] ?? ""
    )
      .replace(/,+$/, "")
      .trim();

    if (!guestName) continue;

    const room = String(
      row[roomCol] ?? ""
    ).trim();

    const pax = Math.max(
      Number(row[paxCol]) || 1,
      1
    );

    // First room encountered
    if (room !== "") {
      foundFirstRoom = true;
    }

    const target = foundFirstRoom
      ? guests
      : unassignedGuests;

    for (let guestNo = 1; guestNo <= pax; guestNo++) {
      target.push({
        roomNo: room,
        guestName:
          guestNo === 1
            ? guestName
            : `Guest ${guestNo}`,
        guestNumber: guestNo,
        generated: guestNo > 1,
      });
    }
  }

  //---------------------------------------
  // Sort Assigned Guests
  //---------------------------------------

  guests.sort((a, b) => {
    const roomA = Number(a.roomNo);
    const roomB = Number(b.roomNo);

    if (!isNaN(roomA) && !isNaN(roomB)) {
      if (roomA !== roomB) {
        return roomA - roomB;
      }
    }

    return a.guestNumber - b.guestNumber;
  });

  //---------------------------------------
  // Debug
  //---------------------------------------

  console.log(
    "Assigned Guests:",
    guests.length
  );

  console.log(
    "Unassigned Guests:",
    unassignedGuests.length
  );

  //---------------------------------------
  // Return
  //---------------------------------------

  return {
    guests,
    unassignedGuests,
  };
};