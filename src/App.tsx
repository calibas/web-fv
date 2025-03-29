import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import FileViewer from './pages/FileViewer';
import FileUploader from './pages/FileUploader';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/about">About</Link> |{' '}
        <Link to="/file-viewer">File</Link> |{' '}
        <Link to="/file-uploader">Upload</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/file-viewer" element={<FileViewer />} />
        <Route path="/file-uploader" element={<FileUploader />} />
      </Routes>
    </div>
  );
}

export default App;