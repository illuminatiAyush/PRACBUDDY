export default function TitleBar() {
  return (
    <div className="titlebar" id="titlebar">
      <div className="titlebar-left">
        <div className="titlebar-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#000080" stroke="#AAAAAA" strokeWidth="1"/>
            <rect x="3" y="4" width="10" height="2" fill="#AAAAAA"/>
            <rect x="3" y="7" width="10" height="2" fill="#AAAAAA"/>
            <rect x="3" y="10" width="6" height="2" fill="#AAAAAA"/>
          </svg>
        </div>
        <span className="titlebar-text">
          DOSBox 0.74-3, Cpu speed:    3000 cycles, Frameskip  0, Progra...
        </span>
      </div>
      <div className="titlebar-buttons">
        <button className="titlebar-btn" aria-label="Minimize" tabIndex={-1}>─</button>
        <button className="titlebar-btn" aria-label="Maximize" tabIndex={-1}>□</button>
        <button className="titlebar-btn close" aria-label="Close" tabIndex={-1}>×</button>
      </div>
    </div>
  );
}
