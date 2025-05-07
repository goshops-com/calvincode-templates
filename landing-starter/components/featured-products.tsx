'use client';

import { useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function FeaturedProducts() {
  // Sample product data
  const [products] = useState<Product[]>([
    { id: 1, name: 'Linen Blend Blazer', price: 249, image: 'blazer', category: 'Outerwear' },
    { id: 2, name: 'Cashmere Sweater', price: 189, image: 'sweater', category: 'Knitwear' },
    { id: 3, name: 'Tailored Trousers', price: 159, image: 'trousers', category: 'Bottoms' },
    { id: 4, name: 'Silk Blouse', price: 129, image: 'blouse', category: 'Tops' },
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Outerwear', 'Knitwear', 'Bottoms', 'Tops'];
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-2xl font-light tracking-wide mb-3">FEATURED COLLECTION</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Timeless essentials designed with attention to detail</p>
        </div>
        
        <div className="flex justify-center mb-16 space-x-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-2 transition duration-300 text-sm uppercase tracking-wider font-light border-b ${activeCategory === category 
                ? 'text-black border-black' 
                : 'text-gray-400 border-transparent hover:text-gray-800'}`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group transition-all duration-300">
              <div className="relative mb-4">
                <div className="bg-gray-100 aspect-[3/4] flex items-center justify-center overflow-hidden">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">{product.image}</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center">
                  <button className="bg-white text-black text-xs uppercase tracking-widest py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Quick view
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-light text-gray-500">{product.category}</p>
                <h3 className="font-light text-sm">{product.name}</h3>
                <p className="text-sm">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}