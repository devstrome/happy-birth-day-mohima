"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const memories = [
  {
    image: "/images/portrait-silver.webp",
    alt: "Mohima smiling in a silver embroidered outfit",
    label: "A little sparkle, everywhere you go",
    className: "memory-tall",
  },
  {
    image: "/images/birthday-cake.webp",
    alt: "Mohima holding a chocolate birthday cake",
    label: "The sweetest kind of celebration",
    className: "memory-wide",
  },
  {
    image: "/images/dinner-table.webp",
    alt: "A birthday dinner spread with seafood and a small cake",
    label: "A table full of favorite things",
    className: "memory-small",
  },
  {
    image: "/images/cake-detail.webp",
    alt: "A red velvet cake slice with a little birthday message",
    label: "Cake first. Everything else later.",
    className: "memory-small",
  },
  {
    image: "/images/rose.webp",
    alt: "A red rose held beneath the lights of an evening out",
    label: "A rose for the birthday girl",
    className: "memory-wide",
  },
  {
    image: "/images/portrait-black.webp",
    alt: "Mohima in a black embroidered outfit",
    label: "One more lovely Mohima moment",
    className: "memory-tall",
  },
];

const melody = [
  [392, 1], [392, 1], [440, 2], [392, 2], [523.25, 2], [493.88, 3],
  [392, 1], [392, 1], [440, 2], [392, 2], [587.33, 2], [523.25, 3],
  [392, 1], [392, 1], [783.99, 2], [659.25, 2], [523.25, 2], [493.88, 2], [440, 3],
  [698.46, 1], [698.46, 1], [659.25, 2], [523.25, 2], [587.33, 2], [523.25, 4],
] as const;

