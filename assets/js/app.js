// İsim gizleme (sayfa genelinde)
document.addEventListener('DOMContentLoaded', () => {
  const map = [
    { re: /\bSaliha\b/g, rep: 'S…' },
    { re: /\bDeniz\b/g,  rep: 'D…' },
    { re: /\bEmine\b/g,  rep: 'Eşim Emine' }
  ];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) {
    let t = n.nodeValue; map.forEach(m => t = t.replace(m.re, m.rep)); n.nodeValue = t;
  }
});

// Atlas düğümlerinde tooltip
document.addEventListener('mousemove', (e)=>{
  const el =
