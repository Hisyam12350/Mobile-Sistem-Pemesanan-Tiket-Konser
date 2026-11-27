import QRCode from 'qrcode';

/**
 * Generates a scannable 2D QR matrix (0 = white, 1 = black) for any text payload.
 */
export function generateQrMatrix(value: string): number[][] {
  const safeValue = (value || 'CONCERTIX-TICKET').trim();
  const qr = QRCode.create(safeValue, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const matrix: number[][] = [];

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push(qr.modules.get(r, c) ? 1 : 0);
    }
    matrix.push(row);
  }
  return matrix;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function adler32(bytes: Uint8Array): number {
  let a = 1;
  let b = 0;
  const MOD = 65521;
  for (let i = 0; i < bytes.length; i++) {
    a = (a + bytes[i]) % MOD;
    b = (b + a) % MOD;
  }
  return ((b << 16) | a) >>> 0;
}

function writeU32BE(buf: Uint8Array, offset: number, val: number) {
  buf[offset] = (val >>> 24) & 0xff;
  buf[offset + 1] = (val >>> 16) & 0xff;
  buf[offset + 2] = (val >>> 8) & 0xff;
  buf[offset + 3] = val & 0xff;
}

function makePngChunk(type: string, data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12 + data.length);
  writeU32BE(chunk, 0, data.length);
  for (let i = 0; i < 4; i++) {
    chunk[4 + i] = type.charCodeAt(i);
  }
  chunk.set(data, 8);
  const crcInput = chunk.subarray(4, 8 + data.length);
  writeU32BE(chunk, 8 + data.length, crc32(crcInput));
  return chunk;
}

/**
 * Encodes a 0/1 QR matrix directly into a valid uncompressed Grayscale PNG (Uint8Array)
 * so E-Tickets can be saved to the device gallery even without backend PNG connectivity.
 */
export function encodeQrMatrixToPngBytes(
  matrix: number[][],
  targetSize = 480,
  quietModules = 3
): Uint8Array {
  const modulesCount = matrix.length || 21;
  const totalModules = modulesCount + quietModules * 2;
  const scale = Math.max(4, Math.floor(targetSize / totalModules));
  const width = totalModules * scale;
  const height = width;

  // Each scanline has 1 filter byte (0) + `width` grayscale bytes
  const rowStride = 1 + width;
  const rawScanlines = new Uint8Array(rowStride * height);
  rawScanlines.fill(255); // White background

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawScanlines[rowOffset] = 0; // Filter type 0 (None)
    const modY = Math.floor(y / scale) - quietModules;
    if (modY < 0 || modY >= modulesCount) continue;

    const matrixRow = matrix[modY];
    for (let modX = 0; modX < modulesCount; modX++) {
      if (matrixRow[modX] === 1) {
        const pxStart = rowOffset + 1 + (modX + quietModules) * scale;
        rawScanlines.fill(0, pxStart, pxStart + scale);
      }
    }
  }

  // Wrap raw scanlines in valid zlib stream using uncompressed DEFLATE store blocks (max 65535 bytes/block)
  const MAX_BLOCK = 65535;
  const numBlocks = Math.ceil(rawScanlines.length / MAX_BLOCK);
  const zlibBuf = new Uint8Array(2 + rawScanlines.length + numBlocks * 5 + 4);
  zlibBuf[0] = 0x78; // CMF
  zlibBuf[1] = 0x01; // FLG (no dict, fastest)

  let zPos = 2;
  for (let offset = 0; offset < rawScanlines.length; offset += MAX_BLOCK) {
    const end = Math.min(offset + MAX_BLOCK, rawScanlines.length);
    const len = end - offset;
    const isFinal = end === rawScanlines.length ? 1 : 0;

    zlibBuf[zPos++] = isFinal;
    zlibBuf[zPos++] = len & 0xff;
    zlibBuf[zPos++] = (len >>> 8) & 0xff;
    const nlen = ~len & 0xffff;
    zlibBuf[zPos++] = nlen & 0xff;
    zlibBuf[zPos++] = (nlen >>> 8) & 0xff;
    zlibBuf.set(rawScanlines.subarray(offset, end), zPos);
    zPos += len;
  }
  writeU32BE(zlibBuf, zPos, adler32(rawScanlines));

  const ihdrData = new Uint8Array(13);
  writeU32BE(ihdrData, 0, width);
  writeU32BE(ihdrData, 4, height);
  ihdrData[8] = 8; // Bit depth 8
  ihdrData[9] = 0; // Color type 0 (Grayscale)
  ihdrData[10] = 0; // Compression 0
  ihdrData[11] = 0; // Filter 0
  ihdrData[12] = 0; // Interlace 0

  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = makePngChunk('IHDR', ihdrData);
  const idat = makePngChunk('IDAT', zlibBuf);
  const iend = makePngChunk('IEND', new Uint8Array(0));

  const png = new Uint8Array(signature.length + ihdr.length + idat.length + iend.length);
  let p = 0;
  png.set(signature, p);
  p += signature.length;
  png.set(ihdr, p);
  p += ihdr.length;
  png.set(idat, p);
  p += idat.length;
  png.set(iend, p);

  return png;
}

const BASE64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i];
    const hasB1 = i + 1 < len;
    const hasB2 = i + 2 < len;
    const b1 = hasB1 ? bytes[i + 1] : 0;
    const b2 = hasB2 ? bytes[i + 2] : 0;

    const triple = (b0 << 16) | (b1 << 8) | b2;
    result += BASE64_CHARS[(triple >>> 18) & 0x3f];
    result += BASE64_CHARS[(triple >>> 12) & 0x3f];
    result += hasB1 ? BASE64_CHARS[(triple >>> 6) & 0x3f] : '=';
    result += hasB2 ? BASE64_CHARS[triple & 0x3f] : '=';
  }
  return result;
}

/**
 * Converts a QR matrix into a crisp PNG data URI suitable for React Native Image / Web img
 * without subpixel seams between adjacent modules.
 */
export function encodeQrMatrixToPngDataUri(
  matrix: number[][],
  targetSize = 360,
  quietModules = 2
): string {
  const pngBytes = encodeQrMatrixToPngBytes(matrix, targetSize, quietModules);
  return `data:image/png;base64,${uint8ArrayToBase64(pngBytes)}`;
}
