import { useState } from 'react';

export default function FileViewer({ file, onClose, onCopy, copiedId }) {
  const isCopied = copiedId === file.id;

  const handleCopy = () => {
    onCopy(file);
  };

  const divider = '─'.repeat(60);

  return (
    <div className="file-viewer-overlay" id="file-viewer">
      <div className="file-viewer-header">
        <span className="file-viewer-title">
          ──── {file.filename}.{file.extension} {divider}
        </span>
        <div className="file-viewer-actions">
          <button
            className={`file-viewer-btn ${isCopied ? 'copied-btn' : ''}`}
            onClick={handleCopy}
            id="viewer-copy-btn"
          >
            {isCopied ? '[COPIED!]' : '[F5 COPY ALL]'}
          </button>
          <button
            className="file-viewer-btn"
            onClick={onClose}
            id="viewer-close-btn"
          >
            [ESC CLOSE]
          </button>
        </div>
      </div>
      <div className="file-viewer-content" id="file-viewer-content">
        {file.content || 'NO CONTENT AVAILABLE.'}
      </div>
    </div>
  );
}
