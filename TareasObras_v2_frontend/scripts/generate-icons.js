const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(size, primaryColor, accentColor) {
  const width = size;
  const height = size;

  // Raw RGBA buffer with filter byte at start of each scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  const radius = size * 0.44;
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded shield or circle
      if (dist <= radius) {
        // Gradient dark slate to dark blue
        const t = y / height;
        const r = Math.round(15 * (1 - t) + 30 * t);
        const g = Math.round(23 * (1 - t) + 41 * t);
        const b = Math.round(42 * (1 - t) + 88 * t);

        // Construction helmet / badge shape in center
        const inBadge = (Math.abs(dx) < size * 0.28 && Math.abs(dy) < size * 0.28);
        const inAccent = (Math.abs(dx) < size * 0.16 && dy > -size * 0.15 && dy < size * 0.15);

        if (inAccent) {
          // Amber construction accent
          rawData[pxOffset] = 245;     // R
          rawData[pxOffset + 1] = 158; // G
          rawData[pxOffset + 2] = 11;  // B
          rawData[pxOffset + 3] = 255; // A
        } else if (inBadge) {
          // Blue badge accent
          rawData[pxOffset] = 59;      // R
          rawData[pxOffset + 1] = 130; // G
          rawData[pxOffset + 2] = 246; // B
          rawData[pxOffset + 3] = 255; // A
        } else {
          rawData[pxOffset] = r;
          rawData[pxOffset + 1] = g;
          rawData[pxOffset + 2] = b;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent outside circular mask
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  }
  return (c ^ 0xffffffff) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  table[i] = c >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const outDir = path.join(__dirname, '../public/icons');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPNG(512));
fs.writeFileSync(path.join(outDir, 'icon-maskable-512.png'), createPNG(512));
console.log('Icons generated successfully in public/icons/');
