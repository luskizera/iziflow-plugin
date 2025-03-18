import "@/index.css";
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { App } from '@/components/app';

export default function IndexReact() {
  return (
    <ThemeProvider defaultTheme="light">
      <App />
    </ThemeProvider>
  );
}

// Crie a raiz e renderize o componente
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<IndexReact />);
}