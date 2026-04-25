import { useState, useCallback } from 'react';

export default function FileRow({
  file,
  index,
  onSelect,
  onCopy,
  onDelete,
  copiedId,
  isActive,
  animate,
}) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  // Format filename to DOS 8.3 format (padded)
  const formatFilename = (name) => {
    return name.padEnd(8, ' ').substring(0, 8);
  };

  // Format file size with commas
  const formatSize = (bytes) => {
    return bytes.toLocaleString().padStart(8, ' ');
  };

  // Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setShowContextMenu(true);
    setContextPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleDeleteClick = useCallback(() => {
    setShowContextMenu(false);
    if (onDelete) onDelete(file);
  }, [file, onDelete]);

  // Click on row → select file (shows code on page)
  const handleRowClick = useCallback(() => {
    onSelect(file);
  }, [file, onSelect]);

  const isCopied = copiedId === file.id;

  return (
    <>
      <div
        className={`file-row ${isActive ? 'file-row-active' : ''} ${isCopied ? 'file-row-copied' : ''} ${animate ? 'file-row-animate' : ''}`}
        style={animate ? { animationDelay: `${index * 50}ms` } : undefined}
        onContextMenu={handleContextMenu}
        onClick={handleRowClick}
        id={`file-row-${file.id}`}
        title="Click to view code"
      >
        <span className="file-name">
          {formatFilename(file.filename)}
        </span>
        <span className="file-ext"> .{file.extension}</span>
        <span className="file-size">{formatSize(file.size_bytes)}</span>
        <span className="file-date">  {formatDate(file.uploaded_at)}</span>
        {isCopied && <span className="file-copy-status">  ✓ COPIED!</span>}
      </div>

      {showContextMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 199,
            }}
            onClick={() => setShowContextMenu(false)}
          />
          <div
            className="context-menu"
            style={{ top: contextPos.y, left: contextPos.x }}
            id={`context-menu-${file.id}`}
          >
            <button
              className="context-menu-item"
              onClick={handleDeleteClick}
            >
              ▶ DELETE FILE
            </button>
          </div>
        </>
      )}
    </>
  );
}
