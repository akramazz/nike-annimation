"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Composant de scène À propos avec animations CSS (sans Three.js)
export default function AboutScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cubesRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation GSAP au chargement
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation du logo central
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0, rotation: -180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1.5 },
    );

    // Animation des anneaux avec stagger
    tl.fromTo(
      ringsRef.current,
      { opacity: 0, scale: 0, rotation: -90 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.2,
      },
      "-=0.8",
    );

    // Animation des cubes avec stagger
    tl.fromTo(
      cubesRef.current,
      { opacity: 0, scale: 0, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
      },
      "-=0.5",
    );

    // Animation des particules avec stagger
    tl.fromTo(
      particlesRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.05,
      },
      "-=0.3",
    );

    // Animation continue du logo
    gsap.to(logoRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Animation continue des anneaux
    ringsRef.current.forEach((ring, index) => {
      if (ring) {
        gsap.to(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 15 + index * 5,
          repeat: -1,
          ease: "none",
        });
      }
    });

    // Animation continue des cubes
    cubesRef.current.forEach((cube, index) => {
      if (cube) {
        gsap.to(cube, {
          y: -20,
          rotation: 360,
          duration: 3 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.2,
        });
      }
    });

    // Animation continue des particules
    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.to(particle, {
          y: -30,
          opacity: 0.3,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: Math.random() * 2,
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
      {/* Fond avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      {/* Logo central 3D */}
      <div
        ref={logoRef}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Sphère centrale */}
        <div
          className="relative w-32 h-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #ffffff, #a0a0a0, #606060)",
            boxShadow:
              "0 0 60px rgba(255, 255, 255, 0.5), inset 0 0 30px rgba(0, 0, 0, 0.3)",
            transform: "rotateX(10deg)",
          }}
        >
          {/* Reflet */}
          <div
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/30"
            style={{
              filter: "blur(4px)",
            }}
          />
        </div>
      </div>

      {/* Anneaux orbitaux */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          ref={(el) => {
            ringsRef.current[index] = el;
          }}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{
            width: `${200 + index * 60}px`,
            height: `${200 + index * 60}px`,
            borderColor: `rgba(255, 255, 255, ${0.3 - index * 0.1})`,
            transformStyle: "preserve-3d",
            animation: `float ${4 + index}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Cubes flottants */}
      {[
        { left: "20%", top: "30%" },
        { left: "80%", top: "30%" },
        { left: "20%", top: "70%" },
        { left: "80%", top: "70%" },
        { left: "50%", top: "20%" },
        { left: "50%", top: "80%" },
        { left: "30%", top: "50%" },
        { left: "70%", top: "50%" },
      ].map((position, index) => (
        <div
          key={index}
          ref={(el) => {
            cubesRef.current[index] = el;
          }}
          className="absolute w-6 h-6 bg-white/20 backdrop-blur-sm rounded-sm"
          style={{
            left: position.left,
            top: position.top,
            transform: "rotate(45deg)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
          }}
        />
      ))}

      {/* Particules */}
      {[...Array(30)].map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            particlesRef.current[index] = el;
          }}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5,
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}

      {/* Lignes de connexion */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {[...Array(10)].map((_, index) => (
          <line
            key={index}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Effet de lumière */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
