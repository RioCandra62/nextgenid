"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const products = [
  {
    tag: "Nutritional Foundation",
    title: "Etta Goat Milk: Nutrisi Bioavailable",
    description: "Susu kambing etawa murni yang dirancang untuk penyerapan optimal, mendukung kepadatan tulang dan integritas mukosa pencernaan.",
    image: "/products/etagoat.jpg",
    features: [
      { label: "Bone Density", detail: "Kalsium organik untuk regenerasi sel tulang." },
      { label: "Digestive Ease", detail: "Struktur lemak rantai pendek yang mudah dicerna." }
    ]
  },
  {
    tag: "Nutritional Foundation",
    title: "Laurik: Solusi Inflamasi",
    description: "Diformulasikan dengan ekstrak Sidaguri untuk menetralkan kadar asam urat dan meredakan inflamasi kronis pada persendian.",
    image: "/products/laurik.jpg",
    features: [
      { label: "Bone Density", detail: "Kalsium organik untuk regenerasi sel tulang." },
      { label: "Digestive Ease", detail: "Struktur lemak rantai pendek yang mudah dicerna." }
    ]
  },
  {
    tag: "Nutritional Foundation",
    title: "Mengkudu: Penyeimbang Tekanan Darah",
    description: "Ekstrak Mengkudu pilihan yang kaya akan antioksidan xeronine untuk menstabilkan tekanan darah dan mendukung sistem imunitas tubuh.",
    image: "/products/mengkudu.jpg",
    features: [
      { label: "Bone Density", detail: "Kalsium organik untuk regenerasi sel tulang." },
      { label: "Digestive Ease", detail: "Struktur lemak rantai pendek yang mudah dicerna." }
    ]
  },
  {
    tag: "Nutritional Foundation",
    title: "Magafit: Pelindung Lambung Alami",
    description: "Formulasi herbal temu lawak dan kunyit untuk memelihara fungsi lambung, meredakan kembung, dan menormalkan asam lambung.",
    image: "/products/magafit.jpg",
    features: [
      { label: "Bone Density", detail: "Kalsium organik untuk regenerasi sel tulang." },
      { label: "Digestive Ease", detail: "Struktur lemak rantai pendek yang mudah dicerna." }
    ]
  },
    {
    tag: "Nutritional Foundation",
    title: "Fitago: Pelindung Lambung Alami",
    description: "Formulasi herbal temu lawak dan kunyit untuk memelihara fungsi lambung, meredakan kembung, dan menormalkan asam lambung.",
    image: "/products/fitago.jpg",
    features: [
      { label: "Bone Density", detail: "Kalsium organik untuk regenerasi sel tulang." },
      { label: "Digestive Ease", detail: "Struktur lemak rantai pendek yang mudah dicerna." }
    ]
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false); // Close mobile menu if clicked
  };

  useEffect(() => {
    // Smooth scroll for horizontal product grid
    const scrollContainer = scrollContainerRef.current;
    const handleWheel = (evt: WheelEvent) => {
      evt.preventDefault();
      if (scrollContainer) {
        scrollContainer.scrollLeft += evt.deltaY;
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleWheel);
    }

    // Parallax Effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxEls = document.querySelectorAll(".parallax-element");

      parallaxEls.forEach((el) => {
        const speed = 0.5;
        (el as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Intersection Observer untuk animasi masuk (fade up)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".glass-card, .animate-on-scroll").forEach((card) => {
      card.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-10");
      observer.observe(card);
    });

    return () => {
      if (scrollContainer) scrollContainer.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-[#f8faf8] text-[#191c1b] overflow-x-hidden font-sans selection:bg-[#b0ceb4] selection:text-[#061b0e]" id="home">
      {/* CSS Variable injection for the custom landing colors & styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .font-serif { font-family: 'Libre Caslon Text', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(141, 170, 145, 0.1);
        }
        .organic-shape {
          border-radius: 63% 37% 30% 70% / 50% 45% 55% 50%;
        }
        .parallax-element {
          transition: transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #eceeec;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4d6453;
          border-radius: 10px;
        }
      `}} />

      {/* TopNavBar */}
      <nav className="sticky top-0 z-50 bg-[#f8faf8]/60 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center w-full px-5 md:px-6 max-w-[1280px] mx-auto h-20">
          <div className="flex items-center gap-4">
            <span className="font-serif text-[32px] font-bold text-[#061b0e]">NexGen.id</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a 
              className="text-[#061b0e] font-bold border-b-2 border-[#061b0e] pb-1 text-[14px] font-semibold tracking-wide cursor-pointer" 
              href="#home"
              onClick={(e) => scrollToSection(e, "home")}
            >
              Home
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] transition-colors duration-300 text-[14px] font-semibold tracking-wide cursor-pointer" 
              href="#about"
              onClick={(e) => scrollToSection(e, "about")}
            >
              About
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] transition-colors duration-300 text-[14px] font-semibold tracking-wide cursor-pointer" 
              href="#vision"
              onClick={(e) => scrollToSection(e, "vision")}
            >
              Vision
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] transition-colors duration-300 text-[14px] font-semibold tracking-wide cursor-pointer" 
              href="#products"
              onClick={(e) => scrollToSection(e, "products")}
            >
              Products
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] transition-colors duration-300 text-[14px] font-semibold tracking-wide cursor-pointer" 
              href="#contact"
              onClick={(e) => scrollToSection(e, "contact")}
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger menu trigger */}
            <button 
              className="md:hidden flex items-center p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-[#061b0e] text-3xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
            <Link href="/dashboard/auth/login" className="bg-[#061b0e] text-white px-6 py-2.5 rounded-full text-[14px] font-semibold tracking-wide hover:opacity-80 scale-95 transition-all active:scale-90 shadow-lg">
              Join Us
            </Link>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-[#f8faf8]/95 border-t border-white/20 flex flex-col p-6 gap-4 shadow-lg">
            <a 
              className="text-[#061b0e] font-semibold cursor-pointer py-2 border-b border-[#061b0e]/10" 
              href="#home"
              onClick={(e) => scrollToSection(e, "home")}
            >
              Home
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] font-semibold cursor-pointer py-2 border-b border-[#061b0e]/10" 
              href="#about"
              onClick={(e) => scrollToSection(e, "about")}
            >
              About
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] font-semibold cursor-pointer py-2 border-b border-[#061b0e]/10" 
              href="#vision"
              onClick={(e) => scrollToSection(e, "vision")}
            >
              Vision
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] font-semibold cursor-pointer py-2 border-b border-[#061b0e]/10" 
              href="#products"
              onClick={(e) => scrollToSection(e, "products")}
            >
              Products
            </a>
            <a 
              className="text-[#434843]/80 hover:text-[#061b0e] font-semibold cursor-pointer py-2" 
              href="#contact"
              onClick={(e) => scrollToSection(e, "contact")}
            >
              Contact
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[750px] flex items-center overflow-hidden pt-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#d0e9d4]/30 organic-shape blur-3xl opacity-50 mix-blend-multiply animate-pulse"></div>
          <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-[#cceacf]/20 organic-shape blur-3xl opacity-50 mix-blend-multiply"></div>
        </div>
        <div className="w-full max-w-[1280px] mx-auto px-5 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="order-2 lg:order-1 animate-on-scroll">
            <span className="inline-block bg-[#d0e9d4] text-[#061b0e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              Digital Transformation Partner
            </span>
            <h1 className="font-serif text-[40px] md:text-[42px] text-[#061b0e] font-bold mb-6 leading-[1.15] tracking-tight">
              Transformasi Digital &amp; <br />
              <span className="italic text-[#4a654f]">Pengembangan SDM</span> Terintegrasi
            </h1>
            <p className="text-[18px] leading-[1.6] text-[#434843] mb-10 w-full">
              Kami hadir sebagai mitra strategis untuk membangun pemimpin masa depan melalui sinergi teknologi, kepemimpinan, dan kesejahteraan holistik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                className="bg-[#061b0e] text-white px-10 py-4 rounded-full text-[14px] font-semibold tracking-wide hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                href="#about"
                onClick={(e) => scrollToSection(e, "about")}
              >
                Mulai Transformasi <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
              <a 
                className="border border-[#061b0e] text-[#061b0e] px-10 py-4 rounded-full text-[14px] font-semibold tracking-wide hover:bg-[#d0e9d4]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                href="#products"
                onClick={(e) => scrollToSection(e, "products")}
              >
                Lihat Produk Herbal
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative animate-on-scroll">
            <div className="relative w-full aspect-square md:aspect-auto flex justify-center rounded-xl">
              <Image
                alt="NextGen Wellness Products Collage"
                className="w-full h-full object-contain drop-shadow-2xl rounded-xl"
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={700}
                height={700}
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section (Pendahuluan) */}
      <section className="py-20 md:py-32 bg-[#f2f4f2] overflow-hidden" id="about">
        <div className="w-full max-w-[1280px] mx-auto px-5 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative animate-on-scroll">
            <div className="relative w-full aspect-[4/3] md:h-[450px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                alt="Professional team collaborating in a modern office"
                src="https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          
          <div className="animate-on-scroll">
            <span className="text-[14px] font-semibold text-[#4a654f] uppercase tracking-widest mb-4 block">Pendahuluan</span>
            <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-[#061b0e] mb-6 leading-tight">
              Membangun Fondasi Masa Depan yang Solid
            </h2>
            <div className="space-y-6 text-[#434843] leading-relaxed text-[16px]">
              <p>
                Di era transformasi digital dan dinamika pasar kerja yang semakin kompleks, kemampuan kepemimpinan dan kemampuan membangun tim yang solid bukan lagi sekadar keunggulan, melainkan kebutuhan mutlak bagi setiap individu yang ingin mengembangkan karirnya secara maksimal.
              </p>
              <p>
                Nexgen.id hadir sebagai mitra terpercaya dalam pengembangan sumber daya manusia yang fokus pada peningkatan kapasitas profesional setiap orang. Kami mengusung konsep integratif yang menggabungkan pelatihan kepemimpinan, pembinaan tim, serta sistem pelatihan marketing yang komprehensif.
              </p>
              <p>
                Melalui pendekatan yang adaptif, kami berkomitmen untuk membentuk generasi baru pemimpin yang tidak hanya cakap dalam strategi bisnis, tetapi juga mampu menciptakan lingkungan kerja yang kolaboratif, produktif, dan sehat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section (Bento Style Grid) */}
      <section className="py-20 md:py-32 bg-[#f8faf8]" id="vision">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-serif text-[32px] md:text-[48px] font-semibold text-[#061b0e] mb-4">Visi &amp; Misi Kami</h2>
            <div className="w-20 h-1 bg-[#4a654f] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vision Card */}
            <div className="lg:col-span-1 glass-card p-10 rounded-[2.5rem] flex flex-col justify-center border-l-4 border-[#061b0e] animate-on-scroll">
              <span className="material-symbols-outlined text-[#061b0e] text-5xl mb-6">track_changes</span>
              <h3 className="font-serif text-[28px] font-bold mb-4 text-[#061b0e]">Visi</h3>
              <p className="text-[#434843] leading-relaxed text-[16px]">
                Menjadi perusahaan pemasaran herbal terdepan dan terpercaya di Indonesia, yang dikenal sebagai tempat lahirnya pemimpin-pemimpin hebat, serta memiliki jaringan kantor cabang yang luas, kokoh, dan membawa manfaat kesehatan serta kesejahteraan bagi masyarakat luas.
              </p>
            </div>
            
            {/* Mission Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll">
              {/* Mission 1 */}
              <div className="p-8 bg-white/60 backdrop-blur-md rounded-2xl border border-[#c3c8c1]/30 hover:border-[#061b0e] transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#d0e9d4] flex items-center justify-center text-[#061b0e] font-bold">1</span>
                  <h4 className="font-bold text-[#061b0e] text-lg">Kembangkan Potensi</h4>
                </div>
                <p className="text-[14px] text-[#434843] leading-relaxed">
                  Memberikan pelatihan berkualitas dan jenjang karir yang jelas bagi seluruh tim agar setiap orang bisa tumbuh dan siap memimpin.
                </p>
              </div>
              
              {/* Mission 2 */}
              <div className="p-8 bg-white/60 backdrop-blur-md rounded-2xl border border-[#c3c8c1]/30 hover:border-[#061b0e] transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#d0e9d4] flex items-center justify-center text-[#061b0e] font-bold">2</span>
                  <h4 className="font-bold text-[#061b0e] text-lg">Perluas Jangkauan</h4>
                </div>
                <p className="text-[14px] text-[#434843] leading-relaxed">
                  Membuka kantor cabang di berbagai daerah agar produk herbal berkualitas semakin mudah dijangkau seluruh masyarakat.
                </p>
              </div>
              
              {/* Mission 3 */}
              <div className="p-8 bg-white/60 backdrop-blur-md rounded-2xl border border-[#c3c8c1]/30 hover:border-[#061b0e] transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#d0e9d4] flex items-center justify-center text-[#061b0e] font-bold">3</span>
                  <h4 className="font-bold text-[#061b0e] text-lg">Pemasaran Modern</h4>
                </div>
                <p className="text-[14px] text-[#434843] leading-relaxed">
                  Gunakan strategi pemasaran terkini agar kekayaan alam Nusantara diterima dan dicintai generasi sekarang.
                </p>
              </div>
              
              {/* Mission 4 */}
              <div className="p-8 bg-white/60 backdrop-blur-md rounded-2xl border border-[#c3c8c1]/30 hover:border-[#061b0e] transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#d0e9d4] flex items-center justify-center text-[#061b0e] font-bold">4</span>
                  <h4 className="font-bold text-[#061b0e] text-lg">Kualitas &amp; Kepercayaan</h4>
                </div>
                <p className="text-[14px] text-[#434843] leading-relaxed">
                  Hanya memasarkan produk bersertifikasi resmi, halal, dan teruji demi ketenangan hati konsumen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 bg-[#f2f4f2]" id="products">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="w-full">
              <span className="text-[#4a654f] font-label-caps text-sm uppercase tracking-wider mb-2 block">Premium Wellness Selection</span>
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-[#061b0e]">Produk Kesehatan Pilihan</h2>
              <p className="text-[#434843] mt-4 text-[16px]">Solusi alami yang didukung oleh ilmu pengetahuan untuk menunjang performa dan vitalitas Anda setiap hari.</p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-[#061b0e]/30 flex items-center justify-center hover:bg-[#061b0e]/5 transition-all"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="w-12 h-12 rounded-full border border-[#061b0e]/30 flex items-center justify-center hover:bg-[#061b0e]/5 transition-all"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
          <div className="flex flex-col gap-12">
            {products.map((product, index) => (
              <section
                key={index}
                className="w-full bg-white/60 backdrop-blur-md border border-[#c3c8c1]/30 rounded-3xl p-8 md:p-12 animate-on-scroll"
              >
                <div
                  className={`flex flex-col md:flex-row gap-12 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Product Image */}
                  <div className="flex justify-center shrink-0 w-full md:w-[350px]">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c3c8c1]/10 flex items-center justify-center w-full aspect-square">
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 350px"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full flex flex-col">
                    <span className="uppercase tracking-widest text-[#4a654f] text-xs font-semibold">
                      {product.tag}
                    </span>

                    <h2 className="mt-4 font-serif text-[28px] md:text-[36px] font-bold text-[#061b0e] leading-tight">
                      {product.title}
                    </h2>

                    <p className="mt-6 text-[16px] text-[#434843] leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-8 space-y-4">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2
                            size={22}
                            className="text-[#4a654f] shrink-0 mt-0.5"
                          />
                          <p className="text-[16px] text-[#434843]">
                            <span className="font-bold text-[#061b0e]">{feature.label}:</span>{" "}
                            {feature.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 bg-[#061b0e] relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
        </div>
        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative z-10 text-center">
          <h2 className="font-serif text-[40px] md:text-[56px] font-semibold mb-6">Siap Menjadi Pemimpin Berikutnya?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed">
            Bergabunglah dengan ekosistem NexGen.id dan mulailah perjalanan Anda menuju kesuksesan yang berkelanjutan dan kesehatan yang prima.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/dashboard/auth/login" className="bg-white text-[#061b0e] h-[48px] px-8 rounded-full flex items-center justify-center font-semibold hover:shadow-xl transition-all">
              Hubungi Kami
            </Link>
            <Link href="/dashboard/auth/login" className="bg-white/10 backdrop-blur-md border border-white/20 h-[48px] px-8 rounded-full flex items-center justify-center font-semibold hover:bg-white/20 transition-all">
              Pelajari Program
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#f8faf8] border-t border-[#c3c8c1]/30 py-12 px-5 md:px-6" id="contact">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-serif text-[32px] font-bold text-[#061b0e]">NexGen.id</span>
            <p className="text-[14px] text-[#434843] text-center md:text-left w-full">
              © 2024 NexGen.id. Health and Leadership Development. Dedikasi untuk kemajuan bangsa.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-[#434843] hover:text-[#061b0e] underline transition-all text-sm" href="#">Privacy Policy</a>
            <a className="text-[#434843] hover:text-[#061b0e] underline transition-all text-sm" href="#">Terms of Service</a>
            <a className="text-[#434843] hover:text-[#061b0e] underline transition-all text-sm" href="#">Contact Us</a>
            <a className="text-[#434843] hover:text-[#061b0e] underline transition-all text-sm" href="#">Instagram</a>
            <a className="text-[#434843] hover:text-[#061b0e] underline transition-all text-sm" href="#">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}