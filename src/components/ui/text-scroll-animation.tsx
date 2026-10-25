"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
  characterClassName?: string;
  spread?: number;
};

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
  characterClassName,
  spread = 50,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * spread, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * spread, 0]);

  return (
    <motion.span
      className={cn("inline-block", characterClassName || "text-orange-500", isSpace && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 50, 0]);

  return (
    <motion.img
      src={char}
      alt=""
      className="h-16 w-16 shrink-0 object-contain will-change-transform"
      style={{ x, scale, y, transformOrigin: "center" }}
    />
  );
};

const CharacterV3 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 90, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [-Math.abs(distanceFromCenter) * 20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  return (
    <motion.img
      src={char}
      alt=""
      className="h-16 w-16 shrink-0 object-contain will-change-transform"
      style={{ x, rotate, y, scale, transformOrigin: "center" }}
    />
  );
};

export const Bracket = ({ className }: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className}>
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      />
    </svg>
  );
};

function ScrollAnimatedChar({
  char,
  index,
  centerIndex,
  spread,
  scrollYProgress,
  characterClassName,
  isAccent,
  accentClassName,
}: {
  char: string;
  index: number;
  centerIndex: number;
  spread: number;
  scrollYProgress: any;
  characterClassName?: string;
  isAccent?: boolean;
  accentClassName?: string;
}) {
  const distanceFromCenter = index - centerIndex;
  const x = useTransform(
    scrollYProgress,
    [0, 0.7],
    [distanceFromCenter * spread, 0]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.7],
    [distanceFromCenter * spread * 0.7, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7],
    [0.25, 0.75, 1]
  );

  return (
    <motion.span
      className={cn(
        "inline-block will-change-transform",
        isAccent ? accentClassName : characterClassName
      )}
      style={{ x, rotateX, opacity }}
    >
      {char}
    </motion.span>
  );
}

export function ScrollAnimatedHeading({
  text,
  className,
  characterClassName,
  as: Component = "h2",
  style,
  offset = ["start 95%", "center 55%"],
  spread = 24,
  accentIndices,
  accentClassName = "text-[#FF4A16]",
}: {
  text: string;
  className?: string;
  characterClassName?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  style?: React.CSSProperties;
  offset?: [string, string];
  spread?: number;
  accentIndices?: number[];
  accentClassName?: string;
}) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: offset as any,
  });

  const words = text.split(" ");
  const totalChars = text.length;
  const centerIndex = Math.floor(totalChars / 2);

  let globalCharIdx = 0;
  const wordsWithChars = words.map((word) => {
    const chars = word.split("").map((char) => {
      const idx = globalCharIdx++;
      return { char, index: idx };
    });
    globalCharIdx++; // Account for space between words
    return chars;
  });

  return (
    <div
      ref={targetRef}
      className={cn("w-full flex items-center justify-center text-center will-change-transform", className)}
      style={{ perspective: "600px", ...style }}
    >
      <Component
        className="inline-flex flex-wrap items-center justify-center leading-tight select-none"
        style={{ columnGap: "0.45em" }}
      >
        {wordsWithChars.map((wordChars, wordIdx) => (
          <React.Fragment key={`frag-${wordIdx}`}>
            {wordIdx > 0 && (
              <span
                aria-hidden="true"
                className="inline-block select-none pointer-events-none"
                style={{ width: "0.42em" }}
              >
                &nbsp;
              </span>
            )}
            <span
              key={`w-${wordIdx}`}
              className="inline-flex items-center whitespace-nowrap"
            >
              {wordChars.map(({ char, index }) => (
                <ScrollAnimatedChar
                  key={`c-${index}`}
                  char={char}
                  index={index}
                  centerIndex={centerIndex}
                  spread={spread}
                  scrollYProgress={scrollYProgress}
                  characterClassName={characterClassName}
                  isAccent={accentIndices?.includes(index)}
                  accentClassName={accentClassName}
                />
              ))}
            </span>
          </React.Fragment>
        ))}
      </Component>
    </div>
  );
}

const Skiper31 = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const targetRef2 = useRef<HTMLDivElement | null>(null);
  const targetRef3 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const { scrollYProgress: scrollYProgress2 } = useScroll({ target: targetRef2 });
  const { scrollYProgress: scrollYProgress3 } = useScroll({ target: targetRef3 });

  const text = "see more from ";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  const macIcon = [
    "https://cdn.21st.dev/assets/mirror/1d/1d364b72c9eaf1fe37d17ca88cd8fb541308dc0f3b09e2ab3b824f380b3493d5.svg",
    "https://cdn.21st.dev/assets/mirror/2f/2f86fca501dfed321a62f28743f29d9dd738dac91668eac5260ab746d1ef8840.svg",
    "https://cdn.21st.dev/assets/mirror/c6/c6c80c9ba890e199e94d35340fb4cf2d5790f339d9846800d68283e3e58e6031.svg",
    "https://cdn.21st.dev/assets/mirror/3b/3bf8cceead820aec50d4ee825a3fd02c5a1cd6665cc9cf4cbf3d9c8861a204bb.svg",
    "https://cdn.21st.dev/assets/mirror/66/6698757ee85997e8167b2eacaff8395d6987954185488f2e90b88ef387fec6c7.svg",
    "https://cdn.21st.dev/assets/mirror/b1/b17d2a2b592a06252efef522d5205f0c7a958f748d40df1011ed081417e42f85.svg",
  ];
  const iconCenterIndex = Math.floor(macIcon.length / 2);

  return (
    <ReactLenis root>
      <main className="w-full bg-white">
        {/* Step indicator */}
        <div className="top-22 absolute left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#f5f4f3] after:to-black after:content-['']">
            Scroll to see more
          </span>
        </div>

        {/* Block 1 — text */}
        <div
          ref={targetRef}
          className="relative box-border flex h-[210vh] items-center justify-center gap-[2vw] overflow-hidden bg-[#f5f4f3] p-[2vw]"
        >
          <div
            className="w-full max-w-4xl text-center text-6xl font-bold uppercase tracking-tighter text-black"
            style={{ perspective: "500px" }}
          >
            {characters.map((char, index) => (
              <CharacterV1
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Block 2 — icons */}
        <div
          ref={targetRef2}
          className="relative -mt-[100vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden bg-[#f5f4f3] p-[2vw]"
        >
          <p className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <Bracket className="h-12 text-black" />
            <span className="font-medium">integrate with your fav tech stack</span>
            <Bracket className="h-12 scale-x-[-1] text-black" />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {macIcon.map((char, index) => (
              <CharacterV2
                key={index}
                char={char}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress2}
              />
            ))}
          </div>
        </div>

        {/* Block 3 — icons (rotate variation) */}
        <div
          ref={targetRef3}
          className="relative -mt-[95vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden bg-[#f5f4f3] p-[2vw]"
        >
          <p className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <Bracket className="h-12 text-black" />
            <span className="font-medium">integrate with your fav tech stack</span>
            <Bracket className="h-12 scale-x-[-1] text-black" />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8" style={{ perspective: "500px" }}>
            {macIcon.map((char, index) => (
              <CharacterV3
                key={index}
                char={char}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress3}
              />
            ))}
          </div>
        </div>
      </main>
    </ReactLenis>
  );
};

export { CharacterV1, CharacterV2, CharacterV3, Skiper31 };
export default Skiper31;
