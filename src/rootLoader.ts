import { LoaderFunctionArgs } from 'react-router-dom';

// Example async function (e.g., fetch user info, auth check, etc.)
async function fetchUserData() {
  // Replace with your real API call
  // const response = await fetch('/api/user');
  // if (!response.ok) {
  //   throw new Error('Failed to fetch user');
  // }
//   return response.json();
  return {"name":"Betty"}
}

// Our root loader
export async function rootLoader(args: LoaderFunctionArgs) {
  console.log(args.request.url);
  const userPromise = fetchUserData();
  
  // Return the promise in a `defer` so we can use <Suspense>/<Await> in the component
  return {
    user: userPromise,
  };
}