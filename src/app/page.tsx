import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  LinkIcon,
  Palette,
  BarChart3,
  Smartphone,
  Sparkles,
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
  Eye,
  Share2,
} from "lucide-react";

/* ─── Navbar ─── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          Volt
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="gap-1">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-500/20 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse-glow-slow" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] animate-pulse-glow" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8 animate-on-scroll">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          Now with embeds, scheduling & QR codes
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
          Your links,{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
            electrified.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          One page. All your links. Embed content. Schedule drops. Bold themes.
          Real-time analytics. Built for creators who move fast.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="text-base gap-2 px-8 h-12">
              <Zap className="h-5 w-5" />
              Create Your Volt — Free
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-base px-8 h-12">
              See Features
            </Button>
          </Link>
        </div>

        {/* Phone mockup */}
        <div className="mt-20 mx-auto max-w-xs animate-float-slow">
          <div className="rounded-[2rem] bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-yellow-500/10 border border-border/30 p-1.5 shadow-2xl shadow-purple-500/10">
            <div className="rounded-[1.6rem] bg-gradient-to-br from-[#0f0f23] to-[#1a1035] p-6 relative overflow-hidden">
              {/* Inner glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-[60px]" />

              <div className="relative flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/30">
                  V
                </div>
                <div className="text-center">
                  <p className="font-bold text-white">@voltuser</p>
                  <p className="text-sm text-white/50">Creator & Developer</p>
                </div>
              </div>

              <div className="relative mt-5 space-y-2.5">
                {["My Portfolio", "Latest Video", "Shop Merch"].map((label) => (
                  <div
                    key={label}
                    className="w-full rounded-xl bg-white/[0.06] backdrop-blur px-4 py-3 text-center text-sm font-medium text-white/80 border border-white/[0.04] transition-colors hover:bg-white/10"
                  >
                    {label}
                  </div>
                ))}

                {/* Embedded content preview */}
                <div className="w-full rounded-xl bg-white/[0.04] border border-white/[0.04] overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white/70 ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center gap-3 mt-4">
                {[Globe, Smartphone, Sparkles].map((Icon, i) => (
                  <div key={i} className="p-1.5 rounded-full bg-white/[0.04]">
                    <Icon className="h-4 w-4 text-white/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features Grid ─── */
function FeaturesSection() {
  const features = [
    {
      icon: LinkIcon,
      title: "Unlimited Links",
      description: "Portfolio, socials, merch, music — everything in one page.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: GripVertical,
      title: "Drag & Drop",
      description: "Reorder links with a drag. Prioritize what matters most.",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      icon: Palette,
      title: "Bold Themes",
      description: "Neon, Sunset, Midnight — pre-built themes that match your vibe.",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track clicks, views, referrers, and devices live.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: MousePointerClick,
      title: "Click Tracking",
      description: "Every click tracked. See which links drive engagement.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Designed for how your audience actually browses.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Everything you need.{" "}
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for creators who want more than just a list of links.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`animate-on-scroll stagger-${i + 1} group rounded-2xl glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/5`}
            >
              <div className={`mb-4 inline-flex rounded-xl ${feature.bg} p-3 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── New Features Showcase ─── */
function NewFeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 text-sm text-yellow-500 dark:text-yellow-400 mb-6">
            <Zap className="h-4 w-4" />
            New
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Fresh off the{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              wire
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three powerful new features to supercharge your Volt page.
          </p>
        </div>

        {/* QR Code Feature */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="animate-on-scroll-left">
            <div className="inline-flex rounded-xl bg-purple-500/10 p-3 mb-4">
              <QrCode className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4">QR Code Generation</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Generate a scannable QR code for your Volt page in your accent color. Download it as a high-res PNG and slap it on merch, flyers, or your stream overlay.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Download className="h-4 w-4" /> PNG export</span>
              <span className="flex items-center gap-1.5"><Palette className="h-4 w-4" /> Custom colors</span>
              <span className="flex items-center gap-1.5"><Share2 className="h-4 w-4" /> Share anywhere</span>
            </div>
          </div>
          <div className="animate-on-scroll-right flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-[40px]" />
              <div className="relative rounded-2xl glass-card p-8">
                {/* QR Code visual */}
                <div className="w-48 h-48 mx-auto rounded-xl bg-white p-4">
                  <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-[3px]">
                    {Array.from({ length: 49 }).map((_, i) => {
                      const row = Math.floor(i / 7);
                      const col = i % 7;
                      const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
                      const isFilled = isCorner || (i % 3 === 0) || (i % 5 === 0);
                      return (
                        <div
                          key={i}
                          className="rounded-[2px]"
                          style={{ backgroundColor: isFilled ? "#8b5cf6" : "#e5e7eb" }}
                        />
                      );
                    })}
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">volt.link/voltuser</p>
              </div>
            </div>
          </div>
        </div>

        {/* Link Scheduling Feature */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1 animate-on-scroll-left flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-[40px]" />
              <div className="relative rounded-2xl glass-card p-8 w-full max-w-sm">
                {/* Calendar visual */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    Schedule
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="py-1 text-muted-foreground font-medium">{d}</div>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => {
                      const day = i + 1;
                      const isActive = day >= 15 && day <= 22;
                      const isStart = day === 15;
                      const isEnd = day === 22;
                      return (
                        <div
                          key={i}
                          className={`py-1.5 rounded-md text-xs transition-colors ${
                            isStart || isEnd
                              ? "bg-cyan-500 text-white font-bold"
                              : isActive
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 text-xs">
                    <Timer className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-cyan-500 dark:text-cyan-400">Live Mar 15 → Mar 22</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 animate-on-scroll-right">
            <div className="inline-flex rounded-xl bg-cyan-500/10 p-3 mb-4">
              <Clock className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4">Link Scheduling</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Set start and end dates for any link. Perfect for limited drops, event promotions, or time-sensitive content. Links go live and expire automatically.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Auto-publish</span>
              <span className="flex items-center gap-1.5"><Timer className="h-4 w-4" /> Auto-expire</span>
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> Status badges</span>
            </div>
          </div>
        </div>

        {/* Embed Blocks Feature */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll-left">
            <div className="inline-flex rounded-xl bg-pink-500/10 p-3 mb-4">
              <Play className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4">Embed Blocks</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Embed YouTube videos, Spotify tracks, TikToks, tweets, and SoundCloud players directly on your page. Your audience never has to leave.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Youtube className="h-4 w-4" /> YouTube</span>
              <span className="flex items-center gap-1.5"><Music className="h-4 w-4" /> Spotify</span>
              <span className="flex items-center gap-1.5"><Play className="h-4 w-4" /> TikTok</span>
              <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" /> Twitter</span>
              <span className="flex items-center gap-1.5"><Music className="h-4 w-4" /> SoundCloud</span>
            </div>
          </div>
          <div className="animate-on-scroll-right flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-pink-500/20 rounded-3xl blur-[40px]" />
              <div className="relative rounded-2xl glass-card p-6 space-y-3">
                {/* YouTube embed mock */}
                <div className="rounded-xl overflow-hidden border border-border/30">
                  <div className="aspect-video bg-gradient-to-br from-red-500/10 to-red-900/10 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
                    <div className="h-10 w-10 rounded-full bg-red-500/80 flex items-center justify-center shadow-lg shadow-red-500/30">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                {/* Spotify embed mock */}
                <div className="rounded-xl bg-gradient-to-r from-green-500/10 to-green-900/5 border border-border/30 p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-green-500/20 flex items-center justify-center shrink-0">
                    <Music className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">Summer Vibes Mix</p>
                    <p className="text-[10px] text-muted-foreground">Artist Name</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-0.5 h-3 bg-green-400 rounded-full animate-pulse" />
                    <div className="w-0.5 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="w-0.5 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Sign up in seconds",
      description: "Create your account and claim your unique username.",
      gradient: "from-yellow-500/20 to-orange-500/20",
      color: "text-yellow-400",
    },
    {
      step: "02",
      title: "Add your content",
      description: "Drop in links, embeds, set schedules — make it yours.",
      gradient: "from-purple-500/20 to-pink-500/20",
      color: "text-purple-400",
    },
    {
      step: "03",
      title: "Share everywhere",
      description: "Grab your QR code or link and start driving traffic.",
      gradient: "from-cyan-500/20 to-blue-500/20",
      color: "text-cyan-400",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-border/50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Live in{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              3 steps
            </span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className={`animate-on-scroll stagger-${i + 1} text-center group`}>
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${s.gradient} border border-border/30 text-2xl font-black ${s.color} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                {s.step}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Switched from Linktree to Volt and my click-through rate doubled. The themes are fire.",
      name: "Alex R.",
      handle: "@alexcreates",
    },
    {
      quote: "The scheduling feature is a game-changer. I set up my merch drops weeks in advance now.",
      name: "Mia K.",
      handle: "@miamakes",
    },
    {
      quote: "Embedded my Spotify right on my bio page. My streams went up 40% in the first week.",
      name: "Jordan T.",
      handle: "@jordandev",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-border/50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Creators love Volt
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`animate-on-scroll stagger-${i + 1} rounded-2xl glass-card p-6 transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Sparkles key={j} className="h-4 w-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-border/50">
      <div className="mx-auto max-w-3xl text-center animate-on-scroll-scale">
        <div className="relative rounded-3xl overflow-hidden p-12 sm:p-16">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-yellow-500/10 animate-gradient-shift" />
          <div className="absolute inset-0 border border-border/30 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

          <div className="relative">
            <Zap className="h-12 w-12 text-yellow-400 fill-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Ready to go live?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of creators who already use Volt to power their online presence.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-base gap-2 px-8 h-12">
                <Zap className="h-5 w-5" />
                Create Your Volt — Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          Volt &copy; {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-foreground transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <NewFeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
