import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'motion/react';
import { en, type Certificate } from '../i18n/en';
import { tools, type Tool } from '../data/tools';
import '../styles/portfolio-modals.css';

export type ModalRequestDetail =
  | { type: 'certificates' }
  | { type: 'tools'; toolName?: string }
  | { type: 'redcarpet' };

type ActiveModalState =
  | { type: 'certificates' }
  | { type: 'tools'; toolName?: string; triggerCount: number }
  | { type: 'redcarpet' };

interface LightboxState {
  items: Certificate[];
  index: number;
  direction: 1 | -1;
}

const MODAL_EASE = [0.22, 1, 0.36, 1] as const;

const SHEET_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 32,
  mass: 0.85,
};

const TOOL_CATEGORIES = Array.from(new Set(tools.map((tool) => tool.category)));
const TOOLS_BY_CATEGORY: { category: string; items: Tool[] }[] = TOOL_CATEGORIES.map((category) => ({
  category,
  items: tools.filter((tool) => tool.category === category),
}));

const PRIMARY_CERTS: Certificate[] = [...en.skills.certificates];
const ADDITIONAL_CERTS: Certificate[] = [...en.skills.additionalCertificates];
const ALL_CERTS: Certificate[] = [...PRIMARY_CERTS, ...ADDITIONAL_CERTS];

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function CloseIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExternalArrowIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.75 11.25 11.25 4.75m0 0H5.75m5.5 0v5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M9.75 3.75 5.5 8l4.25 4.25' : 'M6.25 3.75 10.5 8l-4.25 4.25'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface WhiteModalShellProps {
  titleId: string;
  closeLabel: string;
  closeAriaLabel: string;
  onClose: () => void;
  sheetClassName?: string;
  bodyClassName?: string;
  backdropClassName?: string;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  closeBtnRef: React.RefObject<HTMLButtonElement | null>;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  stickyHeaderContent?: React.ReactNode;
  children: React.ReactNode;
}

function WhiteModalShell({
  titleId,
  closeLabel,
  closeAriaLabel,
  onClose,
  sheetClassName = '',
  bodyClassName = '',
  backdropClassName = '',
  sheetRef,
  closeBtnRef,
  scrollRef: externalScrollRef,
  stickyHeaderContent,
  children,
}: WhiteModalShellProps) {
  const prefersReduced = useReducedMotion();
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalScrollRef ?? internalScrollRef;

  return (
    <motion.div
      className={`pm-backdrop ${backdropClassName}`.trim()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReduced ? 0.12 : 0.18, ease: MODAL_EASE }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`pm-sheet ${sheetClassName}`.trim()}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
        animate={
          prefersReduced
            ? { opacity: 1, transition: { duration: 0.14 } }
            : {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  ...SHEET_SPRING,
                  opacity: { duration: 0.18, ease: MODAL_EASE },
                },
              }
        }
        exit={
          prefersReduced
            ? { opacity: 0, transition: { duration: 0.12 } }
            : {
                opacity: 0,
                scale: 0.97,
                y: 8,
                transition: { duration: 0.15, ease: MODAL_EASE },
              }
        }
      >
        <div ref={scrollRef} className={`pm-body ${bodyClassName}`.trim()}>
          <div className="pm-sticky-top">
            {stickyHeaderContent}
            <button
              ref={closeBtnRef}
              type="button"
              className="pm-close-btn"
              aria-label={closeAriaLabel}
              onClick={onClose}
            >
              <span className="btn-roll-mask">
                <span className="btn-roll-primary">{closeLabel}</span>
                <span className="btn-roll-clone" aria-hidden="true">
                  {closeLabel}
                </span>
              </span>
              <span className="pm-close-well" aria-hidden="true">
                <CloseIcon size={12} />
              </span>
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface CertificateCardProps {
  certificate: Certificate;
  eager: boolean;
  credentialLabel: string;
  onPreview: (certificate: Certificate, triggerEl: HTMLElement) => void;
}

