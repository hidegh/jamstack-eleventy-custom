/*
Based on:
    https://github.com/mohammed2raja/ScrollSpy-vanillaJS
    https://github.com/twbs/bootstrap/blob/main/js/src/scrollspy.js

Extensions:
- supporting URI match if no hash match avail. (so working for URI routes as well)
*/
(function( window, document) {
    
    function menuSpy({ navlinkSelector = undefined, defaultNavlinkSelector = undefined, activeClass = undefined, clearActive = undefined, thresholds = undefined } = {}) {
       
        // Helper fncs.
        const makeEndWith = (input, endsWith) => input.endsWith(endsWith) ? input : input + endsWith;
        const toAbsolutePath = (path, root) => {
            root = makeEndWith(root ?? window.location.pathname, "/");
            path = makeEndWith(path, "/");
            const absPath = (path.startsWith("/") ? "" : root) + path;
            return absPath.replace(/(\/?#)/, "/#"); // hash should always be used with a / before [string match requires uniform values]
        };

        const findLinkToSection = section => {
            const sectionId = section.id;
            const sectionAbsHref = toAbsolutePath("#" + sectionId);
            return navlinks.find(navlink => {
                const navlinkHref = navlink.getAttribute('href');
                const navlinkAbsHref = toAbsolutePath(navlinkHref);
                return navlinkAbsHref == sectionAbsHref;
             });
        };

        const findLinkToUri = uriPath => {
            const absUriPath = toAbsolutePath(uriPath);
            return navlinks.find(navlink => {
                const navlinkHref = navlink.getAttribute('href');
                const navlinkAbsHref = toAbsolutePath(navlinkHref);
                return navlinkAbsHref == absUriPath;
             });
        };

        const  handleLinkActivationBasedOnUri = (defaultNavLink) => {
            // Handle URI path match on load (or when all sections are outside viewport)...
            const locationUri = window.location.pathname;
            const link = findLinkToUri(locationUri);

            if (link) {
                activateLink(link);
            } else {
                activateLink(defaultNavLink);
            }
        };

        const activateLink = navlink => navlink ? navlink.classList.add(activeClass) : undefined;
        const inactivateLink = navlink => navlink ? navlink.classList.remove(activeClass) : undefined;

        // Default params
        navlinkSelector = navlinkSelector || ".nav-link";
        defaultNavlinkSelector = defaultNavlinkSelector || (navlinkSelector + ".default");
        activeClass = activeClass || "active";
        thresholds = thresholds ?? [0.1, 0.5, 1.0];

        // Get defaults from DOM
        const navlinks = Array.from(document.querySelectorAll(navlinkSelector));
        const defaultNavLink = document.querySelector(defaultNavlinkSelector);
        const scrollSections = Array.from(document.querySelectorAll("[id]"));

        const scrollSectionsForNavlinks = scrollSections.filter(section => !!findLinkToSection(section));

        // Keeping track of scroll (up / down)...
        let previousParentScrollTop = 0;

        // Keeping track of targets in view...
        const inViewIntersectionTargets = [];

        const handleIntersectionFn = intersectionEntries => {

            // Scroll tracking
            const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
            const userScrollsDown = parentScrollTop >= previousParentScrollTop;
            previousParentScrollTop = parentScrollTop;

            // Intersection tracking
            intersectionEntries.forEach(intersectionEntry => {

                const intersectionTarget = intersectionEntry.target;

                if (intersectionEntry.isIntersecting) {
                    // Section entered viewport (exceeded one threshold - so multiple call for same section to be expected)!
                    // NOTE: we can select to which section to activate link only after we process all intersection entries!
                    if (!inViewIntersectionTargets.includes(intersectionTarget))
                        inViewIntersectionTargets.push(intersectionTarget);                        
                } else {
                    // Section left viewport...
                    if (inViewIntersectionTargets.includes(intersectionTarget)) {
                        const idx = inViewIntersectionTargets.indexOf(intersectionTarget);
                        inViewIntersectionTargets.splice(idx, 1);
                    }

                    // We can inactivate link immediately...
                    const link = findLinkToSection(intersectionTarget);
                    inactivateLink(link);
                }

            });

            if (inViewIntersectionTargets.length > 0) {                
                // We have a hash-tag to match (classic scroll spy)...need to select from inViewIntersectionTargets based on scroll direction!
                let newTarget = undefined;

                if (userScrollsDown) {
                    // select with highest offset
                    newTarget = inViewIntersectionTargets.sort((l, r) => r.offsetTop - l.offsetTop)[0];
                } else {
                    // select with smallest offset
                    newTarget = inViewIntersectionTargets.sort((l, r) => l.offsetTop - r.offsetTop)[0];                    
                }

                // Inactivate all navlinks
                navlinks.forEach(link =>  inactivateLink(link));

                // Activate new link
                const link = findLinkToSection(newTarget);
                activateLink(link);

                /*
                // NOTE: this would keep existing URI match highlighted!
                // Alter activation status of navlinks
                inViewIntersectionTargets.forEach(target => {
                    const link = findLinkToSection(target);
                    if (target == newTarget)
                        activateLink(link);
                    else
                        inactivateLink(link);
                });
                */

            } else {
                handleLinkActivationBasedOnUri(defaultNavLink);
            }

        };

        // Create an observer and observe scrollSections for scroll-in!
        const observer = new IntersectionObserver(handleIntersectionFn, { root: null, threshold: thresholds });

        scrollSectionsForNavlinks.forEach(section => {
            observer.observe(section);
        });

        // If no observer...
        if (scrollSectionsForNavlinks.length == 0) {
            handleLinkActivationBasedOnUri(defaultNavLink);
        }

    };

    menuSpy();

}( window, document));
