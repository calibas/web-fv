import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks'; // your typed hooks
import { readSelectedFile } from '../features/fileSlice';

function FileUploader() {
  const dispatch = useAppDispatch();
  const { content, loading, error } = useAppSelector((state) => state.file);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(readSelectedFile(file));
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept=".xlsx,.csv,.txt"
        onChange={handleFileChange}
      />
      {loading && <p>Loading file...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <pre>{content.length && content[0]['title']}</pre>
    </div>
  );
}

export default FileUploader;