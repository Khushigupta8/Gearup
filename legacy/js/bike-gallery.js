// Bike page: scrollable thumbnail strip, prev/next, photo counter
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