function CertificateCard({
  certificate,
  eager,
  credentialLabel,
  onPreview,
}: CertificateCardProps) {
  const thumbUrl = encodeURI(certificate.thumb);

  return (
    <div className="pm-cert-item">
      <span className="pm-cert-title">{certificate.title}</span>
      <button
        type="button"
        className="pm-cert-thumb-btn"
        aria-label={`Preview ${certificate.title}`}
        onClick={(event) => onPreview(certificate, event.currentTarget)}
      >
        <img
          src={thumbUrl}
          alt={certificate.title}
          width={520}
          height={360}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </button>
      {certificate.credentialUrl && (
        <a
          className="pm-credential-btn"
          href={certificate.credentialUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="btn-roll-mask">
            <span className="btn-roll-primary">{credentialLabel}</span>
            <span className="btn-roll-clone" aria-hidden="true">
              {credentialLabel}
            </span>
          </span>
          <span className="pm-credential-arrow" aria-hidden="true">
            <span className="btn-icon-roll btn-icon-roll--right">
              <span className="btn-icon-primary">
                <ExternalArrowIcon size={10} />
              </span>
              <span className="btn-icon-clone">
                <ExternalArrowIcon size={10} />
              </span>
            </span>
          </span>
        </a>
      )}
    </div>
  );
}

export default function PortfolioModals() {
  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModalState | null>(null);
  const [lightboxState, setLightboxState] = useState<LightboxState | null>(null);
  const [highlightedTool, setHighlightedTool] = useState<string | null>(null);

  const primarySheetRef = useRef<HTMLDivElement>(null);
  const primaryCloseRef = useRef<HTMLButtonElement>(null);
  const primaryScrollRef = useRef<HTMLDivElement>(null);

  const lightboxSheetRef = useRef<HTMLDivElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);

  const triggerElRef = useRef<HTMLElement | null>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  const certsTitleId = useId();
  const toolsTitleId = useId();
  const caseStudyTitleId = useId();
  const lightboxTitleId = useId();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setLightboxState(null);
    setActiveModal(null);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxState(null);
    window.requestAnimationFrame(() => {
      if (lightboxTriggerRef.current && lightboxTriggerRef.current.isConnected) {
        lightboxTriggerRef.current.focus({ preventScroll: true });
      } else {
        primaryCloseRef.current?.focus({ preventScroll: true });
      }
      lightboxTriggerRef.current = null;
    });
  }, []);

  useEffect(() => {
    const handleOpenRequest = (event: Event) => {
      const detail = (event as CustomEvent<ModalRequestDetail>).detail;
      if (!detail) return;

      if (!wasOpenRef.current && document.activeElement instanceof HTMLElement) {
        triggerElRef.current = document.activeElement;
      }

      setLightboxState(null);

      if (detail.type === 'tools') {
        setHighlightedTool(detail.toolName ?? null);
        setActiveModal((prev) => ({
          type: 'tools',
          toolName: detail.toolName,
          triggerCount: prev?.type === 'tools' ? prev.triggerCount + 1 : 1,
        }));
      } else if (detail.type === 'certificates') {
        setActiveModal({ type: 'certificates' });
      } else if (detail.type === 'redcarpet') {
        setActiveModal({ type: 'redcarpet' });
      }
    };

    const handleBeforeSwap = () => {
      setLightboxState(null);
      setActiveModal(null);
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('portfolio:modal-state', { detail: { open: false } }));
    };

    window.addEventListener('portfolio:open-modal', handleOpenRequest);
    document.addEventListener('astro:before-swap', handleBeforeSwap);
    return () => {
      window.removeEventListener('portfolio:open-modal', handleOpenRequest);
      document.removeEventListener('astro:before-swap', handleBeforeSwap);
    };
  }, []);

  useEffect(() => {
    const isOpen = activeModal !== null;

    if (isOpen) {
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
      window.dispatchEvent(new CustomEvent('portfolio:modal-state', { detail: { open: true } }));

      if (!wasOpenRef.current) {
        window.requestAnimationFrame(() => {
          primaryCloseRef.current?.focus({ preventScroll: true });
        });
      }
      wasOpenRef.current = true;
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('portfolio:modal-state', { detail: { open: false } }));

      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        const returnTo = triggerElRef.current;
        triggerElRef.current = null;
        if (returnTo && returnTo.isConnected) {
          window.requestAnimationFrame(() => {
            returnTo.focus({ preventScroll: true });
          });
        }
      }
    }
  }, [activeModal]);

  useEffect(() => {
    if (lightboxState) {
      window.requestAnimationFrame(() => {
        lightboxCloseRef.current?.focus({ preventScroll: true });
      });
    }
  }, [lightboxState !== null]);

  useEffect(() => {
    if (activeModal?.type !== 'tools' || !activeModal.toolName) return;
    const targetName = activeModal.toolName;
    setHighlightedTool(targetName);

    const rafId = window.requestAnimationFrame(() => {
      const container = primaryScrollRef.current;
      if (!container) return;
      const chip = container.querySelector<HTMLElement>(
        `[data-tool-name="${CSS.escape(targetName)}"]`
      );
      chip?.scrollIntoView({
        block: 'center',
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    });

    const timeoutId = window.setTimeout(() => {
      setHighlightedTool((current) => (current === targetName ? null : current));
    }, 1400);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [activeModal, prefersReduced]);

  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (lightboxState) {
          closeLightbox();
        } else {
          closeAllModals();
        }
        return;
      }

      if (lightboxState && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        const delta: 1 | -1 = event.key === 'ArrowRight' ? 1 : -1;
        setLightboxState((prev) => {
          if (!prev || prev.items.length <= 1) return prev;
          const nextIndex = (prev.index + delta + prev.items.length) % prev.items.length;
          return { ...prev, index: nextIndex, direction: delta };
        });
        return;
      }

      if (event.key === 'Tab') {
        const container = lightboxState ? lightboxSheetRef.current : primarySheetRef.current;
        if (!container) return;
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);

        if (focusable.length === 0) {
          event.preventDefault();
          container.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!container.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
          return;
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, lightboxState, closeAllModals, closeLightbox]);

  const handleOpenCertPreview = useCallback(
    (certificate: Certificate, triggerEl: HTMLElement) => {
      lightboxTriggerRef.current = triggerEl;
      const index = ALL_CERTS.findIndex(
        (item) => item.file === certificate.file && item.title === certificate.title
      );
      setLightboxState({
        items: ALL_CERTS,
        index: index >= 0 ? index : 0,
        direction: 1,
      });
    },
    []
  );

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const certsCopy = en.skills.certificatesDialog;
  const toolsCopy = en.skills.toolsDialog;
  const redcarpet = en.projects.redCarpetCaseStudy;
  const currentLightboxCert = lightboxState ? lightboxState.items[lightboxState.index] : null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <div className="pm-portal-root">
        <AnimatePresence>
          {activeModal?.type === 'certificates' && (
            <WhiteModalShell
              key="certificates-modal"
              titleId={certsTitleId}
              closeLabel={certsCopy.closeLabel}
              closeAriaLabel={certsCopy.closeAriaLabel}
              onClose={closeAllModals}
              sheetRef={primarySheetRef}
              closeBtnRef={primaryCloseRef}
              scrollRef={primaryScrollRef}
            >
              <h2 id={certsTitleId} className="pm-title">
                {certsCopy.title}
              </h2>
              <p className="pm-lede">{certsCopy.lede}</p>

              <div className="pm-cert-category">
                <div className="pm-section-bar">
                  <h3>{certsCopy.primaryCategoryTitle}</h3>
                  <span>
                    {PRIMARY_CERTS.length} {certsCopy.itemsUnit}
                  </span>
                </div>
                <div className="pm-cert-grid">
                  {PRIMARY_CERTS.map((cert, idx) => (
                    <CertificateCard
                      key={`primary-${cert.file}`}
                      certificate={cert}
                      eager={idx < 8}
                      credentialLabel={certsCopy.showCredentialLabel}
                      onPreview={handleOpenCertPreview}
                    />
                  ))}
                </div>
              </div>

              <div className="pm-cert-category">
                <div className="pm-section-bar">
                  <h3>{certsCopy.additionalCategoryTitle}</h3>
                  <span>
                    {ADDITIONAL_CERTS.length} {certsCopy.itemsUnit}
                  </span>
                </div>
                <div className="pm-cert-grid">
                  {ADDITIONAL_CERTS.map((cert) => (
                    <CertificateCard
                      key={`additional-${cert.file}`}
                      certificate={cert}
                      eager={false}
                      credentialLabel={certsCopy.showCredentialLabel}
                      onPreview={handleOpenCertPreview}
                    />
                  ))}
                </div>
              </div>
            </WhiteModalShell>
          )}

          {activeModal?.type === 'tools' && (
            <WhiteModalShell
              key="tools-modal"
              titleId={toolsTitleId}
              closeLabel={toolsCopy.closeLabel}
              closeAriaLabel={toolsCopy.closeAriaLabel}
              onClose={closeAllModals}
              sheetClassName="pm-sheet--tools"
              sheetRef={primarySheetRef}
              closeBtnRef={primaryCloseRef}
              scrollRef={primaryScrollRef}
            >
              <h2 id={toolsTitleId} className="pm-title">
                {toolsCopy.title}
              </h2>
              <p className="pm-lede">{toolsCopy.lede}</p>

              <div className="pm-tools-groups">
                {TOOLS_BY_CATEGORY.map((group) => (
                  <section
                    key={group.category}
                    className="pm-tools-category"
                    aria-labelledby={`pm-tools-cat-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  >
                    <h3
                      id={`pm-tools-cat-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    >
                      {group.category}
                    </h3>
                    <div className="pm-tools-grid">
                      {group.items.map((tool) => {
                        const badgeColor = tool.lightColor ?? tool.color;
                        const isHighlighted = highlightedTool === tool.name;
                        return (
                          <div
                            key={tool.name}
                            className={`pm-tool-chip${isHighlighted ? ' is-highlighted' : ''}`}
                            data-tool-name={tool.name}
                          >
                            <span
                              className="pm-tool-badge"
                              style={{ '--badge-color': badgeColor } as React.CSSProperties}
                            >
                              {tool.short}
                            </span>
                            <span className="pm-tool-name">{tool.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </WhiteModalShell>
          )}

          {activeModal?.type === 'redcarpet' && (
            <WhiteModalShell
              key="redcarpet-modal"
              titleId={caseStudyTitleId}
              closeLabel={redcarpet.closeLabel}
              closeAriaLabel={redcarpet.closeAriaLabel}
              onClose={closeAllModals}
              sheetClassName="pm-sheet--case-study"
              sheetRef={primarySheetRef}
              closeBtnRef={primaryCloseRef}
              scrollRef={primaryScrollRef}
            >
              <h2 id={caseStudyTitleId} className="pm-title">
                {redcarpet.title}
              </h2>
              <p className="pm-lede">{redcarpet.tagline}</p>

              <div className="pm-cs-facts">
                {redcarpet.meta.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <img
                className="pm-cs-hero"
                src={redcarpet.heroImageWebp}
                alt={redcarpet.heroAlt}
                width={1400}
                height={800}
                decoding="async"
              />

              <div className="pm-cs-columns">
                {redcarpet.columns.map((col) => (
                  <div key={col.label}>
                    <span>{col.label}</span>
                    <p>{col.text}</p>
                  </div>
                ))}
              </div>

              <section className="pm-cs-section">
                <h3>{redcarpet.rolesHeading}</h3>
                <div className="pm-cs-roles">
                  {redcarpet.roles.map((role) => (
                    <article key={role.title} className="pm-cs-role-card">
                      <h4>{role.title}</h4>
                      <p>{role.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="pm-cs-section">
                <h3>{redcarpet.featuresHeading}</h3>
                <div className="pm-cs-features">
                  {redcarpet.features.map((feat) => (
                    <article key={feat.number} className="pm-cs-feature-item">
                      <b>{feat.number}</b>
                      <div>
                        <h4>{feat.title}</h4>
                        <p>{feat.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <footer className="pm-cs-footer">
                <div className="pm-cs-tags">
                  {redcarpet.tags.map((tag) => (
                    <span key={tag} className="pm-cs-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </footer>
            </WhiteModalShell>
          )}
        </AnimatePresence>

        {/* Nested White Certificate Lightbox */}
        <AnimatePresence>
          {lightboxState && currentLightboxCert && (
            <WhiteModalShell
              key="certificate-lightbox"
              titleId={lightboxTitleId}
              closeLabel={certsCopy.closeLabel}
              closeAriaLabel={certsCopy.previewCloseAriaLabel}
              onClose={closeLightbox}
              sheetClassName="pm-sheet--lightbox"
              bodyClassName="pm-lightbox-body"
              backdropClassName="pm-backdrop--lightbox"
              sheetRef={lightboxSheetRef}
              closeBtnRef={lightboxCloseRef}
              stickyHeaderContent={
                <h2 id={lightboxTitleId} className="pm-lightbox-title">
                  {currentLightboxCert.title}
                </h2>
              }
            >
              <div className="pm-lightbox-stage">
                {lightboxState.items.length > 1 && (
                  <button
                    type="button"
                    className="pm-lightbox-nav pm-lightbox-nav--prev"
                    aria-label="Previous certificate"
                    onClick={() =>
                      setLightboxState((prev) => {
                        if (!prev) return prev;
                        const nextIndex =
                          (prev.index - 1 + prev.items.length) % prev.items.length;
                        return { ...prev, index: nextIndex, direction: -1 };
                      })
                    }
                  >
                    <ChevronIcon direction="left" />
                  </button>
                )}

                <AnimatePresence mode="popLayout" custom={lightboxState.direction} initial={false}>
                  <motion.figure
                    key={`${currentLightboxCert.preview}-${lightboxState.index}`}
                    className="pm-lightbox-figure"
                    custom={lightboxState.direction}
                    variants={
                      prefersReduced
                        ? {
                            enter: { opacity: 0 },
                            center: { opacity: 1 },
                            exit: { opacity: 0 },
                          }
                        : {
                            enter: (dir: number) => ({ opacity: 0, x: dir * 20 }),
                            center: { opacity: 1, x: 0 },
                            exit: (dir: number) => ({ opacity: 0, x: dir * -20 }),
                          }
                    }
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.18, ease: MODAL_EASE }}
                  >
                    <img
                      className="pm-lightbox-img"
                      src={encodeURI(currentLightboxCert.preview)}
                      alt={currentLightboxCert.title}
                      decoding="async"
                    />
                  </motion.figure>
                </AnimatePresence>

                {lightboxState.items.length > 1 && (
                  <button
                    type="button"
                    className="pm-lightbox-nav pm-lightbox-nav--next"
                    aria-label="Next certificate"
                    onClick={() =>
                      setLightboxState((prev) => {
                        if (!prev) return prev;
                        const nextIndex = (prev.index + 1) % prev.items.length;
                        return { ...prev, index: nextIndex, direction: 1 };
                      })
                    }
                  >
                    <ChevronIcon direction="right" />
                  </button>
                )}
              </div>
            </WhiteModalShell>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>,
    document.body
  );
}
