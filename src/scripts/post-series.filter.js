module.exports = {

    /**
     * Register it as follows, to avoid binding the Template object to the local 'this'!
     * > eleventyConfig.addFilter('getSeriesNavigationDetails', (...args) => require('./src/scripts/series-posts.filter').getSeriesNavigationDetails(...args));
     * 
     * page | series(coll, 4) - 4 links total
     * page | series(coll, 5, 3) - 5 links total, from which 3 should be next (newer) pages, ending with: 1 older, 1 actual and 3 newer page's to navigate to.
     * 
     * @param {*} page the page to which we generate the series navigation
     * @param {*} collectionAll all the generated items, where we look up our page to get detailed information about it
     * @param {*} collectionRelated collection to search for the other series items
     * @param {*} totalLinks total navigation links, including current post item
     * @param {*} nextLinks how many of the total links is a link to a newer item in the series
     */
    getSeriesNavigationDetails: function (templatePage, collectionAll, collectionRelated, totalLinks, nextLinks) {

        const self = this;

        totalLinks = totalLinks || 0;  

        // get current index (and also page with full data - see: https://github.com/11ty/eleventy/issues/338#issuecomment-795331119)
        const pageIndex = collectionAll.findIndex(p => p.url == templatePage.url);
        const page = collectionAll[pageIndex];

        if (!page.data.series)
            return [];

        const series = collectionRelated
            .filter(i => page.data.series && page.data.series == i.data.series)
            .sort((a, b) => a.data.series_no - b.data.series_no);

        const seriesPageIndex = series.findIndex(p => p.url == page.url);
        const seriesTotalItems = series.length;

        let finalSeries = series;

        if (totalLinks > 0) {            
            // alg (trim for special 'pagination'):
            //
            // we got items: 0...N-1 (N = totalItems)
            // we got window: 0...W-1 (W = totalLinks)
            // we know page index: pageIdx
            //
            // set initial pagerWindowStartIndex = so that current page is outside: pagerWindowStartIndex = pageIdx - W
            // now move current page index in right side view: pagerWindowStartIndex++
            // now ensure N new items on the right: for (i = 0; i < newLinks; i++) if (pagerWindowStartIndex + totalLinks < totalItems) pagerWindowStartIndex++
            // and make sure we don't end up with index < 0
            if (nextLinks) {
                previousLinks = totalLinks - nextLinks - 1 /* current post item */;
            } else {
                previousLinks = Math.floor((totalLinks - 1) / 2);
                nextLinks = Math.floor((totalLinks - 1) / 2);

                // adjust nextLinks
                // 5 = 2 + 1 + 2 : 4/2 = 2, mod = 0
                // 4 = 1 + 1 + 2 : 3/2 = 1.5, mod = 0.5
                if (totalLinks % 2 !== 0) nextLinks = ++nextLinks;
            }

            // get starting index
            let pagerWindowStartIndex = seriesPageIndex - totalLinks + 1;
            for (let i = 0; i < nextLinks; i++)
                if (pagerWindowStartIndex + totalLinks < seriesTotalItems) pagerWindowStartIndex = ++pagerWindowStartIndex;

            pagerWindowStartIndex = Math.max(pagerWindowStartIndex, 0);
            
            // slice (trim)
            finalSeries = series.slice(pagerWindowStartIndex, pagerWindowStartIndex + totalLinks);
        }

        return {
            links: finalSeries || [],
            next: (seriesPageIndex < series.length - 1 ? series[seriesPageIndex + 1] : undefined),
            prev: (seriesPageIndex > 0 ? series[seriesPageIndex - 1] : undefined)
        };

    }

}

/*
<!-- Render UI -->
<div id="related-posts" class="mt-5 mb-2 mb-sm-4">
  <h3 class="pt-2 mt-1 mb-4 ml-1" data-toc-skip>{{ site.data.label.post.related_series_navigation_heading }}</h3>
  <div class="card-deck mb-4">
  {% for post in link_posts %}
    <div class="card {% if page.url == post.url %} disabled {% endif %}">
      <a class="{% if page.url == post.url %} disabled {% endif %}" href="{{ post.url | relative_url }}">
        <div class="card-body">
          {% include timeago.html date=post.date class="small" %}
          <h3 class="pt-0 mt-1 mb-3" data-toc-skip>{{ post.title }}</h3>
          <div class="text-body-secondary small">
            <p>
              {% include no-linenos.html content=post.content %}
              {{ content | markdownify | strip_html | truncate: LINK_PREVIEW }}
            </p>
          </div>
        </div>
      </a>
    </div>
  {% endfor %}
  </div> <!-- .card-deck -->
</div> <!-- #related-posts -->
*/
