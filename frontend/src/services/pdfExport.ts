import { jsPDF } from 'jspdf';
import { FactCheckResult, Evidence, ReasoningStep } from '../types/factCheck';

/**
 * Generates an institutional-grade, publication-ready PDF fact-check report
 * directly from frontend state using jsPDF.
 */
export const exportFactCheckToPdf = (result: FactCheckResult): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper to ensure adequate vertical space or create a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin - 35) {
      doc.addPage();
      y = margin;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 113, 108); // stone-500
    doc.text('FACTCHECKAI EVIDENCE DOSSIER', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`AUDIT ID: ${result.id ? result.id.toUpperCase() : 'VERIFY-AUDIT'}`, pageWidth - margin, y, { align: 'right' });
    y += 8;
    doc.setDrawColor(214, 211, 209);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;
  };

  // ---------------- PAGE 1 HEADER ----------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('FACTCHECKAI • INSTITUTIONAL VERIFICATION REPORT', margin, y);
  y += 16;

  // Primary Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(28, 25, 23); // stone-900
  doc.text('Claim Verification Dossier', margin, y);
  y += 18;

  // Metadata Bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(115, 115, 115);
  const checkedDate = result.checkedAt || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const statusLabel = result.isDemo ? 'Verified Sample Archive' : 'Live Evidence Audit';
  doc.text(`Audit Date: ${checkedDate}  •  Status: ${statusLabel}  •  Protocol: Multi-Source Consensus`, margin, y);
  y += 14;

  // Divider
  doc.setDrawColor(214, 211, 209); // stone-300
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  // ---------------- CLAIM SECTION ----------------
  doc.setFillColor(250, 249, 246); // warm stone tinted bg
  doc.setDrawColor(225, 220, 215);

  doc.setFont('times', 'italic');
  doc.setFontSize(12.5);
  const claimLines = doc.splitTextToSize(`"${result.claim}"`, contentWidth - 28);
  const claimBoxHeight = claimLines.length * 16 + 28;

  doc.roundedRect(margin, y, contentWidth, claimBoxHeight, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 113, 108);
  doc.text('CLAIM ASSERTION EXAMINED', margin + 14, y + 15);

  doc.setFont('times', 'bolditalic');
  doc.setFontSize(12.5);
  doc.setTextColor(28, 25, 23);
  doc.text(claimLines, margin + 14, y + 32);

  y += claimBoxHeight + 16;

  // ---------------- VERDICT & CONFIDENCE SECTION ----------------
  checkPageBreak(75);

  const verdictUpper = (result.verdict || 'UNVERIFIED').toUpperCase();
  let verdictBg: [number, number, number] = [245, 245, 244]; // neutral stone-100
  let verdictBorder: [number, number, number] = [214, 211, 209];
  let verdictTextColor: [number, number, number] = [68, 64, 60];

  if (verdictUpper === 'TRUE' || verdictUpper === 'MOSTLY TRUE') {
    verdictBg = [236, 253, 245]; // emerald-50
    verdictBorder = [167, 243, 208]; // emerald-200
    verdictTextColor = [6, 95, 70]; // emerald-800
  } else if (verdictUpper === 'FALSE' || verdictUpper === 'MOSTLY FALSE') {
    verdictBg = [254, 242, 242]; // rose-50
    verdictBorder = [254, 202, 202]; // rose-200
    verdictTextColor = [153, 27, 27]; // rose-800
  } else if (verdictUpper === 'MIXED') {
    verdictBg = [254, 243, 199]; // amber-50
    verdictBorder = [253, 230, 138]; // amber-200
    verdictTextColor = [146, 64, 14]; // amber-800
  }

  // Verdict Container Card
  doc.setFillColor(verdictBg[0], verdictBg[1], verdictBg[2]);
  doc.setDrawColor(verdictBorder[0], verdictBorder[1], verdictBorder[2]);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, contentWidth, 56, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(verdictTextColor[0], verdictTextColor[1], verdictTextColor[2]);
  doc.text('VERDICT DETERMINATION', margin + 16, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(verdictUpper, margin + 16, y + 40);

  // Confidence & Calibration on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 113, 108);
  doc.text('AI CONFIDENCE CALIBRATION', pageWidth - margin - 16, y + 18, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(28, 25, 23);
  const confText = (result.confidence !== null && result.confidence !== undefined)
    ? `${result.confidence}%`
    : 'INCONCLUSIVE';
  doc.text(confText, pageWidth - margin - 16, y + 40, { align: 'right' });

  y += 70;

  // ---------------- EXECUTIVE SUMMARY ----------------
  checkPageBreak(65);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text('Executive Summary', margin, y);
  y += 14;

  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(44, 40, 37);
  const summaryLines = doc.splitTextToSize(result.summary || 'Summary unavailable.', contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 14.5 + 16;

  // ---------------- DETAILED ANALYSIS (IF DISTINCT FROM SUMMARY) ----------------
  if (result.analysis && result.analysis.trim() && result.analysis.trim() !== result.summary?.trim()) {
    checkPageBreak(65);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(28, 25, 23);
    doc.text('Detailed Analytical Context', margin, y);
    y += 14;

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(55, 50, 45);
    const analysisLines = doc.splitTextToSize(result.analysis, contentWidth);
    doc.text(analysisLines, margin, y);
    y += analysisLines.length * 14 + 16;
  }

  // ---------------- STRUCTURED REASONING ----------------
  if (result.reasoning && result.reasoning.length > 0) {
    checkPageBreak(50);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(28, 25, 23);
    doc.text('Step-by-Step Analytical Reasoning', margin, y);
    y += 14;

    result.reasoning.forEach((step: ReasoningStep) => {
      checkPageBreak(45);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(28, 25, 23);
      doc.text(`${step.index}.  ${step.title}`, margin, y);
      y += 13;

      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(68, 64, 60);
      const descLines = doc.splitTextToSize(step.description, contentWidth - 14);
      doc.text(descLines, margin + 14, y);
      y += descLines.length * 13 + 10;
    });

    y += 8;
  }

  // ---------------- EVIDENCE AUDIT & CITATIONS ----------------
  checkPageBreak(60);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text(`Evidence Sources Reviewed (${result.evidence?.length || 0})`, margin, y);

  if (result.evidenceOverview) {
    const { supports, contradicts, context } = result.evidenceOverview;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Distribution: ${supports} Supports  |  ${contradicts} Contradicts  |  ${context} Context`,
      pageWidth - margin,
      y,
      { align: 'right' }
    );
  }
  y += 16;

  // Render each Evidence source card
  const evidenceList: Evidence[] = result.evidence || [];
  evidenceList.forEach((ev: Evidence, idx: number) => {
    checkPageBreak(85);

    // Box dimensions
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    const quoteLines = doc.splitTextToSize(`"${ev.quote}"`, contentWidth - 24);
    const cardHeight = 36 + quoteLines.length * 12.5 + 20;

    // Background & border
    doc.setFillColor(253, 252, 250);
    doc.setDrawColor(229, 225, 220);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, 'FD');

    // Source name & index
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(28, 25, 23);
    const sourceName = ev.source || ev.sourceName || 'Institutional Record';
    doc.text(`${idx + 1}.  ${sourceName}`, margin + 12, y + 14);

    // Relationship tag with colored indicator
    let relTagColor: [number, number, number] = [100, 100, 100];
    if (ev.relationship === 'SUPPORTS') relTagColor = [5, 150, 105];
    if (ev.relationship === 'CONTRADICTS') relTagColor = [220, 38, 38];
    if (ev.relationship === 'CONTEXT') relTagColor = [2, 132, 199];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(relTagColor[0], relTagColor[1], relTagColor[2]);
    doc.text(`[${ev.relationship}]`, pageWidth - margin - 12, y + 14, { align: 'right' });

    // Article Title
    if (ev.title) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 70, 65);
      const titleLines = doc.splitTextToSize(ev.title, contentWidth - 24);
      doc.text(titleLines[0], margin + 12, y + 26);
    }

    // Verbatim Quote
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(44, 40, 37);
    doc.text(quoteLines, margin + 12, y + 40);

    // URL reference & clickable link
    if (ev.url) {
      const urlY = y + cardHeight - 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(37, 99, 235); // blue-600

      const displayUrl = ev.url.length > 90 ? ev.url.substring(0, 90) + '...' : ev.url;
      doc.text(displayUrl, margin + 12, urlY);

      // Add clickable hyperlink inside PDF
      try {
        const textWidth = doc.getTextWidth(displayUrl);
        doc.link(margin + 12, urlY - 7, textWidth, 9, { url: ev.url });
      } catch {
        // Fallback if link placement fails
      }
    }

    y += cardHeight + 10;
  });

  // ---------------- DISCLAIMER & METHODOLOGY ----------------
  checkPageBreak(50);
  doc.setFillColor(245, 245, 244);
  doc.setDrawColor(229, 225, 220);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(87, 83, 78);
  doc.text('TRANSPARENCY & METHODOLOGY DISCLAIMER', margin + 10, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  const disclaimerText = 'This report was synthesized by FactCheckAI utilizing retrieved evidence from public records, institutional databases, and journalistic consensus. Users should review cited sources before making critical legal, financial, or medical determinations.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 20);
  doc.text(disclaimerLines, margin + 10, y + 22);

  // ---------------- FOOTER & PAGE NUMBERING ----------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);

    doc.setDrawColor(229, 225, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);

    doc.text(
      'Verified with FactCheckAI Evidence Engine • Multi-source institutional audit',
      margin,
      pageHeight - 16
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 16, { align: 'right' });
  }

  // Sanitize filename based on verified claim
  const safeClaimName = (result.claim || 'fact-check')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 35)
    .replace(/^-+|-+$/g, '');

  doc.save(`factcheck-${safeClaimName || 'report'}.pdf`);
};
