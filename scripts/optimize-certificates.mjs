import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const CERT_DIRS = ['public/certificates', 'public/additionalCertificates'];
const RED_CARPET_SRC = 'public/Projects/redCarpetFrontPage.png';
const RED_CARPET_DEST = 'public/Projects/redCarpetFrontPage.webp';

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function optimizeCertificateDir(dirPath) {
  const thumbsDir = path.join(dirPath, 'thumbs');
  const previewDir = path.join(dirPath, 'preview');
  fs.mkdirSync(thumbsDir, { recursive: true });
  fs.mkdirSync(previewDir, { recursive: true });

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const pngFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
    .map((entry) => entry.name);

  let origBytes = 0;
  let thumbBytes = 0;
  let previewBytes = 0;

  for (const filename of pngFiles) {
    const srcPath = path.join(dirPath, filename);
    const basename = path.basename(filename, path.extname(filename));
    const thumbPath = path.join(thumbsDir, `${basename}.webp`);
    const previewPath = path.join(previewDir, `${basename}.webp`);

    const srcStat = fs.statSync(srcPath);
    origBytes += srcStat.size;

    await sharp(srcPath)
      .rotate()
      .resize({ width: 520, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(thumbPath);

    await sharp(srcPath)
      .rotate()
      .resize({ width: 1400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86, effort: 5 })
      .toFile(previewPath);

    thumbBytes += fs.statSync(thumbPath).size;
    previewBytes += fs.statSync(previewPath).size;
  }

  console.log(
    `${dirPath}: ${pngFiles.length} PNGs (${formatKB(origBytes)}) -> thumbs ${formatKB(thumbBytes)}, preview ${formatKB(previewBytes)}`
  );
  return { count: pngFiles.length, origBytes, thumbBytes, previewBytes };
}

async function optimizeRedCarpetHero() {
  if (!fs.existsSync(RED_CARPET_SRC)) {
    throw new Error(`Missing source image: ${RED_CARPET_SRC}`);
  }
  const origSize = fs.statSync(RED_CARPET_SRC).size;
  await sharp(RED_CARPET_SRC)
    .rotate()
    .resize({ width: 1400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(RED_CARPET_DEST);
  const destSize = fs.statSync(RED_CARPET_DEST).size;
  console.log(`${RED_CARPET_SRC} (${formatKB(origSize)}) -> ${RED_CARPET_DEST} (${formatKB(destSize)})`);
}

async function main() {
  let totalOrig = 0;
  let totalThumbs = 0;
  let totalPreviews = 0;

  for (const dir of CERT_DIRS) {
    const res = await optimizeCertificateDir(dir);
    totalOrig += res.origBytes;
    totalThumbs += res.thumbBytes;
    totalPreviews += res.previewBytes;
  }

  await optimizeRedCarpetHero();
  console.log(
    `Total certificate PNGs: ${formatKB(totalOrig)} | Total thumbs: ${formatKB(totalThumbs)} | Total previews: ${formatKB(totalPreviews)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
