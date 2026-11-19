// Homepage: hero bike carousel, part-ex / sell toggle, scroll reveal
(function(){
  function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero bike carousel
  var hs=document.querySelector('.hstage');
  if(hs){
    var sl=$$('.hslide',hs),dt=$$('.hdots button',hs),cur=0,timer;
    function go(n){sl[cur].classList.remove('on');dt[cur].classList.remove('on');cur=(n+sl.length)%sl.length;sl[cur].classList.add('on');dt[cur].classList.add('on');}
    function start(){if(!reduce){stop();timer=setInterval(function(){go(cur+1);},2000);}}
    function stop(){if(timer)clearInterval(timer);}
    dt.forEach(function(b,i){b.addEventListener('click',function(){go(i);start();});});
    hs.addEventListener('mouseenter',stop);hs.addEventListener('mouseleave',start);
    start();
  }

  // Part-exchange / Sell toggle
  var vb=document.querySelector('.valbox .vtabs');
  if(vb){
    $$('button',vb).forEach(function(b){b.addEventListener('click',function(){
      var v=b.dataset.v;$$('button',vb).forEach(function(x){x.classList.toggle('on',x===b);});
      $$('.vp').forEach(function(p){p.hidden=p.dataset.v!==v;});
      var box=vb.closest('.valbox');var h=box.querySelector('h3[data-px]');var btn=box.querySelector('button[data-px]');
      if(h)h.textContent=h.dataset[v];if(btn)btn.querySelector('span').textContent=btn.dataset[v];
    });});
  }

  // Gentle scroll reveal for home sections
  if('IntersectionObserver' in window && !reduce){
    var els=$$('.why-i, .budget .bud, .stock .bc, .tiers .tier');
    els.forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=((i%4)*80)+'ms';});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);var t0=e.target;setTimeout(function(){t0.style.transitionDelay='';t0.classList.remove('rv','in');},900);}});},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el);});
  }
})();
