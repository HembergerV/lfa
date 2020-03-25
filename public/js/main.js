/**imagenes*/
        var slideIndex = 0;
            showSlides(null);

            function showSlides(n) {
                var i;
                var slides = document.getElementsByClassName("mySlides");
                var dots = document.getElementsByClassName("dot");
                for (i = 0; i < slides.length; i++) {
                   slides[i].style.display = "none";  
                }
                if(n == null){
                    slideIndex++;
                }else{
                    slideIndex += n;
                }
                if (slideIndex < 1) {
                    slideIndex = 3;
                }
                if (slideIndex > slides.length) {slideIndex = 1}    
                for (i = 0; i < dots.length; i++) {
                    dots[i].className = dots[i].className.replace(" active", "");
                }
                slides[slideIndex-1].style.display = "block";  
                dots[slideIndex-1].className += " active";
                if(n == null){
                    setTimeout(showSlides, 4200);
                }// Change image every 2 seconds  
            }
        /**menu y form*/
        var label = document.getElementsByClassName("icon-menu")[0];

        label.addEventListener("click", function () {
            label.classList.toggle("icon-cancel");
            label.classList.toggle("icon-menu");
        });
       var accion = document.getElementsByClassName("label")[0];
       var negro = document.getElementsByClassName("fondo")[0];
       var cancel = document.getElementsByClassName('icon-cancel')[0];
       var form = document.getElementsByClassName("form")[0];
       
       accion.addEventListener("click", function () {
            negro.classList.toggle("oscurecete");
            form.classList.toggle('translatea');

        });
       cancel.addEventListener("click", function () {
            negro.classList.remove("oscurecete");
            form.classList.remove('translatea');

        });
       
       
        /**header*/
        var menu = document.getElementById("header");
        var logo = document.getElementsByClassName("logo-img")[0];
        var altura = menu.offsetTop;

        window.addEventListener("scroll", function () {
            if (window.pageYOffset > altura) {
                menu.classList.add("sticky");
                logo.classList.add("reduce");

            } else {
                menu.classList.remove("sticky");
                logo.classList.remove("reduce");

            }
        });