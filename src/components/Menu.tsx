import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/about">About</Link> |{' '}
        <Link to="/view">File</Link> |{' '}
        <Link to="/upload">Upload</Link> |{' '}
        <Link to="/upload2">Upload2</Link> |{' '}
        <Link to="/list">Song List</Link>
      </nav>
    </div>
  );
}

export default Menu;