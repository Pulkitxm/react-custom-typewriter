import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

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
  // State for the displayed text
  const [displayText, setDisplayText] = useState("");
  // State for the blinking cursor character
  const [blinkChar, setBlinkChar] = useState(initialCursorChar || "|");
  // Ref to store the interval ID for the blinking cursor
  const blinkIntervalRef = useRef(null);
  // State to control freezing (on hover)
  const [freeze, setFreeze] = useState(pauseOnHover ? true : false);
  // State to keep track of the current index in the text
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing Logic
  useEffect(() => {
    // Default text if not provided
    const targetText = initialText || "Start Typing text here";

    // Function to type the next character
    const typeNextCharacter = () => {
      // Continue typing if not frozen and not at the end of the text
      if (!freeze && currentIndex <= targetText.length) {
        setDisplayText(targetText.substring(0, currentIndex));
        setCurrentIndex((prevIndex) => prevIndex + 1);

        // Call onComplete if defined and reached the end of the text
        if (currentIndex >= targetText.length && onComplete) {
          onComplete();
        }
      } else {
        // Reset index if looping and reached the end of the text
        if (loop && currentIndex >= targetText.length) {
          setCurrentIndex(0);
        }
      }
    };

    // Interval for typing
    const typingInterval = setInterval(
      typeNextCharacter,
      (10 - initialSpeed) * 100
    );

    // Cleanup interval on component unmount or re-render
    return () => {
      clearInterval(typingInterval);
    };
  }, [initialText, initialSpeed, freeze, onComplete, loop, currentIndex]);

  // Blinking Logic
  useEffect(() => {
    // Function to blink the cursor
    const blinkCursor = () => {
      // Show cursor only when not frozen
      setBlinkChar((prevChar) =>
        freeze
          ? initialCursorChar
          : prevChar === initialCursorChar
          ? ""
          : initialCursorChar
      );
    };

    // Start blinking interval if cursor is enabled
    if (initialCursor) {
      blinkIntervalRef.current = setInterval(
        blinkCursor,
        (10 - initialBlinkRate) * 100
      );
    }

    // Cleanup interval on component unmount or re-render
    return () => {
      clearInterval(blinkIntervalRef.current);
    };
  }, [initialCursor, initialBlinkRate, freeze, initialCursorChar]);

  // JSX for rendering
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

// PropTypes for component props
Typewriter.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(Array.from({ length: 9 }, (_, i) => i + 1)),
  ]),
  cursor: PropTypes.bool,
  blinkRate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(Array.from({ length: 9 }, (_, i) => i + 1)),
  ]),
  cursorChar: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  onComplete: PropTypes.func,
  loop: PropTypes.bool,
};

// Default props for the component
Typewriter.defaultProps = {
  text: "Start typing the text",
  color: "#000",
  cursorColor: "#000",
  size: "16",
  cursorChar: "|",
  speed: 6,
  loop: false,
  cursor: true,
  blinkRate: 6,
  pauseOnHover: false,
};

export default Typewriter;
