import ExcelJS from "exceljs";

export const generateReport = async (
  session,
  claimedGuests,
  pendingGuests
) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Downtown Hotel";
  workbook.created = new Date();

  // ======================================
  // Sheet 1 - Summary
  // ======================================

  const summary = workbook.addWorksheet("Summary");

  summary.columns = [
    { header: "Field", width: 30 },
    { header: "Value", width: 35 },
  ];

  const completion =
    session.totalGuests === 0
      ? 0
      : (
          (session.claimedGuests / session.totalGuests) *
          100
        ).toFixed(2);

  summary.addRows([
    ["Hotel", "Downtown Hotel"],
    ["Session Code", session.sessionCode],
    ["Buffet Name", session.buffetName],
    ["Meal", session.mealType],
    [
      "Date",
      new Date(session.buffetDate).toLocaleDateString(),
    ],
    ["Status", session.status],
    ["Total Guests", session.totalGuests],
    ["Claimed Guests", session.claimedGuests],
    [
      "Pending Guests",
      session.totalGuests - session.claimedGuests,
    ],
    ["Completion", `${completion}%`],
    [
      "Report Generated",
      new Date().toLocaleString(),
    ],
  ]);

  summary.getRow(1).font = {
    bold: true,
  };

  // ======================================
  // Sheet 2 - Claimed Guests
  // ======================================

  const claimed = workbook.addWorksheet(
    "Claimed Guests"
  );

  claimed.columns = [
    {
      header: "Room No",
      key: "roomNo",
      width: 15,
    },
    {
      header: "Guest Name",
      key: "guestName",
      width: 30,
    },
    {
      header: "Claimed At",
      key: "claimedAt",
      width: 25,
    },
  ];

  claimedGuests.forEach((guest) => {
    claimed.addRow({
      roomNo: guest.roomNo,
      guestName: guest.guestName,
      claimedAt: guest.claimedAt
        ? new Date(
            guest.claimedAt
          ).toLocaleString()
        : "-",
    });
  });

  claimed.getRow(1).font = {
    bold: true,
  };

  // ======================================
  // Sheet 3 - Pending Guests
  // ======================================

  const pending = workbook.addWorksheet(
    "Pending Guests"
  );

  pending.columns = [
    {
      header: "Room No",
      key: "roomNo",
      width: 15,
    },
    {
      header: "Guest Name",
      key: "guestName",
      width: 30,
    },
  ];

  pendingGuests.forEach((guest) => {
    pending.addRow({
      roomNo: guest.roomNo,
      guestName: guest.guestName,
    });
  });

  pending.getRow(1).font = {
    bold: true,
  };

  return workbook;
};