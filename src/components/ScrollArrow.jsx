import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollArrow() {
  const pathRef  = useRef(null);
  const headRef  = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const head = headRef.current;
    if (!path || !head) return;

    const init = () => {
      const len = path.getTotalLength();
      if (!len) return;

      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(head, { opacity: 0 });

      // Flèche se dessine exactement avec le scroll (scrub: 1 = léger lissage)
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Pointe apparaît quand la flèche atteint ~90%
      gsap.to(head, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "86% top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Sync ScrollTrigger avec Lenis
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    };

    const timerId = setTimeout(() => { init(); }, 200);

    return () => {
      clearTimeout(timerId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div style={{
      position: "absolute", top: 0, left: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 20,
      overflow: "visible",
    }}>
      <svg
        viewBox="0 0 100 400"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        {/*
          Chemin sinueux — centre x=50, oscille entre x=18 et x=82
          Chaque S-curve couvre exactement 100 unités (= 1 section = 100vh)
        */}
        <path
          ref={pathRef}
          d="M 50 1
             C 18 33, 82 67, 50 100
             C 18 133, 82 167, 50 200
             C 18 233, 82 267, 50 300
             C 18 333, 82 367, 50 398"
          fill="none"
          stroke="#0E9F6E"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Pointe de flèche */}
        <path
          ref={headRef}
          d="M 42 390 L 50 400 L 58 390"
          fill="none"
          stroke="#0E9F6E"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
