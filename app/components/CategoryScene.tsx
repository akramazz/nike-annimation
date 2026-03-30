"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Composant de scène Catégorie avec animations CSS (sans Three.js)
export default function CategoryScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const jacketsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const spheresRef = useRef<(HTMLDivElement | null)[]>([]);

  // Couleurs des vestes
  const jacketColors = [
    {
      bg: "linear-gradient(135deg, #e24a4a 0%, #c73e3e 100%)",
      shadow: "rgba(226, 74, 74, 0.5)",
    },
    {
      bg: "linear-gradient(135deg, #888888 0%, #666666 100%)",
      shadow: "rgba(136, 136, 136, 0.5)",
    },
    {
      bg: "linear-gradient(135deg, #4a90e2 0%, #3a7bd5 100%)",
      shadow: "rgba(74, 144, 226, 0.5)",
    },
    {
      bg: "linear-gradient(135deg, #8B4513 0%, #6B3410 100%)",
      shadow: "rgba(139, 69, 19, 0.5)",
    },
    {
      bg: "linear-gradient(135deg, #F5F5DC 0%, #E8E8D0 100%)",
      shadow: "rgba(245, 245, 220, 0.5)",
    },
    {
      bg: "linear-gradient(135deg, #333333 0%, #111111 100%)",
      shadow: "rgba(51, 51, 51, 0.5)",
    },
    {
      bg: "linear-gradient(135deg, #228B22 0%, #1A6B1A 100%)",
      shadow: "rgba(34, 139, 34, 0.5)",
    },
    {
      bg: "linear-gradient(135deg, #9ACD32 0%, #7AB317 100%)",
      shadow: "rgba(154, 205, 50, 0.5)",
    },
  ];

  // Animation GSAP au chargement
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation des vestes avec stagger
    tl.fromTo(
      jacketsRef.current,
      { opacity: 0, y: 100, scale: 0.8, rotationY: -30 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 1,
        stagger: 0.15,
      },
    );

    // Animation des anneaux avec stagger
    tl.fromTo(
      ringsRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
      },
      "-=0.5",
    );

    // Animation des sphères avec stagger
    tl.fromTo(
      spheresRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
      },
      "-=0.3",
    );

    // Animation des particules avec stagger
    tl.fromTo(
      particlesRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.02,
      },
      "-=0.2",
    );

    // Animation continue des vestes
    jacketsRef.current.forEach((jacket, index) => {
      if (jacket) {
        gsap.to(jacket, {
          y: -15,
          rotationY: 10,
          duration: 3 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.2,
        });
      }
    });

    // Animation continue des anneaux
    ringsRef.current.forEach((ring, index) => {
      if (ring) {
        gsap.to(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 20 + index * 5,
          repeat: -1,
          ease: "none",
        });
      }
    });

    // Animation continue des sphères
    spheresRef.current.forEach((sphere, index) => {
      if (sphere) {
        gsap.to(sphere, {
          y: -20,
          x: Math.random() * 20 - 10,
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: Math.random() * 2,
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

      {/* Anneaux décoratifs */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          ref={(el) => {
            ringsRef.current[index] = el;
          }}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: `${300 + index * 100}px`,
            height: `${300 + index * 100}px`,
            borderColor: `rgba(255, 255, 255, ${0.2 - index * 0.05})`,
            transformStyle: "preserve-3d",
          }}
        />
      ))}

      {/* Grille de vestes 3D */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-8 p-8">
          {jacketColors.map((color, index) => (
            <div
              key={index}
              ref={(el) => {
                jacketsRef.current[index] = el;
              }}
              className="relative cursor-pointer group"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Corps de la veste */}
              <div
                className="relative w-24 h-32 rounded-lg transition-all duration-500 group-hover:scale-110"
                style={{
                  background: color.bg,
                  boxShadow: `0 20px 60px ${color.shadow}`,
                  transform: "rotateX(10deg)",
                }}
              >
                {/* Col */}
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-6 rounded-t-lg"
                  style={{
                    background: color.bg,
                    boxShadow: `0 -10px 30px ${color.shadow}`,
                  }}
                />

                {/* Manches */}
                <div
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-6 h-24 rounded-lg"
                  style={{
                    background: color.bg,
                    boxShadow: `0 10px 30px ${color.shadow}`,
                  }}
                />
                <div
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-6 h-24 rounded-lg"
                  style={{
                    background: color.bg,
                    boxShadow: `0 10px 30px ${color.shadow}`,
                  }}
                />

                {/* Boutons */}
                {[0.3, 0.5, 0.7].map((top, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white/80"
                    style={{
                      top: `${top * 100}%`,
                    }}
                  />
                ))}

                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              </div>

              {/* Prix */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {
                  [
                    "69.99€",
                    "220.99€",
                    "59.99€",
                    "33.99€",
                    "59.99€",
                    "59.99€",
                    "88.99€",
                    "69.99€",
                  ][index]
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sphères lumineuses */}
      {[
        { left: "10%", top: "20%", color: "#ff4444" },
        { left: "90%", top: "20%", color: "#4488ff" },
        { left: "10%", top: "80%", color: "#44ff44" },
        { left: "90%", top: "80%", color: "#ffff44" },
        { left: "50%", top: "10%", color: "#ff44ff" },
        { left: "50%", top: "90%", color: "#44ffff" },
      ].map((sphere, index) => (
        <div
          key={index}
          ref={(el) => {
            spheresRef.current[index] = el;
          }}
          className="absolute w-8 h-8 rounded-full"
          style={{
            left: sphere.left,
            top: sphere.top,
            background: `radial-gradient(circle, ${sphere.color}, transparent)`,
            boxShadow: `0 0 30px ${sphere.color}`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Particules */}
      {[...Array(40)].map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            particlesRef.current[index] = el;
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5,
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}

      {/* Effet de lumière central */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
