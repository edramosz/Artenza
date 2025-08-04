import React, { useState, useEffect, useRef } from 'react';
import './Dropdonw.css';

const Dropdown = ({ value, onChange, options, placeholder = "Selecione uma opção" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {value ? `${value} Estrela${value > 1 ? 's' : ''}` : placeholder}
        <span className="dropdown-icon">
          <i className="fa-solid fa-chevron-down"></i>
        </span>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          <li
            className={`dropdown-item ${value === null ? 'selected' : ''}`}
            onClick={() => handleSelect(null)}
          >
            {placeholder}
          </li>
          {options.map((option) => (
            <li
              key={option}
              className={`dropdown-item ${value === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option} Estrela{option > 1 ? 's' : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
