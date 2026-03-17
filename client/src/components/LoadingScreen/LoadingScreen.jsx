import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LoadingScreen.css";

const messages = [
  "GARAGE MODULE: READY",
  "SHOWROOM MODULE: SYNCING...",
  "CREW DATA: LOADED",
  "CALIBRATING MEMBER ACCESS...",
  "FINALIZING LIVE INTERFACE..."
];

const modules = [
  "GARAGE SYNC",
  "SHOWROOM MODULE",
  "MEET ARCHIVE",
  "FEEDBACK CORE"
];

export default function LoadingScreen({ isLoading, onComplete }) {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [history, setHistory] = useState([]);
  const [boosted, setBoosted] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [progress, setProgress] = useState([14, 9, 5, 3]);

  const typingIntervalRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const allReady = useMemo(
    () => progress.every((value) => value >= 100),
    [progress]
  );

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Prevent scrolling while loader is active
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    let charIndex = 0;
    const currentMessage = messages[messageIndex];
    setTypedText("");

    clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = setInterval(() => {
      charIndex += 1;
      setTypedText(currentMessage.slice(0, charIndex));

      if (charIndex >= currentMessage.length) {
        clearInterval(typingIntervalRef.current);

        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => {
          setHistory(prev => {
            const newHistory = [...prev, `> ${currentMessage}`];
            return newHistory.slice(-4); // keep last 4
          });
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 900);
      }
    }, 20);

    return () => {
      clearInterval(typingIntervalRef.current);
      clearTimeout(messageTimeoutRef.current);
    };
  }, [messageIndex, visible]);

  useEffect(() => {
    if (!visible) return;

    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (!isLoading) {
          return prev.map((value) => Math.min(100, value + Math.random() * 18 + 8));
        }

        return prev.map((value, index) => {
          const caps = [92, 76, 68, 61];
          if (value >= caps[index]) return value;
          return Math.min(caps[index], value + Math.random() * 6);
        });
      });
    }, 260);

    return () => clearInterval(progressIntervalRef.current);
  }, [isLoading, visible]);

  useEffect(() => {
    if (!isLoading) {
      setMessageIndex(messages.length - 1);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && allReady) {
      const exitTimer = setTimeout(() => {
        setClosing(true);
      }, 450);

      const unmountTimer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 1500);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoading, allReady, onComplete]);

  const handleCoreClick = () => {
    setBoosted(true);
    setHistory(prev => {
      const newHistory = [...prev, `> BABY : BOONT MODE ENABLED`];
      return newHistory.slice(-5);
    });
    setTimeout(() => setBoosted(false), 1000);
  };

  if (!visible) return null;

  return (
    <div
      className={`trs-loader ${closing ? "trs-loader--closing" : ""} ${boosted ? "trs-loader--boosted" : ""}`}
      aria-live="polite"
    >
      <div
        className="trs-loader__mouse-glow"
        style={{
          left: `${mouse.x}%`,
          top: `${mouse.y}%`
        }}
      />

      <div className="trs-loader__particles" />
      <div className="trs-loader__grid" />

      {/* Background Geometrics */}
      <div className="trs-loader__overlay-circuit trs-loader__overlay-circuit--top" />
      <div className="trs-loader__bg-rings" />

      <div className="trs-loader__noise" />

      <div className="trs-loader__corner trs-loader__corner--tl" />
      <div className="trs-loader__corner trs-loader__corner--tr" />
      <div className="trs-loader__corner trs-loader__corner--bl" />
      <div className="trs-loader__corner trs-loader__corner--br" />

      <div className="trs-loader__top-beam" />

      <div className="trs-loader__status">
        <div className="trs-loader__status-row">
          <span className="trs-loader__status-dot">♦</span>
          <span>SYSTEM ACTIVE</span>
        </div>
        <div className="trs-loader__status-row trs-loader__status-sub">
          <span>SIGNAL: STABLE</span>
        </div>
        <div className="trs-loader__status-row trs-loader__status-sub">
          <span>LINK: SECURE</span>
        </div>
      </div>

      <div className="trs-loader__center">
        <div className="trs-loader__logo-wrap">
          <div className="trs-loader__logo-glow"></div>
          <img src="/TRS_LOGO.png" alt="TRS Logo" className="trs-loader__logo-image" />
        </div>

        <h1 className="trs-loader__title">
          <span>THE ROYAL</span>
          <span>SORCERERS</span>
        </h1>

        <div className="trs-loader__diamond-divider">♦</div>

        <button
          type="button"
          className="trs-loader__core-wrap"
          onClick={handleCoreClick}
          aria-label="Activate core boost"
        >
          {/* Extended Ring Layers */}
          <div className="trs-loader__ring trs-loader__ring--ambient" />
          <div className="trs-loader__ring trs-loader__ring--super-outer" />
          <div className="trs-loader__ring trs-loader__ring--dashed" />
          <div className="trs-loader__ring trs-loader__ring--thick-outer" />
          <div className="trs-loader__ring trs-loader__ring--outer" />
          <div className="trs-loader__ring trs-loader__ring--mid-thick" />
          <div className="trs-loader__ring trs-loader__ring--mid" />
          <div className="trs-loader__ring trs-loader__ring--inner" />
          <div className="trs-loader__ring trs-loader__ring--inner-glow" />
          <div className="trs-loader__ring trs-loader__ring--dotted" />

          {/* Markers */}
          <div className="trs-loader__markers">
            <div className="trs-loader__marker trs-loader__marker--top">▼</div>
            <div className="trs-loader__marker trs-loader__marker--bottom">▲</div>
            <div className="trs-loader__marker trs-loader__marker--left">▶</div>
            <div className="trs-loader__marker trs-loader__marker--right">◀</div>
          </div>

          <div className="trs-loader__pulse trs-loader__pulse--one" />
          <div className="trs-loader__pulse trs-loader__pulse--two" />

          {/* Shining Star in the Center */}
          <div className="trs-loader__star-wrap">
            <div className="trs-loader__star-core" />
            <div className="trs-loader__star-flare trs-loader__star-flare--h" />
            <div className="trs-loader__star-flare trs-loader__star-flare--v" />
            <div className="trs-loader__star-glow" />
          </div>

          {/* Main Horizontal Beam behind the core */}
          <div className="trs-loader__core-beam" />

          {/* Decorative scanner marks */}
          <div className="trs-loader__crosshair trs-loader__crosshair--v" />

          <div className="trs-loader__orbit-dot trs-loader__orbit-dot--1" />
          <div className="trs-loader__orbit-dot trs-loader__orbit-dot--2" />
          <div className="trs-loader__orbit-dot trs-loader__orbit-dot--3" />

          {/* Connected Nodes */}
          <div className="trs-loader__node-group trs-loader__node-group--left-1">
            <div className="trs-loader__node-text">GARAGE</div>
            <div className="trs-loader__node-line" style={{ width: '80px' }}></div>
            <div className="trs-loader__node-dot"></div>
          </div>
          <div className="trs-loader__node-group trs-loader__node-group--left-2">
            <div className="trs-loader__node-text">SHOWROOM</div>
            <div className="trs-loader__node-line" style={{ width: '60px' }}></div>
            <div className="trs-loader__node-dot"></div>
          </div>

          <div className="trs-loader__node-group trs-loader__node-group--right-1">
            <div className="trs-loader__node-dot"></div>
            <div className="trs-loader__node-line" style={{ width: '50px' }}></div>
            <div className="trs-loader__node-text">SHOWROOM</div>
          </div>
          <div className="trs-loader__node-group trs-loader__node-group--right-2">
            <div className="trs-loader__node-dot"></div>
            <div className="trs-loader__node-line" style={{ width: '80px' }}></div>
            <div className="trs-loader__node-text">MEETS</div>
          </div>
          <div className="trs-loader__node-group trs-loader__node-group--right-3">
            <div className="trs-loader__node-dot"></div>
            <div className="trs-loader__node-line" style={{ width: '60px' }}></div>
            <div className="trs-loader__node-text">MEMBERS</div>
          </div>
        </button>
      </div>

      <div className="trs-loader__footer">
        <div className="trs-loader__footer-left">
          <div className="trs-loader__terminal-block">
            <div className="trs-loader__terminal-header">INITIALIZING SYSTEM...</div>
            {history.map((line, i) => (
              <div key={i} className={`trs-loader__terminal-line ${line.includes('BOOST') || line.includes('BOONT') ? 'trs-loader__terminal-line--pink' : ''}`}>
                {line}
              </div>
            ))}
            <div className="trs-loader__terminal-line trs-loader__terminal-line--active">
              {"> " + (allReady && !isLoading ? "ALL SYSTEMS READY" : typedText)}
              <span className="trs-loader__cursor">_</span>
            </div>
          </div>

          <div className="trs-loader__meta">
            <span>TRS CORE: INITIALIZED</span>
            <span>V2.4.0_BUILD</span>
            <span>ACCESS LAYER: PRIME</span>
          </div>
        </div>

        <div className="trs-loader__footer-right">
          <div className="trs-loader__modules">
            {modules.map((moduleName, index) => {
              const value = Math.round(progress[index] || 100);
              const isReady = value >= 100;
              return (
                <div className="trs-loader__module" key={moduleName}>
                  <div className="trs-loader__module-pct">{value}%</div>
                  <div className="trs-loader__module-content">
                    <div className="trs-loader__module-info">
                      <span className="trs-loader__module-name">{moduleName}</span>
                      <span className={`trs-loader__module-status ${isReady ? 'trs-loader__module-status--ready' : ''}`}>
                        {isReady ? "READY" : "SYNCING"}
                      </span>
                    </div>
                    <div className="trs-loader__bar">
                      <div
                        className="trs-loader__bar-fill"
                        style={{ width: `${Math.min(100, value)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
