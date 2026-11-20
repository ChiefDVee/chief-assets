/* preview.js — ChiefMahjong preview page (local, file://). Renders via ChiefMahjong.mount (CSP-safe, no innerHTML). */
(function () {
  'use strict';
  var M = window.ChiefMahjong;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function tileCell(kind, opts, label) {
    var cell = el('div', 'cell'), holder = el('div');
    M.mount(holder, M.render({ kind: kind }, opts));
    cell.appendChild(holder);
    if (label) cell.appendChild(el('span', '', label));
    return cell;
  }

  /* states */
  var states = document.getElementById('states');
  [['normal', {}], ['selected', { selected: true }], ['hint', { hint: true }], ['blocked', { blocked: true }],
   ['no edge', { edge: false }]].forEach(function (s) {
    states.appendChild(tileCell('d-1', s[1], s[0]));
  });

  /* every kind per theme, size 60 and 40 */
  var themes = document.getElementById('themes');
  Object.keys(M.BUILTIN_THEMES).forEach(function (tid) {
    var theme = M.BUILTIN_THEMES[tid];
    themes.appendChild(el('h2', '', theme.name.en + ' (' + tid + ')'));
    [60, 40].forEach(function (size) {
      themes.appendChild(el('h3', '', 'size ' + size));
      var grid = el('div', 'grid');
      M.KINDS.forEach(function (k) { grid.appendChild(tileCell(k.id, { theme: tid, size: size }, size === 60 ? k.id : '')); });
      themes.appendChild(grid);
    });
  });

  /* 3-layer stacking example on the half-tile grid (tile = 2x2 units) */
  var SIZE = 48, g = M.geometry({ size: SIZE });
  var pos = [];
  var x, y;
  for (y = 0; y < 8; y += 2) for (x = 0; x < 12; x += 2) pos.push({ x: x, y: y, z: 0 });
  for (y = 1; y < 6; y += 2) for (x = 2; x < 10; x += 2) pos.push({ x: x, y: y, z: 1 });
  pos.push({ x: 4, y: 2, z: 2 }, { x: 6, y: 2, z: 2 }, { x: 5, y: 4, z: 2 });
  var kinds = M.KINDS.map(function (k) { return k.id; });

  function overlaps(a, b) { return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2; }
  function free(p, alive) {
    var left = false, right = false;
    for (var i = 0; i < pos.length; i++) {
      var q = pos[i];
      if (q === p || !alive[i]) continue;
      if (q.z === p.z + 1 && overlaps(p, q)) return false;
      if (q.z === p.z && Math.abs(q.y - p.y) < 2) {
        if (q.x === p.x - 2) left = true;
        if (q.x === p.x + 2) right = true;
      }
    }
    return !(left && right);
  }
  var board = document.getElementById('board');
  var alive = pos.map(function () { return true; });
  var selected = -1;
  var order = pos.map(function (_p, i) { return i; }).sort(function (a, b) {
    return (pos[a].z - pos[b].z) || (pos[a].y - pos[b].y) || (pos[a].x - pos[b].x);
  });
  board.style.height = (4 * g.faceHeight + g.edge * 3) + 'px';
  board.style.width = (6 * g.faceWidth + g.edge * 3) + 'px';
  function draw() {
    while (board.firstChild) board.removeChild(board.firstChild);
    order.forEach(function (i) {
      if (!alive[i]) return;
      var p = pos[i], d = el('div');
      d.style.left = (p.x * g.faceWidth / 2 - p.z * g.edge + 2 * g.edge) + 'px';
      d.style.top = (p.y * g.faceHeight / 2 - p.z * g.edge + 2 * g.edge) + 'px';
      var isFree = free(p, alive);
      M.mount(d, M.render({ kind: kinds[(i * 7) % kinds.length], id: i }, { size: SIZE, blocked: !isFree, selected: i === selected }));
      if (isFree) d.addEventListener('click', function () { selected = selected === i ? -1 : i; draw(); });
      board.appendChild(d);
    });
  }
  draw();
})();
