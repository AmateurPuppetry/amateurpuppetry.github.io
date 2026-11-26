// カルーセル：ページ単位のドット・前後ボタン（端で無効化）・現在位置表示
(function(){
  var vp=document.getElementById('carouselViewport'); if(!vp) return;
  var slides=[].slice.call(vp.querySelectorAll('.slide'));
  var dotsBox=document.getElementById('carouselDots');
  var count=document.getElementById('carouselCount');
  var prev=document.getElementById('cPrev'), next=document.getElementById('cNext');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var curPage=0, dots=[];
  function perView(){return window.innerWidth>=900?2:1}
  function pages(){return Math.ceil(slides.length/perView())}
  function buildDots(){
    dotsBox.innerHTML=''; dots=[];
    for(var i=0;i<pages();i++){ (function(i){
      var b=document.createElement('button'); b.type='button'; b.className='dot';
      b.setAttribute('aria-label',(i+1)+'ページ目へ');
      b.addEventListener('click',function(){go(i)}); dotsBox.appendChild(b); dots.push(b);
    })(i); }
  }
  function go(p){ p=Math.max(0,Math.min(p,pages()-1)); var s=slides[p*perView()]; if(s) vp.scrollTo({left:s.offsetLeft-vp.offsetLeft-2,behavior:reduced?'auto':'smooth'}); }
  function onScroll(){
    var best=0,bd=1e9; slides.forEach(function(s,i){var d=Math.abs(s.offsetLeft-vp.offsetLeft-vp.scrollLeft); if(d<bd){bd=d;best=i}});
    curPage=Math.min(Math.floor(best/perView()),pages()-1);
    dots.forEach(function(d,i){ if(i===curPage)d.setAttribute('aria-current','true'); else d.removeAttribute('aria-current')});
    var a=curPage*perView()+1, b=Math.min(a+perView()-1,slides.length);
    if(count) count.textContent=(a===b? a : a+'–'+b)+' / '+slides.length+'枚';
    prev.disabled=(curPage===0); next.disabled=(curPage>=pages()-1);
  }
  var t; vp.addEventListener('scroll',function(){clearTimeout(t); t=setTimeout(onScroll,60)},{passive:true});
  prev.addEventListener('click',function(){go(curPage-1)});
  next.addEventListener('click',function(){go(curPage+1)});
  vp.setAttribute('tabindex','0');
  vp.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'){e.preventDefault();go(curPage+1)} if(e.key==='ArrowLeft'){e.preventDefault();go(curPage-1)} });
  var rt; window.addEventListener('resize',function(){clearTimeout(rt); rt=setTimeout(function(){buildDots(); onScroll()},150)});
  buildDots(); onScroll();
})();
