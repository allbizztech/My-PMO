import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("MY-PMO Uncaught Error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
                    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black text-white mb-2">Paparan Tergendala Seketika</h2>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            {this.state.error?.message || 'Terdapat ralat semasa memuatkan komponen sistem.'}
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Muat Semula Halaman</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
