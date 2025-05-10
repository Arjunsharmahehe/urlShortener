import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

// Alert component that shows success or error messages
export default function Alert({ 
  type = 'success' as 'success' | 'error', 
  message = 'URL generated successfully',
  duration = 5000,
  onClose = () => {},
  show = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Handle show/hide logic with animation stages
  useEffect(() => {
    if (show) {
      setIsRendered(true);
      // Small delay to allow DOM to update before starting animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Handle auto-dismissal based on duration
  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setIsRendered(false);
          onClose();
        }, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  // Early return if not rendered
  if (!isRendered) return null;

  // Determine styles based on type
  const styles = {
    success: {
      bg: 'bg-green-950',
      border: 'border-green-500',
      text: 'text-green-300',
      icon: <CheckCircle className="size-6 text-green-300" />,
    },
    error: {
      bg: 'bg-red-950',
      border: 'border-red-500',
      text: 'text-red-200',
      icon: <AlertCircle className="size-6 text-red-200" />,
    }
  };

  const currentStyle = styles[type] || styles.success;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div 
        className={`
          mt-4 max-w-md w-full mx-4 shadow-lg rounded-md 
          ${currentStyle.bg} p-4 border-l-4 ${currentStyle.border}
          transition-all duration-300 ease-in-out pointer-events-auto
          ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {currentStyle.icon}
            <div className={`ml-3 ${currentStyle.text} font-medium`}>
              {message}
            </div>
          </div>
          <button
            type="button"
            className={`inline-flex rounded-md p-1.5 ${currentStyle.text} hover:bg-opacity-20 hover:bg-black/10 focus:outline-none`}
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
