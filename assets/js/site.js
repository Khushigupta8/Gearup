(function(){
  var R=Math.pow(1.199,1/12)-1;
  function pm(p,k){return p*R/(1-Math.pow(1+R,-k));}
  function gbp(v,d){return '£'+v.toLocaleString('en-GB',{minimumFractionDigits:d,maximumFractionDigits:d});}
  function $(s,c){return (c||document).querySelector(s);}
  function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}

  // Generic toggle groups: any container with [data-group] makes its buttons single-select
  $$('[data-group]').forEach(function(g){$$('button,.chip',g).forEach(function(b){b.addEventListener('click',function(){$$('button,.chip',g).forEach(function(x){x.classList.remove('on')});b.classList.add('on');});});});
  $$('.chips').forEach(function(g){$$('.chip',g).forEach(function(b){b.addEventListener('click',function(){$$('.chip',g).forEach(function(x){x.classList.remove('on')});b.classList.add('on');});});});

  // Tabs: .tabs[data-tabs] buttons with data-pane -> #id
  $$('.tabs').forEach(function(t){$$('button',t).forEach(function(b){b.addEventListener('click',function(){$$('button',t).forEach(function(x){x.classList.remove('on');var p=document.getElementById(x.dataset.pane);if(p)p.hidden=true;});b.classList.add('on');var p=document.getElementById(b.dataset.pane);if(p)p.hidden=false;});});});

  // Radio cards
  $$('.rcard input').forEach(function(i){i.addEventListener('change',function(){$$('input[name="'+i.name+'"]').forEach(function(x){x.closest('.rcard').classList.toggle('on',x.checked);});document.dispatchEvent(new Event('rcard'));});});

  // Search dock tabs (home)
  $$('.dock-tabs button').forEach(function(b){b.addEventListener('click',function(){$$('.dock-tabs button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');var pb=$('#p-buy'),pv=$('#p-val');if(pb)pb.hidden=b.dataset.t!=='buy';if(pv)pv.hidden=b.dataset.t!=='val';});});

  // Finance slider
  var rng=$('#rng');
  if(rng){var n=48,out=$('#rngOut'),mo=$('#moOut'),dep=$('#depRng'),depOut=$('#depOut');
    function upd(){var p=+rng.value,d=dep?+dep.value:0;out.textContent=gbp(p,0);if(depOut)depOut.textContent=gbp(d,0);var a=Math.max(p-d,0);mo.innerHTML=gbp(a?pm(a,n):0,2)+'<small>/month</small>';rng.style.setProperty('--p',((p-rng.min)/(rng.max-rng.min)*100)+'%');if(dep)dep.style.setProperty('--p',((d-dep.min)/(dep.max-dep.min)*100)+'%');var tp=$('#totOut');if(tp)tp.textContent=gbp(a?pm(a,n)*n+d:0,2);}
    rng.addEventListener('input',upd);if(dep)dep.addEventListener('input',upd);
    $$('.terms button').forEach(function(b){b.addEventListener('click',function(){$$('.terms button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');n=+b.dataset.n;upd();});});
    upd();}

  // Delivery quote (demo)
  window.quote=function(e,id,outId){e.preventDefault();var pc=($('#'+(id||'pc')).value||'').trim().toUpperCase(),o=$('#'+(outId||'qOut'));
    if(pc.length<2){o.textContent='Please enter a UK postcode.';return false;}
    var h=0;for(var i=0;i<pc.length;i++){h=(h*31+pc.charCodeAt(i))%997;}
    var miles=25+(h%260),price=Math.max(49,Math.round(miles*1.2));
    o.innerHTML='About <b>'+miles+' miles</b> away. Delivery: <b>£'+price+'</b><br><span style="font-size:12px">Demo figure. The live site uses real road distance.</span>';
    var dd=$('#delivFee');if(dd){dd.textContent='£'+price+'.00';var t=$('#dueNow');if(t)t.textContent=gbp((+(t.dataset.base||99))+price,2);}
    return false;};

  // Gallery
  var gm=$('.gal-main img');
  if(gm){$$('.thumbs div[data-src]').forEach(function(t){t.addEventListener('click',function(){gm.src=t.dataset.src;$$('.thumbs div').forEach(function(x){x.classList.remove('on')});t.classList.add('on');});});}

  // Checkout: delivery vs collection
  document.addEventListener('rcard',function(){var del=$('input[name="ful"][value="del"]');var box=$('#delBox');if(del&&box){box.hidden=!del.checked;var dd=$('#delivFee'),t=$('#dueNow');if(!del.checked&&dd){dd.textContent='£0.00';if(t)t.textContent=gbp(+(t.dataset.base||99),2);}}});

  // Mobile filters toggle
  var mf=$('.mfilter');if(mf){mf.addEventListener('click',function(){var f=$('.filters');f.style.display=f.style.display==='block'?'':'block';});}
})();

