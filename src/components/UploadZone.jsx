import { useRef } from 'react';

export default function UploadZone({ onFilesSelected }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
    // Reset so same folder can be re-uploaded
    e.target.value = '';
  };

  const trigger = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        webkitdirectory=""
        directory=""
        multiple
        accept=".asm"
        onChange={handleChange}
        className="hidden"
        id="upload-input"
        aria-label="Upload ASM folder"
      />
    </>
  );
}

// Export trigger function hook
export function useUploadTrigger() {
  const trigger = () => {
    const input = document.getElementById('upload-input');
    if (input) input.click();
  };
  return trigger;
}
