/**
 * Generate SVG for neon signs with glow effect
 */
export function generateNeonSignSVG(options = {}) {
    const {
        text = 'NEON',
        font = 'Arial',
        color = '#FF1493', // Hot pink default
        width = 600,
        height = 200,
        glowIntensity = 20,
    } = options;

    const fontSize = Math.min(width / text.length * 1.2, height * 0.6);
    const textY = height / 2 + fontSize / 3;

    // Create glow filter ID
    const glowId = `neon-glow-${Math.random().toString(36).substr(2, 9)}`;

    return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${glowIntensity}" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${adjustBrightness(color, 40)};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Dark background for neon effect -->
      <rect width="${width}" height="${height}" fill="#1a1a1a" rx="8"/>
      
      <!-- Neon text with glow -->
      <text 
        x="${width / 2}" 
        y="${textY}" 
        font-family="${font}, sans-serif" 
        font-size="${fontSize}" 
        fill="url(#neonGradient)" 
        text-anchor="middle" 
        font-weight="bold"
        filter="url(#${glowId})"
        stroke="${color}"
        stroke-width="2"
      >${escapeXml(text)}</text>
    </svg>
  `.trim();
}

/**
 * Adjust color brightness (helper function - already exists in svgRenderer.js)
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
 * Escape XML special characters (helper function - already exists)
 */
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
