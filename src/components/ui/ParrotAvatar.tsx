"use client";

type Props = {
  talking?: boolean; // mỏ mở khép khi đang nói
  alert?: boolean; // chấm hồng khi bong bóng đang thu gọn
  onClick?: () => void;
};

export default function ParrotAvatar({
  talking = false,
  alert = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Chú vẹt hướng dẫn"
      className="relative h-[84px] w-[84px] shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 md:h-[96px] md:w-[96px]"
    >
      <span
        className="absolute inset-0"
        style={{ animation: "parrot-bob 3.2s ease-in-out infinite" }}
      >
        {/* bóng hồng + xanh lam */}
        <span className="absolute inset-0 -translate-x-[3px] -translate-y-[2px] rounded-full bg-[#ff5fa8]" />
        <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-[#6ecbf5]" />

        {/* huy hiệu tròn */}
        <span className="absolute inset-0 overflow-hidden rounded-full border-[3px] border-[#1a1030] bg-white">
          <svg
            viewBox="0 0 100 100"
            className={`h-full w-full ${talking ? "is-talking" : ""}`}
          >
            <defs>
              <radialGradient id="obg" cx="35%" cy="25%" r="85%">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#e4d9ff" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#obg)" />

            {/* mào lông */}
            <g
              className="parrot-crest"
              stroke="#1a1030"
              strokeWidth="1.8"
              strokeLinejoin="round"
            >
              <g transform="rotate(-32 50 44)">
                <path
                  d="M50 44C43 32 45 20 50 14C55 20 57 32 50 44Z"
                  fill="#ffb02e"
                />
              </g>
              <g transform="rotate(32 50 44)">
                <path
                  d="M50 44C43 32 45 20 50 14C55 20 57 32 50 44Z"
                  fill="#ffb02e"
                />
              </g>
              <path
                d="M50 46C42 30 44 14 50 6C56 14 58 30 50 46Z"
                fill="#ff7a3c"
              />
            </g>

            {/* thân + cánh xanh vàng */}
            <path
              d="M6 104Q8 80 34 76L66 76Q92 80 94 104Z"
              fill="#ff4f5e"
              stroke="#1a1030"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M7 104Q7 86 22 80Q20 94 26 104Z" fill="#3b82ff" />
            <path d="M12 104Q12 92 22 86Q20 96 22 104Z" fill="#ffd23f" />
            <g transform="translate(100 0) scale(-1 1)">
              <path d="M7 104Q7 86 22 80Q20 94 26 104Z" fill="#3b82ff" />
              <path d="M12 104Q12 92 22 86Q20 96 22 104Z" fill="#ffd23f" />
            </g>

            {/* đầu */}
            <circle
              cx="50"
              cy="52"
              r="30"
              fill="#ff4f5e"
              stroke="#1a1030"
              strokeWidth="2.2"
            />
            <ellipse
              cx="38"
              cy="36"
              rx="9"
              ry="4.5"
              fill="#fff"
              opacity="0.28"
              transform="rotate(-25 38 36)"
            />

            {/* mảng mặt trắng */}
            <ellipse cx="38" cy="53" rx="11" ry="10" fill="#fff8f0" />
            <ellipse cx="62" cy="53" rx="11" ry="10" fill="#fff8f0" />

            {/* mắt */}
            {[40, 60].map((cx) => (
              <g key={cx} className="parrot-eye">
                <circle cx={cx} cy="52" r="5.2" fill="#1a1030" />
                <circle cx={cx + 1.6} cy="50.2" r="1.8" fill="#fff" />
              </g>
            ))}

            {/* má hồng */}
            <circle cx="30" cy="64" r="3.6" fill="#ff7aa8" opacity="0.65" />
            <circle cx="70" cy="64" r="3.6" fill="#ff7aa8" opacity="0.65" />

            {/* miệng: bên trong + mỏ dưới (động) */}
            <ellipse cx="50" cy="73" rx="6" ry="3.5" fill="#3a1030" />
            <g className="parrot-lower">
              <ellipse
                cx="50"
                cy="76"
                rx="6.5"
                ry="4"
                fill="#e08a1c"
                stroke="#1a1030"
                strokeWidth="1.6"
              />
            </g>

            {/* mỏ trên */}
            <path
              d="M40 58Q50 47 60 58Q61 70 50 79Q39 70 40 58Z"
              fill="#ffc533"
              stroke="#1a1030"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <ellipse
              cx="46"
              cy="58"
              rx="3"
              ry="1.6"
              fill="#fff"
              opacity="0.6"
              transform="rotate(-30 46 58)"
            />
          </svg>
        </span>
      </span>

      {alert && (
        <span
          className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-[#1a1030] bg-[#ff5fa8]"
          style={{ animation: "ping-soft 1.4s ease-in-out infinite" }}
        />
      )}
    </button>
  );
}
