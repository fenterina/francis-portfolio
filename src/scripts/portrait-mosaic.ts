interface Point {
	x: number;
	y: number;
}

interface CubicSegment {
	p0: Point;
	p1: Point;
	p2: Point;
	p3: Point;
}

interface StarParticle {
	x: number;
	y: number;
	size: number;
	baseAlpha: number;
	colorRgb: string;
	phase: number;
	speed: number;
}

interface TileParticle {
	tx: number;
	ty: number;
	sx: number;
	sy: number;
	vxMid: number;
	vyMid: number;
	size: number;
	val: number;
	spriteIdx: number;
	isSprite: boolean;
	spriteAlpha: number;
	highlightAlpha: number;
	highlightStyle: string;
	fillStyle: string;
	starFillStyle: string;
	occAlpha: number;
	spawnDelay: number;
	lockDelay: number;
	shimmerPhase: number;
	shimmerSpeed: number;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
}

interface SignaturePolyline {
	points: Point[];
	cumLengths: Float64Array;
	totalLength: number;
}

interface MosaicScene {
	width: number;
	height: number;
	dpr: number;
	sigWidth: number;
	startX: number;
	startY: number;
	gridSize: number;
	stars: StarParticle[];
	tiles: TileParticle[];
	occCanvas: HTMLCanvasElement | null;
	stroke1: SignaturePolyline;
	stroke2: SignaturePolyline;
}

const EMERGE_END_MS = 650;
const PLUME_PEAK_MS = 1450;
const CONVERGENCE_END_MS = 3150;
const STROKE1_START_MS = 700;
const STROKE1_END_MS = 1550;
const STROKE2_START_MS = 1650;
const STROKE2_END_MS = 3250;
const ENTRANCE_DONE_MS = 3350;
const MAX_LOCK_DELAY_MS = 420;
const FULL_SETTLE_MS = Math.max(CONVERGENCE_END_MS - 350 + MAX_LOCK_DELAY_MS, STROKE2_END_MS);

const POINTER_RADIUS = 110;
const POINTER_MAX_PUSH = 13;
const SPRING_STIFFNESS = 0.11;
const SPRING_DAMPING = 0.8;
const SETTLE_EPSILON = 0.04;

const V6_CENTER_X = 720;
const V6_CENTER_Y = 394;
const V6_GRID_SIZE = 732;
const SIGNATURE_STROKE_STYLE = 'rgba(232, 242, 255, 0.64)';

const SPRITE_IMAGE_SRCS = [
	'/Projects/redCarpetFrontPage.png',
	'/images/hero-cityscape.webp',
	'/images/footer-illustration.webp',
] as const;

const UI_PALETTES: readonly [string, string, string, string][] = [
	['#0b1433', '#ffffff', '#4169e1', '#38bdf8'],
	['#111c44', '#edf4ff', '#60a5fa', '#818cf8'],
	['#091029', '#dbeafe', '#3b82f6', '#22d3ee'],
	['#14245a', '#f8fafc', '#8b5cf6', '#f59e0b'],
];

const SIGNATURE_STROKE_1: readonly CubicSegment[] = [
	{
		p0: { x: 430, y: 412 },
		p1: { x: 444, y: 302 },
		p2: { x: 464, y: 174 },
		p3: { x: 480, y: 106 },
	},
	{
		p0: { x: 480, y: 106 },
		p1: { x: 486, y: 74 },
		p2: { x: 464, y: 72 },
		p3: { x: 454, y: 112 },
	},
	{
		p0: { x: 454, y: 112 },
		p1: { x: 436, y: 186 },
		p2: { x: 430, y: 336 },
		p3: { x: 438, y: 468 },
	},
	{
		p0: { x: 438, y: 468 },
		p1: { x: 442, y: 504 },
		p2: { x: 458, y: 506 },
		p3: { x: 480, y: 444 },
	},
];

const SIGNATURE_STROKE_2: readonly CubicSegment[] = [
	{
		p0: { x: 278, y: 304 },
		p1: { x: 410, y: 286 },
		p2: { x: 740, y: 268 },
		p3: { x: 958, y: 284 },
	},
	{
		p0: { x: 958, y: 284 },
		p1: { x: 1034, y: 290 },
		p2: { x: 1022, y: 332 },
		p3: { x: 916, y: 354 },
	},
	{
		p0: { x: 916, y: 354 },
		p1: { x: 735, y: 392 },
		p2: { x: 410, y: 386 },
		p3: { x: 338, y: 356 },
	},
	{
		p0: { x: 338, y: 356 },
		p1: { x: 298, y: 338 },
		p2: { x: 368, y: 306 },
		p3: { x: 560, y: 294 },
	},
	{
		p0: { x: 560, y: 294 },
		p1: { x: 815, y: 278 },
		p2: { x: 1085, y: 282 },
		p3: { x: 1295, y: 250 },
	},
];

let activeCleanup: (() => void) | null = null;
let swapListenerBound = false;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const smoothstep = (e0: number, e1: number, x: number): number => {
	const t = clamp01((x - e0) / (e1 - e0));
	return t * t * (3 - 2 * t);
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

function createRng(initialSeed = 6109): () => number {
	let seed = initialSeed;
	return () => {
		seed = (seed * 16807) % 2147483647;
		return (seed - 1) / 2147483646;
	};
}

function hash2(x: number, y: number): number {
	const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
	return h - Math.floor(h);
}

function noise2(x: number, y: number): number {
	const ix = Math.floor(x);
	const iy = Math.floor(y);
	const fx = x - ix;
	const fy = y - iy;
	const ux = fx * fx * (3 - 2 * fx);
	const uy = fy * fy * (3 - 2 * fy);
	const a = hash2(ix, iy);
	const b = hash2(ix + 1, iy);
	const c = hash2(ix, iy + 1);
	const d = hash2(ix + 1, iy + 1);
	return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.decoding = 'async';
		img.onload = () => {
			if (img.naturalWidth > 0 && img.naturalHeight > 0) {
				resolve(img);
			} else {
				reject(new Error(`Image loaded with zero dimensions: ${src}`));
			}
		};
		img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
		img.src = src;
		if (img.complete && img.naturalWidth > 0) {
			resolve(img);
		}
	});
}

