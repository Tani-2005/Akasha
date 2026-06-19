import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { PanoramaHandle } from "./Panorama";
import Panorama from "./Panorama";
import ManuscriptUI from "./ManuscriptUI";
import NightArchive from "./NightArchive";
import CosmicJourney from "./CosmicJourney";
import TutorialManuscript from "./TutorialManuscript";
import { useInheritances } from "../hooks/useInheritances";
import type { Inheritance } from "../types/inheritance";
import galaxyAssetUrl from "../../imports/galaxy-1.mp4";
import environmentAudio from "../../imports/Environment.mp3";
import entryAudio from "../../imports/Entry.mp3";
import letterIconSrc from "../../imports/Letter_Icon.png";
import archiveIconSrc from "../../imports/Night_archive_icon.png";
import menuIconSrc from "../../imports/menu_icon.png";
import * as Audio from "../utils/audio";

const JOURNEY_KEY = "hasCompletedJourney";
const TUTORIAL_KEY = "hasSeenTutorial";

/* ── PNG icon wrapper — preserves sacred artifact feel ── */
function PngIcon({
  src,
  size = 32,
}: {
  src: string;
  size?: number;
}) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}

/* ── Hall Icon Button ── */
function HallIcon({
  icon,
  label,
  onClick,
  glowing,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  glowing?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex flex-col items-center cursor-pointer select-none"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {glowing && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 8px rgba(232,130,26,0.3)",
              "0 0 22px rgba(232,130,26,0.65)",
              "0 0 8px rgba(232,130,26,0.3)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      <motion.div
        animate={{
          color: hovered ? "#E8821A" : "#F5EDD6",
          opacity: hovered ? 0.9 : glowing ? 0.7 : 0.3,
          filter: hovered
            ? "drop-shadow(0 0 6px rgba(232,130,26,0.5))"
            : "none",
        }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              bottom: "115%",
              whiteSpace: "nowrap",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 13,
              color: "#E8821A",
              letterSpacing: "0.08em",
              pointerEvents: "none",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Deepa glow — brief amber pulse after a thought is released ── */
function DeepaGlow({ onDone }: { onDone: () => void }) {
  const left = `${22 + Math.random() * 56}%`;
  const top = `${28 + Math.random() * 30}%`;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 20 }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 0.9, 0.7, 1, 0],
        scale: [0.3, 1.4, 1.1, 1.2, 0.9],
      }}
      transition={{ duration: 2.8, ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,130,26,0.65) 0%, rgba(232,130,26,0.15) 50%, transparent 70%)",
          filter: "blur(1.5px)",
        }}
      />
    </motion.div>
  );
}

/* ── Hall ── */
type HallView = "idle" | "manuscript" | "night-archive";

interface HallProps {
  /** Becomes true once the gate transition + camera-settle period has elapsed. */
  entered?: boolean;
}

