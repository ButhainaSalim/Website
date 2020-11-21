
let controller;
let slideScene;
let pageScene;
let detailScene;

//animate main page using gsap and scrollMagic
function animationSlide(){
    controller = new ScrollMagic.Controller();
   const slider = document.querySelectorAll(".slider");
   const header = document.querySelector("header");
   
    slider.forEach((slide,index,slides) => {
        const img = slide.querySelector("img");
        const imgReveal = slide.querySelector(".reveal-image");
        const textReveal = slide.querySelector(".reveal-text");

        const sliderTL = gsap.timeline({
            defaults: {duration:1, ease: "power2.inOut"}
        });

        sliderTL.fromTo(imgReveal,{x:"0%"}, {x:"100%"}) ;
        sliderTL.fromTo(img,{scale:2}, {scale:1}, "-=1");
        sliderTL.fromTo(textReveal,{x:"0%"}, {x:"100%"}, "-=.75");
        sliderTL.fromTo(header,{y:"-100%"}, {y:"0%"}, "-=.5");

        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook:.25,
            reverse: false
        })
        .addIndicators({
            colorStart:"white", colorTrigger:"white", name:"slide"
        })
        .setTween(sliderTL)
        .addTo(controller);
    
     const pageLT = gsap.timeline();
     let nextSlide = slides.length -1 == index ?"end" : slides[index+1];
     pageLT.fromTo(nextSlide,{y:"0%"}, {y:"50%"});
     pageLT.fromTo(slide, {opacity:1, scale:1}, {opacity:0, scale:0.5});
     pageLT.fromTo(nextSlide,{y:"50%"}, {y:"0%"}, "-=.5");

    pageScene = new ScrollMagic.Scene({
        triggerElement: slide,
        duration:"100%",
        triggerHook:0

    })
    .addIndicators({
        colorStart:"white", colorTrigger:"White", name:"page",indent:200
    })
    .setPin(slide, {pushFollowers:false})
    
     .setTween(pageLT)
    .addTo(controller);
});

}

const mouse = document.querySelector(".curser");
const mouseSpan = mouse.children[0];
const burger = document.querySelector(".hamburger");

function curser(e){
    const item = e.target;
   
    mouse.style.top= e.pageY + "px";
    mouse.style.left= e.pageX + "px";
}
function curserAnimation(e){
    const item = e.target;
    if(item.id === "logo" || item.classList.contains("hamburger")){
        mouse.classList.add("nav-active");
    } else{
        mouse.classList.remove("nav-active");
    }

    if(item.classList.contains("explore")){
        mouse.classList.add("span-active");
        gsap.to(".title-swipe", 1, {y:"0%"});
       
        mouseSpan.innerText="tap";
    }else{
        mouse.classList.remove("span-active");
        gsap.to(".title-swipe", 1, {y:"100%"});
        mouseSpan.innerText ="";
    }
}

function burgerAnimate(e){
    const burger = e.target;
    console.log(burger);
    burger.classList.toggle("active");
    if(burger.classList.contains("active")){
        gsap.to(".line1", .5,{rotate:"45", y: 5, background:"black"});
        gsap.to(".line2", .5,{rotate:"-45", y: -5, background:"black"});
        gsap.to("#logo", .5, {color:"black"});
        gsap.to(".nav-bar", 1, {clipPath:"circle(2500px at 100% -10%)"});
       
        
        
    }else{
        gsap.to(".line1", .5,{rotate:"0", y: 0, background:"white"});
        gsap.to(".line2", .5,{rotate:"0", y: 0, background:"white"});
        gsap.to("#logo", .5, {color:"white"});
        gsap.to(".nav-bar", .5, {clipPath:"circle(50px at 100% -10%)" });
    }
}


//barba animation to transition to the next page smoothly
const logo = document.querySelector("#logo");
barba.init({
    views:[
        {
            namespace: "home",
            beforeEnter(){
               animationSlide(); 
               logo.href="./index.html";
            },
            beforeLeave(){
                controller.destroy();
                slideScene.destroy();
                pageScene.destroy();
            }
        },

        {
            namespace: "fashion",
            beforeEnter(){
                detailAnimation();
                logo.href="../index.html";
            },
            beforeLeave(){
                controller.destroy();
                detailScene.destroy();
            }
        }
    ],
    transitions: [
        {
            
            leave({current,next}){
                let done = this.async();
                const tl = gsap.timeline({defaults: {ease:"power2.inOut"}});
                tl.fromTo(current.container, 1, {opacity:1}, {opacity:0});
                tl.fromTo(".swipe", 1, {x: "-100%"}, {x: "0%", onComplete:done});
            },

            enter({current, next}){
                let done = this.async();
                //scroll to the top
                window.scrollTo(0, 0);
                // add animation
                const tl = gsap.timeline({defaults: {ease:"power2.inOut"}});
                tl.fromTo(".swipe", 1, {x: "0%"}, {x: "100%",stagger:.25, onComplete:done});
                tl.fromTo(next.container, 1, {opacity:0}, {opacity:1});
                

            }
        }
    ]
});

//animate the second page via scrollMagic
function detailAnimation(){
    controller = new ScrollMagic.Controller();
    const detailSlide = document.querySelectorAll(".detail-slide");
    detailSlide.forEach((slide, index, slides) =>{
       
        const detailTl = gsap.timeline({defaults: {duration: 1, ease: "power2.inOut"}});
        const nextSlide = slides.length - 1 === index ?"end" : slides[index+1];
        const nextImg = nextSlide.querySelector(".fashion-img img");
        const img = slide.querySelector("img");
        

      detailTl.fromTo(slide, {opacity:1},{opacity:0});
     detailTl.fromTo(nextSlide,{x:"50%"}, {x:"0%"},"-=1" );
     
      
     
        
        
      detailScene = new ScrollMagic.Scene({
        triggerElement: slide,
        duration:"80%",
        triggerHook:0

    })
        .setPin(slide, {pushFollowers:false})
        .setTween(detailTl)
        .addIndicators({colorStart:"white", colorTrigger:"white", name:"slide"})
        .addTo(controller);

    

     })
    


}




window.addEventListener("mousemove", curser);
window.addEventListener("mouseover", curserAnimation);
burger.addEventListener("click", burgerAnimate);
