import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import PixelTracker from "./components/PixelTracker";
import MetaPixelInit from "./components/MetaPixelInit";

const appUrlRaw =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
const appUrl = appUrlRaw.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "DripBazzarDZ - Mode Urbaine et Accessoires Haut de Gamme",
  description:
    "Découvrez DripBazzarDZ, votre destination pour la mode urbaine premium. Vestes, accessoires et collections exclusives livrées en Algérie.",
  keywords: [
    "DripBazzarDZ",
    "mode urbaine algérie",
    "vestes premium",
    "accessoires mode",
    "fashion dz",
    "boutique mode alger",
  ],
  authors: [{ name: "DripBazzarDZ" }],
  creator: "DripBazzarDZ",
  publisher: "DripBazzarDZ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "DripBazzarDZ - Mode Urbaine et Accessoires Haut de Gamme",
    description:
      "Découvrez DripBazzarDZ, votre destination pour la mode urbaine premium. Vestes, accessoires et collections exclusives livrées en Algérie.",
    url: appUrl,
    siteName: "DripBazzarDZ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DripBazzarDZ - Mode Urbaine Premium",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DripBazzarDZ - Mode Urbaine et Accessoires Haut de Gamme",
    description:
      "Découvrez DripBazzarDZ, votre destination pour la mode urbaine premium. Vestes, accessoires et collections exclusives livrées en Algérie.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Preconnect pour les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Fonts - Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifest pour PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color pour mobile */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />

        {/* Viewport optimisé */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />

        {/* Security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {/* Disable automatic phone number detection */}
        <meta name="format-detection" content="telephone=no" />

        {/* Disable automatic date detection */}
        <meta name="format-detection" content="date=no" />

        {/* Disable automatic address detection */}
        <meta name="format-detection" content="address=no" />

        {/* Disable automatic email detection */}
        <meta name="format-detection" content="email=no" />

        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
        </head>
        <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=1668719870942213&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
          <PixelTracker />
          <MetaPixelInit />
          {/* Skip to main content pour l'accessibilité */}
         <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-semibold"
          >
            Aller au contenu principal
          </a>

         {/* Contenu principal avec CartProvider + AuthProvider */}
         <CartProvider>
           <AuthProvider>
             <main id="main-content">{children}</main>
           </AuthProvider>
         </CartProvider>

         {/* Préchargement léger — ne pas toucher aux src des images lazy */}
         <script
           dangerouslySetInnerHTML={{
             __html: `
               (function () {
                 var preloadLinks = [
                   { rel: 'preload', href: '/products/algersoliel.webp', as: 'image' },
                   { rel: 'preload', href: '/products/alg16vert.webp', as: 'image' },
                 ];
                 preloadLinks.forEach(function (link) {
                   var linkEl = document.createElement('link');
                   linkEl.rel = link.rel;
                   linkEl.href = link.href;
                   linkEl.as = link.as;
                   document.head.appendChild(linkEl);
                 });
               })();
             `,
           }}
         />
       </body>
     </html>
   );
}