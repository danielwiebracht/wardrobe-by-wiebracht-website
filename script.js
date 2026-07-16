const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-button');
const nav=document.querySelector('#site-nav');
const heroVideo=document.querySelector('#hero-video');
const audioButton=document.querySelector('#hero-audio');

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>30));
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#site-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

audioButton.addEventListener('click',async()=>{
  heroVideo.muted=!heroVideo.muted;
  if(!heroVideo.muted){try{await heroVideo.play()}catch(e){}}
  audioButton.textContent=heroVideo.muted?'Play with sound':'Mute sound';
  audioButton.setAttribute('aria-pressed',String(!heroVideo.muted));
});

document.getElementById('year').textContent=new Date().getFullYear();

const reviewToggle=document.querySelector('.review-toggle');
const reviewList=document.getElementById('review-list');
if(reviewToggle&&reviewList){reviewToggle.addEventListener('click',()=>{const open=reviewList.classList.toggle('open');reviewToggle.setAttribute('aria-expanded',String(open));reviewToggle.textContent=open?'Show fewer reviews':'Read more reviews';});}
