"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap,
  LinkIcon,
  Palette,
  BarChart3,
  Smartphone,
  ArrowRight,
  GripVertical,
  MousePointerClick,
  Globe,
  QrCode,
  Clock,
  Play,
  Calendar,
  Youtube,
  Music,
  Timer,
  Download,
  Check,
  Star,
  TrendingUp,
  Users,
  Activity,
  ChevronRight,
} from "lucide-react";

/* ─── Reusable Motion Variants ─── */

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/[0.06] bg-black/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
            <Zap className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Volt</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-violet-500/25">
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ─── Hero ─── */
const WORDS = ["electrified.", "unleashed.", "amplified.", "iconic."];

function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    const interval = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-violet-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-500/6 rounded-full blur-[130px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        {/* Radial mask */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, transparent 0%, #000 70%)" }} />
      </motion.div>

      <div className="mx-auto max-w-5xl text-center w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm px-4 py-1.5 text-sm text-violet-300 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
          </span>
          10,000+ creators already on Volt
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-tight leading-[1.0] mb-6"
        >
          <span className="text-white">Your links,</span>
          <br />
          <span className="relative inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-violet-500 bg-clip-text text-transparent"
              >
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          One page. All your links. Embeds, scheduling, QR codes, and real-time analytics.
          Built for creators who don&apos;t settle.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
        >
          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="relative text-base gap-2 px-8 h-12 overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-2xl shadow-violet-500/30 font-semibold"
              >
                <Zap className="h-5 w-5 fill-current" />
                Create Your Volt — Free
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              </Button>
            </motion.div>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 h-12 border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white backdrop-blur-sm"
            >
              See Features <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Phone Mockup */}
        <motion.div
          style={{ y: phoneY }}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[280px] sm:max-w-[320px] relative"
        >
          {/* Glow behind phone */}
          <div className="absolute inset-0 bg-violet-500/20 blur-[60px] scale-110 rounded-full" />

          <div className="relative rounded-[2.5rem] p-[1.5px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl shadow-violet-900/50">
            <div className="rounded-[2.4rem] overflow-hidden bg-gradient-to-br from-[#0d0d1e] via-[#12122a] to-[#0d0d1e] p-6">
              {/* Notch */}
              <div className="flex justify-center mb-5">
                <div className="w-20 h-1.5 bg-white/15 rounded-full" />
              </div>

              {/* Profile */}
              <div className="flex flex-col items-center gap-3 mb-5">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-pink-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-violet-500/40">
                    V
                  </div>
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 -z-10 blur-[6px] opacity-60" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-sm">@voltcreator</p>
                  <p className="text-xs text-white/40 mt-0.5">Content Creator & Artist</p>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2.5 mb-4">
                {[
                  { label: "✦ My Portfolio", gradient: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20" },
                  { label: "▶ Latest Video", gradient: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20" },
                  { label: "🛍 Shop Merch", gradient: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/20" },
                ].map((link) => (
                  <div
                    key={link.label}
                    className={`w-full rounded-xl bg-gradient-to-r ${link.gradient} backdrop-blur-sm px-4 py-2.5 text-center text-xs font-semibold text-white/80 border ${link.border}`}
                  >
                    {link.label}
                  </div>
                ))}
              </div>

              {/* Embed preview */}
              <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-red-500/10 to-red-900/10 flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
                <div className="h-8 w-8 rounded-full bg-red-500/70 flex items-center justify-center shadow-lg">
                  <Play className="h-4 w-4 text-white ml-0.5" />
                </div>
              </div>

              {/* Social icons */}
              <div className="flex justify-center gap-2 mt-4">
                {[Globe, Youtube, Music].map((Icon, i) => (
                  <div key={i} className="p-1.5 rounded-full bg-white/[0.05] border border-white/[0.05]">
                    <Icon className="h-3.5 w-3.5 text-white/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating stat badges */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-16 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-3 py-2 shadow-xl"
          >
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs font-semibold text-white">+127% clicks</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -left-4 bottom-24 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-3 py-2 shadow-xl"
          >
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-semibold text-white">1.2k views today</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Stats Marquee ─── */
const STATS = [
  { value: "10K+", label: "Creators", icon: Users },
  { value: "50M+", label: "Link Clicks", icon: MousePointerClick },
  { value: "2M+", label: "Page Views", icon: Activity },
  { value: "99.9%", label: "Uptime", icon: TrendingUp },
  { value: "4.9★", label: "Rating", icon: Star },
];

function StatsBar() {
  return (
    <div className="relative py-8 overflow-hidden border-y border-white/[0.05]">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
      <motion.div
        animate={{ x: [0, -50 + "%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 items-center whitespace-nowrap"
      >
        {[...STATS, ...STATS, ...STATS, ...STATS].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20">
              <stat.icon className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-base font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
            <div className="w-px h-6 bg-white/10 ml-4" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Features Grid ─── */
const FEATURES = [
  {
    icon: LinkIcon,
    title: "Unlimited Links",
    description: "Portfolio, socials, merch, music — everything in one beautiful page.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/15",
    glow: "blue-500",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15",
  },
  {
    icon: GripVertical,
    title: "Drag & Drop",
    description: "Reorder links with a drag. Prioritize what matters most, instantly.",
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/15",
    glow: "green-500",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
  {
    icon: Palette,
    title: "Bold Themes",
    description: "Neon, Sunset, Midnight — pre-built themes that match your vibe.",
    gradient: "from-pink-500/10 to-rose-500/10",
    border: "border-pink-500/15",
    glow: "pink-500",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/15",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track clicks, views, referrers, and devices as they happen, live.",
    gradient: "from-cyan-500/10 to-sky-500/10",
    border: "border-cyan-500/15",
    glow: "cyan-500",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Custom QR codes in your brand color. Download high-res PNG instantly.",
    gradient: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/15",
    glow: "violet-500",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Designed for how your audience actually browses — thumb-friendly by default.",
    gradient: "from-orange-500/10 to-amber-500/10",
    border: "border-orange-500/15",
    glow: "orange-500",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/15",
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.border} p-6 cursor-default transition-shadow duration-300 hover:shadow-xl`}
      style={{ "--glow": `var(--${feature.glow})` } as React.CSSProperties}
    >
      {/* Corner brackets on hover */}
      <div className="absolute top-2.5 left-2.5 h-3 w-3 border-t border-l border-white/0 group-hover:border-white/20 transition-colors duration-300 rounded-tl" />
      <div className="absolute top-2.5 right-2.5 h-3 w-3 border-t border-r border-white/0 group-hover:border-white/20 transition-colors duration-300 rounded-tr" />
      <div className="absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-white/0 group-hover:border-white/20 transition-colors duration-300 rounded-bl" />
      <div className="absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-white/0 group-hover:border-white/20 transition-colors duration-300 rounded-br" />

      <div className={`mb-4 inline-flex rounded-xl ${feature.iconBg} p-3 transition-transform duration-300 group-hover:scale-110`}>
        <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
      </div>
      <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-28 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Everything you need.{" "}
            <span className="text-white/30">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Built for creators who want more than just a list of links.
          </p>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Feature Showcase ─── */
function ShowcaseRow({
  icon: Icon,
  iconColor,
  iconBg,
  glowColor,
  title,
  description,
  tags,
  visual,
  reversed = false,
  index,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  glowColor: string;
  title: string;
  description: string;
  tags: string[];
  visual: React.ReactNode;
  reversed?: boolean;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className={`grid md:grid-cols-2 gap-12 items-center ${index < 2 ? "mb-24" : ""}`}
    >
      <motion.div
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={reversed ? "md:order-2" : ""}
      >
        <div className={`inline-flex rounded-xl ${iconBg} p-3 mb-5`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">{title}</h3>
        <p className="text-white/50 leading-relaxed mb-6">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.05] border border-white/[0.06] rounded-full px-3 py-1">
              <Check className="h-3 w-3 text-white/30" /> {tag}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reversed ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`flex justify-center ${reversed ? "md:order-1" : ""}`}
      >
        <div className="relative w-full max-w-sm">
          <div className={`absolute inset-0 ${glowColor} rounded-3xl blur-[50px] opacity-30`} />
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-7">
            {visual}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NewFeaturesSection() {
  return (
    <section className="py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 text-sm text-yellow-400 mb-5">
            <Zap className="h-4 w-4 fill-yellow-400" />
            New Features
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Fresh off the{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              wire
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Three powerful new features to supercharge your creator presence.
          </p>
        </AnimatedSection>

        {/* QR Code */}
        <ShowcaseRow
          index={0}
          icon={QrCode}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/15"
          glowColor="bg-violet-500"
          title="QR Code Generation"
          description="Generate a scannable QR code for your Volt page in your accent color. Download it as a high-res PNG and put it on merch, flyers, or your stream overlay."
          tags={["PNG export", "Custom colors", "Share anywhere"]}
          visual={
            <div className="space-y-4">
              <div className="w-40 h-40 mx-auto rounded-2xl bg-white p-3.5 shadow-2xl">
                <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-[3px]">
                  {Array.from({ length: 49 }).map((_, i) => {
                    const row = Math.floor(i / 7);
                    const col = i % 7;
                    const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
                    const isFilled = isCorner || i % 3 === 0 || i % 5 === 0;
                    return <div key={i} className="rounded-[2px]" style={{ backgroundColor: isFilled ? "#7c3aed" : "#e5e7eb" }} />;
                  })}
                </div>
              </div>
              <p className="text-center text-xs text-white/30 font-mono">volt.app/voltcreator</p>
              <div className="flex justify-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-violet-500/15 border border-violet-500/20 px-3 py-1.5 text-xs text-violet-300">
                  <Download className="h-3 w-3" /> Download PNG
                </div>
              </div>
            </div>
          }
        />

        {/* Scheduling */}
        <ShowcaseRow
          index={1}
          icon={Clock}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/15"
          glowColor="bg-cyan-500"
          title="Link Scheduling"
          description="Set start and end dates for any link. Perfect for limited drops, event promotions, or time-sensitive content. Links go live and expire automatically."
          tags={["Auto-publish", "Auto-expire", "Status badges"]}
          reversed
          visual={
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                <Calendar className="h-4 w-4 text-cyan-400" /> Schedule Window
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="py-1 text-white/30 font-medium">{d}</div>
                ))}
                {Array.from({ length: 28 }).map((_, i) => {
                  const day = i + 1;
                  const isActive = day >= 15 && day <= 22;
                  const isEdge = day === 15 || day === 22;
                  return (
                    <div key={i} className={`py-1.5 rounded-md text-[11px] font-medium transition-colors ${isEdge ? "bg-cyan-500 text-white" : isActive ? "bg-cyan-500/20 text-cyan-400" : "text-white/25"}`}>
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 text-xs">
                <Timer className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="text-cyan-300">Live: Mar 15 → Mar 22, auto-expires</span>
              </div>
            </div>
          }
        />

        {/* Embeds */}
        <ShowcaseRow
          index={2}
          icon={Play}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/15"
          glowColor="bg-pink-500"
          title="Embed Blocks"
          description="Embed YouTube videos, Spotify tracks, TikToks, tweets, and SoundCloud players directly on your page. Your audience never has to leave."
          tags={["YouTube", "Spotify", "TikTok", "Twitter", "SoundCloud"]}
          visual={
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                <div className="bg-gradient-to-br from-red-500/15 to-red-900/10 flex items-center justify-center py-6 relative">
                  <div className="h-10 w-10 rounded-full bg-red-500/80 flex items-center justify-center shadow-xl shadow-red-500/30">
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 bg-black/50 rounded-md px-2 py-1">
                    <div className="h-1 bg-white/20 rounded-full"><div className="h-full w-2/5 bg-red-400 rounded-full" /></div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-green-500/10 to-green-900/5 border border-green-500/10 p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-green-500/20 flex items-center justify-center shrink-0">
                  <Music className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate">Summer Vibes Mix</p>
                  <p className="text-[10px] text-white/30">Artist Name • Spotify</p>
                </div>
                <div className="flex items-end gap-[2px] h-4">
                  {[3, 5, 2, 4, 3].map((h, i) => (
                    <motion.div key={i} animate={{ scaleY: [1, 2, 0.8, 1.5, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} className="w-[3px] bg-green-400 rounded-full origin-bottom" style={{ height: `${h * 3}px` }} />
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorksSection() {
  const steps = [
    { step: "01", title: "Sign up in seconds", description: "Create your account and claim your unique @username. No credit card required.", color: "text-yellow-400", glow: "bg-yellow-500", border: "border-yellow-500/20", bg: "bg-yellow-500/10" },
    { step: "02", title: "Add your content", description: "Drop in links, embeds, schedule drops, and customize your theme.", color: "text-violet-400", glow: "bg-violet-500", border: "border-violet-500/20", bg: "bg-violet-500/10" },
    { step: "03", title: "Share & grow", description: "Grab your QR code or link and watch your analytics explode.", color: "text-pink-400", glow: "bg-pink-500", border: "border-pink-500/20", bg: "bg-pink-500/10" },
  ];

  return (
    <section id="how-it-works" className="py-28 px-4 sm:px-6 border-t border-white/[0.05]">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Live in{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">3 steps</span>
          </h2>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-3 relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {steps.map((s, i) => (
            <AnimatedSection key={s.step} delay={i * 0.12} className="text-center group">
              <div className="relative inline-flex mb-5">
                <div className={`absolute inset-0 ${s.glow} blur-[20px] opacity-40 rounded-2xl scale-110`} />
                <div className={`relative h-16 w-16 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center text-2xl font-black ${s.color} transition-transform duration-300 group-hover:scale-110`}>
                  {s.step}
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{s.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { quote: "Switched from Linktree to Volt and my click-through rate doubled. The themes are absolutely fire.", name: "Alex R.", handle: "@alexcreates", role: "Content Creator", avatar: "A" },
  { quote: "The scheduling feature is a game-changer. I set up my merch drops weeks in advance now.", name: "Mia K.", handle: "@miamakes", role: "Artist & Designer", avatar: "M" },
  { quote: "Embedded my Spotify right on my bio page. My streams went up 40% in the first week.", name: "Jordan T.", handle: "@jordanbeats", role: "Music Producer", avatar: "J" },
  { quote: "The analytics are insane. I can see exactly which links my audience clicks the most.", name: "Sam L.", handle: "@samcodes", role: "Developer & Streamer", avatar: "S" },
  { quote: "Volt just feels different. The dark themes are perfect for my aesthetic.", name: "Riley P.", handle: "@rileyart", role: "Digital Artist", avatar: "R" },
  { quote: "QR code feature alone made this worth it. My IRL merchandise drives 30% of my traffic now.", name: "Taylor M.", handle: "@taylormade", role: "YouTuber", avatar: "T" },
];

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-blue-500 to-cyan-600",
  "from-orange-500 to-amber-600",
  "from-green-500 to-emerald-600",
  "from-red-500 to-rose-600",
];

function TestimonialCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 mb-4">
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, j) => (
          <Star key={j} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-sm text-white/60 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} flex items-center justify-center text-xs font-black text-white shrink-0`}>
          {t.avatar}
        </div>
        <div>
          <p className="font-semibold text-sm text-white">{t.name}</p>
          <p className="text-xs text-white/30">{t.handle} · {t.role}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const col1 = TESTIMONIALS.slice(0, 2);
  const col2 = TESTIMONIALS.slice(2, 4);
  const col3 = TESTIMONIALS.slice(4, 6);

  return (
    <section className="py-28 px-4 sm:px-6 border-t border-white/[0.05] overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Social Proof</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Creators{" "}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">love</span>
            {" "}Volt
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Join thousands of creators who already call Volt home.
          </p>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-3 max-h-[520px] overflow-hidden relative">
          {/* Fade masks */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />

          {[col1, col2, col3].map((col, colIdx) => (
            <motion.div
              key={colIdx}
              animate={{ y: colIdx % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
              transition={{ duration: 20 + colIdx * 3, repeat: Infinity, ease: "linear" }}
            >
              {[...col, ...col, ...col, ...col].map((t, i) => (
                <TestimonialCard key={`${colIdx}-${i}`} t={t} index={(colIdx * 2 + i) % TESTIMONIALS.length} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["Unlimited links", "3 themes", "Basic analytics", "QR code", "Mobile-first profile"],
    cta: "Get Started Free",
    ctaHref: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$6",
    period: "per month",
    description: "For creators who mean business",
    features: ["Everything in Free", "All premium themes", "Real-time analytics", "Link scheduling", "Embed blocks", "Custom domain", "Priority support", "Remove Volt branding"],
    cta: "Start Free Trial",
    ctaHref: "/signup",
    featured: true,
  },
  {
    name: "Team",
    price: "$19",
    period: "per month",
    description: "For agencies & brands",
    features: ["Everything in Pro", "Up to 5 profiles", "Team dashboard", "Shared analytics", "API access", "Dedicated support"],
    cta: "Contact Sales",
    ctaHref: "/signup",
    featured: false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Simple,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">transparent</span>
            {" "}pricing
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready to go pro.
          </p>
        </AnimatedSection>

        <div className="grid gap-5 sm:grid-cols-3 items-stretch">
          {PLANS.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative h-full rounded-2xl p-6 flex flex-col ${
                  plan.featured
                    ? "bg-gradient-to-b from-violet-600/20 to-purple-900/20 border border-violet-500/40"
                    : "bg-white/[0.03] border border-white/[0.07]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-violet-500/30">
                      Most Popular
                    </div>
                  </div>
                )}

                {plan.featured && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />
                )}

                <div className="mb-6">
                  <p className={`text-sm font-semibold mb-1 ${plan.featured ? "text-violet-300" : "text-white/50"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-white/40">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.featured ? "bg-violet-500/30" : "bg-white/10"}`}>
                        <Check className={`h-2.5 w-2.5 ${plan.featured ? "text-violet-300" : "text-white/50"}`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaHref}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className={`w-full font-semibold ${
                        plan.featured
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-violet-500/25"
                          : "bg-white/[0.06] hover:bg-white/[0.10] text-white/80 hover:text-white border border-white/[0.08]"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 px-4 sm:px-6 border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden p-12 sm:p-16 text-center"
        >
          {/* Animated mesh background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-purple-900/40 to-pink-900/30" />
          <div className="absolute inset-0">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-violet-500/20 via-transparent to-pink-500/20"
            />
          </div>
          <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />
          <div className="absolute inset-0 backdrop-blur-sm" />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="relative">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-[20px] opacity-50 rounded-full" />
                <Zap className="relative h-12 w-12 text-yellow-400 fill-yellow-400" />
              </div>
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Ready to go live?
            </h2>
            <p className="text-lg text-white/50 mb-8 max-w-lg mx-auto">
              Join 10,000+ creators who already use Volt to power their online presence. It&apos;s free to start.
            </p>

            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Button
                  size="lg"
                  className="relative text-base gap-2 px-10 h-12 overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black border-0 shadow-2xl shadow-yellow-500/30"
                >
                  <Zap className="h-5 w-5 fill-current" />
                  Create Your Volt — Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>

            <p className="text-xs text-white/25 mt-4">No credit card required · Free forever plan available</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="font-black text-white/80">Volt</span>
          <span className="text-white/20 text-sm ml-2">© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-white/30">
          <span>Made for creators who move fast</span>
          <Zap className="h-3.5 w-3.5 text-yellow-400/60 fill-yellow-400/60 ml-1" />
        </div>

        <div className="flex items-center gap-5 text-sm text-white/40">
          <Link href="/login" className="hover:text-white/80 transition-colors">Log in</Link>
          <Link href="/signup" className="hover:text-white/80 transition-colors">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Export ─── */
export default function LandingPageClient() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <NewFeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