/**
 * Generates miniature UI/portfolio tile sprites: 18 crops from loaded showcase
 * artwork when available, plus 12 procedural blue-theme dashboard micro-cards.
 */
function buildTileSprites(srcImgs: HTMLImageElement[]): HTMLCanvasElement[] {
	const tileSize = 18;
	const tileSprites: HTMLCanvasElement[] = [];

	if (srcImgs.length > 0) {
		for (let t = 0; t < 18; t++) {
			const tc = document.createElement('canvas');
			tc.width = tileSize;
			tc.height = tileSize;
			const tctx = tc.getContext('2d');
			if (!tctx) continue;

			const src = srcImgs[t % srcImgs.length];
			const srcW = src.naturalWidth || src.width;
			const srcH = src.naturalHeight || src.height;
			const rx = (0.1 + ((t * 0.23) % 0.65)) * srcW;
			const ry = (0.1 + ((t * 0.37) % 0.65)) * srcH;

			tctx.drawImage(src, rx, ry, srcW * 0.24, srcH * 0.24, 0, 0, tileSize, tileSize);
			tctx.fillStyle =
				t % 3 === 0 ? 'rgba(65, 105, 225, 0.25)' : 'rgba(169, 186, 242, 0.16)';
			tctx.fillRect(0, 0, tileSize, tileSize);
			tileSprites.push(tc);
		}
	}

	for (let u = 0; u < 12; u++) {
		const tc = document.createElement('canvas');
		tc.width = tileSize;
		tc.height = tileSize;
		const tctx = tc.getContext('2d');
		if (!tctx) continue;

		const [bg, light, accent1, accent2] = UI_PALETTES[u % UI_PALETTES.length];
		tctx.fillStyle = bg;
		tctx.fillRect(0, 0, tileSize, tileSize);
		tctx.fillStyle = light;
		tctx.fillRect(2, 2, tileSize - 4, u % 2 === 0 ? 7 : 5);
		tctx.fillStyle = accent1;
		tctx.fillRect(2, 10, 7, 6);
		tctx.fillStyle = accent2;
		tctx.fillRect(10, 10, 6, 6);
		tileSprites.push(tc);
	}

	return tileSprites;
}

/**
 * Samples the portrait offscreen, isolates the silhouette via border BFS flood-fill,
 * and evaluates directional chiaroscuro lighting across skin, hair, and crew-neck T-shirt.
 */
