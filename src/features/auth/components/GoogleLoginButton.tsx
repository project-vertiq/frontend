import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import React, { useEffect, useRef } from "react";

interface GoogleLoginButtonProps {
  clientId: string;
  onTokenReceived: (idToken: string) => void;
  className?: string;
  buttonText?: string;
}

// Add window.google type
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: { theme: string; size: string; width: string }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  clientId,
  onTokenReceived,
  className = "",
  buttonText = "Continue with Google",
}) => {
  const gisBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gisBtn: HTMLDivElement | null = null;
    // Load Google Identity Services script if not already present
    if (!document.getElementById("google-identity-script")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-identity-script";
      document.body.appendChild(script);
      script.onload = renderButton;
    } else {
      renderButton();
    }
    function renderButton() {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            if (response.credential) {
              onTokenReceived(response.credential);
            }
          },
        });
        if (gisBtnRef.current) {
          gisBtnRef.current.innerHTML = "";
          gisBtn = gisBtnRef.current;
        }
        window.google.accounts.id.renderButton(
          gisBtnRef.current,
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    }
    // Cleanup
    return () => {
      if (gisBtn) gisBtn.innerHTML = "";
    };
  }, [clientId, onTokenReceived]);

  // Hide the GIS button, trigger click on it when our styled button is clicked
  const handleClick = () => {
    const btn = gisBtnRef.current?.querySelector("div[role=button]");
    if (btn) (btn as HTMLElement).click();
  };

  return (
    <>
      <div ref={gisBtnRef} style={{ display: "none" }}></div>
      <Button
        type="button"
        variant="outline"
        className={className + " w-full flex items-center justify-center gap-2"}
        onClick={handleClick}
      >
        <FcGoogle className="h-5 w-5" />
        {buttonText}
      </Button>
    </>
  );
};

export default GoogleLoginButton;
