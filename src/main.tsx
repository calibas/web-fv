import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "./App.tsx";
import Root from './Root';
import { rootLoader } from './rootLoader';
import Home from "./pages/Home.tsx";
import About from './pages/About';
import FileViewer from './pages/FileViewer';
import FileUploader from './pages/FileUploader';
import ErrorBoundary from "./ErrorBoundary.tsx";
// import SongList from "./pages/SongList.tsx";
import AGGrid from "./pages/AGGrid.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <AGGrid />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/view",
        element: <FileViewer />,
      },
      {
        path: "/upload",
        element: <FileUploader />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "*",
        element: <ErrorBoundary />,
      },
      // ...other child routes
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
//   </StrictMode>
// );
