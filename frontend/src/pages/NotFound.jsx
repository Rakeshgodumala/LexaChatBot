import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Home, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold">404</h1>
        <h2 className="text-xl font-bold">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          The interview preparation page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button icon={Home}>Return to LexaChatbot</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