/* ===== v4 additions ===== */
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

/* Shop by style: bikes ride in once when the section comes into view */
(function(){
  var g=document.querySelector('.styles2');
  if(!g||!('IntersectionObserver' in window))return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  g.classList.add('ridein');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.disconnect();g.classList.add('go');setTimeout(function(){g.classList.remove('ridein','go');},1700);}});},{rootMargin:'0px 0px -15% 0px'});
  io.observe(g);
})();

/* Bike page gallery: scrollable thumbnail strip, prev/next, live photo counter */
(function(){
  var track=document.querySelector('.ts-track');if(!track)return;
  var main=document.querySelector('.gal-main img'),now=document.getElementById('gNow');
  var photos=Array.prototype.slice.call(track.querySelectorAll('.tb[data-src]')),cur=0;
  var l=document.querySelector('.ts-nav.l'),r=document.querySelector('.ts-nav.r');
  function show(i){
    cur=(i+photos.length)%photos.length;var b=photos[cur];
    photos.forEach(function(x){x.classList.toggle('on',x===b);});
    if(main){main.classList.add('fade');setTimeout(function(){main.src=b.dataset.src;main.classList.remove('fade');},120);}
    if(now)now.textContent=cur+1;
    var tl=b.offsetLeft-track.offsetLeft,tw=b.offsetWidth;
    if(tl<track.scrollLeft||tl+tw>track.scrollLeft+track.clientWidth)track.scrollTo({left:tl-tw,behavior:'smooth'});
  }
  photos.forEach(function(b,i){b.addEventListener('click',function(){show(i);});});
  var gl=document.querySelector('.gal-main .gnav.l'),gr=document.querySelector('.gal-main .gnav.r');
  if(gl)gl.addEventListener('click',function(){show(cur-1);});
  if(gr)gr.addEventListener('click',function(){show(cur+1);});
  function arrows(){if(!l||!r)return;l.disabled=track.scrollLeft<4;r.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-4;}
  if(l)l.addEventListener('click',function(){track.scrollBy({left:-track.clientWidth*.8,behavior:'smooth'});});
  if(r)r.addEventListener('click',function(){track.scrollBy({left:track.clientWidth*.8,behavior:'smooth'});});
  track.addEventListener('scroll',arrows,{passive:true});window.addEventListener('resize',arrows);arrows();
  // vertical mouse wheel scrolls the strip sideways
  track.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&track.scrollWidth>track.clientWidth){var max=track.scrollWidth-track.clientWidth;if((e.deltaY<0&&track.scrollLeft>0)||(e.deltaY>0&&track.scrollLeft<max)){e.preventDefault();track.scrollLeft+=e.deltaY;}}},{passive:false});
  // keyboard on the strip
  track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){show(cur+1);e.preventDefault();}if(e.key==='ArrowLeft'){show(cur-1);e.preventDefault();}});
})();
