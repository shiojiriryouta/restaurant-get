
import logo from '../data/instagram.png'; 
import openSign from '../data/307076.svg';
import Image from 'next/image';
const Header = () => {
  return (
    <header className="text-gray-900 body-font bg-yellow-300 w-full">
      <div className="flex flex-wrap p-5 flex-col md:flex-row items-center justify-between w-full">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <Image 
            src={openSign} 
            alt="Open Sign" 
            width={80} 
            height={80} 
          />
          <span className="ml-3 text-4xl font-creepy text-gray-600 font-extrabold text-shadow-lg">
            アルティメット・グルメ・ジャッジメント
          </span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center md:justify-end">
          <a className="flex items-center text-2xl ml-2 mr-9 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            instagram
          </a>
          <a className="flex items-center text-2xl ml-2 mr-9 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ai ai-Utensils"><path d="M11 8V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4z"/><path d="M15 16V2h3a4 4 0 0 1 4 4v10h-4"/><path d="M15 16v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5"/><path d="M5 12v9a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-9"/><path d="M5 6V2"/><path d="M8 6V2"/></svg>
            Hot Pepper Gourmet
          </a>
          <a className="flex items-center text-2xl ml-2 mr-9 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ai ai-Map"><path d="M8.368 4.79l-2.736-.913A2 2 0 0 0 3 5.775v11.783a2 2 0 0 0 1.368 1.898l4 1.333a2 2 0 0 0 1.264 0l4.736-1.578a2 2 0 0 1 1.264 0l2.736.912A2 2 0 0 0 21 18.224V6.442a2 2 0 0 0-1.367-1.898l-4-1.333a2 2 0 0 0-1.265 0L9.631 4.789a2 2 0 0 1-1.264 0z"/><path d="M9 5v16"/><path d="M15 3v16"/></svg>
            Google Map
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;