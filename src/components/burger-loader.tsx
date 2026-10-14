const seeds = [
  [0.2, 3.5, 30], [0.5, 6.5, 148], [0.8, 9.5, 210], [0.4, 12.5, 92],
  [1.2, 1.5, 276], [1.5, 4.9, 316], [1.8, 7.8, 143], [1.5, 11.2, 269],
  [1.7, 14, 318], [2.4, 0, 126], [2.6, 2.6, 56], [3.3, 5.6, 251],
  [3.2, 9.5, 76], [2.5, 12.5, 203], [3.1, 15.4, 178], [4.2, -1.1, 292],
  [3.9, 1.2, 2], [4.5, 3.5, 107], [4.2, 7.8, 210], [4.1, 11.5, 116],
  [4.4, 14.1, 65],
] as const;

export function BurgerLoader({ label = "Loading recipes", size = 8 }: { label?: string; size?: number }) {
  return (
    <div className="takeout-loader" role="status" aria-label={label}>
      <div className="takeout-box" style={{ fontSize: size }} aria-hidden="true">
        <div className="takeout-piece takeout-top">
          {seeds.map(([top, left, rotation]) => (
            <i key={`${top}-${left}`} className="takeout-seed" style={{ top: `${top}em`, left: `${left}em`, rotate: `${rotation}deg` }} />
          ))}
        </div>
        <div className="takeout-piece takeout-lettuce" />
        <div className="takeout-piece takeout-tomato" />
        <div className="takeout-piece takeout-cheese" />
        <div className="takeout-piece takeout-patty" />
        <div className="takeout-piece takeout-bottom" />
      </div>
      <span className="loader-caption">{label}…</span>
    </div>
  );
}
