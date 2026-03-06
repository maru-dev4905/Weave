import { createBrowserRouter } from 'react-router-dom';

import { DocsLayout } from '../layout/DocsLayout.jsx';
import { DocsPage } from '../pages/DocsPage.jsx';
import { DownloadPage } from '../pages/DownloadPage.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { PalettePage } from '../pages/PalettePage.jsx';
import { UILibraryPage } from '../pages/UILibraryPage.jsx';

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
        element: <DocsPage />,
      },
      {
        path: 'palette',
        element: <PalettePage />,
      },
      {
        path: 'ui',
        element: <UILibraryPage />,
      },
      {
        path: 'download',
        element: <DownloadPage />,
      },
    ],
  },
]);
