// Pure SVG charts for IELTS Writing Task 1 — no external dependencies

// ─── Chart 1: Library Visits Bar Chart ───────────────────────────────────────

function LibraryBarChart() {
  const W = 560, H = 295, L = 62, R = 16, T = 28, B = 48;
  const plotW = W - L - R; // 482
  const plotH = H - T - B; // 219
  const MAX = 2400;
  const yBase = T + plotH; // 247
  const yOf = (v: number) => yBase - (v / MAX) * plotH;
  const hOf = (v: number) => (v / MAX) * plotH;

  const bars = [
    { label: 'Jan', v: 1200 },
    { label: 'Feb', v: 950 },
    { label: 'Mar', v: 1400 },
    { label: 'Apr', v: 1800 },
    { label: 'May', v: 2100 },
    { label: 'Jun', v: 1600 },
  ];
  const groupW = plotW / bars.length; // ~80.3
  const barW = 48;
  const xOf = (i: number) => L + i * groupW + (groupW - barW) / 2;
  const ticks = [0, 400, 800, 1200, 1600, 2000, 2400];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Bar chart showing monthly library visits">
      {/* Grid lines */}
      {ticks.map(v => (
        <line key={v} x1={L} x2={L + plotW} y1={yOf(v)} y2={yOf(v)} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {/* Axes */}
      <line x1={L} y1={T} x2={L} y2={yBase} stroke="#6b7280" strokeWidth="1.5" />
      <line x1={L} y1={yBase} x2={L + plotW} y2={yBase} stroke="#6b7280" strokeWidth="1.5" />
      {/* Y ticks + labels */}
      {ticks.map(v => (
        <g key={v}>
          <line x1={L - 4} y1={yOf(v)} x2={L} y2={yOf(v)} stroke="#6b7280" strokeWidth="1" />
          <text x={L - 7} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#6b7280">
            {v === 0 ? '0' : v.toLocaleString()}
          </text>
        </g>
      ))}
      {/* Y axis label */}
      <text transform={`translate(12,${T + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="10" fill="#6b7280">
        Visitors
      </text>
      {/* Bars */}
      {bars.map((d, i) => (
        <g key={d.label}>
          <rect x={xOf(i)} y={yOf(d.v)} width={barW} height={hOf(d.v)} fill="#2563eb" rx="2" opacity="0.82" />
          <text x={xOf(i) + barW / 2} y={yOf(d.v) - 5} textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="600">
            {d.v.toLocaleString()}
          </text>
          <text x={xOf(i) + barW / 2} y={yBase + 16} textAnchor="middle" fontSize="12" fill="#374151">
            {d.label}
          </text>
        </g>
      ))}
      {/* Chart title */}
      <text x={L + plotW / 2} y={15} textAnchor="middle" fontSize="12" fontWeight="600" fill="#111827">
        Monthly Library Visits (Jan – Jun)
      </text>
    </svg>
  );
}

// ─── Chart 2: Renewable Energy Line Graph ────────────────────────────────────

function RenewableLineChart() {
  const W = 580, H = 305, L = 55, R = 108, T = 28, B = 50;
  const plotW = W - L - R; // 417
  const plotH = H - T - B; // 227
  const MAX = 80;
  const yBase = T + plotH; // 255
  const xOf = (i: number) => L + (i / 4) * plotW;
  const yOf = (v: number) => yBase - (v / MAX) * plotH;

  const years = [2000, 2005, 2010, 2015, 2020];
  const series = [
    { label: 'Germany', color: '#2563eb', data: [5, 12, 18, 32, 45] },
    { label: 'UK',      color: '#dc2626', data: [2, 4,  8, 22, 38] },
    { label: 'India',   color: '#16a34a', data: [1, 3,  7, 14, 22] },
    { label: 'Brazil',  color: '#ea580c', data: [60, 63, 65, 69, 72] },
  ];
  const yTicks = [0, 20, 40, 60, 80];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Line chart: Renewable energy production by country 2000-2020">
      {/* Grid */}
      {yTicks.map(v => (
        <line key={v} x1={L} x2={L + plotW} y1={yOf(v)} y2={yOf(v)} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {/* Axes */}
      <line x1={L} y1={T} x2={L} y2={yBase} stroke="#6b7280" strokeWidth="1.5" />
      <line x1={L} y1={yBase} x2={L + plotW} y2={yBase} stroke="#6b7280" strokeWidth="1.5" />
      {/* Y labels */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={L - 4} y1={yOf(v)} x2={L} y2={yOf(v)} stroke="#6b7280" strokeWidth="1" />
          <text x={L - 7} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#6b7280">{v}%</text>
        </g>
      ))}
      {/* Y axis label */}
      <text transform={`translate(12,${T + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="10" fill="#6b7280">
        % from Renewables
      </text>
      {/* X labels + ticks */}
      {years.map((yr, i) => (
        <g key={yr}>
          <line x1={xOf(i)} y1={yBase} x2={xOf(i)} y2={yBase + 4} stroke="#6b7280" strokeWidth="1" />
          <text x={xOf(i)} y={yBase + 16} textAnchor="middle" fontSize="11" fill="#374151">{yr}</text>
        </g>
      ))}
      {/* Lines + dots */}
      {series.map(s => {
        const pts = s.data.map((v, i) => `${xOf(i)},${yOf(v)}`).join(' ');
        return (
          <g key={s.label}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={xOf(i)} cy={yOf(v)} r="4" fill="white" stroke={s.color} strokeWidth="2" />
            ))}
          </g>
        );
      })}
      {/* Legend (right side) */}
      {series.map((s, i) => (
        <g key={s.label} transform={`translate(${L + plotW + 10},${T + 18 + i * 24})`}>
          <line x1={0} y1={0} x2={22} y2={0} stroke={s.color} strokeWidth="2.5" />
          <circle cx={11} cy={0} r="3.5" fill="white" stroke={s.color} strokeWidth="2" />
          <text x={28} y={4} fontSize="11" fill="#374151">{s.label}</text>
        </g>
      ))}
      {/* Title */}
      <text x={L + plotW / 2} y={15} textAnchor="middle" fontSize="12" fontWeight="600" fill="#111827">
        Renewable Electricity by Country (2000–2020)
      </text>
    </svg>
  );
}

// ─── Chart 3: Urban Population + Infrastructure Combo ────────────────────────

function UrbanComboChart() {
  const W = 640, H = 345, L = 68, R = 76, T = 35, B = 72;
  const plotW = W - L - R; // 496
  const plotH = H - T - B; // 238
  const MAX = 25;
  const yBase = T + plotH; // 273
  const yOf = (v: number) => yBase - (v / MAX) * plotH;
  const hOf = (v: number) => (v / MAX) * plotH;

  const years = ['2005', '2010', '2015', '2020', '2025'];
  const N = years.length;
  const groupW = plotW / N; // 99.2
  const barW = 16, barGap = 3;
  const clusterW = 3 * barW + 2 * barGap; // 54
  const barX = (yi: number, ci: number) =>
    L + yi * groupW + (groupW - clusterW) / 2 + ci * (barW + barGap);
  const lineX = (yi: number) => L + yi * groupW + groupW / 2;

  const cities = [
    {
      name: 'Singapore', color: '#2563eb',
      spending:   [8,  12,  15,  19,  22],
      population: [5.5, 5.6, 5.7, 5.8, 5.9],
    },
    {
      name: 'Mumbai', color: '#ea580c',
      spending:   [3,  4,   6,   7.5, 9],
      population: [18, 19,  20,  21,  22],
    },
    {
      name: 'Bangkok', color: '#16a34a',
      spending:   [2,  3,   4.5, 6,   7],
      population: [10, 10.5, 11, 11.5, 12],
    },
  ];
  const yTicks = [0, 5, 10, 15, 20, 25];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Combo chart: Urban population and infrastructure spending, Singapore Mumbai Bangkok 2005-2025">
      {/* Grid */}
      {yTicks.map(v => (
        <line key={v} x1={L} x2={L + plotW} y1={yOf(v)} y2={yOf(v)} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {/* Axes */}
      <line x1={L} y1={T} x2={L} y2={yBase} stroke="#6b7280" strokeWidth="1.5" />
      <line x1={L} y1={yBase} x2={L + plotW} y2={yBase} stroke="#6b7280" strokeWidth="1.5" />
      <line x1={L + plotW} y1={T} x2={L + plotW} y2={yBase} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,3" />
      {/* Left Y labels — spending */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={L - 4} y1={yOf(v)} x2={L} y2={yOf(v)} stroke="#6b7280" strokeWidth="1" />
          <text x={L - 7} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#6b7280">${v}bn</text>
        </g>
      ))}
      {/* Right Y labels — population */}
      {yTicks.map(v => (
        <text key={v} x={L + plotW + 6} y={yOf(v) + 4} fontSize="10" fill="#6b7280">{v}M</text>
      ))}
      {/* Left axis label */}
      <text transform={`translate(13,${T + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="600">
        Spending ($bn) — bars
      </text>
      {/* Right axis label */}
      <text transform={`translate(${W - 12},${T + plotH / 2}) rotate(90)`} textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="600">
        Population (M) — lines
      </text>
      {/* X labels */}
      {years.map((yr, i) => (
        <text key={yr} x={lineX(i)} y={yBase + 16} textAnchor="middle" fontSize="11" fill="#374151">{yr}</text>
      ))}
      {/* Grouped bars — spending */}
      {cities.map((city, ci) =>
        years.map((_, yi) => (
          <rect
            key={`b-${ci}-${yi}`}
            x={barX(yi, ci)}
            y={yOf(city.spending[yi])}
            width={barW}
            height={hOf(city.spending[yi])}
            fill={city.color}
            opacity="0.72"
            rx="1"
          />
        ))
      )}
      {/* Population lines */}
      {cities.map(city => {
        const pts = city.population.map((v, i) => `${lineX(i)},${yOf(v)}`).join(' ');
        return (
          <g key={`l-${city.name}`}>
            <polyline points={pts} fill="none" stroke={city.color} strokeWidth="2.5" strokeDasharray="7,3" strokeLinejoin="round" />
            {city.population.map((v, i) => (
              <circle key={i} cx={lineX(i)} cy={yOf(v)} r="3.5" fill="white" stroke={city.color} strokeWidth="2" />
            ))}
          </g>
        );
      })}
      {/* Legend */}
      {cities.map((city, i) => {
        const lx = L + i * (plotW / 3);
        const ly = yBase + 38;
        return (
          <g key={`lg-${city.name}`}>
            <rect x={lx} y={ly - 7} width={13} height={12} fill={city.color} opacity="0.72" rx="1" />
            <line x1={lx + 20} y1={ly - 1} x2={lx + 40} y2={ly - 1} stroke={city.color} strokeWidth="2.5" strokeDasharray="6,2" />
            <circle cx={lx + 30} cy={ly - 1} r="3" fill="white" stroke={city.color} strokeWidth="2" />
            <text x={lx + 46} y={ly + 3} fontSize="11" fill="#374151">{city.name}</text>
          </g>
        );
      })}
      <text x={L} y={yBase + 60} fontSize="9.5" fill="#9ca3af">
        ▪ Solid bars = Infrastructure Spending ($bn, left axis)   ‒ ‒ Dashed lines = Population (millions, right axis)
      </text>
      {/* Title */}
      <text x={L + plotW / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="600" fill="#111827">
        Urban Population {'&'} Infrastructure Spending — Singapore, Mumbai, Bangkok (2005–2025)
      </text>
    </svg>
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────

interface Props {
  chartKey: string;
  className?: string;
}

export default function WritingChart({ chartKey, className }: Props) {
  return (
    <div className={className}>
      {chartKey === 'library-bar'    && <LibraryBarChart />}
      {chartKey === 'renewable-line' && <RenewableLineChart />}
      {chartKey === 'urban-combo'    && <UrbanComboChart />}
    </div>
  );
}
