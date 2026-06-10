import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

function addTextToPDF(pdf, content) {
  const margin = 14;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const lineHeight = 6;
  const lines = pdf.splitTextToSize(String(content || ''), pageWidth - margin * 2);
  let y = margin;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);

  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }

    pdf.text(line, margin, y);
    y += lineHeight;
  });
}

export const exportToPDF = async (elementId, fileName = 'resume.pdf', fallbackContent = '') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    if (fallbackContent.trim()) {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      addTextToPDF(pdf, fallbackContent);
      pdf.save(fileName);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error exporting to PDF:', error);

    if (fallbackContent.trim()) {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      addTextToPDF(pdf, fallbackContent);
      pdf.save(fileName);
      return;
    }

    throw error;
  }
};

export const exportToDOCX = (content, fileName = 'resume.docx') => {
  try {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: content,
            run: new TextRun({ size: 22 }),
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, fileName);
    });
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw error;
  }
};

export const downloadAsText = (content, fileName = 'resume.txt') => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
