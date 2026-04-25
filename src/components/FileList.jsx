import { useState } from 'react';
import FileRow from './FileRow';
import SearchBar from './SearchBar';

export default function FileList({
  files,
  loading,
  error,
  onCopy,
  onDelete,
  copiedId,
  messages,
  activeFile,
  onSelectFile,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusTrigger, setFocusTrigger] = useState(0);

  // Filter files by search query
  const filteredFiles = searchQuery
    ? files.filter((f) =>
        f.filename.toUpperCase().includes(searchQuery.toUpperCase())
      )
    : files;

  // Calculate total size
  const totalSize = filteredFiles.reduce((acc, f) => acc + (f.size_bytes || 0), 0);

  return (
    <div className="file-list-container" id="file-list">
      {/* DIR header */}
      <div className="dir-header">
        {' Volume in drive C is ASMVAULT'}
      </div>
      <div className="dir-header">
        {' Directory of C:\\ASM'}
      </div>
      <div className="dir-header">&nbsp;</div>

      {/* Loading state */}
      {loading && (
        <div className="terminal-message info">
          READING DISK...
          <span className="cursor" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="terminal-message error">
          {error}
        </div>
      )}

      {/* File rows */}
      {!loading && filteredFiles.map((file, index) => (
        <FileRow
          key={file.id}
          file={file}
          index={index}
          onSelect={onSelectFile}
          onCopy={onCopy}
          onDelete={onDelete}
          copiedId={copiedId}
          isActive={activeFile && activeFile.id === file.id}
          animate={true}
        />
      ))}

      {/* DIR footer */}
      {!loading && (
        <div className="dir-footer">
          {'         '}
          {filteredFiles.length} File(s){'      '}
          {totalSize.toLocaleString()} bytes
        </div>
      )}

      {/* ===== ACTIVE FILE CODE DISPLAY ===== */}
      {activeFile && (
        <div className="code-display" id="code-display">
          <div className="code-display-header">
            <span className="code-display-title">
              ──── {activeFile.filename}.{activeFile.extension} ────
            </span>
            <button
              className={`code-display-copy-btn ${copiedId === activeFile.id ? 'copied' : ''}`}
              onClick={() => onCopy(activeFile)}
              id="code-copy-btn"
            >
              {copiedId === activeFile.id ? '[ ✓ COPIED! ]' : '[ COPY CODE ]'}
            </button>
          </div>
          <pre
            className="code-display-content"
            id="code-content"
            onClick={() => onCopy(activeFile)}
            title="Click anywhere to copy code"
          >
            {activeFile.content}
          </pre>
          <div className="code-display-footer">
            ──── END OF FILE ──── Click code or [COPY CODE] to copy ────
          </div>
        </div>
      )}

      {/* Terminal messages */}
      {messages && messages.map((msg, i) => (
        <div key={i} className={`terminal-message ${msg.type || ''}`}>
          {msg.text}
        </div>
      ))}

      {/* Search bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        visible={true}
        onFocusRequest={focusTrigger}
      />

      {/* Prompt line */}
      <div className="prompt-line">
        <span className="prompt-path">C:\ASM&gt;</span>
        <span className="cursor" />
      </div>
    </div>
  );
}
