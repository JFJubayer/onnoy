/**
 * Onnoy (অন্বয়) - Course Certificate Generator & Exporter
 * Renders high-resolution certificates on HTML5 Canvas, generates verification codes,
 * and provides 1-click Download (PNG) and Print (PDF) functionality.
 */

(function () {
  function renderCertificateOnCanvas(cert, canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1600;
    const height = 1130;
    canvas.width = width;
    canvas.height = height;

    // Background - soft cream / off-white paper
    ctx.fillStyle = '#FCFDFB';
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    // Outer emerald border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Thin inner gold accent border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(46, 46, width - 92, height - 92);

    // Corner flourishes / geometric accents
    drawCornerFlourish(ctx, 46, 46);
    drawCornerFlourish(ctx, width - 46, 46, true, false);
    drawCornerFlourish(ctx, 46, height - 46, false, true);
    drawCornerFlourish(ctx, width - 46, height - 46, true, true);

    // Organization Eyebrow
    ctx.textAlign = 'center';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#047857';
    ctx.letterSpacing = '4px';
    ctx.fillText('ONNOY — অন্বয় FOUNDATION', width / 2, 130);

    ctx.font = '500 16px "Inter", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('YOUTH INITIATIVE FOR DIGITAL RESPONSIBILITY & CYBER SAFETY', width / 2, 160);

    // Certificate Main Title
    ctx.font = '700 54px "Plus Jakarta Sans", serif';
    ctx.fillStyle = '#0F172A';
    ctx.letterSpacing = '2px';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 250);

    ctx.font = '400 22px "Inter", sans-serif';
    ctx.fillStyle = '#059669';
    ctx.letterSpacing = '3px';
    ctx.fillText('সফলভাবে সম্পন্ন করার স্বীকৃতি সনদ', width / 2, 290);

    // Presentation text
    ctx.font = '400 22px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.letterSpacing = '0px';
    ctx.fillText('This is proudly presented to', width / 2, 360);

    // Student Name (Prominent)
    ctx.font = '700 60px "Plus Jakarta Sans", serif';
    ctx.fillStyle = '#047857';
    ctx.fillText(cert.studentName || 'Student Name', width / 2, 440);

    // Decorative underline under name
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 465);
    ctx.lineTo(width / 2 + 250, 465);
    ctx.stroke();

    // Institution & District details
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillStyle = '#1E293B';
    const institutionText = cert.institution ? `${cert.institution}, ${cert.district || 'Bangladesh'}` : (cert.district || 'Bangladesh');
    ctx.fillText(institutionText, width / 2, 515);

    // Achievement Description
    ctx.font = '400 20px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('for successfully completing all video lectures, interactive learning checkpoints, and achieving a perfect', width / 2, 580);
    ctx.fillText('score on all knowledge assessments in the foundational curriculum of:', width / 2, 615);

    // Course Title Banner
    ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(cert.courseTitle || 'Digital Responsibility & Cyber Safety Course', width / 2, 680);

    // Central Verified Badge / Seal
    drawCertificateSeal(ctx, width / 2, 810);

    // Signatures and Metadata footer
    const leftX = 260;
    const rightX = width - 260;
    const sigY = 960;

    // Left: Date & Verification ID
    ctx.textAlign = 'center';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(cert.issueDateFormatted || new Date().toLocaleDateString(), leftX, sigY);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftX - 120, sigY + 12);
    ctx.lineTo(leftX + 120, sigY + 12);
    ctx.stroke();

    ctx.font = '500 15px "Inter", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Date of Completion', leftX, sigY + 36);

    ctx.font = '600 14px monospace';
    ctx.fillStyle = '#047857';
    ctx.fillText(`ID: ${cert.certificateId}`, leftX, sigY + 62);

    // Right: Authorized Signature
    ctx.font = 'italic 700 24px "Plus Jakarta Sans", cursive';
    ctx.fillStyle = '#064E3B';
    ctx.fillText('Jubayer Talukdar', rightX, sigY - 5);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightX - 120, sigY + 12);
    ctx.lineTo(rightX + 120, sigY + 12);
    ctx.stroke();

    ctx.font = '500 15px "Inter", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Director & Lead Facilitator', rightX, sigY + 36);

    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Onnoy — অন্বয় Bangladesh', rightX, sigY + 62);

    // Verification Footer note
    ctx.textAlign = 'center';
    ctx.font = '400 13px "Inter", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Official verification: ${cert.verificationUrl}`, width / 2, 1075);
  }

  function drawCornerFlourish(ctx, x, y, flipX = false, flipY = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 40);
    ctx.moveTo(10, 10);
    ctx.arc(10, 10, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawCertificateSeal(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Outer scalloped/circular glow
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fillStyle = '#ECFDF5';
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner gold ring
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Checkmark or Ribbon emblem
    ctx.beginPath();
    ctx.moveTo(-18, -2);
    ctx.lineTo(-5, 12);
    ctx.lineTo(20, -14);
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Seal text
    ctx.textAlign = 'center';
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#065F46';
    ctx.fillText('VERIFIED', 0, 32);

    ctx.restore();
  }

  function openCertificateModal() {
    const progress = OnnoyCourseStore.getProgress();
    const allCompleted = ONNOY_COURSE_LESSONS.every(l => progress.completedLessons && progress.completedLessons.includes(l.id));
    if (!allCompleted || !progress.isCourseFinished) {
      alert('Certificate Locked 🔒\n\nYou must complete all 5 lessons and answer all 5 questions correctly per video to earn and view your certificate.');
      return;
    }

    let cert = OnnoyCourseStore.getCertificate();
    if (!cert) {
      cert = OnnoyCourseStore.generateCertificateRecord();
    }

    if (!cert) {
      alert('You must complete all lessons and pass all quizzes with 100% correct answers to unlock your certificate!');
      return;
    }

    const modal = document.getElementById('certificate-modal');
    const canvas = document.getElementById('certificate-canvas');

    if (!modal || !canvas) return;

    renderCertificateOnCanvas(cert, canvas);
    modal.classList.add('active');

    // Update download link
    const downloadBtn = document.getElementById('btn-download-cert-png');
    if (downloadBtn) {
      downloadBtn.onclick = function () {
        const link = document.createElement('a');
        link.download = `Onnoy-Certificate-${cert.studentName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      };
    }

    // Print button
    const printBtn = document.getElementById('btn-print-cert-pdf');
    if (printBtn) {
      printBtn.onclick = function () {
        window.print();
      };
    }

    // Copy link button
    const copyBtn = document.getElementById('btn-copy-cert-link');
    if (copyBtn) {
      copyBtn.onclick = function () {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cert.verificationUrl).then(() => {
            copyBtn.textContent = 'Copied to Clipboard! ✓';
            setTimeout(() => {
              copyBtn.textContent = 'Copy Verification Link';
            }, 3000);
          }).catch(() => {
            prompt('Copy your certificate link:', cert.verificationUrl);
          });
        } else {
          prompt('Copy your certificate link:', cert.verificationUrl);
        }
      };
    }

    const closeBtn = document.getElementById('close-certificate-modal');
    if (closeBtn) {
      closeBtn.onclick = function () {
        modal.classList.remove('active');
      };
    }
  }

  // Export
  window.OnnoyCertificateViewer = openCertificateModal;
})();
