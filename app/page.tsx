"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const searchSuggestions = useMemo(() => [
    "Abandoned hotel in Paris",
    "Ancient ruins in Mexico",
    "Spooky hospital in Detroit",
    "Ghost town in Arizona",
    "Lost temple in Cambodia",
    "Forgotten castle in Scotland",
    "Underground bunker in Berlin"
  ], []);

  const [placeholderText, setPlaceholderText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentText = searchSuggestions[currentIndex];

    const typeWriter = () => {
      if (!isDeleting && placeholderText.length < currentText.length) {
        setPlaceholderText(currentText.slice(0, placeholderText.length + 1));
        setTypingSpeed(100);
      } else if (!isDeleting && placeholderText === currentText) {
        // Pause at the end of typing
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      } else if (isDeleting && placeholderText.length > 0) {
        setPlaceholderText(placeholderText.slice(0, -1));
        setTypingSpeed(50);
      } else if (isDeleting && placeholderText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % searchSuggestions.length);
        return;
      }
    };

    const timer = setTimeout(typeWriter, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, currentIndex, typingSpeed, searchSuggestions]);

  return (
    <div>
      <header className="flex justify-between items-center px-6 py-4 border-b">
        {/* Left side - Logo */}
        <div className="text-2xl font-bold">
          Roamr
        </div>
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} 
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" asChild>
            <Link href="/explore">
              Explore
            </Link>
          </Button>
          <Button variant="ghost">
            Create
          </Button>
          <Button variant="ghost">
            Invite
          </Button>
          <Button variant="ghost">
            Log in
          </Button>
          <Button>
            Sign up
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-[65px] left-0 right-0 bg-black/90 border-b md:hidden z-50">
            <nav className="flex flex-col p-4">
              <Link 
                href="/explore" 
                className="px-4 py-3 hover:bg-zinc-50 rounded-lg"
                onClick={toggleMenu}
              >
                Explore
              </Link>
              <button 
                className="px-4 py-3 text-left hover:bg-zinc-50 rounded-lg"
                onClick={toggleMenu}
              >
                Create
              </button>
              <button 
                className="px-4 py-3 text-left hover:bg-zinc-50 rounded-lg"
                onClick={toggleMenu}
              >
                Invite
              </button>
              <button 
                className="px-4 py-3 text-left hover:bg-zinc-50 rounded-lg"
                onClick={toggleMenu}
              >
                Log in
              </button>
              <button 
                className="px-4 py-3 text-left bg-zinc-900 text-white rounded-lg mt-2"
                onClick={toggleMenu}
              >
                Sign up
              </button>
            </nav>
          </div>
        )}
      </header>
      <main>
        <section className="relative h-[600px] flex items-center justify-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/1f6a1612-9b4c-4659-972e-c9cf05bfd087.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight text-balance">
              Discover abandoned places and hidden gems around the world
            </h1>

            {/* Search Bar */}
            <div className="flex w-full max-w-3xl mx-auto px-4 md:px-0">
              <div className="flex w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-full overflow-hidden">
                <Input
                  type="text"
                  placeholder={`${placeholderText}${showCursor ? '|' : ' '}` || "Search for locations..."}
                  className="border-0 bg-transparent text-white placeholder:text-white/80 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 !text-base md:!text-lg h-12 md:h-16 px-4 md:px-8 [&:not(:placeholder-shown)]:!text-base md:[&:not(:placeholder-shown)]:!text-lg"
                />
                <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none px-6 md:px-12 text-base md:text-lg h-12 md:h-16">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Latest Additions */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Latest Additions</h2>
                <p className="text-zinc-600">Recently discovered locations by our community</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/explore">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location Card 1 */}
              <div className="group relative overflow-hidden rounded-xl">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1518656306295-aa28b28b2504?q=80&w=2940&auto=format&fit=crop"
                    alt="Abandoned Factory in Detroit"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">Abandoned Factory</h3>
                    <p className="text-white/80 text-sm mb-3">Detroit, Michigan</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <span>Added 2 days ago</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>4.8 ★</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Location Card 2 */}
              <div className="group relative overflow-hidden rounded-xl">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1548021029-d6cf0f5b9c91?q=80&w=2940&auto=format&fit=crop"
                    alt="Lost Temple in Cambodia"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">Ancient Temple Ruins</h3>
                    <p className="text-white/80 text-sm mb-3">Siem Reap, Cambodia</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <span>Added 5 days ago</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>4.9 ★</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Card 3 */}
              <div className="group relative overflow-hidden rounded-xl">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1533031685597-3e51ecd5bb3e?q=80&w=2940&auto=format&fit=crop"
                    alt="Ghost Hotel in Paris"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">Forgotten Hotel</h3>
                    <p className="text-white/80 text-sm mb-3">Paris, France</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <span>Added 1 week ago</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>4.7 ★</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* How It Works */}
        <section className="py-24 bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How Roamr Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Discover</h3>
                <p className="text-white/70">Browse our curated collection of abandoned places and hidden gems</p>
              </div>
              {/* Repeat for Plan and Explore steps */}
            </div>
          </div>
        </section>
        {/* Categories */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Explore by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group relative aspect-square rounded-2xl overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1518656306295-aa28b28b2504"
                    alt="Industrial"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold text-white">Industrial</span>
                  </div>
                </div>
              </div>
              {/* Repeat for: Hospitals, Hotels, Military Bases, etc. */}
            </div>
          </div>
        </section>
        {/* Community Highlights */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">Featured Explorers</h2>
            <p className="text-zinc-600 mb-12">Meet our most active community members</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src="/photographer-1.jpg"
                    alt="Photographer name"
                    fill
                    className="rounded-full object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    Pro
                  </div>
                </div>
                <h3 className="font-semibold">Sarah Parker</h3>
                <p className="text-sm text-zinc-600">150 locations shared</p>
              </div>
              {/* Repeat for other photographers */}
            </div>
          </div>
        </section>
        
        {/* Safety First */}
        <section className="py-24 bg-orange-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Explore Safely</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <span>✓</span>
                    </div>
                    <p>Always check local regulations and obtain necessary permits</p>
                  </div>
                  {/* Repeat for other safety tips */}
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/safety-image.jpg"
                  alt="Safety equipment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Testimonials */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">What Explorers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex gap-4 mb-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src="/user-1.jpg"
                      alt="User"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-zinc-600">Urban Explorer</p>
                  </div>
                </div>
                <p className="text-zinc-600">&quot;Found amazing locations I never knew existed in my own city!&quot;</p>
              </div>
              {/* Repeat for other testimonials */}
            </div>
          </div>
        </section>
      </main>
      <footer className="text-white/80 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Roamr</h3>
            <p className="text-sm">Discover and explore the world&apos;s most fascinating abandoned places and hidden gems.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/popular" className="hover:text-white transition-colors">Popular Places</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit Location</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/safety" className="hover:text-white transition-colors">Safety Guidelines</Link></li>
              <li><Link href="/photography" className="hover:text-white transition-colors">Photography Tips</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 Roamr. All rights reserved.</p>
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
              <Link href="#" className="hover:text-white transition-colors">YouTube</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}