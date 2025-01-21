import React from 'react';
import { createRoot } from 'react-dom/client';
import ConfigPage from './ConfigPage'

const container = document.getElementById('configPage');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <div className="text-2xl h-svh bg-config-enka bg-cover relative font-genshin">
      <div className='absolute h-full w-full bg-sky-200 opacity-10'></div>
      <ConfigPage />
    </div>
  </React.StrictMode>
);