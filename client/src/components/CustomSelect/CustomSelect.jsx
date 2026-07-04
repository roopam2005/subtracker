import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomSelect.css";

const CustomSelect = ({ label, value, onChange, options, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="custom-select" ref={selectRef}>
      <button
        type="button"
        className={`select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="select-value">
          {selectedOption ? selectedOption.label : "Select..."}
        </span>
        <span className={`select-arrow ${isOpen ? "open" : ""}`}>▾</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="select-dropdown"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`select-option ${
                  value === option.value ? "selected" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
                {value === option.value && <span className="check">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;