import { formatClock } from './date.js';
import { getLanguage, t } from './i18n.js';

function concatBytes(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

function ascii(text) {
  return new TextEncoder().encode(text);
}

function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function imageBytesToPdf(jpegBytes, imageWidth, imageHeight) {
  const pageWidth = 842;
  const pageHeight = 595;
  const chunks = [];
  const offsets = [0];
  let length = 0;

  function push(chunk) {
    chunks.push(chunk);
    length += chunk.length;
  }

  function pushText(text) {
    push(ascii(text));
  }

  push(ascii('%PDF-1.4\n'));
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  function object(number, body) {
    offsets[number] = length;
    pushText(`${number} 0 obj\n${body}\nendobj\n`);
  }

  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
  );

  offsets[4] = length;
  pushText(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
  );
  push(jpegBytes);
  pushText('\nendstream\nendobj\n');

  const content = `q ${pageWidth} 0 0 ${pageHeight} 0 0 cm /Im0 Do Q`;
  object(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xrefOffset = length;
  pushText('xref\n0 6\n');
  pushText('0000000000 65535 f \n');

  for (let i = 1; i <= 5; i += 1) {
    pushText(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }

  pushText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return concatBytes(chunks);
}

function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function fitText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let value = text;

  while (value.length > 2 && ctx.measureText(`${value}…`).width > maxWidth) {
    value = value.slice(0, -1);
  }

  return `${value}…`;
}

export function downloadMonthlySchedulePdf({
  rows,
  year,
  month,
  timeZone,
  language,
  sourceName = '',
}) {
  const locale = getLanguage(language).locale;
  const monthDate = new Date(Date.UTC(year, month - 1, 1));
  const monthTitle = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(monthDate);

  const width = 2400;
  const height = 1697;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.direction = language === 'ar' ? 'rtl' : 'ltr';
  ctx.fillStyle = '#f8f5ee';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#174f3a';
  ctx.font = '700 58px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Lamaz Xan', 92, 95);

  ctx.fillStyle = '#1e2923';
  ctx.font = '700 48px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${t(language, 'calendar.pdfTitle')} — ${monthTitle}`, width / 2, 160);

  ctx.fillStyle = '#737b75';
  ctx.font = '400 25px Arial, sans-serif';
  ctx.fillText(
    sourceName
      ? `${t(language, 'calendar.source')}: ${sourceName}`
      : t(language, 'calendar.calculatedSource'),
    width / 2,
    204,
  );

  const prayerKeys = ['fajr', 'sunrise', 'duha', 'dhuhr', 'asr', 'maghrib', 'isha', 'qiyam'];
  const headers = [
    t(language, 'calendar.date'),
    ...prayerKeys.map((key) => t(language, `prayer.${key}`)),
  ];

  const left = 72;
  const top = 250;
  const tableWidth = width - left * 2;
  const dateWidth = 260;
  const otherWidth = (tableWidth - dateWidth) / prayerKeys.length;
  const headerHeight = 64;
  const rowHeight = 42;
  const columnWidths = [dateWidth, ...prayerKeys.map(() => otherWidth)];

  let x = left;

  ctx.fillStyle = '#e9f0e9';
  ctx.fillRect(left, top, tableWidth, headerHeight);

  ctx.strokeStyle = '#d8ddd7';
  ctx.lineWidth = 2;

  ctx.font = '700 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#174f3a';

  headers.forEach((header, index) => {
    const cellWidth = columnWidths[index];
    ctx.strokeRect(x, top, cellWidth, headerHeight);
    ctx.fillText(
      fitText(ctx, header, cellWidth - 18),
      x + cellWidth / 2,
      top + headerHeight / 2,
    );
    x += cellWidth;
  });

  rows.forEach((row, rowIndex) => {
    const y = top + headerHeight + rowIndex * rowHeight;
    x = left;

    if (rowIndex % 2 === 0) {
      ctx.fillStyle = '#fffdf8';
      ctx.fillRect(left, y, tableWidth, rowHeight);
    }

    const weekday = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      timeZone,
    }).format(row.date);

    const values = [
      `${row.dateParts.day} ${weekday}`,
      ...prayerKeys.map((key) => formatClock(row.times[key], timeZone, language)),
    ];

    ctx.font = '400 23px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#252e29';

    values.forEach((value, index) => {
      const cellWidth = columnWidths[index];
      ctx.strokeRect(x, y, cellWidth, rowHeight);
      ctx.fillText(
        fitText(ctx, value, cellWidth - 16),
        x + cellWidth / 2,
        y + rowHeight / 2,
      );
      x += cellWidth;
    });
  });

  ctx.fillStyle = '#8a918c';
  ctx.font = '400 20px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    `${t(language, 'prayer.qiyam')}: ${t(language, 'prayer.lastThird')}`,
    left,
    height - 55,
  );

  const jpegBytes = dataUrlToBytes(canvas.toDataURL('image/jpeg', 0.94));
  const pdfBytes = imageBytesToPdf(jpegBytes, width, height);
  const filename = `lamaz-xan-${year}-${String(month).padStart(2, '0')}.pdf`;

  downloadBytes(pdfBytes, filename);
}
