import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import galaxyUrl from "../../imports/galaxy-1.mp4";

interface CosmicJourneyProps {
  visible: boolean;
  onComplete: () => void;
  /** No longer required for video streaming, but kept for interface compatibility */
  preloadedBlobUrl?: string;
}

type Phase = "loading" | "ready" | "video" | "reflection";

export default function CosmicJourney({
  visible,
  onComplete,
}: CosmicJourneyProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [showBody, setShowBody] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const wantPlay = useRef(false); // tracks if visible became true before component mounted
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ── Sync initial phase ─────────────────────────────────────────
  useEffect(() => {
    setPhase(wantPlay.current ? "video" : "ready");
  }, []);

  // ── Trigger play when visibility flips true ────────────────────
  useEffect(() => {
    if (!visible) return;
    wantPlay.current = true;

    if (phase === "ready" || phase === "loading") {
      setPhase("video");
    }
  }, [visible, phase]);

  // ── Production Fix: Force play command once the DOM node is ready ──
  useEffect(() => {
    if (phase === "video" && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn(
          "Autoplay interrupted or stalled by browser policies:",
          err,
        );
        // Fallback safety net: If the browser blocks it entirely, skip straight to reflection
        enterReflection();
      });
    }
  }, [phase]);

  const enterReflection = () => {
    setPhase("reflection");
    setTimeout(() => setShowBody(true), 2800);
    setTimeout(() => setShowContinue(true), 8000);
  };

  // Safety net: if onEnded never fires (stalled codec, browser quirk),
  // advance after 90 s — long enough to never cut a real video short.
  useEffect(() => {
    if (phase !== "video") return;
    const t = setTimeout(enterReflection, 90000);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 200,
        backgroundColor: "#000",
        pointerEvents: visible ? "auto" : "none",
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: visible ? 0.6 : 0 }}
    >
      {/* Galaxy video — Using explicit ref manipulation to guarantee production streaming */}
      <AnimatePresence>
        {phase === "video" && (
          <motion.video
            ref={videoRef}
            key="galaxy"
            src={galaxyUrl}
            muted
            playsInline
            preload="auto"
            controls={false}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onEnded={enterReflection}
          />
        )}
      </AnimatePresence>

      {/* Reflection screen */}
      <AnimatePresence>
        {phase === "reflection" && (
          <motion.div
            key="reflection"
            className="flex flex-col items-center justify-center text-center"
            style={{ maxWidth: 640, padding: "0 40px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 3, delay: 0.6 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: 30,
                color: "#F5EDD6",
                letterSpacing: "0.05em",
                lineHeight: 1.4,
                marginBottom: 52,
              }}
            >
              Every thought carries a universe of its own.
            </motion.p>

            <AnimatePresence>
              {showBody && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 3 }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 16,
                    color: "#F5EDD6",
                    lineHeight: 2,
                    letterSpacing: "0.07em",
                    marginBottom: 68,
                  }}
                >
                  <p>
                    Some words are never meant to disappear.
                  </p>
                  <p style={{ marginTop: 6 }}>
                    They become memories, hopes, promises and
                    quiet moments
                    <br />
                    that continue to exist long after we let
                    them go.
                  </p>
                  <p style={{ marginTop: 6 }}>
                    Here, your thoughts are released into the
                    universe —<br />
                    not to be forgotten, but to become part of
                    something infinite.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showContinue && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  whileHover={{
                    opacity: 0.9,
                    borderColor: "rgba(232,130,26,0.5)",
                  }}
                  transition={{ duration: 1.8 }}
                  onClick={onComplete}
                  style={{
                    background: "none",
                    border: "1px solid rgba(245,237,214,0.25)",
                    borderRadius: 20,
                    padding: "10px 38px",
                    cursor: "pointer",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 11,
                    letterSpacing: "0.34em",
                    color: "#F5EDD6",
                    textTransform: "uppercase",
                  }}
                >
                  Continue
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}