export default function HotkeyBar({ onUpload, onFind, onBossKey }) {
  return (
    <div className="hotkey-bar" id="hotkey-bar">
      <div className="hotkey-item" onClick={onUpload} title="Upload .asm folder">
        <span className="hotkey-key">F3</span>
        <span className="hotkey-label">Upload</span>
      </div>
      <div className="hotkey-item" onClick={onFind} title="Find file">
        <span className="hotkey-key">F7</span>
        <span className="hotkey-label">Find</span>
      </div>
      <div className="hotkey-item" onClick={onBossKey} title="System Info">
        <span className="hotkey-key">ESC</span>
        <span className="hotkey-label">SysInfo</span>
      </div>
      <div className="hotkey-spacer" />
    </div>
  );
}
