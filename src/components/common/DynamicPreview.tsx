"use client";

import React, { useState, useEffect } from "react";

const DynamicPreview = ({ code }: { code: string }) => {
  if (typeof window === "undefined") {
    return (
      <div className="text-gray-500 p-4">
        Preview only works on client side.
      </div>
    );
  }
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const blob = new Blob(
          [
            `
            import React from 'react';
            import { motion } from 'framer-motion';
            import gsap from 'gsap';
            import styled from 'styled-components';
            
            const App = () => {
              return (
                <div style={{ margin: 0, padding: 0 }}>
                  ${code}
                </div>
              );
            };
            
            export default App;
          `,
          ],
          { type: "text/javascript" }
        );
        const url = URL.createObjectURL(blob);
        const module = await import(/* @vite-ignore */ url);
        setComponent(() => module.default);
        setError(null);
        URL.revokeObjectURL(url);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load component"
        );
      }
    };
    loadComponent();
  }, [code]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  if (!Component) {
    return <div className="text-gray-500 p-4">Loading component...</div>;
  }
  return <Component />;
};

export default DynamicPreview;
