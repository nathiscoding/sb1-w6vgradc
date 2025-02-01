import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronLeft, ChevronRight, Heart, Sun, Moon } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ProductModel from './components/ProductModel';

const carouselItems = [
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=100&w=3840",
    title: "L'Excellence",
    subtitle: "Collection Prestige 2024",
    description: "Une collection qui transcende le temps"
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=100&w=3840",
    title: "Artisanat d'Exception",
    subtitle: "Bijoux Signature",
    description: "L'art de la perfection"
  },
  {
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=100&w=3840",
    title: "Édition Limitée",
    subtitle: "Collection Exclusive",
    description: "Une vision unique du luxe"
  }
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const cursorRef = useRef({ x: 0, y: 0 });

  // Smooth cursor animation
  const cursorSpring = useSpring({
    to: { x: mousePosition.x - 16, y: mousePosition.y - 16 },
    config: { mass: 0.1, tension: 120, friction: 14 }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleLinkHover = () => {
    setCursorVariant('hover');
  };

  const handleLinkLeave = () => {
    setCursorVariant('default');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Custom Cursor */}
      <animated.div 
        style={{
          ...cursorSpring,
          transform: cursorSpring.x.to((x) => `translate3d(${x}px, ${cursorSpring.y.get()}px, 0)`)
        }}
        className={`fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference ${
          cursorVariant === 'hover' 
            ? 'w-12 h-12 bg-white rounded-full transition-all duration-200'
            : 'border-2 border-white rounded-full transition-all duration-200'
        }`}
      />

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-colors ${
          isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
        }`}
        onMouseEnter={handleLinkHover}
        onMouseLeave={handleLinkLeave}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${
        isScrolled 
          ? isDarkMode 
            ? 'bg-black/95 backdrop-blur-md' 
            : 'bg-white/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}>
        <div className="max-w-[2000px] mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:text-gold transition-colors"
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-3xl font-serif ml-2 lg:ml-0 tracking-widest">LUXE</h1>
            </div>

            <div className="hidden lg:flex space-x-12">
              {['BIJOUX', 'SACS', 'NOUVEAUTÉS', 'COLLECTIONS'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm tracking-widest hover:text-gold transition-all duration-300 relative group"
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-6">
              {[
                { Icon: Search, label: 'Search' },
                { Icon: Heart, label: 'Wishlist' },
                { Icon: User, label: 'Account' },
                { Icon: ShoppingBag, label: 'Cart' }
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  className="p-2 hover:text-gold transition-colors"
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                  aria-label={label}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black transition-transform duration-500 z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center space-y-8 text-2xl">
          {['BIJOUX', 'SACS', 'NOUVEAUTÉS', 'COLLECTIONS'].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-gold transition-colors"
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-110'
              }`}
            >
              <div className={`absolute inset-0 ${
                isDarkMode ? 'bg-black/40' : 'bg-white/40'
              }`} />
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-4xl px-4">
                  <h3 className="text-sm tracking-[0.3em] mb-4 opacity-90">{item.subtitle}</h3>
                  <h2 className="text-6xl lg:text-8xl font-serif mb-6">{item.title}</h2>
                  <p className="text-lg mb-8 opacity-90">{item.description}</p>
                  <button 
                    className={`border border-gold bg-transparent hover:bg-gold ${
                      isDarkMode ? 'text-gold hover:text-black' : 'text-gold hover:text-white'
                    } px-12 py-4 transition-all duration-300 tracking-widest text-sm`}
                    onMouseEnter={handleLinkHover}
                    onMouseLeave={handleLinkLeave}
                  >
                    DÉCOUVRIR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-8">
          <button
            onClick={prevSlide}
            className="p-2 hover:text-gold transition-colors group"
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex space-x-3">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-16 h-px transition-all duration-300 ${
                  index === currentSlide ? 'bg-gold' : 'bg-white/50'
                }`}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 hover:text-gold transition-colors group"
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3D Product Viewer */}
      <section className="h-screen relative">
        <div className="absolute inset-0">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <ProductModel />
            </Suspense>
            <OrbitControls enableZoom={true} enablePan={true} />
          </Canvas>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className={`text-4xl font-serif ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Explorez en 3D
          </h2>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-[2000px] mx-auto px-6 py-24">
        <h2 className="text-4xl font-serif text-center mb-16">Collections Exclusives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=100&w=3840",
              title: "BIJOUX",
              description: "L'art de la joaillerie"
            },
            {
              image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=100&w=3840",
              title: "SACS",
              description: "Élégance intemporelle"
            },
            {
              image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=100&w=3840",
              title: "ACCESSOIRES",
              description: "Le raffinement absolu"
            }
          ].map((category, index) => (
            <div 
              key={index}
              className="group relative h-[600px] overflow-hidden"
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 ${
                isDarkMode ? 'bg-black/30' : 'bg-white/30'
              } transition-opacity group-hover:opacity-60`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <h3 className="text-3xl font-serif mb-3 transform translate-y-8 transition-transform duration-500 group-hover:translate-y-0">
                  {category.title}
                </h3>
                <p className="text-sm tracking-wider opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  {category.description}
                </p>
                <button className="mt-8 border-b border-transparent hover:border-current pb-1 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  EXPLORER
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;