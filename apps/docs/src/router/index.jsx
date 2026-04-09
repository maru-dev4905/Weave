import { Navigate, createBrowserRouter } from 'react-router-dom';

import { DocsLayout } from '../layout/DocsLayout.jsx';
import { AnimPage } from '../pages/AnimPage.jsx';
import { CssDocsPage } from '../pages/CssDocsPage.jsx';
import { DownloadPage } from '../pages/DownloadPage.jsx';
import { FormPage } from '../pages/FormPage.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { PalettePage } from '../pages/PalettePage.jsx';
import { JsDocsPage } from '../pages/JsDocsPage.jsx';
import { PlaygroundPage } from '../pages/PlaygroundPage.jsx';
import { ReleasePage } from '../pages/ReleasePage.jsx';
import { ToolsPage } from '../pages/ToolsPage.jsx';
import { ValidationPage } from '../pages/ValidationPage.jsx';

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
        path: 'tools',
        element: <ToolsPage />,
      },
      {
        path: 'tools/:toolId',
        element: <ToolsPage />,
      },
      {
        path: 'playground',
        element: <PlaygroundPage />,
      },
      {
        path: 'validation',
        element: <ValidationPage />,
      },
      {
        path: 'form',
        element: <FormPage />,
      },
      {
        path: 'plate',
        element: <PalettePage />,
      },
      {
        path: 'release',
        element: <ReleasePage />,
      },
      {
        path: 'download',
        element: <DownloadPage />,
      },
    ],
  },
]);
