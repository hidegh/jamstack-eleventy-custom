( function( window, document) {
    
    function menuSpy(navlinkSelector, activeClass, clearActive, threshold) {

        // Default params
        navlinkSelector = navlinkSelector || ".nav-link";
        activeClass = activeClass || "active";
        threshold = threshold ?? .8;

        // Get defaults from DOM
        const navlinks = Array.from(document.querySelectorAll(navlinkSelector));
        const scrollSections = Array.from(document.querySelectorAll("[id]"));

        var absPath = window.location.pathname;

        // Navlink helpers
        const findDefaultNavlinkFn = function(navlinks) {

            const defaultNavLink = navlinks.find(navLink => {
                const href = navLink.getAttribute('href')
                const absHrefPath = (href.startsWith("/") ? "" : absPath) + href;
                return absHrefPath.replace(/\/$/, "") == absPath.replace(/\/$/, "");
            });

            return defaultNavLink;
        };

        const setLinksInactiveFn = function(navlinks) {
            navlinks.forEach(e => e.classList.remove(activeClass));
        };

        const setLinkActiveFn = function(navlink) {
            navlink.classList.add(activeClass);
        };

        // Intersection handling logic
        const handleIntersectionFn = function(intersectionEntries) {

            setLinksInactiveFn(navlinks);

            // Check for intersection (absolute page refs.) - this is what usual scroll-spy plugins do!
            var matchFound = false;

            intersectionEntries.forEach(intersectionEntry => {

                // Bypass initial call where funciton is called with all observed entries!
                if (intersectionEntry.isIntersecting == false) return false;

                const scrollSection = intersectionEntry.target;
                const scrollId = scrollSection.id;
                const absScrollPath = absPath + "#" + scrollId;

                const matchedNavLink = navlinks.findLast(navLink => {
                    const href = navLink.getAttribute('href')
                    const hrefNormalized = href.replace(/(\/?#)/, "/#");
                    const absHrefPath = (href.startsWith("/") ? "" : absPath) + hrefNormalized;
                    return absHrefPath.replace(/\/$/, "") == absScrollPath.replace(/\/$/, "");
                });

                if (matchedNavLink) {
                    matchFound = true;
                    setLinkActiveFn(matchedNavLink);
                };

            });

            // If no match found, match via path...
            if (!matchFound) {
                const defaultNavLink = findDefaultNavlinkFn(navlinks);
                if (defaultNavLink) setLinkActiveFn(defaultNavLink);
            }
        };

        // Create an observer and observe scrollSections for scroll-in!
        const observer = new IntersectionObserver(handleIntersectionFn, { threshold: threshold });

        scrollSections.forEach(section => {
            observer.observe(section);
        });

        // Set default navlink (if such exists)...
        if (clearActive) setLinksInactiveFn(navlinks);
        const defaultNavLink = findDefaultNavlinkFn(navlinks);
        if (defaultNavLink) setLinkActiveFn(defaultNavLink);
    };

    menuSpy();

}( window, document));
