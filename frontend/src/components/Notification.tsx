/* general-purpose component to be imported by any component
that needs to display 5-second notifications */

import { useEffect } from 'react';

interface NotificationProps {
  type: string
  message: string
  setNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function Notification ({ type, message, setNotification }:
NotificationProps) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, setNotification]);

  return (
    <button
      tabIndex={-1} // make untabbable
      className={`
        absolute inset-x-4 bottom-4 border rounded-3xl p-3 h-15 transition
        ${type === 'success'
      ? 'bg-green dark:bg-green-dark'
      : ''}
        ${type === 'info'
      ? 'bg-background dark:bg-background-dark'
      : ''}
        ${type === 'error'
      ? 'bg-red dark:bg-red-dark'
      : ''}
        ${!message
      ? 'translate-y-23'
      : ''}`}
      onClick={() => {
        setNotification({ type: '', message: '' });
      }}
    >
      {message}
    </button>
  );
}
