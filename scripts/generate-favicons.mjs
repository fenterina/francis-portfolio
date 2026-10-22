import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'public/images/logo-white.png';
const PUBLIC_DIR = 'public';

async function generatePng(size, filename) {
  const dest = path.join(PUBLIC_DIR, filename);
  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(dest);
  console.log(`Generated ${dest} (${size}x${size})`);
}

async function createBmpIco(imageSizes, srcPath, destPath) {
  const count = imageSizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const entries = [];
  const imageBuffers = [];

  for (const size of imageSizes) {
    const { data } = await sharp(srcPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // BITMAPINFOHEADER (40 bytes)
    const bih = Buffer.alloc(40);
    bih.writeUInt32LE(40, 0); // biSize
    bih.writeInt32LE(size, 4); // biWidth
    bih.writeInt32LE(size * 2, 8); // biHeight (doubled for XOR + AND masks)
    bih.writeUInt16LE(1, 12); // biPlanes
    bih.writeUInt16LE(32, 14); // biBitCount
    bih.writeUInt32LE(0, 16); // biCompression = BI_RGB
    bih.writeUInt32LE(size * size * 4, 20); // biSizeImage

    const xorMask = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      const srcY = size - 1 - y;
      for (let x = 0; x < size; x++) {
        const srcIdx = (srcY * size + x) * 4;
        const dstIdx = (y * size + x) * 4;
        xorMask[dstIdx] = data[srcIdx + 2];     // B
        xorMask[dstIdx + 1] = data[srcIdx + 1]; // G
        xorMask[dstIdx + 2] = data[srcIdx];     // R
        xorMask[dstIdx + 3] = data[srcIdx + 3]; // A
      }
    }

    const andRowBytes = Math.ceil(size / 32) * 4;
    const andMask = Buffer.alloc(andRowBytes * size);
    for (let y = 0; y < size; y++) {
      const srcY = size - 1 - y;
      for (let x = 0; x < size; x++) {
        const alpha = data[(srcY * size + x) * 4 + 3];
        if (alpha === 0) {
          const byteIdx = y * andRowBytes + Math.floor(x / 8);
          const bitIdx = 7 - (x % 8);
          andMask[byteIdx] |= (1 << bitIdx);
        }
      }
    }

    const imgBuf = Buffer.concat([bih, xorMask, andMask]);
    imageBuffers.push(imgBuf);

    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(imgBuf.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);

    offset += imgBuf.length;
  }

  const icoBuf = Buffer.concat([header, ...entries, ...imageBuffers]);
  fs.writeFileSync(destPath, icoBuf);
  console.log(`Generated ${destPath} (sizes: ${imageSizes.join(',')})`);
}

async function main() {
  await generatePng(16, 'favicon-16x16.png');
  await generatePng(32, 'favicon-32x32.png');
  await generatePng(48, 'favicon-48x48.png');
  await generatePng(96, 'favicon-96x96.png');
  await generatePng(180, 'apple-touch-icon.png');
  await generatePng(192, 'favicon-192x192.png');

  await createBmpIco([16, 32, 48], SRC, path.join(PUBLIC_DIR, 'favicon.ico'));

  console.log('All favicon assets generated successfully!');
}

main().catch(console.error);
