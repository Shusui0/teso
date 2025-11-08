"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, LogIn, UserPlus, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [videoStarted, setVideoStarted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center font-bold text-black">
              TG
            </div>
            <span className="font-bold text-lg hidden sm:inline">TrafficGuard</span>
          </div>

          {/* Right side - Theme toggle, Login, Signup */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-amber-500" />
              )}
            </button>

            <Link
              href="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors duration-300 text-sm"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>

            <Link
              href="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:shadow-lg hover:shadow-yellow-300/50 transition-all duration-300 text-sm"
            >
              <UserPlus size={18} />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background blob */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-yellow-200 to-transparent rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-amber-200 to-transparent rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-950/30 border border-yellow-400/50 animate-fade-in">
            <span className="text-yellow-700 dark:text-yellow-300 text-sm font-semibold">
              Welcome to Smart Traffic Management
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in animation-delay-100">
            Smart Traffic Management for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              Bengaluru
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 animate-fade-in animation-delay-200 max-w-2xl mx-auto">
            Leveraging advanced technology to make Bengaluru's roads safer, smarter, and more efficient through
            intelligent traffic violation detection and real-time management.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in animation-delay-300">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:shadow-lg hover:shadow-yellow-300/50 transition-all duration-300 hover:scale-105">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-lg border-2 border-yellow-400/50 text-yellow-600 dark:text-yellow-400 font-semibold hover:bg-yellow-50 dark:hover:bg-yellow-950/10 transition-all duration-300">
              Learn More
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce mt-12">
            <ChevronDown size={32} className="mx-auto text-yellow-400/60" />
          </div>
        </div>
      </section>

      {/* See Our System In Action - Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 transition-colors duration-500">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in text-foreground">
              See Our System in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-100">
              Watch how our AI-powered technology detects and reports traffic violations in real-time.
            </p>
          </div>

          {/* Video Container */}
          <div className="rounded-xl overflow-hidden shadow-2xl bg-black/20 aspect-video flex items-center justify-center backdrop-blur-sm border border-green-200/30 dark:border-green-800/30 hover:shadow-xl transition-all duration-500 animate-fade-in animation-delay-200">
            <div className="relative w-full h-full bg-gradient-to-br from-green-900/40 to-black/40 flex items-center justify-center group cursor-pointer">
              <video
                className="w-full h-full rounded-xl object-cover"
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TESO-dghFNg8FbKuJY6dcG4pZj4vmCYm9Te.mp4"
                title="Traffic Detection System Demo"
                controls
                autoPlay
                muted
                loop
              ></video>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Vision */}
          <div className="animate-fade-in">
            <div className="mb-4 inline-block px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-950/30">
              <h3 className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm">OUR VISION</h3>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              A Safer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Bengaluru
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We envision a city where traffic violations are minimized through intelligent detection and real-time
              enforcement, creating safer roads for every citizen and reducing accidents caused by traffic rule
              violations.
            </p>
          </div>

          {/* Mission */}
          <div className="animate-fade-in animation-delay-100">
            <div className="mb-4 inline-block px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-950/30">
              <h3 className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm">OUR MISSION</h3>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Intelligent Traffic{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Management
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to deploy cutting-edge AI and computer vision technology to detect traffic violations in
              real-time, enabling authorities to enforce rules effectively and make our roads safer for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Report & Fetch Violations in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Bengaluru
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Easy access to report and check traffic violations across major zones in Bengaluru
            </p>
          </div>

          {/* Zones Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { zone: "Central Bengaluru", hotspots: "MG Road, Cubbon Park, Brigade Road", icon: "📍" },
              { zone: "North Bengaluru", hotspots: "Whitefield, Indiranagar, Marathahalli", icon: "📍" },
              { zone: "South Bengaluru", hotspots: "Koramangala, BTM Layout, Jayanagar", icon: "📍" },
              { zone: "East Bengaluru", hotspots: "K R Puram, Ramamurthy Nagar, Purana Palya", icon: "📍" },
              { zone: "West Bengaluru", hotspots: "Yeshwanthpur, Jalahalli, Rajajinagar", icon: "📍" },
              { zone: "Electronic City", hotspots: "ITPL Area, Outer Ring Road, Sarjapur Road", icon: "📍" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/10 dark:to-amber-950/10 border border-yellow-200/30 dark:border-yellow-800/30 hover:border-yellow-400/50 dark:hover:border-yellow-600/50 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.zone}</h3>
                <p className="text-muted-foreground text-sm">{item.hotspots}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detection Gallery Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">AI Detection in Action</h2>
            <p className="text-lg text-muted-foreground">See how our system identifies traffic violations</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AkxSAPT0D0qtHM8MWGXmBP8ZEmSiIn.png",
                alt: "AI Traffic Detection System",
              },
              {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ghgu5uSdRcYCgh7VZdSV8wCHqJ2lE8.png",
                alt: "AI Detection with Object Recognition - Bus, Person, Motorcycle Detection",
              },
              { src: "/placeholder.svg?height=300&width=400", alt: "Vehicle Detection" },
            ].map((img, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden h-64 animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <img src={img.src || "/placeholder.svg"} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30 border-t border-yellow-200/30 dark:border-yellow-800/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">TrafficGuard</h4>
              <p className="text-muted-foreground text-sm">
                Making Bengaluru roads safer with AI-powered traffic management.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setShowTerms(!showTerms)}
                    className="text-muted-foreground hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPrivacy(!showPrivacy)}
                    className="text-muted-foreground hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-yellow-200/30 dark:border-yellow-800/30 pt-8">
            <p className="text-center text-sm text-muted-foreground">© 2025 TrafficGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal - Terms & Conditions */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-background rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-8 animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Terms & Conditions</h3>
            <p className="text-muted-foreground mb-4">
              By using TrafficGuard, you agree to comply with all applicable traffic laws and regulations. Our platform
              is designed to support traffic enforcement and public safety in Bengaluru. Misuse of the platform or
              providing false information may result in legal consequences.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal - Privacy Policy */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-background rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-8 animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Privacy Policy</h3>
            <p className="text-muted-foreground mb-4">
              TrafficGuard collects and processes traffic violation data to improve road safety in Bengaluru. Your
              personal information is protected according to applicable privacy laws. We do not share your data with
              third parties without consent, except as required by law.
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
