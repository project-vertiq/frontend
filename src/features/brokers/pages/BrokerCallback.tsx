import { useEffect } from 'react';

const BrokerCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (window.opener && code && state) {
      window.opener.postMessage({ type: 'broker-oauth', code, state }, '*');
      window.close();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-lg">You can close this window.</div>
    </div>
  );
};

export default BrokerCallback;