export default function BirthdayPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [celebration, setCelebration] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const songTimerRef = useRef<number | null>(null);

  const stopSong = () => {
    if (songTimerRef.current !== null) window.clearTimeout(songTimerRef.current);
    songTimerRef.current = null;
    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context && context.state !== "closed") void context.close();
    setIsPlaying(false);
  };

  const playSong = async () => {
    if (isPlaying) {
      stopSong();
      return;
    }

    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;

    const context = new AudioContextConstructor();
    audioContextRef.current = context;
    await context.resume();
    setIsPlaying(true);

    const beat = 0.43;
    let cursor = context.currentTime + 0.08;

    melody.forEach(([frequency, beats]) => {
      const start = cursor;
      const length = beat * beats * 0.84;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(0.095, start + 0.025);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
      oscillator.connect(envelope);
      envelope.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + length + 0.04);
      cursor += beat * beats;
    });

    songTimerRef.current = window.setTimeout(stopSong, (cursor - context.currentTime + 0.2) * 1000);
  };

  useEffect(() => () => {
    if (songTimerRef.current !== null) window.clearTimeout(songTimerRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }
  }, []);

  useEffect(() => {
    const forceReducedMotion = new URLSearchParams(window.location.search).get("reduce") === "1";
    if (forceReducedMotion) document.documentElement.dataset.motion = "reduce";
    return () => {
      if (forceReducedMotion) delete document.documentElement.dataset.motion;
    };
  }, []);

  const goToWish = () => {
    document.getElementById("wish")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
  };

  const makeWish = () => {
    setWishMade(true);
    setCelebration((current) => current + 1);
  };

  return (
    <main className="page-shell">
      <a className="skip-link" href="#main-content">Skip to the birthday wishes</a>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="ambient ambient-three" aria-hidden="true" />

      <header className="site-header glass-panel">
        <a className="brand" href="#top" aria-label="A little celebration for Mohima">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>a little celebration</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#memories">Little moments</a>
          <a href="#wish">Make a wish</a>
        </nav>
        <a className="header-note" href="#wish"><span aria-hidden="true">♡</span> just for Mohima</a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy" id="main-content">
          <p className="eyebrow"><span className="eyebrow-star" aria-hidden="true">✦</span> a day that belongs to you</p>
          <h1 id="hero-title">Happiest<br />birthday,<br /><em>Mohima.</em></h1>
          <p className="hero-lede">A little reminder that the world got brighter the day you arrived in it. May this next trip around the sun bring you all the joy you give away.</p>

          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={goToWish}>
              Make a wish <span aria-hidden="true">↗</span>
            </button>
            <button className={`button button-music${isPlaying ? " is-playing" : ""}`} type="button" onClick={playSong} aria-pressed={isPlaying}>
              <span className="music-icon" aria-hidden="true">{isPlaying ? "Ⅱ" : "♫"}</span>
              {isPlaying ? "Stop the song" : "Play birthday music"}
            </button>
          </div>
          <p className="audio-hint" aria-live="polite">{isPlaying ? "A little birthday melody, just for you" : "Tap for a tiny, homemade birthday song"}</p>

          <div className="hero-signature">
            <span className="signature-line" />
            <p>Wishing you a year<br />as lovely as you are <span aria-hidden="true">♡</span></p>
          </div>
        </div>

        <div className="hero-stage" aria-label="A little birthday portrait gallery">
          <div className="stage-halo" aria-hidden="true" />
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="sparkle sparkle-one" aria-hidden="true">✦</div>
          <div className="sparkle sparkle-two" aria-hidden="true">✧</div>
          <div className="sparkle sparkle-three" aria-hidden="true">·</div>
          <div className="balloon balloon-pink" aria-hidden="true"><span /></div>
          <div className="balloon balloon-pearl" aria-hidden="true"><span /></div>

          <figure className="portrait-card portrait-main">
            <div className="portrait-image">
              <Image src="/images/mohima-portrait.webp" alt="Mohima smiling in a bright pink outfit" fill priority sizes="(max-width: 760px) 70vw, 360px" />
            </div>
            <figcaption><span className="caption-heart" aria-hidden="true">♡</span> the birthday girl</figcaption>
          </figure>

          <figure className="portrait-card portrait-small glass-panel">
            <div className="portrait-image">
              <Image src="/images/birthday-cake.webp" alt="Mohima holding a birthday cake" fill sizes="160px" />
            </div>
            <figcaption>cake, candles &amp; wishes</figcaption>
          </figure>

          <div className="cake-scene" aria-hidden="true">
            <div className="cake-shadow" />
            <div className="cake-tier cake-bottom"><span className="cake-icing" /></div>
            <div className="cake-tier cake-top"><span className="cake-icing" /></div>
            <div className="cake-candle"><span className="cake-flame" /></div>
            <span className="cake-sprinkle sprinkle-a" />
            <span className="cake-sprinkle sprinkle-b" />
            <span className="cake-sprinkle sprinkle-c" />
          </div>

          <div className="floating-note glass-panel"><span className="note-icon" aria-hidden="true">✧</span><span>made with<br /><b>a lot of love</b></span></div>
        </div>
      </section>

      <section className="intro-strip" aria-label="Birthday message">
        <span className="strip-flower" aria-hidden="true">✿</span>
        <p>Today, we celebrate <em>you</em> — every laugh, every little kindness, every beautiful bit.</p>
        <span className="strip-flower" aria-hidden="true">✿</span>
      </section>

      <section className="memories-section" id="memories" aria-labelledby="memories-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-star" aria-hidden="true">✦</span> little moments, lovely memories</p>
            <h2 id="memories-title">A gallery of <em>you.</em></h2>
          </div>
          <p className="section-description">The best days are made of tiny things worth keeping. Here are a few of ours.</p>
        </div>

        <div className="memory-grid">
          {memories.map((memory, index) => (
            <figure className={`memory-card ${memory.className}`} key={memory.image}>
              <Image src={memory.image} alt={memory.alt} fill sizes="(max-width: 680px) 90vw, (max-width: 1050px) 45vw, 30vw" />
              <span className="memory-number" aria-hidden="true">0{index + 1}</span>
              <figcaption>{memory.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="wish-section" id="wish" aria-labelledby="wish-title">
        <div className="wish-backdrop" aria-hidden="true" />
        <div className={`wish-card glass-panel${wishMade ? " wish-made" : ""}`}>
          <div className="wish-copy">
            <p className="eyebrow"><span className="eyebrow-star" aria-hidden="true">✦</span> one birthday wish, coming up</p>
            <h2 id="wish-title">This little light<br />is <em>all yours.</em></h2>
            <p>Close your eyes, make a wish for the year ahead, and let the candles do the rest.</p>
            <button className="button button-primary wish-button" type="button" onClick={makeWish}>
              {wishMade ? "Your wish is on its way" : "I made a wish"}<span aria-hidden="true">{wishMade ? " ✨" : " ✦"}</span>
            </button>
            <p className="wish-status" aria-live="polite">{wishMade ? "May every bit of it find its way to you, Mohima." : "Psst… it's okay to wish for the big things."}</p>
          </div>

          <div className="wish-cake-wrap" aria-label={wishMade ? "A birthday cake with its candle blown out" : "A birthday cake with a glowing candle"}>
            <div className="wish-cake-glow" />
            <div className={`wish-cake${wishMade ? " candle-out" : ""}`}>
              <div className="wish-candle"><span className="wish-flame" /></div>
              <div className="wish-cake-top"><span className="cake-berry berry-one" /><span className="cake-berry berry-two" /><span className="cake-berry berry-three" /></div>
              <div className="wish-cake-side"><span className="icing-drip drip-one" /><span className="icing-drip drip-two" /><span className="icing-drip drip-three" /><span className="icing-drip drip-four" /><span className="cake-piped piped-one">✿</span><span className="cake-piped piped-two">✿</span><span className="cake-piped piped-three">✿</span></div>
              <div className="wish-cake-base" />
            </div>
            <div className="confetti-burst" key={celebration} aria-hidden="true">
              {Array.from({ length: 26 }, (_, index) => (
                <span
                  className={`confetti confetti-${index % 6}`}
                  key={`${celebration}-${index}`}
                  style={{
                    "--confetti-x": `${(index - 12) * 12}px`,
                    "--confetti-y": `${-116 - (index % 4) * 13}px`,
                    "--confetti-angle": `${index * 51}deg`,
                  } as CSSProperties}
                />
              ))}
            </div>
            <p className="cake-caption">a little sweetness, just for you</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span className="footer-star" aria-hidden="true">✧</span>
        <p>Made with love, for <em>Mohima</em> <span aria-hidden="true">♡</span></p>
        <a href="#top">Back to the top ↑</a>
      </footer>
    </main>
  );
}
