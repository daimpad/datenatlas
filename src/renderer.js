// ── Color helpers ─────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : [128,128,128];
}

function tint(hex, factor) {
  const [r,g,b] = hexToRgb(hex);
  const c = (v, f) => Math.round(Math.max(0, Math.min(255, v * f)));
  return `rgb(${c(r,factor)},${c(g,factor)},${c(b,factor)})`;
}

function rgba(hex, a) {
  const [r,g,b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// ── Text wrapping ─────────────────────────────────────────────────────────────

function wrapText(ctx, text, maxW, maxLines = 2) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  // Truncate last line if text was cut
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.slice(0, -1) + '…';
  }
  return lines;
}

// ── Polygon hit test ──────────────────────────────────────────────────────────

function pointInPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

// ── IsometricRenderer ─────────────────────────────────────────────────────────

export class IsometricRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.tiles  = [];       // [{id,name,color,col,row,...}]
    this.cols   = 0;
    this.rows   = 0;
    this.W      = 160;      // tile diamond width
    this.H      = 80;       // tile diamond height (= W/2)
    this.D      = 28;       // box depth (side face height)
    this.pan    = { x: 0, y: 0 };
    this.hov    = null;     // hovered tile id
    this.alpha  = 1;        // global fade (0-1) for transitions
    this.dirty  = true;
    this._raf   = null;

    this._resize();
    this._loop();
  }

  _resize() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.lW = rect.width  || this.canvas.offsetWidth;
    this.lH = rect.height || this.canvas.offsetHeight;
    this.canvas.width  = this.lW * dpr;
    this.canvas.height = this.lH * dpr;
    this.ctx.scale(dpr, dpr);
    this.dirty = true;
  }

  // ── Public API ──

  setTiles(tiles) {
    const n    = tiles.length || 1;
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    this.cols  = cols;
    this.rows  = rows;
    this.tiles = tiles.map((t, i) => ({
      ...t,
      col: i % cols,
      row: Math.floor(i / cols),
    }));
    this.dirty = true;
  }

  setPan(x, y) {
    this.pan.x = x;
    this.pan.y = y;
    this.dirty = true;
  }

  setHovered(id) {
    if (this.hov !== id) { this.hov = id; this.dirty = true; }
  }

  setAlpha(a) {
    this.alpha = a;
    this.dirty = true;
  }

  // Return tile id at logical screen point (px, py), or null
  hitTest(px, py) {
    // Iterate tiles front-to-back (reverse painter order)
    const sorted = [...this.tiles].sort((a, b) => (b.col + b.row) - (a.col + a.row));
    for (const t of sorted) {
      const { tx, ty } = this._tilePos(t.col, t.row);
      const W = this.W, H = this.H, D = this.D;
      // Hexagonal bounding polygon: top-diamond + side faces
      const poly = [
        [tx,       ty],
        [tx+W/2,   ty+H/2],
        [tx+W/2,   ty+H/2+D],
        [tx,       ty+H+D],
        [tx-W/2,   ty+H/2+D],
        [tx-W/2,   ty+H/2],
      ];
      if (pointInPoly(px, py, poly)) return t.id;
    }
    return null;
  }

  // ── Rendering ──

  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    if (!this.dirty) return;
    this.dirty = false;
    this._draw();
  }

  _draw() {
    const { ctx, lW, lH, alpha } = this;
    ctx.clearRect(0, 0, lW, lH);
    if (!this.tiles.length) return;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Paint tiles back-to-front (ascending col+row)
    const sorted = [...this.tiles].sort((a, b) => (a.col + a.row) - (b.col + b.row));
    for (const t of sorted) {
      const { tx, ty } = this._tilePos(t.col, t.row);
      this._drawTile(ctx, tx, ty, t.color, t.name, t.id === this.hov);
    }

    ctx.restore();
  }

  _tilePos(col, row) {
    const { lW, lH, W, H, D, cols, rows, pan } = this;
    // Center the isometric grid visually on canvas
    const originX = lW / 2 + pan.x - (cols - rows) * W / 4;
    const originY = lH / 2 + pan.y - (cols + rows) * H / 4 - D / 2;
    const tx = originX + (col - row) * W / 2;
    const ty = originY + (col + row) * H / 2;
    return { tx, ty };
  }

  _drawTile(ctx, tx, ty, color, label, hovered) {
    const { W, H, D } = this;

    const topColor   = hovered ? tint(color, 1.35) : color;
    const rightColor = tint(color, 0.72);
    const leftColor  = tint(color, 0.52);
    const edgeAlpha  = hovered ? 0.45 : 0.2;

    // ── Right face ──
    ctx.beginPath();
    ctx.moveTo(tx + W/2, ty + H/2);
    ctx.lineTo(tx + W/2, ty + H/2 + D);
    ctx.lineTo(tx,       ty + H   + D);
    ctx.lineTo(tx,       ty + H      );
    ctx.closePath();
    ctx.fillStyle = rightColor;
    ctx.fill();
    ctx.strokeStyle = rgba(color, edgeAlpha);
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Left face ──
    ctx.beginPath();
    ctx.moveTo(tx - W/2, ty + H/2);
    ctx.lineTo(tx,       ty + H      );
    ctx.lineTo(tx,       ty + H   + D);
    ctx.lineTo(tx - W/2, ty + H/2 + D);
    ctx.closePath();
    ctx.fillStyle = leftColor;
    ctx.fill();
    ctx.strokeStyle = rgba(color, edgeAlpha);
    ctx.stroke();

    // ── Top face (diamond) ──
    ctx.beginPath();
    ctx.moveTo(tx,       ty        );
    ctx.lineTo(tx + W/2, ty + H/2  );
    ctx.lineTo(tx,       ty + H    );
    ctx.lineTo(tx - W/2, ty + H/2  );
    ctx.closePath();
    ctx.fillStyle = topColor;
    ctx.fill();
    ctx.strokeStyle = rgba('#ffffff', edgeAlpha);
    ctx.lineWidth = hovered ? 1.5 : 0.8;
    ctx.stroke();

    // ── Hover glow ring ──
    if (hovered) {
      ctx.beginPath();
      ctx.moveTo(tx,       ty        );
      ctx.lineTo(tx + W/2, ty + H/2  );
      ctx.lineTo(tx,       ty + H    );
      ctx.lineTo(tx - W/2, ty + H/2  );
      ctx.closePath();
      ctx.strokeStyle = rgba('#ffffff', 0.6);
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // ── Label ──
    this._drawLabel(ctx, tx, ty + H * 0.42, W * 0.74, label);
  }

  _drawLabel(ctx, cx, cy, maxW, text) {
    ctx.save();
    ctx.font = 'bold 11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapText(ctx, text, maxW, 2);
    const LH    = 14;
    const startY = cy - (lines.length - 1) * LH / 2;

    // Shadow for legibility
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur  = 4;
    ctx.fillStyle   = 'rgba(255,255,255,0.95)';

    lines.forEach((ln, i) => ctx.fillText(ln, cx, startY + i * LH));
    ctx.restore();
  }

  destroy() {
    cancelAnimationFrame(this._raf);
  }
}
