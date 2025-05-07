'use client';

import { useState } from 'react';

export default function Hero() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! ${email} has been subscribed.`);
    setEmail('');
  };

  return (
    <section className="bg-white text-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-6 py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0 pr-8">
          <span className="inline-block text-xs tracking-widest uppercase text-gray-500 mb-8">New Collection SS24</span>
          <h1 className="text-4xl md:text-6xl font-light mb-8 leading-tight tracking-tighter">Effortless <br/>Minimalism</h1>
          <p className="text-base mb-12 text-gray-600 leading-relaxed max-w-md">A curated collection of contemporary essentials. Clean lines, luxurious fabrics, and timeless design for the modern wardrobe.</p>
          
          <form onSubmit={handleSubmit} className="flex max-w-md border-b border-gray-300 pb-2">
            <input
              type="email"
              placeholder="Join our newsletter"
              className="flex-grow px-0 py-2 text-gray-800 focus:outline-none border-0 bg-transparent text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="bg-white px-4 py-2 font-light transition duration-300 uppercase tracking-widest text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
        
        <div className="md:w-1/2">
          <div className="relative">
            <div className="bg-gray-100 aspect-[3/4] flex items-center justify-center overflow-hidden">
              <p className="text-gray-400 text-sm font-light uppercase tracking-widest">Fashion Lookbook</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}