import puppeteer from "puppeteer";
import path from "path";

/**
 * Generates a PDF from HTML content.
 * @param {string} htmlContent - HTML content to convert into PDF.
 * @param {string} outputFilePath - Path where the PDF will be saved.
 * @returns {Promise<string>} - Returns the path of the generated PDF.
 */
const generatePDF = async (htmlContent, outputFilePath) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("Generating PDF...");
    
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    await page.emulateMediaType("screen");

    await page.pdf({
      path: path.resolve(outputFilePath),
      margin: { top: "50px", right: "50px", bottom: "50px", left: "50px" },
      printBackground: true,
      format: "A4",
    });

    await browser.close();
    console.log(`PDF successfully generated: ${outputFilePath}`);
    return outputFilePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

export default generatePDF;
