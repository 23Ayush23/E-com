import pdf from "html-pdf";
import path from "path";
import { path as phantomPath } from "phantomjs-prebuilt";

const generatePDF = (htmlContent, outputFilePath) => {
  return new Promise((resolve, reject) => {
    console.log("Generating PDF...");

    const options = {
      format: "A4",
      border: {
        top: "50px",
        right: "50px",
        bottom: "50px",
        left: "50px"
      },
      phantomPath, // Use imported PhantomJS path
      timeout: 30000 // Optional timeout
    };

    pdf.create(htmlContent, options).toFile(path.resolve(outputFilePath), (err, res) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return reject(err);
      }
      console.log(`PDF successfully generated: ${res.filename}`);
      resolve(res.filename);
    });
  });
};

export default generatePDF;
