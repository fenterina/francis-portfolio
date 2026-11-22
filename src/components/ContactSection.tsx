import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'motion/react';
import { en } from '../i18n/en';
import '../styles/contact-section.css';

const CONTACT_EASE = [0.22, 1, 0.36, 1] as const;

const SOCIAL_PILL_SPRING = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 32,
  mass: 0.85,
};

function ArrowRightIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      className="icon-svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 3.5V3a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10H4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.25 8.5 6.5 11.75 12.75 4.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [focusedSocial, setFocusedSocial] = useState<number | null>(null);

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const copyTimerRef = useRef<number | null>(null);
  const emailPillRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Spring-damped pointer spotlight inside the Email glass capsule
  const rawSpotX = useMotionValue(50);
  const rawSpotY = useMotionValue(50);
  const spotX = useSpring(rawSpotX, { stiffness: 180, damping: 24 });
  const spotY = useSpring(rawSpotY, { stiffness: 180, damping: 24 });
  const spotlightBackground = useMotionTemplate`radial-gradient(240px circle at ${spotX}% ${spotY}%, rgba(169, 186, 242, 0.18), transparent 72%)`;

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const activeSocial = hoveredSocial ?? focusedSocial;

  const handleEmailPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !emailPillRef.current) return;
    const rect = emailPillRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    rawSpotX.set(((e.clientX - rect.left) / rect.width) * 100);
    rawSpotY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleCopyEmail = async () => {
    const email = en.contact.email;
    let didCopy = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(email);
        didCopy = true;
      } catch {
        didCopy = false;
      }
    }

    if (!didCopy) {
      const helper = document.createElement('textarea');
      helper.value = email;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      try {
        didCopy = document.execCommand('copy');
      } finally {
        document.body.removeChild(helper);
      }
    }

    if (didCopy) {
      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2200);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const data = new FormData(form);
    setFormState('submitting');
    setStatusMessage('');

    try {
      const response = await fetch(en.contact.form.endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }
      form.reset();
      setFormState('success');
      setStatusMessage(en.contact.form.successMessage);
    } catch {
      setFormState('error');
      setStatusMessage(en.contact.form.errorMessage);
    }
  };

  const handleAnotherMessage = () => {
    setFormState('idle');
    setStatusMessage('');
    window.requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
  };

  const viewportConfig = { once: true, amount: 0.15 } as const;

  const enterTransition = (delay: number, duration: number) => ({
    duration,
    delay,
    ease: CONTACT_EASE,
  });

  return (
    <MotionConfig reducedMotion="never">
      <div className="contact-ambient-glow" aria-hidden="true" />
      <div className="container contact-inner contact-grid">
        <div className="contact-copy">
          {/* Lead: Display Title + Animated Luminous Curved Underline */}
          <motion.div
            className="contact-heading-wrap"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={enterTransition(0, 0.42)}
          >
            <h2 className="section-heading">{en.contact.title}</h2>
            <svg
              className="contact-title-arc"
              viewBox="0 0 260 14"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="contact-arc-base" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4169e1" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#6c8eff" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#4169e1" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="contact-arc-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4169e1" stopOpacity="0.15" />
                  <stop offset="35%" stopColor="#7ca2ff" stopOpacity="0.95" />
                  <stop offset="52%" stopColor="#edf4ff" stopOpacity="1" />
                  <stop offset="72%" stopColor="#6c8eff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4169e1" stopOpacity="0.15" />
                </linearGradient>
                <filter id="contact-arc-glow" x="-15%" y="-120%" width="130%" height="340%">
                  <feGaussianBlur stdDeviation="2.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Subtle Base Track */}
              <motion.path
                d="M2 10.5C68 3.5 162 2.5 258 8"
                stroke="url(#contact-arc-base)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ opacity: 0, pathLength: 0 }}
                whileInView={{ opacity: 1, pathLength: 1 }}
                viewport={viewportConfig}
                transition={enterTransition(0.08, 0.44)}
              />

              {/* Continuous Luminous Light Pulse Traveling Along the Curve */}
              <motion.path
                d="M2 10.5C68 3.5 162 2.5 258 8"
                stroke="url(#contact-arc-beam)"
                strokeWidth="2.4"
                strokeLinecap="round"
                filter="url(#contact-arc-glow)"
                pathLength={1}
                strokeDasharray="0.3 1.4"
                initial={{ strokeDashoffset: 0.34, opacity: 0 }}
                animate={{
                  strokeDashoffset: [0.34, -1.04],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  repeatDelay: 0.55,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.14, 0.86, 1],
                }}
              />
            </svg>
          </motion.div>

          {/* Support: Intro Paragraph */}
          <motion.p
            className="section-intro"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={enterTransition(0.055, 0.34)}
          >
            {en.contact.intro}
          </motion.p>

          {/* Support: Email Glass Capsule Card */}
          <motion.div
            ref={emailPillRef}
            className="contact-email-pill"
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportConfig}
            transition={enterTransition(0.1, 0.38)}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') {
                setIsEmailHovered(true);
                handleEmailPointerMove(e);
              }
            }}
            onPointerMove={handleEmailPointerMove}
            onPointerLeave={(e) => {
              if (e.pointerType === 'mouse') setIsEmailHovered(false);
            }}
          >
            <motion.div
              className="contact-email-spotlight"
              aria-hidden="true"
              style={{ background: spotlightBackground }}
              initial={false}
              animate={{ opacity: isEmailHovered ? 1 : 0 }}
              transition={{ duration: 0.2, ease: CONTACT_EASE }}
            />

            <div className="contact-email-meta">
              <span className="contact-email-eyebrow">{en.contact.emailLabel}</span>
              <a className="contact-email-address" href={en.contact.emailHref}>
                {en.contact.email}
              </a>
            </div>

            <div className="contact-email-actions">
              <button
                type="button"
                className={`contact-copy-btn${copied ? ' is-copied' : ''}`}
                onClick={handleCopyEmail}
                aria-label={copied ? 'Email address copied' : 'Copy email address'}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      className="contact-copy-inner"
                      initial={{ opacity: 0, scale: 0.92, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.92, filter: 'blur(2px)' }}
                      transition={{ duration: 0.16, ease: CONTACT_EASE }}
                    >
                      <CheckIcon size={13} />
                      <span>Copied</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      className="contact-copy-inner"
                      initial={{ opacity: 0, scale: 0.92, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.92, filter: 'blur(2px)' }}
                      transition={{ duration: 0.16, ease: CONTACT_EASE }}
                    >
                      <span className="btn-icon-roll btn-icon-roll--down" aria-hidden="true">
                        <span className="btn-icon-primary">
                          <CopyIcon />
                        </span>
                        <span className="btn-icon-clone">
                          <CopyIcon />
                        </span>
                      </span>
                      <span className="btn-roll-mask">
                        <span className="btn-roll-primary">Copy</span>
                        <span className="btn-roll-clone" aria-hidden="true">
                          Copy
                        </span>
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <a
                className="contact-circle-btn"
                href={en.contact.emailHref}
                aria-label={`Send email to ${en.contact.email}`}
              >
                <span className="btn-icon-roll btn-icon-roll--right" aria-hidden="true">
                  <span className="btn-icon-primary">
                    <ArrowRightIcon size={15} />
                  </span>
                  <span className="btn-icon-clone">
                    <ArrowRightIcon size={15} />
                  </span>
                </span>
              </a>
            </div>
          </motion.div>

          {/* Support: Morphing Social Rows */}
          <LayoutGroup id="contact-social-group">
            <motion.div
              className="contact-social-list"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={enterTransition(0.135, 0.36)}
              onPointerLeave={(e) => {
                if (e.pointerType === 'mouse') setHoveredSocial(null);
              }}
            >
              {en.contact.social.map((social, index) => {
                const isActive = activeSocial === index;
                const isDimmed = activeSocial !== null && !isActive;
                const hideTopDivider = index === 0 && isActive;
                const hideBottomDivider =
                  isActive || (activeSocial !== null && activeSocial === index + 1);

                return (
                  <div key={social.label} className="contact-social-item">
                    {index === 0 && (
                      <span
                        className={`contact-social-divider contact-social-divider--top${
                          hideTopDivider ? ' is-hidden' : ''
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`contact-social-row${isActive ? ' is-active' : ''}${
                        isDimmed ? ' is-dimmed' : ''
                      }`}
                      whileTap={{ scale: 0.985 }}
                      onPointerEnter={(e) => {
                        if (e.pointerType === 'mouse') setHoveredSocial(index);
                      }}
                      onFocus={() => setFocusedSocial(index)}
                      onBlur={() =>
                        setFocusedSocial((prev) => (prev === index ? null : prev))
                      }
                    >
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="contact-social-pill"
                            className="contact-social-pill"
                            aria-hidden="true"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{
                              layout: SOCIAL_PILL_SPRING,
                              opacity: { duration: 0.16, ease: CONTACT_EASE },
                              scale: { duration: 0.16, ease: CONTACT_EASE },
                            }}
                          />
                        )}
                      </AnimatePresence>

                      <span className="contact-social-name">
                        <strong>{social.label}</strong>
                        <span className="contact-handle">{social.handle}</span>
                      </span>

                      <span className="contact-social-badge" aria-hidden="true">
                        <motion.span
                          className="contact-social-badge-bg"
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            scale: isActive ? 1 : 0.85,
                          }}
                          transition={{ duration: 0.18, ease: CONTACT_EASE }}
                        />
                        <span className="btn-icon-roll btn-icon-roll--right">
                          <span className="btn-icon-primary">
                            <ArrowRightIcon size={15} />
                          </span>
                          <span className="btn-icon-clone">
                            <ArrowRightIcon size={15} />
                          </span>
                        </span>
                      </span>
                    </motion.a>
                    <span
                      className={`contact-social-divider${
                        hideBottomDivider ? ' is-hidden' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </motion.div>
          </LayoutGroup>

          {/* Decoration: Location with Glowing Blue Status Dot */}
          <motion.p
            className="contact-location"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={enterTransition(0.17, 0.28)}
          >
            <span className="contact-status-dot" aria-hidden="true" />
            <span>{en.contact.location}</span>
          </motion.p>
        </div>

        {/* Right Column: Signature Form Card */}
        <motion.form
          ref={formRef}
          className={`contact-form${formState === 'success' ? ' is-success' : ''}`}
          id="contact-form"
          action={en.contact.form.endpoint}
          method="POST"
          aria-describedby="form-status"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14, scale: 0.988 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportConfig}
          transition={enterTransition(0.075, 0.42)}
        >
          <div className="contact-form-box">
            <AnimatePresence mode="wait" initial={false}>
              {formState === 'success' ? (
                <motion.div
                  key="form-success"
                  className="form-success"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 8, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.985 }}
                  transition={{ duration: 0.22, ease: CONTACT_EASE }}
                >
                  <div className="success-check" aria-hidden="true">
                    <svg className="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <motion.path
                        d="M5.5 12.5 10 17l8.5-9.5"
                        stroke="currentColor"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.32, delay: 0.08, ease: CONTACT_EASE }}
                      />
                    </svg>
                  </div>
                  <h3>{en.contact.form.successTitle}</h3>
                  <p>{en.contact.form.successBody}</p>
                  <div className="success-actions">
                    <a className="success-primary" href="#projects">
                      <span className="btn-roll-mask">
                        <span className="btn-roll-primary">{en.contact.form.backToWorkLabel}</span>
                        <span className="btn-roll-clone" aria-hidden="true">
                          {en.contact.form.backToWorkLabel}
                        </span>
                      </span>
                    </a>
                    <button
                      className="success-secondary"
                      type="button"
                      onClick={handleAnotherMessage}
                    >
                      <span className="btn-roll-mask">
                        <span className="btn-roll-primary">
                          {en.contact.form.anotherMessageLabel}
                        </span>
                        <span className="btn-roll-clone" aria-hidden="true">
                          {en.contact.form.anotherMessageLabel}
                        </span>
                      </span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form-fields"
                  className="form-fields"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: CONTACT_EASE }}
                >
                  <div className="contact-form-top">
                    <div className="contact-form-logo" aria-hidden="true">
                      <svg
                        className="contact-form-logo-svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="3"
                          stroke="currentColor"
                          strokeWidth="1.85"
                        />
                        <path
                          d="m4 7 8 6 8-6"
                          stroke="currentColor"
                          strokeWidth="1.85"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="contact-form-heading">
                      <h3>{en.contact.form.title}</h3>
                      <p>{en.contact.form.requiredNote}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <label>
                      {en.contact.form.nameLabel}
                      <input
                        ref={nameInputRef}
                        name="name"
                        type="text"
                        placeholder={en.contact.form.namePlaceholder}
                        required
                      />
                    </label>
                    <label>
                      {en.contact.form.emailLabel}
                      <input
                        name="email"
                        type="email"
                        placeholder={en.contact.form.emailPlaceholder}
                        required
                      />
                    </label>
                  </div>

                  <label>
                    {en.contact.form.messageLabel}
                    <span className="field-hint">{en.contact.form.messageHint}</span>
                    <textarea
                      name="message"
                      placeholder={en.contact.form.messagePlaceholder}
                      required
                    />
                  </label>

                  <button
                    className="form-submit"
                    type="submit"
                    disabled={formState === 'submitting'}
                  >
                    <span className="btn-roll-mask">
                      <span className="btn-roll-primary form-submit-label">
                        {formState === 'submitting'
                          ? en.contact.form.sendingLabel
                          : en.contact.form.submitLabel}
                      </span>
                      <span className="btn-roll-clone form-submit-label" aria-hidden="true">
                        {formState === 'submitting'
                          ? en.contact.form.sendingLabel
                          : en.contact.form.submitLabel}
                      </span>
                    </span>
                    <span className="btn-icon-roll btn-icon-roll--right" aria-hidden="true">
                      <span className="btn-icon-primary">
                        <ArrowRightIcon size={15} />
                      </span>
                      <span className="btn-icon-clone">
                        <ArrowRightIcon size={15} />
                      </span>
                    </span>
                  </button>

                  <p
                    className={`form-status${formState === 'error' ? ' is-error' : ''}`}
                    id="form-status"
                    role="status"
                    aria-live="polite"
                  >
                    {statusMessage}
                  </p>

                  <p className="contact-form-footer">
                    Prefer direct email?{' '}
                    <a className="contact-form-footer-link" href={en.contact.emailHref}>
                      {en.contact.email}
                    </a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </MotionConfig>
  );
}
