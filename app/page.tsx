import Image from "next/image";
import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px8">
      <NavBar />
      <Hero />
    </main>
  );
}
