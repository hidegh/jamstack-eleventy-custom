/*
Motivated by: https://github.com/samsono/sticky-multi-header-scroll
*/
( function( window, document)
{
    window.addEventListener('load', () => {

        function getTop(el) {
            // NOTE: does not work well with sticky
            // https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document#answer-18673641 + https://github.com/jquery/jquery/blob/025da4dd343e6734f3d3c1b4785b1548498115d8/src/offset.js
            return el.getBoundingClientRect().top + el.ownerDocument.defaultView.scrollY;
        }

        function getContentHeight(el) {
            // https://www.javascripttutorial.net/javascript-dom/javascript-width-height/
            const style = getComputedStyle(el);
            const height = el.clientHeight - parseInt(style.paddingTop || 0) - parseInt(style.paddingBottom || 0);
            return height;
        }

        function getInnerHeight(el) {
            // https://www.javascripttutorial.net/javascript-dom/javascript-width-height/ + https://api.jquery.com/innerheight/
            const style = getComputedStyle(el);
            const height = el.clientHeight;
            return height;
        }

        function getOuterHeight(el, withMargin) {
            // https://www.javascripttutorial.net/javascript-dom/javascript-width-height/ + https://api.jquery.com/outerheight/
            if (withMargin == undefined || withMargin == null) withMargin = true;
            const style = getComputedStyle(el);
            const height = el.offsetHeight + (withMargin ? (parseInt(style.marginTop || 0) + parseInt(style.marginBottom || 0)) : 0);
            return height;
        }

        // 
        // making sticky work
        const headerEl = document.querySelector("header");   
        const headerElHeight = getOuterHeight(headerEl);
        
        const stickyContainerEls = document.querySelectorAll(".sticky-container");

        stickyContainerEls.forEach(stickyContainerEl => {
            
            if (!stickyContainerEl.children.length) return;

            const stickyContainerTop = getTop(stickyContainerEl);

            const containersFirstChildTopPadding = parseInt(getComputedStyle(stickyContainerEl.children[0]).paddingTop || 0);
            const paddingFromHeader = containersFirstChildTopPadding;

            const firstStickyHeaderTop = headerElHeight + paddingFromHeader;

            let firstStickyElFound = false;
            let firstStickyElementTop = undefined;
            let stickingFromScrollY = undefined;

            let previousHeadingHeights = 0;
            let previousItemHeights = 0;
            
            Array.from(stickyContainerEl.children).forEach(el => {
                
                const isSticky = el.classList.contains("sticky");

                if (isSticky) {            
                    
                    // 1st sticky (set base values)
                    if (!firstStickyElFound) {
                        firstStickyElFound = true;
                        firstStickyElementTop = previousItemHeights + stickyContainerTop;
                        stickingFromScrollY = firstStickyElementTop - firstStickyHeaderTop;
                        // console.log(`first sticky top: ${firstStickyElementTop}, stick from Y: ${stickingFromScrollY}`)
                    }

                    // handling sticky - TOP
                    const elTop = firstStickyHeaderTop + previousHeadingHeights;
                    el.style.top = elTop + "px";

                    // handling sticky - LINK
                    const linkEl = el.querySelector(".heading .sticky-link");
                    if (linkEl) {
                        let scrollY = previousItemHeights - previousHeadingHeights;
                        // console.log(`prevItemHeights: ${previousItemHeights}, ppreviousHeadingHeightsevItem: ${previousHeadingHeights}, scrollY: ${scrollY}`);
                        linkEl.dataset.scrollY = scrollY;
                        linkEl.addEventListener('click', (event) => handleStickyLinkClick(event.target));
                    }                    

                    // increment the sticky-TOP by heading size + top padding (to avoid clipping)
                    const stickyHeadingEl = el.querySelector(".heading, h1, h2, h3, h4, h5, h6");
                    const stickyHeadingElHeightWithContainersTopPadding = getOuterHeight(stickyHeadingEl) + parseInt(getComputedStyle(el).paddingTop);
                    previousHeadingHeights = previousHeadingHeights + stickyHeadingElHeightWithContainersTopPadding;                   
                }

                // increment previous item heights
                previousItemHeights = previousItemHeights + getOuterHeight(el);

            });

        });

        //
        // making nav-links work: just scroll to the .sticky TOP position
        function handleStickyLinkClick(clickEl) {
            let linkEl = clickEl;

            while (linkEl && !linkEl.classList.contains("sticky-link")) 
                linkEl = linkEl.parentElement

            // console.log(`scroll to Y: ${linkEl.dataset.scrollY}`)

            if (linkEl)
                window.scroll(window.scrollX, linkEl.dataset.scrollY);
        }

    });

}( window, document));
