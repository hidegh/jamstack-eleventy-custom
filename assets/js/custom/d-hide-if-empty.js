( function( window, document)
{
    window.addEventListener('load', () => {
        // here you can access anything in the page, and everything is ready...
        const els = document.querySelectorAll(".d-hide-if-empty");

        els.forEach(el => {
            // based on: https://www.javascripttutorial.net/javascript-dom/javascript-width-height/
            const style = getComputedStyle(el);
            const height = el.clientHeight - parseInt(style.paddingTop || 0) - parseInt(style.paddingBottom || 0);
            if (height == 0) {
                el.style.display = 'none';
            }
        });
    });
    
}( window, document));
