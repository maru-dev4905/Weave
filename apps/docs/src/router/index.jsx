import { Navigate, createBrowserRouter } from 'react-router-dom';

import { DocsLayout } from '../layout/DocsLayout.jsx';
import { AnimPage } from '../pages/AnimPage.jsx';
import { CssDocsPage } from '../pages/CssDocsPage.jsx';
import { DownloadPage } from '../pages/DownloadPage.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { PalettePage } from '../pages/PalettePage.jsx';
import { JsDocsPage } from '../pages/JsDocsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DocsLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'docs',
        element: <Navigate to="/docs/css" replace />,
      },
      {
        path: 'docs/css',
        element: <CssDocsPage />,
      },
      {
        path: 'docs/js',
        element: <JsDocsPage />,
      },
      {
        path: 'anim',
        element: <AnimPage />,
      },
      {
        path: 'plate',
        element: <PalettePage />,
      },
      {
        path: 'download',
        element: <DownloadPage />,
      },
    ],
  },
]);
