"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Composant de scène garage avec animations CSS (sans Three.js)
export default function GarageScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const car1Ref = useRef<HTMLDivElement>(null);
  const car2Ref = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation GSAP au chargement
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation de la première voiture
    tl.fromTo(
      car1Ref.current,
      { opacity: 0, x: -100, rotateY: -30 },
      { opacity: 1, x: 0, rotateY: 0, duration: 1.2 },
    );

    // Animation de la deuxième voiture
    tl.fromTo(
      car2Ref.current,
      { opacity: 0, x: 100, rotateY: 30 },
      { opacity: 1, x: 0, rotateY: 0, duration: 1.2 },
      "-=0.8",
    );

    // Animation des lumières
    tl.fromTo(
      lightsRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2 },
      "-=0.5",
    );

    // Animation continue des voitures
    gsap.to(car1Ref.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    gsap.to(car2Ref.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 0.5,
    });

    // Animation des lumières
    lightsRef.current.forEach((light, index) => {
      if (light) {
        gsap.to(light, {
          opacity: 0.8,
          scale: 1.2,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.3,
        });
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 overflow-hidden"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Fond du garage */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      {/* Sol du garage */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-800 to-transparent"
        style={{
          transform: "rotateX(60deg)",
          transformOrigin: "bottom",
        }}
      />

      {/* Murs du garage */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Mur arrière */}
        <div
          className="absolute w-full h-2/3 bg-gradient-to-b from-gray-700 to-gray-900"
          style={{
            transform: "translateZ(-200px)",
            transformOrigin: "center",
          }}
        />

        {/* Mur gauche */}
        <div
          className="absolute left-0 w-1/4 h-full bg-gradient-to-r from-gray-800 to-transparent"
          style={{
            transform: "rotateY(90deg) translateZ(-200px)",
            transformOrigin: "left",
          }}
        />

        {/* Mur droit */}
        <div
          className="absolute right-0 w-1/4 h-full bg-gradient-to-l from-gray-800 to-transparent"
          style={{
            transform: "rotateY(-90deg) translateZ(-200px)",
            transformOrigin: "right",
          }}
        />
      </div>

      {/* Voiture 1 - Mercedes rouge */}
      <div
        ref={car1Ref}
        className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          transformStyle: "preserve-3d",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        {/* Corps de la voiture */}
        <div
          className="relative w-48 h-24 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #e24a4a 0%, #c73e3e 100%)",
            boxShadow: "0 20px 60px rgba(226, 74, 74, 0.5)",
            transform: "rotateX(10deg)",
          }}
        >
          {/* Toit */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-16 rounded-t-lg"
            style={{
              background: "linear-gradient(135deg, #e24a4a 0%, #c73e3e 100%)",
              boxShadow: "0 -10px 30px rgba(226, 74, 74, 0.3)",
            }}
          />

          {/* Roues */}
          <div className="absolute -bottom-4 left-4 w-8 h-8 rounded-full bg-gray-900 border-4 border-gray-700" />
          <div className="absolute -bottom-4 right-4 w-8 h-8 rounded-full bg-gray-900 border-4 border-gray-700" />

          {/* Phares */}
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-3 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-3 h-2 rounded-full bg-yellow-400 animate-pulse" />
        </div>
      </div>

      {/* Voiture 2 - BMW bleue */}
      <div
        ref={car2Ref}
        className="absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2"
        style={{
          transformStyle: "preserve-3d",
          animation: "float 3s ease-in-out infinite 0.5s",
        }}
      >
        {/* Corps de la voiture */}
        <div
          className="relative w-48 h-24 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #4a90e2 0%, #3a7bd5 100%)",
            boxShadow: "0 20px 60px rgba(74, 144, 226, 0.5)",
            transform: "rotateX(10deg)",
          }}
        >
          {/* Toit */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-16 rounded-t-lg"
            style={{
              background: "linear-gradient(135deg, #4a90e2 0%, #3a7bd5 100%)",
              boxShadow: "0 -10px 30px rgba(74, 144, 226, 0.3)",
            }}
          />

          {/* Roues */}
          <div className="absolute -bottom-4 left-4 w-8 h-8 rounded-full bg-gray-900 border-4 border-gray-700" />
          <div className="absolute -bottom-4 right-4 w-8 h-8 rounded-full bg-gray-900 border-4 border-gray-700" />

          {/* Phares */}
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-3 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-3 h-2 rounded-full bg-yellow-400 animate-pulse" />
        </div>
      </div>

      {/* Lumières du garage */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Lumière principale */}
        <div
          ref={(el) => {
            lightsRef.current[0] = el;
          }}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Lumière gauche */}
        <div
          ref={(el) => {
            lightsRef.current[1] = el;
          }}
          className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(74,144,226,0.4) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />

        {/* Lumière droite */}
        <div
          ref={(el) => {
            lightsRef.current[2] = el;
          }}
          className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(226,74,74,0.4) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />
      </div>

      {/* Effet de particules */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
