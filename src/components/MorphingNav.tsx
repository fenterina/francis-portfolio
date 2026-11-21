import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import '../styles/morphing-nav.css';

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialItem {
  label: string;
  href: string;
  external?: boolean;
}

interface MorphingNavProps {
  brandName?: string;
  brandLogo?: string;
  homeHref?: string;
  primaryLinks: NavItem[];
  secondaryLinks: SocialItem[];
  isHomePage?: boolean;
}

const SHELL_SPRING = {
  type: 'spring' as const,
  stiffness: 290,
  damping: 29,
  mass: 0.9,
};

const DASH_SPRING = {
  type: 'spring' as const,
  stiffness: 460,
  damping: 32,
};

const TEXT_EASE = [0.22, 1, 0.36, 1] as const;

export default function MorphingNav({
  brandName = 'Francis',
  brandLogo = '/images/logo-white.png',
  homeHref = '/',
  primaryLinks,
  secondaryLinks,
  isHomePage = true,
}: MorphingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredSecondaryIndex, setHoveredSecondaryIndex] = useState<number | null>(null);
  const [activeHref, setActiveHref] = useState<string>(primaryLinks[0]?.href ?? '#hero');
  const [viewportWidth, setViewportWidth] = useState<number>(1200);

  const menuId = useId();
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const suppressHoverOpenRef = useRef(false);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const isDesktopHoverPointer = (e?: React.PointerEvent) =>
    e
      ? e.pointerType === 'mouse'
      : window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Clean up pending hover-close timeout on unmount
  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  // Initialize hash if present on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      setActiveHref(window.location.hash);
    }
  }, []);

  // Track viewport width safely for responsive morphing widths
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth, { passive: true });
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearCloseTimeout();
        suppressHoverOpenRef.current = false;
        setIsOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Reset hover state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setHoveredIndex(null);
      setHoveredSecondaryIndex(null);
    }
  }, [isOpen]);

  // Active-section Scroll-Spy (Home Page only)
  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = primaryLinks
      .map((item) => item.href)
      .filter((href) => href.startsWith('#'))
      .map((href) => href.slice(1));

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.35, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHomePage, primaryLinks]);

  const collapsedWidth = Math.min(162, viewportWidth - 24);
  const expandedWidth = Math.min(368, viewportWidth - 24);

  const resolveHref = (href: string) => {
    if (href.startsWith('#') && !isHomePage) {
      return `/${href}`;
    }
    return href;
  };

  const handleShellPointerEnter = (e: React.PointerEvent) => {
    if (!isDesktopHoverPointer(e)) return;
    clearCloseTimeout();
    if (suppressHoverOpenRef.current) return;
    setIsOpen(true);
  };

  const handleShellPointerLeave = (e: React.PointerEvent) => {
    if (!isDesktopHoverPointer(e)) return;
    suppressHoverOpenRef.current = false;
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 160);
  };

  const handleToggleClick = () => {
    clearCloseTimeout();
    if (isOpen) {
      suppressHoverOpenRef.current = true;
      setIsOpen(false);
    } else {
      suppressHoverOpenRef.current = false;
      setIsOpen(true);
    }
  };

  const closeFromInnerLink = () => {
    clearCloseTimeout();
    if (isOpen) {
      suppressHoverOpenRef.current = true;
    }
    setIsOpen(false);
  };

  const handlePrimaryClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    closeFromInnerLink();

    if (href.startsWith('#') && isHomePage) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        event.preventDefault();
        setActiveHref(href);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        window.history.replaceState(null, '', href);
      }
    }
  };

  return (
    <MotionConfig reducedMotion="never">
      {/* Click-outside Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="morph-backdrop"
            className="morph-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={() => {
              clearCloseTimeout();
              suppressHoverOpenRef.current = false;
              setIsOpen(false);
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Bottom-Center Floating Navigation Shell */}
      <div className="morph-nav-anchor">
        <motion.nav
          aria-label="Primary Navigation"
          className="morph-nav-shell"
          onPointerEnter={handleShellPointerEnter}
          onPointerLeave={handleShellPointerLeave}
          initial={false}
          animate={{
            width: isOpen ? expandedWidth : collapsedWidth,
            borderRadius: isOpen ? 26 : 28,
          }}
          transition={
            isOpen
              ? SHELL_SPRING
              : { duration: 0.28, ease: TEXT_EASE, delay: 0.08 }
          }
        >
          {/* Expandable Card Content - Sits above the stationary bottom bar */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={menuId}
                key="morph-menu-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  transition: {
                    height: SHELL_SPRING,
                    opacity: { duration: 0.2, delay: 0.04 },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    opacity: { duration: 0.12 },
                    height: { duration: 0.28, ease: TEXT_EASE, delay: 0.08 },
                  },
                }}
                style={{ overflow: 'hidden' }}
              >
                <div className="morph-nav-content">
                  {/* Primary Staggered Navigation List */}
                  <ul
                    className="morph-nav-primary-list"
                    onPointerLeave={() => setHoveredIndex(null)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {primaryLinks.map((item, idx) => {
                      const isHovered = hoveredIndex === idx;
                      const isDimmed = hoveredIndex !== null && hoveredIndex !== idx;
                      const isActive = isHomePage && activeHref === item.href;

                      return (
                        <li
                          key={item.href}
                          className="morph-nav-line-mask"
                          onPointerEnter={() => setHoveredIndex(idx)}
                          onMouseEnter={() => setHoveredIndex(idx)}
                        >
                          <motion.div
                            initial={{ y: '115%', opacity: 0 }}
                            animate={{
                              y: '0%',
                              opacity: 1,
                              transition: {
                                duration: 0.42,
                                delay: 0.08 + idx * 0.045,
                                ease: TEXT_EASE,
                              },
                            }}
                            exit={{
                              y: '24%',
                              opacity: 0,
                              transition: {
                                duration: 0.12,
                                ease: 'easeIn',
                              },
                            }}
                          >
                            <motion.a
                              href={resolveHref(item.href)}
                              className={`morph-nav-primary-link${isDimmed ? ' is-dimmed' : ''}`}
                              aria-current={isActive ? 'page' : undefined}
                              animate={{ opacity: isDimmed ? 0.28 : 1 }}
                              transition={{ duration: 0.22, ease: TEXT_EASE }}
                              onFocus={() => setHoveredIndex(idx)}
                              onBlur={() => setHoveredIndex(null)}
                              onClick={(e) => handlePrimaryClick(e, item.href)}
                            >
                              {/* Leading Animated Dash (—) */}
                              <motion.span
                                className="morph-nav-dash"
                                aria-hidden="true"
                                initial={false}
                                animate={{
                                  scaleX: isHovered ? 1 : 0,
                                  opacity: isHovered ? 1 : 0,
                                }}
                                transition={{
                                  scaleX: DASH_SPRING,
                                  opacity: { duration: 0.14, ease: TEXT_EASE },
                                }}
                              />
                              <motion.span
                                className="morph-nav-link-label"
                                animate={{ x: isHovered ? 30 : 0 }}
                                transition={DASH_SPRING}
                              >
                                {item.label}
                              </motion.span>
                              {isActive && !isHovered && (
                                <span
                                  className="morph-nav-active-dot"
                                  aria-hidden="true"
                                />
                              )}
                            </motion.a>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Hairline Divider */}
                  <motion.div
                    className="morph-nav-divider"
                    aria-hidden="true"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: 1,
                      opacity: 1,
                      transition: {
                        duration: 0.36,
                        delay: 0.14 + primaryLinks.length * 0.04,
                        ease: TEXT_EASE,
                      },
                    }}
                    exit={{
                      scaleX: 0,
                      opacity: 0,
                      transition: { duration: 0.12 },
                    }}
                  />

                  {/* Secondary / Social Links */}
                  <ul
                    className="morph-nav-secondary-list"
                    onPointerLeave={() => setHoveredSecondaryIndex(null)}
                    onMouseLeave={() => setHoveredSecondaryIndex(null)}
                  >
                    {secondaryLinks.map((social, idx) => {
                      const isSecondaryHovered = hoveredSecondaryIndex === idx;
                      const isSecondaryDimmed =
                        hoveredSecondaryIndex !== null && hoveredSecondaryIndex !== idx;

                      return (
                        <li
                          key={social.label}
                          className="morph-nav-line-mask"
                          onPointerEnter={() => setHoveredSecondaryIndex(idx)}
                          onMouseEnter={() => setHoveredSecondaryIndex(idx)}
                        >
                          <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{
                              y: '0%',
                              opacity: 1,
                              transition: {
                                duration: 0.32,
                                delay: 0.2 + primaryLinks.length * 0.04 + idx * 0.035,
                                ease: TEXT_EASE,
                              },
                            }}
                            exit={{
                              y: '24%',
                              opacity: 0,
                              transition: { duration: 0.1 },
                            }}
                          >
                            <motion.a
                              href={social.href}
                              className={`morph-nav-secondary-link${isSecondaryDimmed ? ' is-dimmed' : ''}`}
                              target={social.external ? '_blank' : undefined}
                              rel={social.external ? 'noopener noreferrer' : undefined}
                              animate={{
                                x: isSecondaryHovered ? 5 : 0,
                                opacity: isSecondaryDimmed ? 0.38 : 1,
                              }}
                              transition={{
                                x: DASH_SPRING,
                                opacity: { duration: 0.2, ease: TEXT_EASE },
                              }}
                              onFocus={() => setHoveredSecondaryIndex(idx)}
                              onBlur={() => setHoveredSecondaryIndex(null)}
                              onClick={closeFromInnerLink}
                            >
                              {social.label}
                            </motion.a>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Persistent Bottom Capsule Bar (Anchored at bottom, never jumps away) */}
          <div className="morph-nav-bar">
            <motion.a
              href={homeHref}
              className="morph-nav-brand"
              aria-label={`${brandName} Home`}
              whileHover={{ scale: 1.08 }}
              transition={DASH_SPRING}
              onClick={closeFromInnerLink}
            >
              <motion.span
                className="morph-nav-icon"
                animate={{ rotate: isOpen ? 360 : 0 }}
                transition={{ duration: 0.55, ease: TEXT_EASE }}
                aria-hidden="true"
              >
                {brandLogo ? (
                  <img
                    src={brandLogo}
                    alt=""
                    width="24"
                    height="24"
                    className="morph-nav-logo-img"
                  />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" />
                  </svg>
                )}
              </motion.span>
            </motion.a>

            <motion.button
              ref={toggleBtnRef}
              type="button"
              className="morph-nav-toggle"
              aria-expanded={isOpen}
              aria-controls={menuId}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={DASH_SPRING}
              onClick={handleToggleClick}
            >
              <span className="morph-nav-toggle-mask">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? 'close' : 'menu'}
                    className="morph-nav-toggle-text"
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.16, ease: TEXT_EASE }}
                  >
                    {isOpen ? 'Close' : 'Menu'}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.button>
          </div>
        </motion.nav>
      </div>
    </MotionConfig>
  );
}
