'use client';

import React, { useEffect, useRef } from 'react';

export default function SimplifiedP5Background() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const loadP5 = async () => {
      const p5 = await import('p5');
      const p5Instance = new p5.default((p) => {
        let points = [];
        let canvasWidth, canvasHeight;
        
        p.setup = () => {
          // Set canvas size based on container
          updateCanvasSize();
          p.createCanvas(canvasWidth, canvasHeight);
          
          // Basic styling
          p.noFill();
          p.stroke(255);
          p.strokeWeight(3);
          
          // Generate points for text
          generateTextPoints();
        };
        
        p.draw = () => {
          const time = Date.now() / 2000;
          p.background(10);
          
          // Center the text in the canvas
          const xOffset = (canvasWidth - (canvasWidth * 0.8)) / 2;
          const yOffset = canvasHeight / 2;
          
          p.translate(xOffset, yOffset);
          
          // Draw points with animation
          p.beginShape(p.POINTS);
          for (const point of points) {
            const noiseValue = p.sin(point.y * 0.04 + time);
            const distortionFactor = 0.05;
            const x = point.x + (p.mouseX - canvasWidth/2) * distortionFactor * noiseValue;
            const y = point.y + (p.mouseY - canvasHeight/2) * 0.01 * noiseValue;
            
            p.vertex(x, y);
          }
          p.endShape();
        };
        
        p.windowResized = () => {
          updateCanvasSize();
          p.resizeCanvas(canvasWidth, canvasHeight);
          generateTextPoints();
        };
        
        // Helper functions
        function updateCanvasSize() {
          if (containerRef.current) {
            canvasWidth = containerRef.current.offsetWidth;
            canvasHeight = containerRef.current.offsetHeight;
          } else {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
          }
        }
        
        function generateTextPoints() {
          // Create simple dot grid as fallback instead of text
          points = [];
          const isMobile = canvasWidth < 600;
          const gridSize = isMobile ? 20 : 30;
          const width = canvasWidth * 0.8;
          const height = isMobile ? canvasHeight * 0.4 : canvasHeight * 0.2;
          
          // Create a dot grid in the shape of text (simplified approach)
          for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
              // Skip some points to create a pattern
              if ((x + y) % (gridSize * 2) === 0) {
                points.push({ x, y: y - height/2 });
              }
            }
          }
        }
        
      }, canvasRef.current);
      
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