function samplePortraitMaskAndIntensity(
	portraitImg: HTMLImageElement,
	cols: number,
	rows: number
): { mask: Float32Array; tileVal: Float32Array } {
	const total = cols * rows;
	const mask = new Float32Array(total);
	const tileVal = new Float32Array(total);

	const off = document.createElement('canvas');
	off.width = cols;
	off.height = rows;
	const octx = off.getContext('2d');
	if (!octx) return { mask, tileVal };

	octx.imageSmoothingEnabled = true;
	octx.imageSmoothingQuality = 'high';
	if ('filter' in octx) {
		octx.filter = 'blur(0.75px)';
	}

	const imgW = portraitImg.naturalWidth || portraitImg.width;
	const imgH = portraitImg.naturalHeight || portraitImg.height;
	octx.drawImage(
		portraitImg,
		imgW * 0.03,
		imgH * 0.02,
		imgW * 0.94,
		imgH * 0.935,
		0,
		0,
		cols,
		rows
	);

	const raw = octx.getImageData(0, 0, cols, rows).data;

	// Border BFS flood-fill to isolate Francis from white backdrop.
	const isBg = new Uint8Array(total);
	const queue = new Int32Array(total);
	let qHead = 0;
	let qTail = 0;

	const isWhiteLike = (idx4: number): boolean => {
		const r = raw[idx4];
		const g = raw[idx4 + 1];
		const b = raw[idx4 + 2];
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const avgLum = (r + g + b) / 3;
		return (avgLum > 186 && max - min < 38) || avgLum > 224;
	};

	const trySeed = (c: number, r: number): void => {
		const i = r * cols + c;
		if (isBg[i]) return;
		if (c <= 0 || c >= cols - 1 || r <= 0 || isWhiteLike(i * 4)) {
			isBg[i] = 1;
			queue[qTail++] = i;
		}
	};

	for (let c = 0; c < cols; c++) trySeed(c, 0);
	for (let r = 0; r < rows; r++) {
		trySeed(0, r);
		trySeed(cols - 1, r);
	}

	while (qHead < qTail) {
		const curr = queue[qHead++];
		const cr = Math.floor(curr / cols);
		const cc = curr % cols;
		const neighbors = [
			cr > 0 ? curr - cols : -1,
			cr < rows - 1 ? curr + cols : -1,
			cc > 0 ? curr - 1 : -1,
			cc < cols - 1 ? curr + 1 : -1,
		];
		for (const n of neighbors) {
			if (n >= 0 && !isBg[n] && isWhiteLike(n * 4)) {
				isBg[n] = 1;
				queue[qTail++] = n;
			}
		}
	}

	const lum = new Float32Array(total);
	for (let r = 0; r < rows; r++) {
		const v = r / rows;
		for (let c = 0; c < cols; c++) {
			const i = r * cols + c;
			const idx4 = i * 4;
			let l = (0.299 * raw[idx4] + 0.587 * raw[idx4 + 1] + 0.114 * raw[idx4 + 2]) / 255;
			let m = isBg[i] ? 0 : 1;

			if (m > 0 && r > 0 && r < rows - 1 && c > 0 && c < cols - 1) {
				const bgn = isBg[i - 1] + isBg[i + 1] + isBg[i - cols] + isBg[i + cols];
				if (bgn > 0) {
					m = Math.max(0.2, 1 - bgn * 0.22);
					if (l > 0.55) l *= 0.4;
				}
			}

			if (v > 0.88) {
				m *= 1 - smoothstep(0.88, 0.995, v) * 0.75;
			}

			lum[i] = l;
			mask[i] = m;
		}
	}

	for (let r = 0; r < rows; r++) {
		const v = r / rows;
		for (let c = 0; c < cols; c++) {
			const i = r * cols + c;
			const m = mask[i];
			if (m < 0.05) continue;

			const u = c / cols;
			const nVal = noise2(c * 0.24, r * 0.24);

			let smoothL = lum[i];
			if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) {
				smoothL =
					(lum[i - cols] + lum[i - 1] + lum[i] * 2 + lum[i + 1] + lum[i + cols]) / 6;
			}

			const inSkin = smoothL > 0.3 && u > 0.32 && u < 0.68 && v > 0.16 && v < 0.77;
			const inFace = Math.hypot((u - 0.5) / 0.18, (v - 0.39) / 0.21) <= 1.0;

			const keySweep = smoothstep(0.45, 0.58, u);
			const leftContourRim = Math.exp(-Math.pow((u - 0.355) / 0.025, 2)) * 0.14;

			const leftEyeHole =
				Math.exp(-Math.pow((u - 0.435) / 0.036, 2)) *
				Math.exp(-Math.pow((v - 0.37) / 0.028, 2)) *
				0.8;
			const rightEyeHole =
				Math.exp(-Math.pow((u - 0.562) / 0.026, 2)) *
				Math.exp(-Math.pow((v - 0.37) / 0.02, 2)) *
				0.4;
			const leftCheekHole =
				Math.exp(-Math.pow((u - 0.425) / 0.042, 2)) *
				Math.exp(-Math.pow((v - 0.47) / 0.045, 2)) *
				0.72;
			const underChinShadow =
				Math.exp(-Math.pow((u - 0.47) / 0.06, 2)) *
				Math.exp(-Math.pow((v - 0.61) / 0.035, 2)) *
				0.58;

			let val = 0;

			if (inSkin || inFace) {
				const contrastL = Math.pow(Math.max(0, (smoothL - 0.14) / 0.8), 1.15);
				const rightPlaneFill = inFace
					? smoothstep(0.46, 0.55, u) *
						(1 - smoothstep(0.62, 0.69, u)) *
						Math.exp(-Math.pow((v - 0.39) / 0.17, 2)) *
						0.46
					: 0;
				const litBase = Math.max(contrastL, rightPlaneFill);
				val = litBase * (0.07 + keySweep * 1.02 + leftContourRim);
				val *= Math.max(
					0.05,
					1 - leftEyeHole - rightEyeHole - leftCheekHole - underChinShadow
				);

				if (inFace && u > 0.34 && u < 0.42 && v > 0.3 && v < 0.56) {
					val = Math.max(val, 0.11);
				}
			} else if (v < 0.62) {
				const leftForeheadStreak =
					Math.exp(
						-Math.pow((u - 0.425 - Math.sin((v - 0.14) * 14) * 0.015) / 0.032, 2)
					) *
					smoothstep(0.08, 0.13, v) *
					(1 - smoothstep(0.22, 0.28, v)) *
					0.58;
				const crownStreak =
					Math.exp(-Math.pow((v - 0.09) / 0.045, 2)) *
					smoothstep(0.36, 0.45, u) *
					(1 - smoothstep(0.56, 0.64, u)) *
					0.42;
				const rightHairLit =
					smoothstep(0.54, 0.67, u) * Math.exp(-Math.pow((v - 0.28) / 0.13, 2)) * 0.58;
				const outerHairRim = u < 0.34 || u > 0.66 || v < 0.12 ? 0.14 : 0.06;

				val = Math.max(leftForeheadStreak, crownStreak, rightHairLit, outerHairRim);
			} else {
				// Natural rounded crew-neck T-shirt & shoulders directly from the photo.
				const rightTeeLight = smoothstep(0.4, 0.82, u) * 0.28;
				const leftTeeLight = smoothstep(0.1, 0.48, u) * 0.17;
				const shoulderEdgeRim = u > 0.14 && u < 0.86 && v < 0.96 ? 0.06 : 0;
				const clothPresence = nVal > 0.24 ? 1.0 : 0.42;
				const bottomFade = 1 - smoothstep(0.88, 0.995, v) * 0.65;

				val = Math.min(
					0.31,
					Math.max(shoulderEdgeRim, rightTeeLight + leftTeeLight) * clothPresence * bottomFade
				);
			}

			tileVal[i] = val * m;
		}
	}

	return { mask, tileVal };
}

/**
 * Samples cubic Bézier segments into an arc-length-parameterized polyline mapped
 * relative to the responsive portrait center.
 */
