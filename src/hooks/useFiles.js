import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import localFiles from 'virtual:local-files';

const STORAGE_KEY = 'asmvault_files';

// LocalStorage helpers
function getLocalFiles() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalFiles(files) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (e) {
    console.error('LocalStorage save failed:', e);
  }
}

export function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const useLocal = !supabase;

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (useLocal) {
        // Merge: local folder files (from Vite plugin) + localStorage uploaded files
        const uploaded = getLocalFiles();
        
        // Combine both sources, folder files first then uploaded
        // Deduplicate by filename (uploaded overwrites folder files)
        const merged = new Map();
        
        // Add folder files first
        for (const f of localFiles) {
          merged.set(f.filename, f);
        }
        
        // Add uploaded files (overwrite if same name)
        for (const f of uploaded) {
          merged.set(f.filename, f);
        }

        const allFiles = Array.from(merged.values());
        allFiles.sort((a, b) => a.filename.localeCompare(b.filename));
        setFiles(allFiles);
      } else {
        // Fetch from Supabase — ALL data including content for instant copy
        const { data, error: fetchError } = await supabase
          .from('asm_files')
          .select('*')
          .order('filename', { ascending: true });

        if (fetchError) throw fetchError;
        
        // Also merge local folder files with Supabase data
        const merged = new Map();
        for (const f of localFiles) {
          merged.set(f.filename, f);
        }
        for (const f of (data || [])) {
          merged.set(f.filename, f);
        }
        
        const allFiles = Array.from(merged.values());
        allFiles.sort((a, b) => a.filename.localeCompare(b.filename));
        setFiles(allFiles);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('CONNECTION FAILED. SUPABASE UNREACHABLE.');
      // Still show local folder files on error
      setFiles([...localFiles].sort((a, b) => a.filename.localeCompare(b.filename)));
    } finally {
      setLoading(false);
    }
  }, [useLocal]);

  const addFiles = useCallback((newFiles) => {
    if (useLocal) {
      const existing = getLocalFiles();
      // Upsert by filename
      const merged = [...existing];
      for (const nf of newFiles) {
        const idx = merged.findIndex((f) => f.filename === nf.filename);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...nf, updated_at: new Date().toISOString() };
        } else {
          merged.push({
            ...nf,
            id: crypto.randomUUID(),
            uploaded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
      merged.sort((a, b) => a.filename.localeCompare(b.filename));
      saveLocalFiles(merged);
      
      // Re-merge with folder files
      const allMerged = new Map();
      for (const f of localFiles) {
        allMerged.set(f.filename, f);
      }
      for (const f of merged) {
        allMerged.set(f.filename, f);
      }
      const allFiles = Array.from(allMerged.values());
      allFiles.sort((a, b) => a.filename.localeCompare(b.filename));
      setFiles(allFiles);
      return true;
    }
    return false;
  }, [useLocal]);

  const deleteFile = useCallback(async (id) => {
    try {
      // Check if it's a local folder file — can't delete those
      const folderFile = localFiles.find((f) => f.id === id);
      if (folderFile) {
        setError('CANNOT DELETE LOCAL FOLDER FILE.');
        return false;
      }

      if (useLocal) {
        const existing = getLocalFiles();
        const updated = existing.filter((f) => f.id !== id);
        saveLocalFiles(updated);
        setFiles((prev) => prev.filter((f) => f.id !== id));
        return true;
      } else {
        const { error: deleteError } = await supabase
          .from('asm_files')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        setFiles((prev) => prev.filter((f) => f.id !== id));
        return true;
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('DELETE FAILED.');
      return false;
    }
  }, [useLocal]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, loading, error, fetchFiles, deleteFile, addFiles, setError, useLocal };
}
