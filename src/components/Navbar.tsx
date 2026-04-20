"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Live Dashboard", href: "/" },
    { name: "Venue Map", href: "#map" },
    { name: "Manage Alerts", href: "#alerts" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-linear-to-tr from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <span className="text-xl font-bold tracking-tight text-white">
              MatchDay
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const isDisabled = link.href.startsWith("#");

                return isDisabled ? (
                  <button
                    key={link.name}
                    disabled
                    className="group relative flex items-center text-sm font-medium text-gray-500 opacity-60 cursor-not-allowed transition-all"
                  >
                    {link.name}
                    <span className="absolute -top-3 -right-3 whitespace-nowrap rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                      Soon
                    </span>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-white ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/admin"
              className="rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-semibold text-blue-400 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-600/20"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
