import { animate, type AnimationPlaybackControls } from 'motion';

export const FLUID_EASE = [0.22, 1, 0.36, 1] as const;

export const SPRING_SHELL = {
	type: 'spring' as const,
	stiffness: 290,
	damping: 28,
	mass: 0.9,
};

export const SPRING_SNAP = {
	type: 'spring' as const,
	stiffness: 420,
	damping: 30,
};

interface RevealGroupOptions {
	y?: number;
	scale?: number;
	delays?: number[];
}

interface HeroBeat {
	selector: string;
	delay: number;
	y: number;
	duration: number;
}

const HERO_BEATS: readonly HeroBeat[] = [
	{ selector: '.hero-bio-snippet', delay: 0, y: 12, duration: 0.28 },
	{ selector: '.display-name-wrap', delay: 0.02, y: 14, duration: 0.32 },
	{ selector: '.explore-pill', delay: 0.06, y: 10, duration: 0.28 },
];

const activeAnimations = new WeakMap<HTMLElement, AnimationPlaybackControls>();

const getNonUniformDelay = (index: number, overrides?: number[]): number => {
	if (overrides && index < overrides.length) {
		return overrides[index];
	}
	const clamped = Math.min(index, 5);
	return Number((clamped * 0.045 * (1 - clamped * 0.06)).toFixed(3));
};

function runMotion(
	element: HTMLElement,
	keyframes: Parameters<typeof animate>[1],
	options: Parameters<typeof animate>[2]
): void {
	activeAnimations.get(element)?.stop();
	const controls = animate(element, keyframes, options);
	activeAnimations.set(element, controls);
	controls.then(
		() => {
			if (activeAnimations.get(element) === controls) {
				// Clear inline transform so CSS :hover and :active transforms remain unobstructed.
				element.style.transform = '';
			}
		},
		() => {}
	);
}

/**
 * Reveals matching items inside each container with MorphingNav's spring physics
 * and a subtle non-uniform decelerating overlap.
 */
function revealGroup(
	containerSelector: string,
	itemSelector: string,
	options?: RevealGroupOptions
): void {
	const y = options?.y ?? 16;
	const scale = options?.scale ?? 0.985;

	const containers = document.querySelectorAll<HTMLElement>(containerSelector);

	containers.forEach((container) => {
		if (container.dataset.fluidBound === '1') return;
		container.dataset.fluidBound = '1';

		const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
		if (items.length === 0) return;

		items.forEach((item) => {
			item.style.opacity = '0';
			item.style.transform = `translateY(${y}px) scale(${scale})`;
		});

		const runAnimation = () => {
			items.forEach((item, index) => {
				const delay = getNonUniformDelay(index, options?.delays);
				runMotion(
					item,
					{ opacity: [0, 1], y: [y, 0], scale: [scale, 1] },
					{
						...SPRING_SHELL,
						delay,
						opacity: { duration: 0.28, delay, ease: FLUID_EASE },
					}
				);
			});
		};

		if (container.getBoundingClientRect().top < window.innerHeight * 0.94) {
			runAnimation();
			return;
		}

		let hasAnimated = false;
		const observer = new IntersectionObserver(
			(entries) => {
				if (hasAnimated) return;
				if (entries.some((entry) => entry.isIntersecting)) {
					hasAnimated = true;
					observer.disconnect();
					runAnimation();
				}
			},
			{ threshold: 0.06 }
		);

		observer.observe(container);
	});
}

/**
 * Initializes hero choreography (overlapping Lead + Support beats) and
 * scroll-triggered section entrances aligned with MorphingNav's spring physics.
 */
export function initFluidMotion(): void {
	const hero = document.querySelector<HTMLElement>('#hero');

	if (hero && hero.dataset.fluidBound !== '1') {
		hero.dataset.fluidBound = '1';

		// Collapse choreography under reduced motion; drop translation/delays, keep crisp opacity fade.
		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;

		// Animate .display-name-wrap rather than #hero-display-name so fitDisplayName()'s scaleX transform stays intact.
		for (const beat of HERO_BEATS) {
			const items = Array.from(hero.querySelectorAll<HTMLElement>(beat.selector));
			for (const item of items) {
				item.style.opacity = '0';
				if (prefersReducedMotion) {
					runMotion(
						item,
						{ opacity: [0, 1] },
						{ duration: 0.2, delay: 0, ease: FLUID_EASE }
					);
					continue;
				}
				item.style.transform = `translateY(${beat.y}px)`;
				runMotion(
					item,
					{ opacity: [0, 1], y: [beat.y, 0] },
					{
						duration: beat.duration,
						delay: beat.delay,
						ease: FLUID_EASE,
					}
				);
			}
		}
	}

	// Experience: heading leads, 3 cards enter without double-animating inner timeline items
	revealGroup('#experience', '.experience-heading, .experience-card', {
		delays: [0, 0.055, 0.1, 0.135],
	});

	// Skills: center editorial block + Certificates showcase card (side tool rails stay continuous)
	revealGroup('#skills', '.skills-copy, .certificate-card', {
		delays: [0, 0.07],
	});

	// Projects: section header + cards with non-uniform overlap
	revealGroup('#projects', '.projects-top, .project-card', {
		delays: [0, 0.05, 0.09, 0.12, 0.145],
	});

	// Contact: left contact details + right Formspree card
	revealGroup('#contact', '.contact-copy, .contact-form', {
		delays: [0, 0.07],
	});

	// Dedicated Red Carpet case study route only
	revealGroup(
		'.case-study-page .case-study-content',
		'.case-study-back, .eyebrow, h1, .project-dialog-lede, .project-dialog-facts, .case-study-hero, .project-dialog-columns, .case-study-section, .tag-row'
	);
}
