export const generatePrescriptionHTML = ({
  patientName,
  doctorName,
  date,
  medicines,
  dosageInstructions,
  notes,
}: any) => {

  const medicineRows = medicines
    .map(
      (m: any, index: number) => `
      <tr>
        <td>${index + 1}</td>
        <td>${m.name}</td>
        <td>${m.dose}</td>
        <td>${m.frequency}</td>
        <td>${m.duration}</td>
      </tr>
    `
    )
    .join("");

  return `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        color: #333;
      }

      .header {
        text-align: center;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
      }

      .clinic-name {
        font-size: 24px;
        font-weight: bold;
      }

      .section {
        margin-top: 25px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      th, td {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
      }

      th {
        background-color: #f2f2f2;
      }

      .info {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }

      .box {
        border: 1px solid #ccc;
        padding: 10px;
        margin-top: 5px;
        border-radius: 5px;
      }

      .footer {
        position: fixed;
        bottom: 20px;
        left: 40px;
        right: 40px;
        border-top: 1px solid #ccc;
        padding-top: 10px;
        font-size: 12px;
        text-align: center;
      }

      .signature {
        margin-top: 50px;
        text-align: right;
      }

      .signature-line {
        margin-top: 40px;
        border-top: 1px solid #000;
        width: 200px;
        float: right;
        text-align: center;
      }
    </style>
  </head>

  <body>

    <!-- HEADER -->
    <div class="header">
      <div class="clinic-name">HealthCare Clinic</div>
      <div>Kathmandu, Nepal</div>
      <div>Phone: +977-9800000000</div>
    </div>

    <!-- PATIENT & DOCTOR INFO -->
    <div class="info">
      <div>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>

      <div>
        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
      </div>
    </div>

    <!-- MEDICINES -->
    <div class="section">
      <h3>Prescription</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine</th>
            <th>Dose</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${medicineRows || `<tr><td colspan="5">No medicines</td></tr>`}
        </tbody>
      </table>
    </div>

    <!-- DOSAGE -->
    <div class="section">
      <h3>Dosage Instructions</h3>
      <div class="box">${dosageInstructions || "N/A"}</div>
    </div>

    <!-- NOTES -->
    <div class="section">
      <h3>Doctor's Notes</h3>
      <div class="box">${notes || "N/A"}</div>
    </div>

    <!-- SIGNATURE -->
    <div class="signature">
      <div class="signature-line">
        Dr. ${doctorName}
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>This is a digitally generated prescription.</p>
      <p>Please follow the doctor's instructions carefully.</p>
    </div>

  </body>
  </html>
  `;
};