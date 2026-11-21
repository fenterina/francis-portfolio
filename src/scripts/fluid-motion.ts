import { animate, inView, stagger } from 'motion';

export const FLUID_EASE = [0.22, 1, 0.36, 1] as const;

interface RevealGroupOptions {
	delay?: number;
	y?: number;
	duration?: number;
}

/**
 * Reveals matching items inside each container with a staggered vertical rise,
 * animating immediately when already in/above the viewport or on scroll into view.
 */
function revealGroup(
	containerSelector: string,
	itemSelector: string,
	options?: RevealGroupOptions
): void {
	const staggerDelay = options?.delay ?? 0.065;
	const y = options?.y ?? 20;
	const duration = options?.duration ?? 0.62;

	const containers = document.querySelectorAll<HTMLElement>(containerSelector);

	containers.forEach((container) => {
		if (container.dataset.fluidBound === '1') return;
		container.dataset.fluidBound = '1';

		const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
		if (items.length === 0) return;

		items.forEach((item) => {
			item.style.opacity = '0';
			item.style.transform = `translateY(${y}px)`;
		});

		const runAnimation = () => {
			animate(
				items,
				{ opacity: [0, 1], y: [y, 0] },
				{ duration, delay: stagger(staggerDelay), ease: FLUID_EASE }
			);
		};

		if (container.getBoundingClientRect().top < window.innerHeight * 0.92) {
			runAnimation();
			return;
		}

		let hasAnimated = false;
		inView(
			container,
			() => {
				if (hasAnimated) return;
				hasAnimated = true;
				runAnimation();
			},
			{ amount: 0.12 }
		);
	});
}

/**
 * Initializes hero entrance and scroll-triggered section choreography.
 */
export function initFluidMotion(): void {
	const hero = document.querySelector<HTMLElement>('#hero');
	if (hero && hero.dataset.fluidBound !== '1') {
		hero.dataset.fluidBound = '1';

		const heroItems = Array.from(
			hero.querySelectorAll<HTMLElement>(
				'.hero-brand-bar, .hero-eyebrow, .hero-title, .hero-lead, .hero-cta-row, .hero-bento-grid > *'
			)
		);

		if (heroItems.length > 0) {
			heroItems.forEach((item) => {
				item.style.opacity = '0';
				item.style.transform = 'translateY(22px)';
			});

			animate(
				heroItems,
				{ opacity: [0, 1], y: [22, 0] },
				{ duration: 0.7, delay: stagger(0.075), ease: FLUID_EASE }
			);
		}
	}

	revealGroup('#about', '.about-visual, .about-copy > *');
	revealGroup('#experience', '.experience-heading > *, .experience-card, .timeline-item');
	revealGroup('#skills', '.skills-copy > *, .certificate-card');
	revealGroup('#projects', '.projects-top, .project-card');
	revealGroup('#contact', '.contact-copy > *, .contact-form');
	revealGroup(
		'.case-study-content',
		'.eyebrow, h1, .project-dialog-lede, .project-dialog-facts, .case-study-hero, .project-dialog-columns > div, .case-study-feature-grid article'
	);
}

/**
 * Animates a modal dialog's inner container when opened.
 */
export function animateDialogOpen(dialog: HTMLDialogElement): void {
	const target =
		dialog.querySelector<HTMLElement>('.project-dialog-inner, .tools-dialog-inner, figure') ||
		dialog;

	animate(
		target,
		{ opacity: [0, 1], y: [18, 0], scale: [0.97, 1] },
		{ duration: 0.38, ease: FLUID_EASE }
	);
}
