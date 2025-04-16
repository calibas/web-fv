import { useState, useEffect } from 'react';

export interface RouteDefinition {
    path: string;
    name: string;
    // Add any other props you might want to pass to your component
    extraProps?: Record<string, string>;
  }

export const useRoutes = () => {
  const [routes, setRoutes] = useState<RouteDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/index.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch routes: ${response.status}`);
        }
        const data: RouteDefinition[] = await response.json();
        setRoutes(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return { routes, loading, error };
};