'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { cart, toggleCart } = useCart();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinkStyles = (path: string) => {
    const isActive = pathname === path;
    const containerClasses = isActive
      ? "flex items-center gap-4 px-4 py-3 rounded-[14px] bg-[#8d61c6] text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)]"
      : "flex items-center gap-4 px-4 py-3 rounded-[14px] text-[#434343] hover:bg-[#efe3ff]/50 transition-colors";

    const iconContainerClasses = isActive
      ? "w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg text-white"
      : "w-8 h-8 flex items-center justify-center bg-[#efe3ff] rounded-lg text-[#8d61c6]";

    return { container: containerClasses, icon: iconContainerClasses };
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-[60] px-6 py-12 mt-0 flex justify-between items-center shadow-none transition-all duration-300 ${isScrolled ? 'bg-background border-b border-gray-200' : 'bg-transparent border-b border-transparent'}`}>
      {/* Hamburger Menu - Mobile Only */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-brand-purple hover:text-brand-purple transition-colors absolute left-6 md:hidden"
        aria-label="Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/25 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-[#fffcf4] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="h-[81px] flex items-center justify-between px-6 border-b border-[#efe3ff]">
                <h2 className="text-[#434343] text-[18px] font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[#8d61c6]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-4 py-6 flex flex-col gap-3">
                <Link
                  href="/"
                  className={getLinkStyles("/").container}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={getLinkStyles("/").icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                  </div>
                  <span className="font-medium text-[16px]">Home</span>
                </Link>

                <Link
                  href="/cardapio"
                  className={getLinkStyles("/cardapio").container}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={getLinkStyles("/cardapio").icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-[16px]">Cardápio</span>
                </Link>

                <Link
                  href="/pedidos"
                  className={getLinkStyles("/pedidos").container}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={getLinkStyles("/pedidos").icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v.75z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-[16px]">Pedidos</span>
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/perfil"
                      className={getLinkStyles("/perfil").container}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={getLinkStyles("/perfil").icon}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-[16px]">Perfil</span>
                    </Link>

                    <button
                      onClick={async () => {
                        await signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-4 px-4 py-3 rounded-[14px] text-[#ff6b6b] hover:bg-[#fff5f5] transition-colors w-full text-left"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-[#fff5f5] rounded-lg text-[#ff6b6b]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-[16px]">Sair</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className={getLinkStyles("/signin").container}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className={getLinkStyles("/signin").icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium text-[16px]">Entrar</span>
                  </Link>
                )}
              </nav>

              {/* Bottom Image Placeholder */}
              <div className="mt-auto relative h-32 w-full overflow-hidden rounded-b-lg">
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#efe3ff] to-transparent opacity-50"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Link href="/">
          <div className="relative w-32 h-12 md:w-48 md:h-20">
            <Image
              src="/logo.png"
              alt="Luli Cookies Artesanais"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Cookie Jar Cart Icon */}
      {/* Cart Icon */}
      <button
        onClick={toggleCart}
        className="text-brand-purple hover:text-brand-purple transition-colors absolute right-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#EFE3FF] text-brand-purple text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}
