/* AulaFinder V39 · usa la planimetria originale e la ruota di 180°, mantenendo ogni stanza identica e leggibile. */
(()=>{
  'use strict';
  const NS='http://www.w3.org/2000/svg';

  document.querySelectorAll('#piantinaPage svg.plan').forEach(svg=>{
    if(svg.querySelector(':scope > g.plan-rotated')) return;

    const vb=svg.viewBox.baseVal;
    const mx=vb.x + vb.width / 2;
    const my=vb.y + vb.height / 2;

    const rotated=document.createElementNS(NS,'g');
    rotated.setAttribute('class','plan-rotated');
    rotated.setAttribute('transform',`rotate(180 ${mx} ${my})`);

    while(svg.firstChild) rotated.appendChild(svg.firstChild);
    svg.appendChild(rotated);

    // Mantiene ogni stanza IDENTICA alla mappa originale, ma spostata nella posizione ruotata.
    rotated.querySelectorAll('g.room').forEach(room=>{
      if(room.classList.contains('room-upright')) return;
      const cx=Number(room.dataset.cx);
      const cy=Number(room.dataset.cy);
      if(!Number.isFinite(cx) || !Number.isFinite(cy)) return;
      const prev=room.getAttribute('transform') || '';
      room.setAttribute('transform',`${prev} rotate(180 ${cx} ${cy})`.trim());
      room.classList.add('room-upright');
    });

    // Eventuali chip/overlay selezionati vengono creati dopo via JS: se esistono già, li raddrizziamo.
    rotated.querySelectorAll('g.sel-clone').forEach(room=>{
      const cx=Number(room.dataset.cx);
      const cy=Number(room.dataset.cy);
      if(!Number.isFinite(cx) || !Number.isFinite(cy)) return;
      const prev=room.getAttribute('transform') || '';
      room.setAttribute('transform',`${prev} rotate(180 ${cx} ${cy})`.trim());
    });
  });
})();
