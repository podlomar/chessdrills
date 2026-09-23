import { render } from 'preact';
import '@/styles/reset.css';
import '@/styles/tokens.css';
import '@/styles/global.css';
import { App } from '@/app/App.tsx';

const root = document.getElementById('app');
if (root) {
  render(<App />, root);
}
