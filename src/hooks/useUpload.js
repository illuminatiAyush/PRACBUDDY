import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useUpload(onComplete, addFilesLocal) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [result, setResult] = useState(null);

  const uploadFiles = useCallback(async (fileList) => {
    const asmFiles = [];
    let skipped = 0;

    // Filter .asm files
    for (const file of fileList) {
      if (file.name.toLowerCase().endsWith('.asm')) {
        asmFiles.push(file);
      } else {
        skipped++;
      }
    }

    if (asmFiles.length === 0) {
      setResult({ error: 'NO .ASM FILES FOUND IN SELECTED FOLDER.', skipped });
      return;
    }

    setUploading(true);
    setProgress({ current: 0, total: asmFiles.length, percent: 0 });
    setResult(null);

    try {
      const fileRecords = [];

      // Read all files client-side
      for (let i = 0; i < asmFiles.length; i++) {
        const file = asmFiles[i];
        const content = await readFileAsText(file);
        const filename = file.name
          .replace(/\.asm$/i, '')
          .toUpperCase();

        fileRecords.push({
          filename,
          extension: 'ASM',
          content,
          size_bytes: file.size,
          updated_at: new Date().toISOString(),
        });

        setProgress({
          current: i + 1,
          total: asmFiles.length,
          percent: Math.round(((i + 1) / asmFiles.length) * 100),
        });
      }

      if (supabase) {
        // Batch upsert to Supabase
        const { error: upsertError } = await supabase
          .from('asm_files')
          .upsert(fileRecords, { onConflict: 'filename' });

        if (upsertError) throw upsertError;
      } else if (addFilesLocal) {
        // Save to localStorage
        addFilesLocal(fileRecords);
      }

      setResult({
        success: true,
        count: asmFiles.length,
        skipped,
      });

      // Refresh file list
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Upload error:', err);
      setResult({ error: `UPLOAD FAILED: ${err.message}` });
    } finally {
      setUploading(false);
    }
  }, [onComplete, addFilesLocal]);

  const resetUpload = useCallback(() => {
    setResult(null);
    setProgress({ current: 0, total: 0, percent: 0 });
  }, []);

  return { uploading, progress, result, uploadFiles, resetUpload };
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
