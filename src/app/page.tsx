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
} from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
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

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          The link-in-bio built for creators
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          Your links,{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            electrified.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          One page. All your links. Bold themes. Real-time analytics.
          Create your Volt page in seconds and share it everywhere.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="text-base gap-2 px-8">
              <Zap className="h-5 w-5" />
              Create Your Volt — Free
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-base px-8">
              See Features
            </Button>
          </Link>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 mx-auto max-w-xs">
          <div className="rounded-3xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-white/10 p-1">
            <div className="rounded-[1.25rem] bg-gradient-to-br from-[#0f0f23] to-[#1a1035] p-6">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
                  V
                </div>
                <div className="text-center">
                  <p className="font-bold text-white">@voltuser</p>
                  <p className="text-sm text-white/60">Creator & Developer</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {["My Portfolio", "Latest Video", "Shop Merch"].map((label) => (
                  <div
                    key={label}
                    className="w-full rounded-xl bg-white/8 backdrop-blur px-4 py-3 text-center text-sm font-medium text-white/90 border border-white/5"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-3 mt-4">
                {[Globe, Smartphone, Sparkles].map((Icon, i) => (
                  <div key={i} className="p-1.5 rounded-full bg-white/5">
                    <Icon className="h-4 w-4 text-white/50" />
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

function FeaturesSection() {
  const features = [
    {
      icon: LinkIcon,
      title: "Unlimited Links",
      description:
        "Add as many links as you need. Portfolio, socials, merch, music — everything in one place.",
    },
    {
      icon: GripVertical,
      title: "Drag & Drop",
      description:
        "Reorder your links with a simple drag. Prioritize what matters most to your audience.",
    },
    {
      icon: Palette,
      title: "Bold Themes",
      description:
        "Choose from stunning pre-built themes. Neon, Sunset, Midnight — match your vibe.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Track clicks, views, referrers, and devices. Know exactly what's working.",
    },
    {
      icon: MousePointerClick,
      title: "Click Tracking",
      description:
        "Every click is tracked. See which links drive the most engagement.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description:
        "Looks incredible on any device. Designed for the way your audience actually browses.",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Everything you need.{" "}
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for creators who want more than just a list of links.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05] hover:border-white/20"
            >
              <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3">
                <feature.icon className="h-6 w-6 text-purple-400" />
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

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Sign up in seconds",
      description: "Create your account and claim your unique username.",
    },
    {
      step: "02",
      title: "Add your links",
      description: "Drop in your links, socials, and anything you want to share.",
    },
    {
      step: "03",
      title: "Share everywhere",
      description: "Put your Volt link in your bio and start driving traffic.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-white/5">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Live in{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              3 steps
            </span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 text-2xl font-black text-purple-400 mb-4">
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

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Switched from Linktree to Volt and my click-through rate doubled. The themes are fire.",
      name: "Alex R.",
      handle: "@alexcreates",
    },
    {
      quote: "The analytics alone make it worth it. I finally know which links actually matter.",
      name: "Mia K.",
      handle: "@miamakes",
    },
    {
      quote: "Set it up in literally 2 minutes. Clean, fast, and looks amazing on mobile.",
      name: "Jordan T.",
      handle: "@jordandev",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Creators love Volt
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <p className="text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-white/5">
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 border border-white/10 p-12 sm:p-16">
          <Zap className="h-12 w-12 text-yellow-400 fill-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Ready to go live?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of creators who already use Volt to power their
            online presence.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base gap-2 px-8">
              <Zap className="h-5 w-5" />
              Create Your Volt — Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
