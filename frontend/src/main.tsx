import { createRoot } from 'react-dom/client';

import AuthProvider from './AuthProvider';
import InnerApp from './InnerApp';

import './index.css';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

