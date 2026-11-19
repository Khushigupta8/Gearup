// Shop by style: bikes ride in when the section scrolls into view
(function(){
  var g=document.querySelector('.styles2');
  if(!g||!('IntersectionObserver' in window))return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  g.classList.add('ridein');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.disconnect();g.classList.add('go');setTimeout(function(){g.classList.remove('ridein','go');},1700);}});},{rootMargin:'0px 0px -15% 0px'});
  io.observe(g);
})();
