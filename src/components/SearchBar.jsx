import { useEffect, useRef } from 'react';

export default function SearchBar({ value, onChange, visible, onFocusRequest }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  // Also focus when onFocusRequest changes
  useEffect(() => {
    if (onFocusRequest && inputRef.current) {
      inputRef.current.focus();
    }
  }, [onFocusRequest]);

  if (!visible) return null;

  return (
    <div className="search-bar" id="search-bar">
      <span className="search-bar-label">FIND: </span>
      <input
        ref={inputRef}
        type="text"
        className="search-bar-input"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder=""
        spellCheck={false}
        autoComplete="off"
        id="search-input"
      />
      <span className="cursor" />
    </div>
  );
}