function buildSignaturePolyline(
	segments: readonly CubicSegment[],
	centerX: number,
	centerY: number,
	sigScale: number
): SignaturePolyline {
	const stepsPerSegment = 48;
	const points: Point[] = [];

	const mapPoint = (pt: Point): Point => ({
		x: centerX + (pt.x - V6_CENTER_X) * sigScale,
		y: centerY + (pt.y - V6_CENTER_Y) * sigScale,
	});

	for (let s = 0; s < segments.length; s++) {
		const p0 = mapPoint(segments[s].p0);
		const p1 = mapPoint(segments[s].p1);
		const p2 = mapPoint(segments[s].p2);
		const p3 = mapPoint(segments[s].p3);

		const startStep = s === 0 ? 0 : 1;
		for (let step = startStep; step <= stepsPerSegment; step++) {
			const t = step / stepsPerSegment;
			const mt = 1 - t;
			const mt2 = mt * mt;
			const t2 = t * t;
			points.push({
				x:
					mt2 * mt * p0.x +
					3 * mt2 * t * p1.x +
					3 * mt * t2 * p2.x +
					t2 * t * p3.x,
				y:
					mt2 * mt * p0.y +
					3 * mt2 * t * p1.y +
					3 * mt * t2 * p2.y +
					t2 * t * p3.y,
			});
		}
	}

	const cumLengths = new Float64Array(points.length);
	for (let i = 1; i < points.length; i++) {
		const dx = points[i].x - points[i - 1].x;
		const dy = points[i].y - points[i - 1].y;
		cumLengths[i] = cumLengths[i - 1] + Math.hypot(dx, dy);
	}

	return {
		points,
		cumLengths,
		totalLength: points.length > 0 ? cumLengths[points.length - 1] : 0,
	};
}

function buildMosaicScene(
	width: number,
	height: number,
	dpr: number,
	portraitImg: HTMLImageElement | null,
	tileSpriteCount: number
): MosaicScene {
	const rand = createRng(6109);
	const isDesktop = width >= 768;

	const cols = isDesktop ? 70 : width <= 480 ? 38 : 44;
	const rows = cols;

	const gridSize = isDesktop
		? Math.min(width * 0.56, height * 0.86, 790)
		: Math.min(width * 1.12, height * 0.54, 460);
	const startX = (width - gridSize) / 2;
	const startY = isDesktop ? Math.max(8, height * 0.015) : Math.max(24, height * 0.08);
	const pitchX = gridSize / cols;
	const pitchY = gridSize / rows;
	const centerX = width / 2;
	const centerY = startY + gridSize / 2;

	const starCount = isDesktop ? 560 : 260;
	const stars: StarParticle[] = [];
	for (let s = 0; s < starCount; s++) {
		const x = rand() * width;
		const y = rand() * height;
		const sz = rand() < 0.84 ? 1.15 : 1.85;
		const a = 0.1 + rand() * 0.42;
		const isTint = rand() < 0.42;
		stars.push({
			x,
			y,
			size: sz,
			baseAlpha: isTint ? a : a * 0.9,
			colorRgb: isTint ? '169, 186, 242' : '237, 244, 255',
			phase: rand() * Math.PI * 2,
			speed: 0.7 + rand() * 1.1,
		});
	}

	const sigScale = isDesktop
		? gridSize / V6_GRID_SIZE
		: Math.min(gridSize / V6_GRID_SIZE, (width * 0.9) / 1060);
	const sigWidth = Math.max(1.15, 1.75 * sigScale);
	const stroke1 = buildSignaturePolyline(SIGNATURE_STROKE_1, centerX, centerY, sigScale);
	const stroke2 = buildSignaturePolyline(SIGNATURE_STROKE_2, centerX, centerY, sigScale);

	const tiles: TileParticle[] = [];

	if (!portraitImg) {
		return {
			width,
			height,
			dpr,
			sigWidth,
			startX,
			startY,
			gridSize,
			stars,
			tiles,
			occCanvas: null,
			stroke1,
			stroke2,
		};
	}

	let occCanvas: HTMLCanvasElement | null = null;
	let octx: CanvasRenderingContext2D | null = null;
	if (typeof document !== 'undefined') {
		occCanvas = document.createElement('canvas');
		occCanvas.width = Math.max(1, Math.ceil(gridSize));
		occCanvas.height = Math.max(1, Math.ceil(gridSize));
		octx = occCanvas.getContext('2d');
		if (!octx) occCanvas = null;
	}

	const { mask, tileVal } = samplePortraitMaskAndIntensity(portraitImg, cols, rows);
	const maxSpawnY = Math.max(startY + 40, height - Math.max(120, height * 0.2));

	for (let r = 0; r < rows; r++) {
		const rowFrac = r / rows;
		const isShirtRow = rowFrac >= 0.64;

		for (let c = 0; c < cols; c++) {
			const i = r * cols + c;
			const m = mask[i];
			const val = tileVal[i];

			if (m >= 0.2 && octx) {
				const occAlpha = m * (val > 0.25 ? 0.95 : 0.72);
				octx.fillStyle = `rgba(2, 5, 13, ${occAlpha.toFixed(3)})`;
				octx.fillRect(c * pitchX - 0.5, r * pitchY - 0.5, pitchX + 1, pitchY + 1);
			}

			if (m < 0.08 || val < 0.045) continue;

			const nVal = noise2(c * 0.23, r * 0.23);
			const roll = rand();

			if (isShirtRow) {
				if (val > 0.14 && roll < 0.08) continue;
				if (val <= 0.14 && roll < 0.14) continue;
			} else {
				if (val > 0.32 && roll < 0.1) continue;
				if (val <= 0.32 && val > 0.14 && roll < 0.24) continue;
				if (val <= 0.14 && (roll < 0.3 || nVal < 0.25)) continue;
			}

			const minNMask =
				r > 0 && r < rows - 1 && c > 0 && c < cols - 1
					? Math.min(mask[i - 1], mask[i + 1], mask[i - cols], mask[i + cols])
					: 0;
			const isEdge = minNMask < 0.5;

			const jx = isEdge ? (rand() - 0.5) * pitchX * 1.15 : 0;
			const jy = isEdge ? (rand() - 0.5) * pitchY * 1.05 : 0;

			const tx = startX + (c + 0.5) * pitchX + jx;
			const ty = startY + (r + 0.5) * pitchY + jy;
			const maxTile = Math.min(pitchX, pitchY) * 0.84;

			const sizeJitter = val > 0.32 ? 0.74 + rand() * 0.42 : 1.0;
			const size = Math.max(
				1.3,
				Math.min(maxTile, (1.2 + Math.pow(val, 0.86) * (maxTile - 1.2)) * sizeJitter)
			);

			const isSprite = tileSpriteCount > 0 && size >= 4.2 && val > 0.34;
			const spriteIdx = isSprite ? Math.floor(rand() * tileSpriteCount) : 0;
			const spriteAlpha = Math.min(1, 0.72 + val * 0.28);
			const highlightAlpha = val > 0.68 ? (val - 0.66) * 1.15 : 0;
			const highlightStyle =
				highlightAlpha > 0 ? `rgba(238, 245, 255, ${highlightAlpha.toFixed(2)})` : '';

			let fillStyle: string;
			if (val > 0.4) {
				fillStyle = `rgba(169, 186, 242, ${(0.62 + val * 0.34).toFixed(2)})`;
			} else if (val > 0.2) {
				fillStyle = `rgba(96, 138, 244, ${(0.45 + val * 0.48).toFixed(2)})`;
			} else {
				fillStyle = `rgba(128, 152, 214, ${(0.32 + val * 0.55).toFixed(2)})`;
			}

			// Stage 1 spawn: upper-center cloud volume clamped above bottom typography row.
			const sx = Math.max(12, Math.min(width - 12, centerX + (rand() - 0.5) * width * 0.68));
			const sy = Math.max(8, Math.min(maxSpawnY, startY + rand() * gridSize * 0.88));

			// Stage 2 vertical plume: compressed horizontally toward centerline and vertically clustered.
			const vxMid = centerX + (tx - centerX) * 0.24 + (rand() - 0.5) * gridSize * 0.14;
			const vyMid = ty + (rand() - 0.5) * gridSize * 0.18;

			const spawnDelay = 40 + rand() * 380;
			let lockDelay: number;
			if (val > 0.35) {
				lockDelay = rand() * 180;
			} else if (val > 0.16) {
				lockDelay = 120 + rand() * 180;
			} else {
				lockDelay = 220 + rand() * 200;
			}

			tiles.push({
				tx,
				ty,
				sx,
				sy,
				vxMid,
				vyMid,
				size,
				val,
				spriteIdx,
				isSprite,
				spriteAlpha,
				highlightAlpha,
				highlightStyle,
				fillStyle,
				starFillStyle: `rgba(186, 206, 255, ${(0.44 + val * 0.46).toFixed(2)})`,
				occAlpha: m >= 0.2 ? m * (val > 0.25 ? 0.95 : 0.72) : 0,
				spawnDelay,
				lockDelay,
				shimmerPhase: rand() * Math.PI * 2,
				shimmerSpeed: 0.85 + rand() * 1.15,
				ox: 0,
				oy: 0,
				vx: 0,
				vy: 0,
			});
		}
	}

	return {
		width,
		height,
		dpr,
		sigWidth,
		startX,
		startY,
		gridSize,
		stars,
		tiles,
		occCanvas,
		stroke1,
		stroke2,
	};
}

