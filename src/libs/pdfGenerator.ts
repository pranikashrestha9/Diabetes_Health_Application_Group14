export const generatePDF = async (html: string) => {
  const puppeteer = await import("puppeteer");

  const browser = await puppeteer.default.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdf;
};