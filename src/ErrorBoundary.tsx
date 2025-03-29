import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  // If it's a special error response (e.g. 404, 401, etc.)
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <h2>404 - Page Not Found</h2>;
    }
    // Handle other HTTP errors here if desired, e.g. 401
    return (
      <div>
        <h2>Error {error.status}</h2>
        <p>{error.statusText}</p>
      </div>
    );
  }

  // For all other error types (network failure, JS errors, etc.)
  // Also using this when there's no matching routes
  return <h2>Resource Not Found</h2>;
}