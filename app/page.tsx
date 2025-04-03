'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const searchSuggestions = useMemo(
    () => [
      'Abandoned hotel in Paris',
      'Ancient ruins in Mexico',
      'Spooky hospital in Detroit',
      'Ghost town in Arizona',
      'Lost temple in Cambodia',
      'Forgotten castle in Scotland',
      'Underground bunker in Berlin',
    ],
    []
  );

  const [placeholderText, setPlaceholderText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
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
        setCurrentIndex(prev => (prev + 1) % searchSuggestions.length);
        return;
      }
    };

    const timer = setTimeout(typeWriter, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, currentIndex, typingSpeed, searchSuggestions]);

  return (
    <div>
      <header className="flex items-center justify-between border-b px-6 py-4">
        {/* Left side - Logo */}
        <div className="text-2xl font-bold">Roamr</div>
        {/* Mobile Menu Button */}
        <button className="p-2 md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'
              }
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/explore">Explore</Link>
          </Button>
          <Button variant="ghost">Create</Button>
          <Button variant="ghost">Invite</Button>
          <Button variant="ghost">Log in</Button>
          <Button>Sign up</Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-[65px] z-50 border-b bg-black/90 md:hidden">
            <nav className="flex flex-col p-4">
              <Link
                href="/explore"
                className="rounded-lg px-4 py-3 hover:bg-zinc-50"
                onClick={toggleMenu}
              >
                Explore
              </Link>
              <button
                className="rounded-lg px-4 py-3 text-left hover:bg-zinc-50"
                onClick={toggleMenu}
              >
                Create
              </button>
              <button
                className="rounded-lg px-4 py-3 text-left hover:bg-zinc-50"
                onClick={toggleMenu}
              >
                Invite
              </button>
              <button
                className="rounded-lg px-4 py-3 text-left hover:bg-zinc-50"
                onClick={toggleMenu}
              >
                Log in
              </button>
              <button
                className="mt-2 rounded-lg bg-zinc-900 px-4 py-3 text-left text-white"
                onClick={toggleMenu}
              >
                Sign up
              </button>
            </nav>
          </div>
        )}
      </header>
      <main>
        <section className="relative flex h-[600px] items-center justify-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              backgroundImage:
                'url("https://cdn.usegalileo.ai/sdxl10/1f6a1612-9b4c-4659-972e-c9cf05bfd087.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
            <h1 className="mb-8 text-balance text-4xl font-black tracking-tight text-white md:text-6xl">
              Discover abandoned places and hidden gems around the world
            </h1>

            {/* Search Bar */}
            <div className="mx-auto flex w-full max-w-3xl px-4 md:px-0">
              <div className="flex w-full overflow-hidden rounded-full border border-white/10 bg-black/30 backdrop-blur-sm">
                <Input
                  type="text"
                  placeholder={
                    `${placeholderText}${showCursor ? '|' : ' '}` || 'Search for locations...'
                  }
                  className="h-12 rounded-none border-0 bg-transparent px-4 !text-base text-white placeholder:text-white/80 focus-visible:ring-0 focus-visible:ring-offset-0 md:h-16 md:px-8 md:!text-lg [&:not(:placeholder-shown)]:!text-base md:[&:not(:placeholder-shown)]:!text-lg"
                />
                <Button
                  variant="ghost"
                  className="h-12 rounded-none px-6 text-base text-white hover:bg-white/10 md:h-16 md:px-12 md:text-lg"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Latest Additions */}
        <section className="px-4 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold">Latest Additions</h2>
                <p className="text-zinc-600">Recently discovered locations by our community</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/explore">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Location Card 1 */}
              <div className="group relative overflow-hidden rounded-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1518656306295-aa28b28b2504?q=80&w=2940&auto=format&fit=crop"
                    alt="Abandoned Factory in Detroit"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="mb-2 text-xl font-semibold">Abandoned Factory</h3>
                    <p className="mb-3 text-sm text-white/80">Detroit, Michigan</p>
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
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1548021029-d6cf0f5b9c91?q=80&w=2940&auto=format&fit=crop"
                    alt="Lost Temple in Cambodia"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="mb-2 text-xl font-semibold">Ancient Temple Ruins</h3>
                    <p className="mb-3 text-sm text-white/80">Siem Reap, Cambodia</p>
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
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1533031685597-3e51ecd5bb3e?q=80&w=2940&auto=format&fit=crop"
                    alt="Ghost Hotel in Paris"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="mb-2 text-xl font-semibold">Forgotten Hotel</h3>
                    <p className="mb-3 text-sm text-white/80">Paris, France</p>
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
        <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 py-24 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">How Roamr Works</h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="mb-4 text-xl font-semibold">Discover</h3>
                <p className="text-white/70">
                  Browse our curated collection of abandoned places and hidden gems
                </p>
              </div>
              {/* Repeat for Plan and Explore steps */}
            </div>
          </div>
        </section>
        {/* Categories */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Explore by Category</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="group relative aspect-square overflow-hidden rounded-2xl">
                <div className="relative h-full w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1518656306295-aa28b28b2504"
                    alt="Industrial"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50">
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
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-2 text-3xl font-bold">Featured Explorers</h2>
            <p className="mb-12 text-zinc-600">Meet our most active community members</p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src="/photographer-1.jpg"
                    alt="Photographer name"
                    fill
                    className="rounded-full object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-500 px-2 py-1 text-sm text-white">
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
        <section className="bg-orange-800 py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Explore Safely</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <span>✓</span>
                    </div>
                    <p>Always check local regulations and obtain necessary permits</p>
                  </div>
                  {/* Repeat for other safety tips */}
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl">
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
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">What Explorers Say</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-4">
                  <div className="relative h-12 w-12">
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
                <p className="text-zinc-600">
                  &quot;Found amazing locations I never knew existed in my own city!&quot;
                </p>
              </div>
              {/* Repeat for other testimonials */}
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-20 py-16 text-white/80">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Roamr</h3>
            <p className="text-sm">
              Discover and explore the world&apos;s most fascinating abandoned places and hidden
              gems.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="transition-colors hover:text-white">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/popular" className="transition-colors hover:text-white">
                  Popular Places
                </Link>
              </li>
              <li>
                <Link href="/submit" className="transition-colors hover:text-white">
                  Submit Location
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/safety" className="transition-colors hover:text-white">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/photography" className="transition-colors hover:text-white">
                  Photography Tips
                </Link>
              </li>
              <li>
                <Link href="/community" className="transition-colors hover:text-white">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="transition-colors hover:text-white">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 px-4 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm">© 2024 Roamr. All rights reserved.</p>
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <Link href="#" className="transition-colors hover:text-white">
                Twitter
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Instagram
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Facebook
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
