/**
 * Generate SVG for name plate preview
 */
export function generateNamePlateSVG(options = {}) {
  const {
    text = 'Your Name',
    font = 'Arial',
    color = '#000000',
    width = 400,
    height = 150,
    backgroundColor = '#f5f5f5',
    transparentBackground = false,
  } = options;

  const fontSize = Math.min(width / text.length * 1.5, height * 0.5);
  const textY = height / 2 + fontSize / 3;

  const backgroundElement = transparentBackground
    ? ''
    : `
      <defs>
        <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(backgroundColor, -10)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="8" fill="url(#plateGradient)" stroke="#ddd" stroke-width="2"/>
    `;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      ${backgroundElement}
      <text 
        x="${width / 2}" 
        y="${textY}" 
        font-family="${font}, sans-serif" 
        font-size="${fontSize}" 
        fill="${color}" 
        text-anchor="middle" 
        font-weight="600"
      >${escapeXml(text)}</text>
    </svg>
  `.trim();
}

/**
 * Generate SVG for metal letters preview
 */
export function generateMetalLettersSVG(options = {}) {
  const {
    text = 'ABC',
    font = 'Arial',
    color = '#c0c0c0',
    letterSpacing = 20,
    fontSize = 120,
  } = options;

  const letters = text.split('');
  const totalWidth = letters.length * fontSize + (letters.length - 1) * letterSpacing;
  const height = fontSize * 1.5;

  let letterElements = '';
  let xPos = fontSize / 2;

  letters.forEach((letter) => {
    letterElements += `
      <text 
        x="${xPos}" 
        y="${height / 2 + fontSize / 3}" 
        font-family="${font}, sans-serif" 
        font-size="${fontSize}" 
        fill="url(#metalGradient)" 
        text-anchor="middle" 
        font-weight="bold"
      >${escapeXml(letter)}</text>
    `;
    xPos += fontSize + letterSpacing;
  });

  return `
    <svg width="${totalWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${adjustBrightness(color, 20)};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      ${letterElements}
    </svg>
  `.trim();
}

/**
 * Adjust color brightness
 */
function adjustBrightness(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate SVG for neon signs with glow effect
 */
export function generateNeonSignSVG(options = {}) {
  const {
    text = 'NEON',
    font = 'Arial',
    color = '#FF1493',
    glowColor = '#FF1493',
    width = 600,
    height = 200,
    glowIntensity = 20,
    isOn = true
  } = options;

  const fontSize = Math.min(width / text.length * 1.2, height * 0.6);
  const textY = height / 2 + fontSize / 3;
  const uniqueId = Math.random().toString(36).substr(2, 9);
  const glowId = `neon-glow-${uniqueId}`;

  // Filters for Glow
  const filterDef = isOn ? `
    <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
      <!-- Inner Glow -->
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2"/>
      <!-- Outer Glow -->
      <feGaussianBlur in="SourceGraphic" stdDeviation="${glowIntensity / 2}" result="blur10"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="${glowIntensity}" result="blur20"/>
      
      <!-- Merge -->
      <feMerge>
        <feMergeNode in="blur20"/>
        <feMergeNode in="blur10"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  ` : '';

  // Text Styling
  // Off: Darker, solid stroke, no fill or dark fill
  // On: White/Light fill (tube), Colored stroke + Glow filter

  const textFill = isOn ? '#FFFFFF' : adjustBrightness(color, -50);
  const textStroke = isOn ? color : adjustBrightness(color, -30);
  const opacity = isOn ? 1 : 0.8;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        ${filterDef}
      </defs>
      <text 
        x="${width / 2}" 
        y="${textY}" 
        font-family="${font}, sans-serif" 
        font-size="${fontSize}" 
        fill="${textFill}"
        stroke="${textStroke}"
        stroke-width="${isOn ? 3 : 2}"
        stroke-linejoin="round"
        text-anchor="middle" 
        font-weight="bold"
        filter="${isOn ? `url(#${glowId})` : ''}"
        opacity="${opacity}"
      >${escapeXml(text)}</text>
    </svg>
  `.trim();
}
