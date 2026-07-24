export default function RigIllustration() {
  return (
    <svg
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <style>{`
        .beam-pivot {
          transform-box: fill-box;
          transform-origin: 100% 50%;
          animation: pj-rock 2.6s ease-in-out infinite;
        }
        @keyframes pj-rock {
          0%, 100% { transform: rotate(-13deg); }
          50% { transform: rotate(13deg); }
        }
        .flame {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: pj-flicker 0.5s ease-in-out infinite alternate;
        }
        @keyframes pj-flicker {
          0% { transform: scaleY(1) scaleX(1); opacity: 1; }
          100% { transform: scaleY(1.18) scaleX(0.9); opacity: 0.85; }
        }
        .smoke-puff {
          animation: pj-smoke 4s ease-out infinite;
        }
        @keyframes pj-smoke {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          100% { transform: translateY(-90px) scale(2.1); opacity: 0; }
        }
        .rig-light {
          animation: pj-twinkle 2.8s ease-in-out infinite;
        }
        @keyframes pj-twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `}</style>

      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0908" />
          <stop offset="55%" stopColor="#1B120C" />
          <stop offset="100%" stopColor="#3A2115" />
        </linearGradient>
        <radialGradient id="flareGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="600" fill="url(#skyGrad)" />

      {/* distant refinery skyline */}
      <g fill="#17130F" stroke="#2E2620" strokeWidth="1.5">
        <rect x="60" y="380" width="26" height="140" />
        <rect x="100" y="340" width="18" height="180" />
        <circle cx="180" cy="470" r="46" />
        <rect x="150" y="470" width="60" height="50" />
        <circle cx="270" cy="480" r="34" />
        <rect x="250" y="480" width="40" height="40" />
        <rect x="330" y="360" width="14" height="160" />
        <rect x="360" y="390" width="14" height="130" />
        <rect x="900" y="400" width="16" height="120" />
        <rect x="935" y="365" width="20" height="155" />
        <circle cx="1020" cy="475" r="40" />
        <rect x="995" y="475" width="50" height="45" />
        <rect x="1080" y="385" width="14" height="135" />
        <rect x="1110" y="410" width="14" height="110" />
      </g>

      {/* twinkling rig lights */}
      {[
        [104, 345], [335, 365], [905, 405], [940, 370], [1085, 390], [1115, 415], [185, 430], [1015, 435],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.6"
          fill="#EDB35C"
          className="rig-light"
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}

      {/* connecting pipe along the ground */}
      <rect x="0" y="520" width="1200" height="6" fill="#2E2620" />
      <g fill="#3A322A">
        {Array.from({ length: 40 }).map((_, i) => (
          <rect key={i} x={i * 30 + 4} y="518" width="4" height="10" />
        ))}
      </g>

      {/* flare stack, right of center */}
      <g>
        <rect x="850" y="260" width="10" height="260" fill="#221B15" />
        <rect x="838" y="248" width="34" height="14" fill="#221B15" />
        <circle cx="855" cy="230" r="70" fill="url(#flareGlow)" className="animate-pulse" />
        <path
          d="M855,255 C845,235 848,215 855,195 C862,215 866,232 855,255 Z"
          fill="#FF6B35"
          className="flame"
        />
        <path
          d="M855,248 C850,236 851,224 855,212 C860,224 861,236 855,248 Z"
          fill="#FFC46B"
          className="flame"
          style={{ animationDelay: "0.15s" }}
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={855 + i * 4}
            cy={190 - i * 10}
            r={10 + i * 4}
            fill="#4A4038"
            className="smoke-puff"
            style={{ animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </g>

      {/* pumpjack, foreground left-of-center */}
      <g transform="translate(300, 340)">
        {/* base */}
        <polygon points="-70,180 70,180 45,120 -45,120" fill="#221B15" />
        {/* samson post */}
        <rect x="-8" y="-40" width="16" height="160" fill="#2E2620" />
        <rect x="-50" y="110" width="16" height="70" fill="#2E2620" />
        <rect x="34" y="110" width="16" height="70" fill="#2E2620" />
        {/* walking beam group (rocks) */}
        <g className="beam-pivot" style={{ transformOrigin: "0px -40px" }}>
          <rect x="-95" y="-48" width="190" height="14" rx="4" fill="#3A322A" />
          {/* horsehead */}
          <path d="M-95,-41 C-115,-41 -128,-30 -128,-14 L-100,-14 Z" fill="#3A322A" />
          {/* counterweight */}
          <circle cx="80" cy="-41" r="16" fill="#D99A3D" />
        </g>
        {/* pitman arm + crank (simplified static suggestion of motion) */}
        <rect x="-4" y="-50" width="8" height="14" fill="#3A322A" />
      </g>

      {/* derrick / drilling tower, background right of pumpjack */}
      <g transform="translate(560, 260)" stroke="#2E2620" strokeWidth="4" fill="none">
        <path d="M0,260 L40,0 L80,260" />
        <path d="M10,220 L70,220 M14,180 L66,180 M18,140 L62,140 M22,100 L58,100 M26,60 L54,60" />
      </g>

      <rect x="0" y="524" width="1200" height="76" fill="#0A0908" />
    </svg>
  );
}
