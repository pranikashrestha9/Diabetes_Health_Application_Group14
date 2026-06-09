export const generateRecommendationHTML = ({
  patientName,
  doctorName,
  date,
  advice,
  dietPlan,
  lifestyleChanges,
}: any) => {
  const formatList = (items?: string[]) => {
    if (!items || items.length === 0) return `<li>None</li>`;
    return items.map((i) => `<li>${i}</li>`).join("");
  };

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

      .info {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }

      .section {
        margin-top: 25px;
      }

      .box {
        border: 1px solid #ccc;
        padding: 12px;
        border-radius: 6px;
        margin-top: 5px;
        background: #fafafa;
      }

      ul {
        margin: 0;
        padding-left: 20px;
      }

      .diet-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 10px;
      }

      .diet-box {
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 6px;
        background: #fff;
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
      <div class="clinic-name">HealthCare Recommendation Report</div>
      <div>Kathmandu, Nepal</div>
      <div>Generated Report</div>
    </div>

    <!-- INFO -->
    <div class="info">
      <div>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>

      <div>
        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
      </div>
    </div>

    <!-- ADVICE -->
    <div class="section">
      <h3>Medical Advice</h3>
      <div class="box">${advice || "N/A"}</div>
    </div>

    <!-- DIET PLAN -->
    <div class="section">
      <h3>Diet Plan</h3>

      <div class="diet-grid">

        <div class="diet-box">
          <h4>Breakfast</h4>
          <ul>${formatList(dietPlan?.breakfast)}</ul>
        </div>

        <div class="diet-box">
          <h4>Lunch</h4>
          <ul>${formatList(dietPlan?.lunch)}</ul>
        </div>

        <div class="diet-box">
          <h4>Dinner</h4>
          <ul>${formatList(dietPlan?.dinner)}</ul>
        </div>

        <div class="diet-box">
          <h4>Snacks</h4>
          <ul>${formatList(dietPlan?.snacks)}</ul>
        </div>

        <div class="diet-box" style="grid-column: span 2;">
          <h4>Avoid Foods</h4>
          <ul>${formatList(dietPlan?.avoidFoods)}</ul>
        </div>

      </div>
    </div>

    <!-- LIFESTYLE -->
    <div class="section">
      <h3>Lifestyle Changes</h3>
      <div class="box">${lifestyleChanges || "N/A"}</div>
    </div>

    <!-- SIGNATURE -->
    <div class="signature">
      <div class="signature-line">
        Dr. ${doctorName}
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>This is a digitally generated health recommendation report.</p>
      <p>Please follow instructions as advised by your doctor.</p>
    </div>

  </body>
  </html>
  `;
};