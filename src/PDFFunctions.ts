/*
import { PDFDocument } from 'pdf-lib';
import { execSync } from "child_process";
import sharp from "sharp";
import fs from 'fs';

console.log("PDFFunctions loaded");

export async function listPdfFields(templatePath: string) {
  const pdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  fields.forEach(field => {
    console.log(field.getName());
  });
}

export async function fillPdf(templatePath: string, outputPath: string, fields: Record<string, string>) {
  const pdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  Object.entries(fields).forEach(([key, value]) => {
    try {
      form.getTextField(key).setText(value);
    } catch (e) {
      console.warn(`Field ${key} not found`);
    }
  });

  const filledPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, filledPdfBytes);
}

export async function pdfToPng(pdfPath: string, outputPrefix: string) { // add pdf-poppler for windows...
  execSync(`pdftoppm -png "${pdfPath}" "${outputPrefix}"`);
  await sharp("output-1.png")
    .extract({ left: 0, top: 0, width: 1240, height: 700 })
    .toFile(`${outputPrefix}.png`);
}
*/