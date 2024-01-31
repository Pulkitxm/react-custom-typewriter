import { useEffect, useState, useRef } from "react";

const Typewriter = ({
  text: initialText,
  speed: initialSpeed,
  cursor: initialCursor,
  blinkRate: initialBlinkRate,
  cursorChar: initialCursorChar,
  cursorColor,
  color: initialColor,
  size: initialSize,
  loop,
  onComplete,
  pauseOnHover,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [blinkChar, setBlinkChar] = useState(initialCursorChar || "|");
  const blinkIntervalRef = useRef(null);
  const [freeze, setFreeze] = useState(pauseOnHover ? true : false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const targetText = initialText || "Start Typing text here";

    const typeNextCharacter = () => {
      if (!freeze && currentIndex <= targetText.length) {
        setDisplayText(targetText.substring(0, currentIndex));
        setCurrentIndex((prevIndex) => prevIndex + 1);

        if (currentIndex >= targetText.length && onComplete) {
          onComplete();
        }
      } else {
        if (loop && currentIndex >= targetText.length) {
          setCurrentIndex(0);
        }
      }
    };

    const typingInterval = setInterval(
      typeNextCharacter,
      (10 - initialSpeed) * 100
    );

    return () => {
      clearInterval(typingInterval);
    };
  }, [initialText, initialSpeed, freeze, onComplete, loop, currentIndex]);

  useEffect(() => {
    const blinkCursor = () => {
      setBlinkChar((prevChar) =>
        freeze
          ? initialCursorChar
          : prevChar === initialCursorChar
          ? ""
          : initialCursorChar
      );
    };

    if (initialCursor) {
      blinkIntervalRef.current = setInterval(
        blinkCursor,
        (10 - initialBlinkRate) * 100
      );
    }

    return () => {
      clearInterval(blinkIntervalRef.current);
    };
  }, [initialCursor, initialBlinkRate, freeze, initialCursorChar]);

  return (
    <div
      onMouseEnter={() => setFreeze(pauseOnHover ? true : false)}
      onMouseLeave={() => setFreeze(false)}
      style={{
        color: initialColor || "#000",
        fontSize: `${initialSize || "20"}px`,
        cursor: onComplete ? "pointer" : "default",
      }}
    >
      {displayText}
      {initialCursor && <span style={{ color: cursorColor }}>{blinkChar}</span>}
    </div>
  );
};