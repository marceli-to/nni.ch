import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger);
const firstElem = document.querySelector(".panel");

function goToSection(i, anim) {
  gsap.to(window, {
    scrollTo: {y: i*innerHeight + firstElem.offsetTop, autoKill: false},
    duration: 1
  });
  
  if(anim) {
    anim.restart();
  }
}

gsap.utils.toArray(".panel").forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    onEnter: () => goToSection(i)
  });
  
  ScrollTrigger.create({
    trigger: panel,
    start: "bottom bottom",
    onEnterBack: () => goToSection(i),
  });
});
