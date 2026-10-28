import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx'

// Sokong akses daripada PC hos dan peranti luar dalam rangkaian LAN (cth: IP 10.86.125.98)
// Memastikan semua panggilan fetch ke /My-PMO diarahkan melalui Vite Proxy ke backend Apache tanpa disekat firewall port 80
if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        if (typeof input === 'string') {
            if (input.includes('://localhost/My-PMO') || input.includes('://127.0.0.1/My-PMO')) {
                input = input.replace(/^https?:\/\/[^\/]+(?=\/My-PMO)/, '');
            } else if (window.location.hostname && input.includes(`://${window.location.hostname}/My-PMO`) && !input.includes(`:${window.location.port}/My-PMO`)) {
                input = input.replace(/^https?:\/\/[^\/]+(?=\/My-PMO)/, '');
            }
        } else if (input instanceof Request && input.url) {
            let newUrl = input.url;
            if (newUrl.includes('://localhost/My-PMO') || newUrl.includes('://127.0.0.1/My-PMO')) {
                newUrl = newUrl.replace(/^https?:\/\/[^\/]+(?=\/My-PMO)/, '');
                input = new Request(newUrl, input);
            } else if (window.location.hostname && newUrl.includes(`://${window.location.hostname}/My-PMO`) && !newUrl.includes(`:${window.location.port}/My-PMO`)) {
                newUrl = newUrl.replace(/^https?:\/\/[^\/]+(?=\/My-PMO)/, '');
                input = new Request(newUrl, input);
            }
        }
        return originalFetch.call(this, input, init);
    };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
