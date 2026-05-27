// Wires mouse/touch events on the canvas to renderer + app callbacks

export function initControls({ canvas, renderer, onTileClick, onHover }) {
  let dragging  = false;
  let moved     = false;
  let startX    = 0, startY = 0;
  let panStartX = 0, panStartY = 0;

  const rect = () => canvas.getBoundingClientRect();

  function logical(clientX, clientY) {
    const r = rect();
    return { x: clientX - r.left, y: clientY - r.top };
  }

  // ── Mouse ──

  canvas.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    dragging = true;
    moved    = false;
    const { x, y } = logical(e.clientX, e.clientY);
    startX = x;  startY = y;
    panStartX = renderer.pan.x;
    panStartY = renderer.pan.y;
    canvas.classList.remove('can-grab', 'hovering');
    canvas.classList.add('grabbing');
  });

  window.addEventListener('mousemove', e => {
    if (dragging) {
      const { x, y } = logical(e.clientX, e.clientY);
      const dx = x - startX, dy = y - startY;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      renderer.setPan(panStartX + dx, panStartY + dy);
    } else {
      const { x, y } = logical(e.clientX, e.clientY);
      const id = renderer.hitTest(x, y);
      renderer.setHovered(id);
      onHover?.(id, e.clientX, e.clientY);
      canvas.className = id ? 'hovering' : 'can-grab';
    }
  });

  window.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('grabbing');
    canvas.classList.add('can-grab');
    if (!moved) {
      const { x, y } = logical(e.clientX, e.clientY);
      const id = renderer.hitTest(x, y);
      if (id) onTileClick(id);
    }
  });

  canvas.addEventListener('mouseleave', () => {
    renderer.setHovered(null);
    onHover?.(null);
  });

  // ── Touch ──

  let touchId  = null;
  let touchStartX = 0, touchStartY = 0;

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    touchId = t.identifier;
    const { x, y } = logical(t.clientX, t.clientY);
    dragging = true; moved = false;
    startX = x; startY = y;
    panStartX = renderer.pan.x;
    panStartY = renderer.pan.y;
    touchStartX = x; touchStartY = y;
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = [...e.changedTouches].find(t => t.identifier === touchId);
    if (!t || !dragging) return;
    const { x, y } = logical(t.clientX, t.clientY);
    const dx = x - startX, dy = y - startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
    renderer.setPan(panStartX + dx, panStartY + dy);
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    const t = [...e.changedTouches].find(t => t.identifier === touchId);
    if (!t) return;
    dragging = false;
    if (!moved) {
      const { x, y } = logical(t.clientX, t.clientY);
      const id = renderer.hitTest(x, y);
      if (id) onTileClick(id);
    }
    touchId = null;
  });

  // ── Resize ──

  const ro = new ResizeObserver(() => renderer._resize());
  ro.observe(canvas);

  return { destroy: () => ro.disconnect() };
}
