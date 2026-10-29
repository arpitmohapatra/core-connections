(function(){
  document.documentElement.classList.add('js');
  var items=document.querySelectorAll('.tl li');
  if('IntersectionObserver' in window && items.length){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
    items.forEach(function(i){io.observe(i)});
  } else { items.forEach(function(i){i.classList.add('in')}); }
  var picker=document.querySelector('[data-picker]');
  if(picker){
    var btns=picker.querySelectorAll('button'), out=picker.querySelector('.answer');
    btns.forEach(function(b){b.addEventListener('click',function(){
      btns.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      var src=document.getElementById(b.getAttribute('aria-controls'));
      out.innerHTML=src.innerHTML; out.hidden=false;
    })});
  }
})();