function drawSignatureStroke(
	ctx: CanvasRenderingContext2D,
	polyline: SignaturePolyline,
	progress: number,
	lineWidth: number
): void {
	if (progress <= 0 || polyline.points.length < 2) return;

	ctx.strokeStyle = SIGNATURE_STROKE_STYLE;
	ctx.lineWidth = lineWidth;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();

	const { points, cumLengths, totalLength } = polyline;
	ctx.moveTo(points[0].x, points[0].y);

	if (progress >= 1) {
		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.stroke();
		return;
	}

	const targetLen = totalLength * progress;
	for (let i = 1; i < points.length; i++) {
		const currLen = cumLengths[i];
		if (currLen <= targetLen) {
			ctx.lineTo(points[i].x, points[i].y);
			continue;
		}
		const prevLen = cumLengths[i - 1];
		const segLen = currLen - prevLen;
		const frac = segLen > 0 ? (targetLen - prevLen) / segLen : 0;
		ctx.lineTo(
			points[i - 1].x + (points[i].x - points[i - 1].x) * frac,
			points[i - 1].y + (points[i].y - points[i - 1].y) * frac
		);
		break;
	}

	ctx.stroke();
}

function renderScene(
	ctx: CanvasRenderingContext2D,
	scene: MosaicScene,
	tileSprites: HTMLCanvasElement[],
	elapsedMs: number,
	timeSec: number,
	animateStars: boolean
): void {
	ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
	ctx.clearRect(0, 0, scene.width, scene.height);

	// 1. Ambient starfield dust (starts pitch black at t = 0 and emerges smoothly across 0–650ms)
	const starFade = elapsedMs >= EMERGE_END_MS ? 1 : smoothstep(0, EMERGE_END_MS, elapsedMs);
	if (starFade > 0.005) {
		for (let i = 0; i < scene.stars.length; i++) {
			const s = scene.stars[i];
			const twinkle = animateStars
				? 0.82 + 0.18 * Math.sin(timeSec * s.speed + s.phase)
				: 1;
			const alpha = s.baseAlpha * starFade * twinkle;
			const driftX = animateStars ? Math.sin(timeSec * s.speed * 0.55 + s.phase) * 0.55 : 0;
			const driftY = animateStars ? Math.cos(timeSec * s.speed * 0.45 + s.phase) * 0.45 : 0;
			ctx.fillStyle = `rgba(${s.colorRgb}, ${alpha.toFixed(3)})`;
			ctx.fillRect(Math.round(s.x + driftX), Math.round(s.y + driftY), s.size, s.size);
		}
	}

	// 2. Two-stroke SignWell signature behind the portrait silhouette
	const p1 = easeOutCubic(
		clamp01((elapsedMs - STROKE1_START_MS) / (STROKE1_END_MS - STROKE1_START_MS))
	);
	const p2 = easeOutCubic(
		clamp01((elapsedMs - STROKE2_START_MS) / (STROKE2_END_MS - STROKE2_START_MS))
	);
	drawSignatureStroke(ctx, scene.stroke1, p1, scene.sigWidth);
	drawSignatureStroke(ctx, scene.stroke2, p2, scene.sigWidth);

	// 3. Soft organic occlusion pass delayed until Stage 3 crystallization so Stage 1–2 stays luminous
	const allSettled = elapsedMs >= FULL_SETTLE_MS;
	if (scene.occCanvas) {
		const occFade = allSettled
			? 1
			: smoothstep(PLUME_PEAK_MS - 150, CONVERGENCE_END_MS - 150, elapsedMs);
		if (occFade > 0.01) {
			ctx.globalAlpha = occFade;
			ctx.drawImage(
				scene.occCanvas,
				scene.startX,
				scene.startY,
				scene.gridSize,
				scene.gridSize
			);
			ctx.globalAlpha = 1;
		}
	}

	// 4. Portrait mosaic tiles: Stage 1 emergence -> Stage 2 central plume -> Stage 3 crystallization
	for (let i = 0; i < scene.tiles.length; i++) {
		const p = scene.tiles[i];
		const spawnAlpha =
			elapsedMs >= p.spawnDelay + 420
				? 1
				: smoothstep(p.spawnDelay, p.spawnDelay + 420, elapsedMs);
		if (spawnAlpha <= 0.005) continue;

		let curX: number;
		let curY: number;
		let curSize: number;
		let gridMix: number;
		let midMix = 1;

		if (allSettled) {
			gridMix = 1;
			curX = p.tx + p.ox;
			curY = p.ty + p.oy;
			curSize = p.size;
		} else {
			const plumeEnd = PLUME_PEAK_MS + p.lockDelay * 0.35;
			midMix = elapsedMs >= plumeEnd ? 1 : smoothstep(p.spawnDelay, plumeEnd, elapsedMs);
			const phase2Start = plumeEnd - 180;
			const gridEnd = CONVERGENCE_END_MS - 350 + p.lockDelay;
			gridMix =
				elapsedMs >= gridEnd
					? 1
					: easeOutQuart(clamp01((elapsedMs - phase2Start) / (gridEnd - phase2Start)));

			const plumeX = p.sx + (p.vxMid - p.sx) * midMix;
			const plumeY = p.sy + (p.vyMid - p.sy) * midMix;
			curX = (1 - gridMix) * plumeX + gridMix * p.tx + p.ox;
			curY = (1 - gridMix) * plumeY + gridMix * p.ty + p.oy;
			curSize = 1.5 + (p.size - 1.5) * gridMix;
		}

		const x0 = curX - curSize * 0.5;
		const y0 = curY - curSize * 0.5;

		const shimmerAmp = p.val > 0.55 ? 0.025 : 0.065;
		const shimmerMix = animateStars && gridMix > 0.85 ? (gridMix - 0.85) / 0.15 : 0;
		const shimmer =
			1 - shimmerMix * shimmerAmp * (1 - Math.sin(timeSec * p.shimmerSpeed + p.shimmerPhase));

		if (p.isSprite) {
			const spriteBlend = gridMix >= 0.92 ? 1 : smoothstep(0.35, 0.92, gridMix);
			if (spriteBlend < 0.99) {
				ctx.globalAlpha = spawnAlpha * shimmer * (1 - spriteBlend * 0.85);
				ctx.fillStyle = p.starFillStyle;
				ctx.fillRect(x0, y0, curSize, curSize);
			}
			if (spriteBlend > 0.01) {
				const sprite = tileSprites[p.spriteIdx];
				ctx.globalAlpha = spawnAlpha * shimmer * p.spriteAlpha * spriteBlend;
				ctx.drawImage(sprite, x0, y0, curSize, curSize);
				if (p.highlightAlpha > 0) {
					ctx.fillStyle = p.highlightStyle;
					ctx.fillRect(x0, y0, curSize, curSize);
				}
			}
		} else if (gridMix < 0.35) {
			ctx.globalAlpha = spawnAlpha * (0.62 + 0.32 * midMix);
			ctx.fillStyle = p.starFillStyle;
			ctx.fillRect(x0, y0, curSize, curSize);
		} else if (gridMix < 0.85) {
			const colorMix = smoothstep(0.35, 0.85, gridMix);
			ctx.globalAlpha = spawnAlpha * (1 - colorMix) * 0.9;
			ctx.fillStyle = p.starFillStyle;
			ctx.fillRect(x0, y0, curSize, curSize);
			ctx.globalAlpha = spawnAlpha * colorMix;
			ctx.fillStyle = p.fillStyle;
			ctx.fillRect(x0, y0, curSize, curSize);
		} else {
			ctx.globalAlpha = spawnAlpha * shimmer;
			ctx.fillStyle = p.fillStyle;
			ctx.fillRect(x0, y0, curSize, curSize);
		}
	}

	ctx.globalAlpha = 1;
}

