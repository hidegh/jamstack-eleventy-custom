/*
Motivated by: https://github.com/samsono/sticky-multi-header-scroll
*/
( function( window, document)
{
    window.addEventListener('load', () => {

        const headerSelector = "header";
        const nonStickyHeadingAttribute = "non-sticky-heading";
        const stickyContainerSelector = ".sticky-container";
        const stickyElementSelector = ".sticky";
        const stickyRelatedElementSelector = `.sticky, [${nonStickyHeadingAttribute}]`;
        const stickyElementHeadingSelector = ".heading";
        const stickyElementLinkSelector = ".sticky-link";

        function getTopFromDocument(el) {
            // NOTE: does not work on hidden el.
            return el.getBoundingClientRect().top + el.ownerDocument.defaultView.scrollY;
        }

        function getOuterHeight(el, withMargin) {
            // https://www.javascripttutorial.net/javascript-dom/javascript-width-height/ + https://api.jquery.com/outerheight/
            if (withMargin == undefined || withMargin == null) withMargin = true;
            const style = getComputedStyle(el);
            const height = el.offsetHeight + (withMargin ? (parseInt(style.marginTop || 0) + parseInt(style.marginBottom || 0)) : 0);
            return height;
        }

        function isVisible(elem) {
            // https://github.com/jquery/jquery/blob/main/src/css/hiddenVisibleSelectors.js
            return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
        }

        //
        // Making sticky work specially
        const initialScrollY = window.scrollY;
        const headerEl = document.querySelector(headerSelector);   
        const headerElHeight = getOuterHeight(headerEl);
        
        const stickyContainerEls = document.querySelectorAll(stickyContainerSelector);

        stickyContainerEls.forEach(stickyContainerEl => {

            const stickyContainerElTop = getTopFromDocument(stickyContainerEl);
            const sticlyRelatedEls = stickyContainerEl.querySelectorAll(stickyRelatedElementSelector);

            var nonStickyHeadingOffset = 0;
            var firstStickyTop = -1;
            var accumulatedStickyHeadingHeights = 0;
            var accumulatedStickyElementHeights = 0;

            // Sort by TOP position (as we use flex layout with special .order-N classes)
            const stickyElsArray = Array.from(sticlyRelatedEls).sort((a, b) => getTopFromDocument(a) - getTopFromDocument(b));
            
            stickyElsArray.forEach(stickyEl => {

                // Ignore invis.
                if (!isVisible(stickyEl)) return;

                if (stickyEl.hasAttribute(nonStickyHeadingAttribute)) {
                    nonStickyHeadingOffset += getOuterHeight(stickyEl);
                    return;
                }

                // Get initial pos.
                if (firstStickyTop == -1) {    
                    const stickyElementDistanceFromContainer = getTopFromDocument(stickyEl) - getTopFromDocument(stickyContainerEl);
                    firstStickyTop = stickyContainerElTop + stickyElementDistanceFromContainer - nonStickyHeadingOffset;
                }

                // Set top for sticky
                const stickyTop = firstStickyTop + accumulatedStickyHeadingHeights;
                stickyEl.style.top =  stickyTop + "px";

                // Scrolling via link
                const stickyLinkEl = stickyEl.querySelector(stickyElementLinkSelector);
                if (stickyLinkEl) {
                    const scrollY = accumulatedStickyElementHeights - accumulatedStickyHeadingHeights;
                    stickyLinkEl.dataset.scrollY = scrollY;
                    stickyLinkEl.addEventListener('click', (event) => window.scroll(window.scrollX, stickyLinkEl.dataset.scrollY));
                }

                // Calc. next sticky-top
                const stickyHeadingEl = stickyEl.querySelector(stickyElementHeadingSelector);
                if (stickyHeadingEl) {
                    const headingHeightWithPadding = getOuterHeight(stickyHeadingEl) + parseInt(getComputedStyle(stickyEl).paddingTop);
                    accumulatedStickyHeadingHeights += headingHeightWithPadding;
                }

                // Calc. cummulative height
                accumulatedStickyElementHeights += getOuterHeight(stickyEl);

            });

        });

    });

}( window, document));
