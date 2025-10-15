import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

interface DietChartData {
  customerName: string;
  customerId: string;
  macros?: any;
  weeklyPlan?: any;
  nutritionistName?: string;
  generatedDate: Date;
}

interface ConsolidatedReportData {
  customerName: string;
  customerId: string;
  stages: {
    stage: number;
    status: string;
    completedAt?: Date;
    documents: Array<{
      label: string;
      url: string;
      uploadedAt: Date;
    }>;
  }[];
  dietPlan?: {
    macros?: any;
    weeklyPlan?: any;
  };
  acknowledgements?: Array<{
    taskType: string;
    status: string;
    createdAt: Date;
  }>;
}

export function generateDietChartPDF(data: DietChartData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).text('Personalized Diet Chart', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Generated on ${data.generatedDate.toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Patient Information
    doc.fontSize(16).text('Patient Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Name: ${data.customerName}`);
    doc.text(`Patient ID: ${data.customerId}`);
    doc.moveDown(1.5);

    // Macros Section
    if (data.macros) {
      doc.fontSize(16).text('Nutritional Macros', { underline: true });
      doc.moveDown(0.5);
      
      if (typeof data.macros === 'object') {
        Object.entries(data.macros).forEach(([key, value]) => {
          doc.fontSize(12).text(`${key}: ${value}`);
        });
      } else {
        doc.fontSize(12).text(String(data.macros));
      }
      doc.moveDown(1.5);
    }

    // Weekly Plan Section
    if (data.weeklyPlan) {
      doc.fontSize(16).text('Weekly Meal Plan', { underline: true });
      doc.moveDown(0.5);
      
      if (typeof data.weeklyPlan === 'object' && data.weeklyPlan !== null) {
        Object.entries(data.weeklyPlan).forEach(([day, meals]) => {
          doc.fontSize(14).text(day, { underline: true });
          if (typeof meals === 'object' && meals !== null) {
            Object.entries(meals).forEach(([mealType, description]) => {
              doc.fontSize(12).text(`  ${mealType}: ${description}`);
            });
          } else {
            doc.fontSize(12).text(`  ${meals}`);
          }
          doc.moveDown(0.5);
        });
      } else {
        doc.fontSize(12).text(String(data.weeklyPlan));
      }
      doc.moveDown(1.5);
    }

    // Footer with nutritionist signature
    doc.moveDown(2);
    doc.fontSize(12).text('Prepared by:', { continued: false });
    doc.text(data.nutritionistName || 'Clinical Nutritionist');
    doc.moveDown(0.5);
    doc.fillColor('gray').fontSize(10).text('This diet plan is personalized based on your health profile and clinical assessment.', {
      align: 'center'
    });

    doc.end();
  });
}

export function generateConsolidatedReportPDF(data: ConsolidatedReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).text('Clinical Progress Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Patient Information
    doc.fontSize(16).text('Patient Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Name: ${data.customerName}`);
    doc.text(`Patient ID: ${data.customerId}`);
    doc.moveDown(1.5);

    // Clinical Journey Summary
    doc.fontSize(16).text('Clinical Journey Summary', { underline: true });
    doc.moveDown(0.5);

    data.stages.forEach((stage) => {
      const stageNames = [
        'Initial Physician Consultation',
        'Test Collection',
        'Discussion',
        'Diet Chart',
        'Payment',
        'Meal Delivery'
      ];
      
      doc.fontSize(14).text(`Stage ${stage.stage}: ${stageNames[stage.stage - 1] || 'Unknown'}`, { underline: true });
      doc.fontSize(12).text(`Status: ${stage.status}`);
      if (stage.completedAt) {
        doc.text(`Completed: ${stage.completedAt.toLocaleDateString()}`);
      }
      
      if (stage.documents && stage.documents.length > 0) {
        doc.text('Documents:');
        stage.documents.forEach((docItem) => {
          doc.fontSize(11).text(`  • ${docItem.label} (${docItem.uploadedAt.toLocaleDateString()})`);
        });
      }
      doc.moveDown(1);
    });

    // Diet Plan Summary (if available)
    if (data.dietPlan) {
      doc.addPage();
      doc.fontSize(16).text('Current Diet Plan', { underline: true });
      doc.moveDown(0.5);

      if (data.dietPlan.macros) {
        doc.fontSize(14).text('Macros:', { underline: true });
        if (typeof data.dietPlan.macros === 'object') {
          Object.entries(data.dietPlan.macros).forEach(([key, value]) => {
            doc.fontSize(12).text(`${key}: ${value}`);
          });
        } else {
          doc.fontSize(12).text(String(data.dietPlan.macros));
        }
        doc.moveDown(1);
      }

      if (data.dietPlan.weeklyPlan) {
        doc.fontSize(14).text('Weekly Plan Summary:', { underline: true });
        doc.fontSize(12).text(typeof data.dietPlan.weeklyPlan === 'object' 
          ? JSON.stringify(data.dietPlan.weeklyPlan, null, 2)
          : String(data.dietPlan.weeklyPlan));
      }
    }

    // Acknowledgements Summary
    if (data.acknowledgements && data.acknowledgements.length > 0) {
      doc.addPage();
      doc.fontSize(16).text('Task Acknowledgements', { underline: true });
      doc.moveDown(0.5);

      data.acknowledgements.forEach((ack) => {
        doc.fontSize(12).text(`• ${ack.taskType} - ${ack.status} (${ack.createdAt.toLocaleDateString()})`);
      });
    }

    // Footer
    doc.moveDown(2);
    doc.fillColor('gray').fontSize(10).text('This is an automated consolidated report of your clinical journey.', {
      align: 'center'
    });
    doc.text('For questions, please contact your clinical team.', {
      align: 'center'
    });

    doc.end();
  });
}
