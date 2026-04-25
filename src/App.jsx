import { useState, useEffect, useCallback } from 'react';
import Terminal from './components/Terminal';
import BootSequence from './components/BootSequence';
import FileList from './components/FileList';
import FileViewer from './components/FileViewer';
import UploadZone from './components/UploadZone';
import ProgressBar from './components/ProgressBar';
import BossKey from './components/BossKey';
import { useFiles } from './hooks/useFiles';
import { useUpload } from './hooks/useUpload';
import { useClipboard } from './hooks/useClipboard';

// App states
const STATE_BOOT = 'boot';
const STATE_MAIN = 'main';
const STATE_VIEWER = 'viewer';
const STATE_BOSS = 'boss';

export default function App() {
  const [appState, setAppState] = useState(STATE_BOOT);
  const [viewingFile, setViewingFile] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Hooks
  const { files, loading, error, fetchFiles, deleteFile, addFiles, setError } = useFiles();
  const { copiedId, copyToClipboard } = useClipboard();
  const { uploading, progress, result, uploadFiles, resetUpload } = useUpload(fetchFiles, addFiles);

  // Add terminal message
  const addMessage = useCallback((text, type = 'success') => {
    setMessages((prev) => [...prev, { text, type, id: Date.now() }]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setMessages((prev) => prev.slice(1));
    }, 5000);
  }, []);

  // Handle boot complete
  const handleBootComplete = useCallback(() => {
    setAppState(STATE_MAIN);
  }, []);

  // Handle copy
  const handleCopy = useCallback(async (file) => {
    const success = await copyToClipboard(file.content, file.id);
    if (success) {
      addMessage('1 FILE(S) COPIED SUCCESSFULLY.', 'success');
    } else {
      // Open viewer as fallback
      setViewingFile(file);
      setAppState(STATE_VIEWER);
      addMessage('CLIPBOARD BLOCKED. USE CTRL+A THEN CTRL+C.', 'warning');
    }
  }, [copyToClipboard, addMessage]);

  // Handle view file (full screen)
  const handleView = useCallback((file) => {
    setViewingFile(file);
    setAppState(STATE_VIEWER);
  }, []);

  // Handle select file (show code inline on page)
  const handleSelectFile = useCallback((file) => {
    // Toggle: click same file again to hide
    setActiveFile((prev) => (prev && prev.id === file.id) ? null : file);
  }, []);

  // Handle close viewer
  const handleCloseViewer = useCallback(() => {
    setViewingFile(null);
    setAppState(STATE_MAIN);
  }, []);

  // Handle delete request
  const handleDeleteRequest = useCallback((file) => {
    setDeleteConfirm(file);
    addMessage(`DELETE ${file.filename}.${file.extension}? [Y/N]`, 'warning');
  }, [addMessage]);

  // Handle upload
  const handleUploadFiles = useCallback((fileList) => {
    resetUpload();
    uploadFiles(fileList);
  }, [uploadFiles, resetUpload]);

  // Handle upload trigger
  const handleUploadTrigger = useCallback(() => {
    const input = document.getElementById('upload-input');
    if (input) input.click();
  }, []);

  // Handle find focus
  const handleFindFocus = useCallback(() => {
    const input = document.getElementById('search-input');
    if (input) input.focus();
  }, []);

  // Handle boss key
  const handleBossKey = useCallback(() => {
    if (appState === STATE_BOSS) {
      setAppState(STATE_MAIN);
    } else if (appState !== STATE_BOOT) {
      setAppState(STATE_BOSS);
    }
  }, [appState]);

  // Upload result messages
  useEffect(() => {
    if (result) {
      if (result.success) {
        addMessage(
          `${result.count} FILE(S) LOADED INTO ASMVAULT.`,
          'success'
        );
        if (result.skipped > 0) {
          addMessage(
            `${result.skipped} NON-ASM FILE(S) SKIPPED.`,
            'warning'
          );
        }
      } else if (result.error) {
        addMessage(result.error, 'error');
      }
    }
  }, [result, addMessage]);

  // Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete confirmation handler
      if (deleteConfirm) {
        if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          const file = deleteConfirm;
          setDeleteConfirm(null);
          deleteFile(file.id).then((success) => {
            if (success) {
              addMessage(`${file.filename}.${file.extension} DELETED.`, 'success');
            }
          });
          return;
        }
        if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
          e.preventDefault();
          setDeleteConfirm(null);
          addMessage('DELETE CANCELLED.', 'info');
          return;
        }
        return;
      }

      // F3 — Upload
      if (e.key === 'F3') {
        e.preventDefault();
        handleUploadTrigger();
        return;
      }

      // F5 — Copy (in viewer)
      if (e.key === 'F5' && appState === STATE_VIEWER && viewingFile) {
        e.preventDefault();
        handleCopy(viewingFile);
        return;
      }

      // F7 — Find
      if (e.key === 'F7') {
        e.preventDefault();
        handleFindFocus();
        return;
      }

      // ESC — Boss key or close viewer
      if (e.key === 'Escape') {
        e.preventDefault();
        if (appState === STATE_VIEWER) {
          handleCloseViewer();
        } else {
          handleBossKey();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    appState,
    viewingFile,
    deleteConfirm,
    handleUploadTrigger,
    handleFindFocus,
    handleBossKey,
    handleCloseViewer,
    handleCopy,
    deleteFile,
    addMessage,
  ]);

  return (
    <>
      {/* Boss key overlay */}
      {appState === STATE_BOSS && (
        <BossKey onClose={handleBossKey} />
      )}

      {/* File viewer overlay */}
      {appState === STATE_VIEWER && viewingFile && (
        <FileViewer
          file={viewingFile}
          onClose={handleCloseViewer}
          onCopy={handleCopy}
          copiedId={copiedId}
        />
      )}

      {/* Main terminal */}
      <Terminal
        onUpload={handleUploadTrigger}
        onFind={handleFindFocus}
        onBossKey={handleBossKey}
      >
        {/* Boot sequence */}
        {appState === STATE_BOOT && (
          <BootSequence onComplete={handleBootComplete} />
        )}

        {/* Main file listing */}
        {appState !== STATE_BOOT && (
          <>
            {/* Upload progress */}
            {uploading && (
              <ProgressBar
                current={progress.current}
                total={progress.total}
                percent={progress.percent}
              />
            )}

            <FileList
              files={files}
              loading={loading}
              error={error}
              onCopy={handleCopy}
              onDelete={handleDeleteRequest}
              copiedId={copiedId}
              messages={messages}
              activeFile={activeFile}
              onSelectFile={handleSelectFile}
            />
          </>
        )}
      </Terminal>

      {/* Hidden upload input */}
      <UploadZone onFilesSelected={handleUploadFiles} />
    </>
  );
}
