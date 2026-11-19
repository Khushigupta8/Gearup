// Shared UI: toggles, tabs, radio cards, search dock, finance calculator, delivery quote, checkout, filters
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
