'use client';

import React, { useEffect, useRef } from 'react';

export default function P5Background() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Load p5.js dynamically
    const loadP5 = async () => {
      const p5 = await import('p5');
      const p5Instance = new p5.default((p) => {
        let font;
        let points;
        let canvasWidth, canvasHeight;
        
        p.preload = () => {
          // Use a web-safe font as fallback if the custom font fails to load
          try {
            font = p.loadFont('/assets/fonts/LEDLIGHT.otf');
          } catch (error) {
            console.error('Error loading font:', error);
            // Handle the error gracefully
          }
        };
        
        p.setup = () => {
          // Make canvas responsive to container size
          if (containerRef.current) {
            canvasWidth = containerRef.current.offsetWidth;
            canvasHeight = containerRef.current.offsetHeight;
          } else {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
          }
          
          p.createCanvas(canvasWidth, canvasHeight);
          p.noFill();
          p.stroke(255);
          p.strokeWeight(3); // Increased from 2 to 3 for better visibility
          
          // Calculate font size based on canvas width, but with a larger minimum
          const fontSize = Math.max(canvasWidth * 0.25, 200);
          
          // Handle case where font failed to load
          if (!font) {
            // Create a default font
            font = p.textFont('monospace');
          }
          
          // Create text points - adjust text position based on screen size
          if (canvasWidth < 600) {
            // Mobile layout - stack the text
            points = [
              ...font.textToPoints('CREATIVITY', 0, 0, fontSize * 0.6, { sampleFactor: 0.4 }),
              ...font.textToPoints('WALKS', 0, fontSize * 0.7, fontSize * 0.6, { sampleFactor: 0.4 })
            ];
          } else {
            // Desktop layout - single line
            points = font.textToPoints('CREATIVITY WALKS', 0, 0, fontSize, { sampleFactor: 0.4 });
          }
        };
        
        p.draw = () => {
          const time = Date.now() / 2000;
          p.background(10); // Very dark gray, almost black
          
          // Center the text in the canvas
          let textWidth, textHeight;
          if (canvasWidth < 600) {
            // For mobile
            textWidth = canvasWidth * 0.9;
            textHeight = canvasHeight * 0.5;
          } else {
            // For desktop
            textWidth = canvasWidth * 0.8;
            textHeight = canvasHeight * 0.6;
          }
          
          const xOffset = (canvasWidth - textWidth) / 2;
          const yOffset = canvasHeight / 2;
          
          p.translate(xOffset, yOffset);
          
          p.beginShape(p.POINTS);
          points
            .map(({ x, y }) => {
              // Enhanced animation effect
              const distortionFactor = canvasWidth < 600 ? 0.08 : 0.05;
              const noiseValue = p.sin(y * 0.04 + time);
              const mouseEffect = (p.mouseX - canvasWidth/2) * distortionFactor * noiseValue;
              
              return [
                x + mouseEffect,
                y + (p.mouseY - canvasHeight/2) * 0.01 * noiseValue // Added subtle vertical movement
              ];
            })
            .forEach(([x, y]) => p.vertex(x, y));
          p.endShape();
        };
        
        p.windowResized = () => {
          if (containerRef.current) {
            canvasWidth = containerRef.current.offsetWidth;
            canvasHeight = containerRef.current.offsetHeight;
          } else {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
          }
          p.resizeCanvas(canvasWidth, canvasHeight);
          
          // Recalculate points for new canvas size
          const fontSize = Math.max(canvasWidth * 0.25, 200);
          
          if (canvasWidth < 600) {
            points = [
              ...font.textToPoints('CREATIVITY', 0, 0, fontSize * 0.6, { sampleFactor: 0.4 }),
              ...font.textToPoints('WALKS', 0, fontSize * 0.7, fontSize * 0.6, { sampleFactor: 0.4 })
            ];
          } else {
            points = font.textToPoints('CREATIVITY WALKS', 0, 0, fontSize, { sampleFactor: 0.4 });
          }
        };
      }, canvasRef.current);
      
      // Cleanup function
      return () => {
        p5Instance.remove();
      };
    };
    
    const cleanup = loadP5();
    
    return () => {
      cleanup.then(cleanupFn => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0
      }}
    >
      <div ref={canvasRef} />
    </div>
  );
}