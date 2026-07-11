"use client";

import Script from "next/script";
import { useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { googleLogin, ApiError } from "@/lib/api";
import type { User } from "@/lib/types";

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleButtonConfig {
  theme?: string;
  size?: string;
  width?: number;
  text?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void;
          renderButton: (parent: HTMLElement, config: GoogleButtonConfig) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (user: User) => void;
  onError: (message: string) => void;
}) {
  const { setUser } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const renderButton = useCallback(() => {
    if (!clientId || !window.google || !buttonRef.current || rendered.current) return;
    rendered.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const user = await googleLogin(response.credential);
          setUser(user);
          onSuccess(user);
        } catch (err) {
          onError(err instanceof ApiError ? err.message : "Google sign-in failed");
        }
      },
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
    });
  }, [clientId, onSuccess, onError, setUser]);

  if (!clientId) return null;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={renderButton}
        onReady={renderButton}
      />
      <div ref={buttonRef} className="flex justify-center" />
    </>
  );
}
