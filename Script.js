// COUNTDOWN

const wedding = new Date("December 26, 2026 09:00:00").getTime();

const days = document.getElementById("days");

const hours = document.getElementById("hours");

const minutes = document.getElementById("minutes");

const seconds = document.getElementById("seconds");

setInterval(()=>{

const now = new Date().getTime();

const distance = wedding-now;

days.innerHTML=Math.floor(distance/(1000*60*60*24));

hours.innerHTML=Math.floor((distance%(1000*60*60*24))/(1000*60*60));

minutes.innerHTML=Math.floor((distance%(1000*60*60))/(1000*60));

seconds.innerHTML=Math.floor((distance%(1000*60))/1000);

},1000);



// NAVBAR

const nav=document.querySelector(".navbar");

window.addEventListener("scroll",()=>{

if(window.scrollY>120){

nav.classList.add("show");

}else{

nav.classList.remove("show");

}

});



// FADE SECTIONS

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show-section");

}

});

});

document.querySelectorAll(".hidden").forEach(section=>{

observer.observe(section);

});




// MAP LINKS

document.getElementById("churchMap").href=

"https://www.google.com/maps/search/?api=1&query=ECWA+Gospel+Church+II+Jenta+Jos";

document.getElementById("churchMap").target="_blank";

document.getElementById("receptionMap").href=

"https://www.google.com/maps/search/?api=1&query=Odilinz+Event+Centre+Jos";

document.getElementById("receptionMap").target="_blank";