/*
Copyright 2023 The Vitess Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const navItems = [
  { to: "/status", title: "Status" },
  { to: "/daily", title: "Daily" },
  { to: "/compare", title: "Compare" },
  { to: "/search", title: "Search" },
  { to: "/micro", title: "Micro" },
  { to: "/macro", title: "Macro" },
  { to: "/pr", title: "PR" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("default");
  const [hidden, setHidden] = useState(false);

  function toggleTheme() {
    setTheme((t) => (t === "default" ? "dark" : "default"));
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Set dark mode if user has set preference manually
    const darkColorPreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    if (darkColorPreference.matches) {
      setTheme("dark");
    }

    // Check for user intent to scroll and hide / show navbar accordingly
    const scrollThreshold = window.innerHeight * 0.15;
    window.addEventListener("scroll", () => {
      const currY = window.scrollY;
      if (currY < window.innerHeight * 0.25) {
        setHidden(false);
      } else {
        setTimeout(() => {
          if (window.scrollY > currY + scrollThreshold) {
            setHidden(true);
          }
          if (window.scrollY < currY - scrollThreshold / 2) {
            setHidden(false);
          }
        }, 200);
      }
    });
  }, []);

  return (
    <nav
      className={twMerge(
        "fixed w-full bg-background z-[999] flex justify-center p-page py-4 border-b border-front border-opacity-30 duration-500",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <Link to="/" className="flex flex-1 gap-x-2 items-center">
        <img src="/logo.png" className="h-[2.5em]" alt="logo" />
        <h1 className="font-medium text-2xl">arewefastyet</h1>
      </Link>

      <div className="flex gap-x-10 items-center">
        {navItems.map((item, key) => (
          <NavLink
            key={key}
            to={item.to}
            className={({ isActive, isPending }) =>
              twMerge(
                "text-lg",
                isPending
                  ? "pointer-events-none opacity-50"
                  : isActive
                  ? "text-primary"
                  : ""
              )
            }
          >
            {item.title}
          </NavLink>
        ))}
      </div>

      <div className="flex-1 flex justify-end items-center">
        <button className="relative" onClick={toggleTheme}>
          Theme
          <p className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1 text-xs text-front text-opacity-70">
            {theme}
          </p>
        </button>
      </div>
    </nav>
  );
}
