'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wide text-gray-900">
          <span className="relative inline-block">
            ELEGANCE
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded"></span>
          </span>
        </Link>
        
        <div className="hidden md:flex space-x-10">
          <Link href="/" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300">Home</Link>
          <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300">Collection</Link>
          <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300">Lookbook</Link>
          <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300">About</Link>
          <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300">Journal</Link>
        </div>

        <div className="flex items-center">
          <button 
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-sm">
          <div className="flex flex-col space-y-5 pb-3">
            <Link href="/" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300 border-b border-gray-100 pb-2">Home</Link>
            <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300 border-b border-gray-100 pb-2">Collection</Link>
            <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300 border-b border-gray-100 pb-2">Lookbook</Link>
            <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300 border-b border-gray-100 pb-2">About</Link>
            <Link href="#" className="text-gray-800 hover:text-black font-light uppercase text-sm tracking-widest transition duration-300">Journal</Link>
          </div>
        </div>
      )}
    </header>
  );
}