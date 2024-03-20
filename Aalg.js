let pixels = document.querySelectorAll('.pixel');
for (let pixel of pixels) {
 pixel.onclick = function() {
   if (pixel.style.backgroundColor ==  'white') {
    pixel.style.backgroundColor =  'pink';
   } else {
     pixel.style.backgroundColor =  'white';
   }
 }
}