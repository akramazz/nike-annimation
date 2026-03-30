"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import AboutScene from "../components/AboutScene";

// Enregistrement du plugin ScrollTrigger de GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Composant de chargement
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="loading-spinner"></div>
    </div>
  );
}

// Page À propos avec animations 3D
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation GSAP au chargement de la page
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animation du titre principal
    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.2,
      }
    );

    // Animation du sous-titre
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
      "-=0.6"
    );

    // Animation des statistiques avec stagger
    if (statsRef.current) {
      tl.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
        },
        "-=0.4"
      );
    }

    // Animation des valeurs avec ScrollTrigger
    if (valuesRef.current) {
      const valueCards = valuesRef.current.querySelectorAll(".value-card");
      valueCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    // Animation de l'équipe avec ScrollTrigger
    if (teamRef.current) {
      const teamMembers = teamRef.current.querySelectorAll(".team-member");
      teamMembers.forEach((member, index) => {
        gsap.fromTo(
          member,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.9 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: member,
              start: "top 85%",
              end: "top 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    // Nettoyage des animations
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  // Données de l'équipe
  const teamMembers = [
    {
      name: "Alexandre Dubois",
      role: "Fondateur & CEO",
      description: "Visionnaire passionné par l'innovation et le design premium.",
      image: "👨‍💼",
    },
    {
      name: "Marie Laurent",
      role: "Directrice Créative",
      description: "Experte en tendances mode et expérience client.",
      image: "👩‍🎨",
    },
    {
      name: "Thomas Martin",
      role: "Directeur Technique",
      description: "Architecte de solutions digitales innovantes.",
      image: "👨‍💻",
    },
    {
      name: "Sophie Bernard",
      role: "Responsable Marketing",
      description: "Stratège marketing avec une vision globale.",
      image: "👩‍💼",
    },
  ];

  // Valeurs de l'entreprise
  const values = [
    {
      icon: "✨",
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque détail, de la conception à la livraison.",
    },
    {
      icon: "🎯",
      title: "Innovation",
      description: "Nous repoussons les limites de la créativité et de la technologie.",
    },
    {
      icon: "💎",
      title: "Qualité",
      description: "Des matériaux premium et une finition impeccable garantis.",
    },
    {
      icon: "🤝",
      title: "Confiance",
      description: "Une relation transparente et durable avec nos clients.",
    },
    {
      icon: "🌍",
      title: "Durabilité",
      description: "Engagés pour une mode responsable et éthique.",
    },
    {
      icon: "💡",
      title: "Créativité",
      description: "L'inspiration au cœur de chaque création.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navigation fixe animée */}
      <Navigation />

      {/* Section héro avec scène 3D */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Scène 3D en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<LoadingSpinner />}>
            <AboutScene />
          </Suspense>
        </div>

        {/* Overlay de gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10" />

        {/* Contenu principal */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Badge animé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2" />
            <span className="text-white/90 text-sm font-medium">
              Notre Histoire
            </span>
          </motion.div>

          {/* Titre principal avec animation GSAP */}
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight"
          >
            <span className="block">À Propos</span>
            <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              De Nous
            </span>
          </h1>

          {/* Sous-titre avec animation GSAP */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Découvrez l'histoire et les valeurs qui font de PREMIUM une marque
            unique dans l'univers de la mode haut de gamme.
          </p>

          {/* Statistiques animées */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: "2018", label: "Année de création" },
              { value: "50+", label: "Employés" },
              { value: "10K+", label: "Clients satisfaits" },
              { value: "25", label: "Pays" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicateur de scroll animé */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-sm mb-2">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-white"
              />
            </div>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </section>

      {/* Section Notre Histoire */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Notre Histoire
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Depuis notre création en 2018, nous avons toujours eu pour mission
              de créer des vêtements qui allient style, confort et qualité
              exceptionnelle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Les Débuts
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Tout a commencé avec une vision simple : créer des vêtements
                  qui permettent à chacun d'exprimer sa personnalité avec
                  élégance. Notre fondateur, passionné de mode et d'automobile,
                  a décidé de fusionner ces deux univers pour créer quelque
                  chose de unique.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  L'Évolution
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Au fil des années, nous avons grandi tout en restant fidèles à
                  nos valeurs. Chaque collection est le fruit d'un travail
                  minutieux, alliant tradition artisanale et innovations
                  modernes pour offrir des pièces d'exception.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="text-6xl mb-6">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Notre Mission
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Nous nous engageons à créer des vêtements qui non seulement
                  subliment votre apparence, mais qui respectent également
                  l'environnement et les normes éthiques les plus strictes.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Éco-responsable</div>
                    <div className="text-white/60 text-sm">Matériaux durables</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nos Valeurs
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Les principes qui guident chacune de nos actions et définissent
              notre identité en tant que marque.
            </p>
          </motion.div>

          <div
            ref={valuesRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Notre Équipe */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Notre Équipe
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Des professionnels passionnés qui travaillent ensemble pour vous
              offrir le meilleur.
            </p>
          </motion.div>

          <div
            ref={teamRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-member bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 group cursor-pointer text-center"
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <div className="text-white/60 text-sm mb-3">{member.role}</div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Rejoignez l'Aventure
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Découvrez notre collection et faites partie de la famille PREMIUM.
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-5 bg-white text-black font-bold text-lg rounded-full shadow-2xl hover:bg-white/90 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Découvrir la Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Pied de page */}
      <Footer />

      {/* Effet de grain de film */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
