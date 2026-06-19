import { motion } from "motion/react";

interface TutorialManuscriptProps {
  onClose: () => void;
}

const STEPS = [
  {
    icon: "✧",
    heading: "Call the Feather",
    body: "Write a memory, hope, dream, confession, or wish.",
  },
  {
    icon: "✧",
    heading: "Choose",
    body: "Stay named or anonymous. Share with the stars or keep it private.",
  },
  {
    icon: "✧",
    heading: "Release",
    body: "Watch your manuscript ascend to become a permanent star in the sky.",
  },
  {
    icon: "✧",
    heading: "Explore",
    body: "Visit the Night Archive to discover the thoughts humanity let go.",
  },
];

export default function TutorialManuscript({
  onClose,
}: TutorialManuscriptProps) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ zIndex: 45 }}
    >
      <motion.div
        initial={{ scaleY: 0.05, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        exit={{ scaleY: 0.05, opacity: 0 }}
        transition={{
          scaleY: { duration: 1.2, ease: [0.2, 0, 0.4, 1] },
          opacity: { duration: 0.8 },
        }}
        style={{
          transformOrigin: "center center",
          width: 560,
          maxWidth: "90vw",
          background:
            "linear-gradient(162deg, #F9F2DC 0%, #F5EDD6 42%, #EFE3C0 100%)",
          borderRadius: "5px 3px 3px 5px",
          padding: "44px 52px 40px",
          position: "relative",
          boxShadow:
            "0 12px 80px rgba(8,10,20,0.82), inset 0 0 0 1px rgba(139,111,78,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Leaf grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(139,111,78,0.06) 22px, rgba(139,111,78,0.06) 23px)",
          }}
        />

        {/* Welcome */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginBottom: 28,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "#8B6F4E",
              opacity: 0.55,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Welcome
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 18,
              lineHeight: 1.75,
              color: "#2E200E",
              letterSpacing: "0.03em",
            }}
          >
            Some thoughts are too beautiful to stay inside us.
            <br />
            This hall is a sanctuary where every released
            thought becomes a star.
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(139,111,78,0.18)",
            marginBottom: 24,
            position: "relative",
            zIndex: 1,
          }}
        />

        {/* Steps */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 10,
            letterSpacing: "0.24em",
            color: "#8B6F4E",
            opacity: 0.5,
            textTransform: "uppercase",
            marginBottom: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          The Ritual
        </p>
        <div
          className="flex flex-col gap-5"
          style={{
            position: "relative",
            zIndex: 1,
            marginBottom: 28,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.heading}
              className="flex gap-4 items-start"
            >
              <span
                style={{
                  fontSize: 16,
                  lineHeight: 1,
                  marginTop: 2,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    color: "#3B2A18",
                    marginBottom: 3,
                  }}
                >
                  {s.heading}
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "#3B2A18",
                    opacity: 0.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(139,111,78,0.18)",
            marginBottom: 20,
            position: "relative",
            zIndex: 1,
          }}
        />

        {/* Quote */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "#8B6F4E",
            opacity: 0.6,
            letterSpacing: "0.06em",
            textAlign: "center",
            marginBottom: 24,
            position: "relative",
            zIndex: 1,
          }}
        >
          "Every star was once a thought someone chose to let
          go."
        </p>

        {/* Begin */}
        <div
          className="flex justify-center"
          style={{ position: "relative", zIndex: 1 }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid rgba(232,130,26,0.4)",
              borderRadius: 20,
              padding: "10px 40px",
              cursor: "pointer",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 11,
              letterSpacing: "0.36em",
              color: "#E8821A",
              textTransform: "uppercase",
              transition: "all 0.5s",
            }}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "rgba(232,130,26,0.07)";
              (
                e.currentTarget as HTMLButtonElement
              ).style.boxShadow =
                "0 0 20px rgba(232,130,26,0.2)";
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "none";
              (
                e.currentTarget as HTMLButtonElement
              ).style.boxShadow = "none";
            }}
          >
            Begin
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}