/**
 * Initializes the fused Hero portrait mosaic canvas, 2-stroke SignWell signature,
 * cursor spring physics, and flush edge-to-edge display name scaling.
 */
export function initPortraitMosaic(): void {
	activeCleanup?.();
	activeCleanup = null;

	if (typeof document !== 'undefined' && !swapListenerBound) {
		swapListenerBound = true;
		document.addEventListener('astro:before-swap', () => {
			activeCleanup?.();
			activeCleanup = null;
		});
	}

	const hero = document.querySelector<HTMLElement>('#hero');
	const canvas = document.querySelector<HTMLCanvasElement>('#portrait-canvas');
	if (!hero || !canvas) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const frameEl = hero.querySelector<HTMLElement>('.hero-frame');
	const titleEl = hero.querySelector<HTMLElement>('#hero-display-name');

	let disposed = false;
	let rafId: number | null = null;
	let resizeRafId: number | null = null;
	const abortController = new AbortController();

	const pointerFineMql = window.matchMedia('(hover: hover) and (pointer: fine)');

	let isPointerFine = pointerFineMql.matches;
	const heroRect = hero.getBoundingClientRect();
	let isInView =
		heroRect.height === 0 || (heroRect.bottom > 0 && heroRect.top < window.innerHeight);
	let elapsedMs = 0;
	let lastTickMs = performance.now();

	let pointerActive = false;
	let pointerX = 0;
	let pointerY = 0;

	let portraitImg: HTMLImageElement | null = null;
	let tileSprites: HTMLCanvasElement[] = buildTileSprites([]);
	let scene: MosaicScene | null = null;
	let lastCanvasW = 0;
	let lastCanvasH = 0;
	let lastCanvasDpr = 0;
	let lastFittedWidth = -1;
	let lastFittedHeight = -1;

	const fitDisplayName = (force = false): void => {
		if (disposed || !frameEl || !titleEl) return;
		const targetWidth = frameEl.clientWidth;
		const heroHeight = hero.clientHeight;
		if (targetWidth <= 0 || heroHeight <= 0) return;
		if (
			!force &&
			Math.abs(targetWidth - lastFittedWidth) < 0.5 &&
			Math.abs(heroHeight - lastFittedHeight) < 0.5
		) {
			return;
		}

		titleEl.style.transform = '';
		titleEl.style.fontSize = '100px';
		const rectWidth = titleEl.getBoundingClientRect().width;
		if (rectWidth > 0) {
			lastFittedWidth = targetWidth;
			lastFittedHeight = heroHeight;
			const isDesktop = hero.clientWidth >= 768;
			let fittedFontSize: number;
			if (isDesktop) {
				const desiredWidth = Math.min(targetWidth * 0.74, 980);
				const rawFontSize = (desiredWidth / rectWidth) * 100;
				const maxFontSize = Math.min(168, Math.max(84, heroHeight * 0.21));
				fittedFontSize = Math.min(rawFontSize, maxFontSize);
			} else {
				const desiredWidth = targetWidth * 0.88;
				fittedFontSize = Math.min((desiredWidth / rectWidth) * 100, 96);
			}
			titleEl.style.fontSize = `${fittedFontSize.toFixed(2)}px`;
		}
	};

	const stopLoop = (): void => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};

	const syncCanvasAndBuildScene = (forceRebuild = false): boolean => {
		const width = hero.clientWidth;
		const height = hero.clientHeight;
		if (width <= 0 || height <= 0) return false;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const sizeChanged =
			Math.abs(width - lastCanvasW) > 0.5 ||
			Math.abs(height - lastCanvasH) > 0.5 ||
			dpr !== lastCanvasDpr;

		if (!forceRebuild && !sizeChanged && scene !== null) {
			return false;
		}

		lastCanvasW = width;
		lastCanvasH = height;
		lastCanvasDpr = dpr;

		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));

		scene = buildMosaicScene(width, height, dpr, portraitImg, tileSprites.length);
		return true;
	};

	const computeRepulsionTarget = (
		tx: number,
		ty: number,
		allowRepulsion: boolean,
		out: Point
	): void => {
		out.x = 0;
		out.y = 0;
		if (!allowRepulsion) return;
		const dx = tx - pointerX;
		const dy = ty - pointerY;
		const distSq = dx * dx + dy * dy;
		const radiusSq = POINTER_RADIUS * POINTER_RADIUS;
		if (distSq > 0.0001 && distSq < radiusSq) {
			const dist = Math.sqrt(distSq);
			const falloff = Math.pow(1 - dist / POINTER_RADIUS, 1.35);
			const push = falloff * POINTER_MAX_PUSH;
			out.x = (dx / dist) * push;
			out.y = (dy / dist) * push;
		}
	};

	const targetScratch: Point = { x: 0, y: 0 };

	const stepCursorSpring = (dtMs: number): void => {
		if (!scene) return;

		const dtScale = Math.min(dtMs / 16.6667, 2.5);
		const damping = Math.pow(SPRING_DAMPING, dtScale);
		const stiffness = SPRING_STIFFNESS * dtScale;
		const allowRepulsion = isPointerFine && pointerActive;

		for (let i = 0; i < scene.tiles.length; i++) {
			const p = scene.tiles[i];
			if (!allowRepulsion && p.ox === 0 && p.oy === 0 && p.vx === 0 && p.vy === 0) {
				continue;
			}
			computeRepulsionTarget(p.tx, p.ty, allowRepulsion, targetScratch);

			p.vx = (p.vx + (targetScratch.x - p.ox) * stiffness) * damping;
			p.vy = (p.vy + (targetScratch.y - p.oy) * stiffness) * damping;
			p.ox += p.vx * dtScale;
			p.oy += p.vy * dtScale;

			if (
				!allowRepulsion &&
				Math.abs(p.ox) + Math.abs(p.oy) + Math.abs(p.vx) + Math.abs(p.vy) < SETTLE_EPSILON
			) {
				p.ox = 0;
				p.oy = 0;
				p.vx = 0;
				p.vy = 0;
			}
		}
	};

	const tick = (now: number): void => {
		rafId = null;
		if (disposed || !scene || !isInView || document.hidden) return;

		const wallDtMs = Math.max(0, Math.min(now - lastTickMs, 250));
		const springDtMs = Math.max(0, Math.min(now - lastTickMs, 64));
		lastTickMs = now;

		if (elapsedMs < ENTRANCE_DONE_MS) {
			elapsedMs = Math.min(ENTRANCE_DONE_MS, elapsedMs + wallDtMs);
		}

		stepCursorSpring(springDtMs);
		renderScene(ctx, scene, tileSprites, elapsedMs, now * 0.001, true);
		rafId = requestAnimationFrame(tick);
	};

	const wakeLoop = (): void => {
		if (disposed || !scene || !isInView || document.hidden) return;
		if (rafId !== null) return;
		lastTickMs = performance.now();
		rafId = requestAnimationFrame(tick);
	};

	const scheduleResizeSync = (): void => {
		if (disposed || resizeRafId !== null) return;
		resizeRafId = requestAnimationFrame(() => {
			resizeRafId = null;
			if (disposed) return;
			fitDisplayName(false);
			if (syncCanvasAndBuildScene(false) && scene) {
				pointerActive = false;
				renderScene(ctx, scene, tileSprites, elapsedMs, performance.now() * 0.001, true);
				wakeLoop();
			}
		});
	};

	// Fit display name immediately and refine once webfont metrics finish loading.
	fitDisplayName(true);
	document.fonts?.ready.then(() => {
		if (!disposed) {
			fitDisplayName(true);
		}
	});

	const frameResizeObserver =
		typeof ResizeObserver !== 'undefined'
			? new ResizeObserver(() => {
					scheduleResizeSync();
				})
			: null;

	if (frameResizeObserver) {
		if (frameEl) frameResizeObserver.observe(frameEl);
		frameResizeObserver.observe(hero);
	}

	window.addEventListener('resize', scheduleResizeSync, {
		passive: true,
		signal: abortController.signal,
	});

	document.addEventListener(
		'visibilitychange',
		() => {
			if (document.hidden) {
				stopLoop();
			} else {
				lastTickMs = performance.now();
				wakeLoop();
			}
		},
		{ signal: abortController.signal }
	);

	hero.addEventListener(
		'pointermove',
		(event: PointerEvent) => {
			if (!isPointerFine || !scene) return;
			const rect = canvas.getBoundingClientRect();
			pointerX = event.clientX - rect.left;
			pointerY = event.clientY - rect.top;
			pointerActive = true;
			wakeLoop();
		},
		{ passive: true, signal: abortController.signal }
	);

	const handlePointerExit = (): void => {
		if (!pointerActive) return;
		pointerActive = false;
		wakeLoop();
	};

	hero.addEventListener('pointerleave', handlePointerExit, {
		passive: true,
		signal: abortController.signal,
	});
	hero.addEventListener('pointercancel', handlePointerExit, {
		passive: true,
		signal: abortController.signal,
	});

	// Click anywhere on the hero stage (outside interactive controls) to replay the 3.35s entrance.
	hero.addEventListener(
		'click',
		(event: MouseEvent) => {
			const target = event.target as Element | null;
			if (target?.closest('a, button, input, textarea, select, [role="button"]')) return;
			if (window.getSelection?.()?.toString()) return;

			elapsedMs = 0;
			pointerActive = false;
			if (scene) {
				for (let i = 0; i < scene.tiles.length; i++) {
					const p = scene.tiles[i];
					p.ox = 0;
					p.oy = 0;
					p.vx = 0;
					p.vy = 0;
				}
			}
			lastTickMs = performance.now();
			wakeLoop();
		},
		{ signal: abortController.signal }
	);

	const handlePointerFineChange = (event: MediaQueryListEvent): void => {
		isPointerFine = event.matches;
		if (!isPointerFine && pointerActive) {
			pointerActive = false;
			wakeLoop();
		}
	};

	pointerFineMql.addEventListener('change', handlePointerFineChange, {
		signal: abortController.signal,
	});

	const intersectionObserver =
		typeof IntersectionObserver !== 'undefined'
			? new IntersectionObserver(
					(entries) => {
						const visible = entries.some((entry) => entry.isIntersecting);
						isInView = visible;
						if (!visible) {
							stopLoop();
						} else {
							wakeLoop();
						}
					},
					{ threshold: 0 }
				)
			: null;

	intersectionObserver?.observe(hero);

	// Paint the initial pitch-black canvas immediately while portrait & sprite assets resolve.
	if (syncCanvasAndBuildScene(true) && scene) {
		renderScene(ctx, scene, tileSprites, 0, 0, false);
	}

	const portraitSrc = canvas.dataset.portraitSrc || '/images/francis-portrait.jpg';
	Promise.allSettled([
		loadImage(portraitSrc),
		...SPRITE_IMAGE_SRCS.map((src) => loadImage(src)),
	]).then(([portraitResult, ...spriteResults]) => {
		if (disposed) return;

		portraitImg = portraitResult.status === 'fulfilled' ? portraitResult.value : null;

		const loadedOptionalImgs: HTMLImageElement[] = [];
		for (const res of spriteResults) {
			if (res.status === 'fulfilled') {
				loadedOptionalImgs.push(res.value);
			}
		}
		tileSprites = buildTileSprites(loadedOptionalImgs);

		if (syncCanvasAndBuildScene(true) && scene) {
			lastTickMs = performance.now();
			renderScene(ctx, scene, tileSprites, elapsedMs, lastTickMs * 0.001, true);
			wakeLoop();
		}
	});

	activeCleanup = () => {
		disposed = true;
		stopLoop();
		if (resizeRafId !== null) {
			cancelAnimationFrame(resizeRafId);
			resizeRafId = null;
		}
		frameResizeObserver?.disconnect();
		intersectionObserver?.disconnect();
		abortController.abort();
	};
}