export default function Hall({ entered = false }: HallProps) {
  const panoramaRef = useRef<PanoramaHandle>(null);
  const { thoughts, add } = useInheritances();
  const [view, setView] = useState<HallView>("idle");

  // Once-in-a-lifetime cosmic journey
  const journeyDone = useRef(
    localStorage.getItem(JOURNEY_KEY) === "true",
  );
  // Galaxy blob pre-fetched as soon as Hall mounts (during the gate sequence)
  // so there is zero gap between the manuscript leaving and the video starting.
  const galaxyBlobRef = useRef("");
  useEffect(() => {
    if (journeyDone.current) return;
    let url = "";
    fetch(galaxyAssetUrl)
      .then((r) => r.blob())
      .then((blob) => {
        url = URL.createObjectURL(blob);
        galaxyBlobRef.current = url;
      })
      .catch(() => {});
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // journeyMounted: true at click-time so the blob pre-fetches during the ceremony
  // journeyVisible: true at release-time so video plays the instant manuscript leaves
  const [journeyMounted, setJourneyMounted] = useState(false);
  const [journeyVisible, setJourneyVisible] = useState(false);
  const [universeListening, setUniverseListening] = useState(
    journeyDone.current,
  );
  const [showDeepaGlow, setShowDeepaGlow] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const isDimmed = view === "manuscript" || showTutorial;

  // Crossfade Entry → Environment when hall becomes active
  useEffect(() => {
    if (!entered) return;
    Audio.crossfade(entryAudio, environmentAudio, {
      target: 0.55,
      duration: 3500,
    });
    // Auto-show tutorial for first-timers (once, after icons settle)
    if (!localStorage.getItem(TUTORIAL_KEY)) {
      const t = setTimeout(() => setShowTutorial(true), 1200);
      return () => clearTimeout(t);
    }
  }, [entered]);

  // Icons: only after entering the hall, not during any release sequence
  const iconsVisible =
    view === "idle" && entered && !isReleasing;

  const handleEntrustStart = () => {
    setIsReleasing(true);
    if (!journeyDone.current) {
      // First send — mount CosmicJourney invisibly so the galaxy blob
      // downloads during the 2.5 s ceremony (zero wait on reveal).
      setJourneyMounted(true);
    }
    // Returning users: no cinematic, no panorama change — just the manuscript flies.
  };

  const handleRelease = (data: {
    message: string;
    name?: string;
    anonymous: boolean;
    visibility: import("../types/inheritance").Visibility;
  }) => {
    add(data);
    setView("idle");
    setShowDeepaGlow(true);
    if (!journeyDone.current) {
      // Manuscript just left — show the journey immediately, blob is pre-fetched
      setJourneyVisible(true);
    }
    setTimeout(() => setIsReleasing(false), 3500);
  };

  const handleJourneyComplete = () => {
    setJourneyMounted(false);
    setJourneyVisible(false);
    localStorage.setItem(JOURNEY_KEY, "true");
    journeyDone.current = true;
    setUniverseListening(true);
    // Cross-fade the panorama directly to the final 360° image (no video replay)
    panoramaRef.current?.switchToFinal();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#080A14]">
      {/* Single unified renderer — handles image, crossfade, and video internally */}
      <Panorama ref={panoramaRef} dim={isDimmed} />

      {/* Dust motes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 3 === 0 ? 2 : 1.5,
            height: i % 3 === 0 ? 2 : 1.5,
            left: `${10 + ((i * 4.5) % 80)}%`,
            bottom: 0,
            backgroundColor: "#F5EDD6",
            zIndex: 5,
          }}
          animate={{
            y: [0, -1200],
            x: [0, ((i % 5) - 2) * 18],
            opacity: [0, 0.12, 0.12, 0],
          }}
          transition={{
            duration: 14 + ((i * 1.1) % 6),
            repeat: Infinity,
            delay: (i * 0.8) % 14,
            ease: "linear",
          }}
        />
      ))}

      {/* Deepa glow */}
      <AnimatePresence>
        {showDeepaGlow && (
          <DeepaGlow
            key="deepa"
            onDone={() => setShowDeepaGlow(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Icons — only after camera has settled inside the hall ── */}
      <AnimatePresence>
        {iconsVisible && (
          <motion.div
            key="icons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 30 }}
          >
            {/* Bottom center — Feather of Thoughts + "universe is always listening" */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-3">
              <HallIcon
                icon={
                  <PngIcon src={letterIconSrc} size={100} />
                }
                label="Entrust a Thought"
                onClick={() => setView("manuscript")}
              />
              <AnimatePresence>
                {universeListening && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.32 }}
                    transition={{ duration: 3, ease: "easeIn" }}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 12,
                      color: "#F5EDD6",
                      letterSpacing: "0.12em",
                      textAlign: "center",
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    The universe is always listening.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom left — Night Archive */}
            <div className="absolute bottom-10 left-10 pointer-events-auto">
              <HallIcon
                icon={
                  <PngIcon src={archiveIconSrc} size={100} />
                }
                label="Explore the Night Archive"
                onClick={() => setView("night-archive")}
              />
            </div>

            {/* Bottom right — Learn the Ritual (first-visit guide) */}
            <div className="absolute bottom-10 right-10 pointer-events-auto">
              <HallIcon
                icon={<PngIcon src={menuIconSrc} size={100} />}
                label="Learn the Ritual"
                onClick={() => setShowTutorial(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Manuscript ── */}
      <AnimatePresence>
        {view === "manuscript" && (
          <ManuscriptUI
            key="ms"
            onEntrustStart={handleEntrustStart}
            onRelease={handleRelease}
            onClose={() => setView("idle")}
          />
        )}
      </AnimatePresence>

      {/* ── Night Archive ── */}
      <AnimatePresence>
        {view === "night-archive" && (
          <NightArchive
            key="arc"
            thoughts={thoughts}
            onClose={() => setView("idle")}
          />
        )}
      </AnimatePresence>

      {/* ── Tutorial manuscript ("Learn the Ritual") ── */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialManuscript
            key="tutorial"
            onClose={() => {
              localStorage.setItem(TUTORIAL_KEY, "true");
              setShowTutorial(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Cosmic Journey ── */}
      {journeyMounted && (
        <CosmicJourney
          visible={journeyVisible}
          preloadedBlobUrl={galaxyBlobRef.current}
          onComplete={handleJourneyComplete}
        />
      )}
    </div>
  );
}