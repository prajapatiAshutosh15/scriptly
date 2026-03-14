"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button, Space } from "antd";
import { EditOutlined, ReadOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=700&fit=crop&q=80",
    title: "Write to think.",
    subtitle: "Publish to connect.",
    description: "A community of developers, engineers, and tech leaders who blog to share ideas, grow their skills, and build their reputation.",
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=700&fit=crop&q=80",
    title: "Share your knowledge.",
    subtitle: "Inspire the world.",
    description: "Write technical articles, tutorials, and insights that help millions of developers learn and grow every day.",
  },
  {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=700&fit=crop&q=80",
    title: "Code. Write. Repeat.",
    subtitle: "Build your reputation.",
    description: "Join a thriving community of builders who document their journey, share solutions, and grow their personal brand.",
  },
  {
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1920&h=700&fit=crop&q=80",
    title: "From ideas to impact.",
    subtitle: "One blog at a time.",
    description: "Transform your thoughts into powerful articles that reach developers across the globe and spark meaningful conversations.",
  },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section style={{ position: "relative" }}>
      {/* Carousel */}
      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="hero-slide"
              style={{
                position: "relative",
                flex: "0 0 100%",
                minWidth: 0,
                height: 520,
              }}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Dark Overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.4) 100%)",
              }} />

              {/* Content */}
              <div style={{
                position: "relative",
                zIndex: 10,
                maxWidth: 1280,
                margin: "0 auto",
                padding: "0 24px",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}>
                <div className="hero-content" style={{ maxWidth: 640 }}>
                  <h1 style={{
                    color: "#ffffff",
                    fontSize: 48,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    margin: 0,
                    textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                  }}>
                    {slide.title}
                  </h1>
                  <h1 style={{
                    color: "#93c5fd",
                    fontSize: 48,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    margin: "8px 0 0 0",
                    textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                  }}>
                    {slide.subtitle}
                  </h1>
                  <p style={{
                    color: "rgba(226,232,240,0.9)",
                    fontSize: 17,
                    lineHeight: 1.7,
                    marginTop: 20,
                    maxWidth: 520,
                  }}>
                    {slide.description}
                  </p>

                  <Space size={16} style={{ marginTop: 28 }} className="hero-buttons">
                    <Link href="/write">
                      <Button
                        type="primary"
                        size="large"
                        icon={<EditOutlined />}
                        style={{
                          background: "#ffffff",
                          color: "#2563eb",
                          border: "none",
                          height: 48,
                          padding: "0 32px",
                          fontSize: 15,
                          fontWeight: 600,
                          borderRadius: 24,
                        }}
                      >
                        Start Your Blog
                      </Button>
                    </Link>
                    <Link href="/explore">
                      <Button
                        size="large"
                        icon={<ReadOutlined />}
                        ghost
                        style={{
                          height: 48,
                          padding: "0 32px",
                          fontSize: 15,
                          fontWeight: 600,
                          borderRadius: 24,
                          borderWidth: 2,
                          color: "#ffffff",
                        }}
                      >
                        Explore Articles
                      </Button>
                    </Link>
                  </Space>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        style={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
          fontSize: 16,
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        <LeftOutlined />
      </button>
      <button
        onClick={scrollNext}
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
          fontSize: 16,
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        <RightOutlined />
      </button>

      {/* Stats Bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          flexWrap: "wrap",
        }} className="hero-stats">
          {[
            { value: "50K+", label: "Active Writers" },
            { value: "1.2M", label: "Articles Published" },
            { value: "10M+", label: "Monthly Readers" },
          ].map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 48 }}>
              {i > 0 && <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>{stat.value}</span>
                <span style={{ fontSize: 13, color: "rgba(191,219,254,0.8)" }}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <DotIndicators emblaApi={emblaApi} slideCount={slides.length} />
    </section>
  );
}

function DotIndicators({ emblaApi, slideCount }) {
  const { selectedIndex, scrollSnaps } = useDotButton(emblaApi);

  return (
    <div style={{
      position: "absolute",
      bottom: 70,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 20,
      display: "flex",
      gap: 8,
    }}>
      {Array.from({ length: slideCount }).map((_, i) => (
        <button
          key={i}
          onClick={() => emblaApi?.scrollTo(i)}
          style={{
            width: selectedIndex === i ? 28 : 8,
            height: 8,
            borderRadius: 4,
            border: "none",
            background: selectedIndex === i ? "#ffffff" : "rgba(255,255,255,0.4)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

function useDotButton(emblaApi) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return { selectedIndex, scrollSnaps };
}

