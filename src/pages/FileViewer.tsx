import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks'; 
import { loadTextFile } from '../features/fileSlice';


function FileViewer() {
  const dispatch = useAppDispatch();
  const { content, loading, error } = useAppSelector((state) => state.file);

  useEffect(() => {
    dispatch(loadTextFile('/path/to/file.txt'));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }
  return <pre>{content[0] && content[0]['title']}</pre>;
}

export default FileViewer;