// check out: https://github.com/11ty/eleventy/issues/338

const util = require("util");
const requireYaml = require("require-yml");
const globals = requireYaml("src/data/globals.yaml");

const categories = require("./collections/categories");

module.exports = {

    _tagScore: globals.post.related.tagScore,
    _categoryScore: globals.post.related.categoryScore,

    _containsCategory(array, category) {
        return array.some(a => a.length == category.length && a.every((node, idx) => node == category[idx]));
    },

    _getScore: function(page, pageTags, pageNormalizedCategories, pageToScore) {

        const self = this;

        let score = 0;

        // tag match:
        const pageToScoreTags = [...new Set(pageToScore.data.tags ? [].concat(pageToScore.data.tags) : [])];
        pageToScoreTags.forEach(tag => { if (pageTags.findIndex(t => t == tag) !== -1) score = score + self._tagScore });

        // category match:
        //  try to match full path, if not possible, go upward
        //  if match found, match category and every parent category should be added to a match list...
        //  ...we use match list to avoid scoring again on something we already scored
        //  ...we also start with the deepest nodes (sort by desc), to avoid matching a longer path (a|b|c) after we added score / matched a shorter (a|b) one.
        const pageToScoreCategories = categories
            ._getNormalizedCategoriesForCollectionItem(pageToScore)
            .sort((a, b) => -1 * (a.length - b.length));

        let matchedCategories = [];
        
        pageToScoreCategories.forEach(category => {
            const matchCount = categories._categoryNodeMatchCount(category, pageNormalizedCategories)

            if (matchCount) {
            
                const matchedCategory = category.slice(0, matchCount);
                if (!this._containsCategory(matchedCategories, matchedCategory))
                    score = score + Math.pow(this._categoryScore, matchCount);
                
                for (let i = 0; i < matchCount - 1; i++) {
                    const partialCategory = category.slice(0, i + 1);
                    if (!this._containsCategory(matchedCategories, partialCategory))
                        matchedCategories.push(partialCategory);
                }

            }

        });

        return score;        
    },

    /**
     * Register it as follows, to avoid binding the Template object to the local 'this'!
     * > eleventyConfig.addFilter('getRelatedNavigationDetails', (...args) => require('./src/scripts/related-posts.filter').getRelatedNavigationDetails(...args));
     * @param {*} templatePage the page to which we search related items
     * @param {*} collectionAll all the generated items, where we look up our page to get detailed information about it
     * @param {*} collectionRelated collection to search for the related items
     * @param {*} take limit the total results
     */
    getRelatedNavigationDetails: function (templatePage, collectionsAll, collectionRelated, take) {

        const self = this;

        // get current index (and also page with full data - see: https://github.com/11ty/eleventy/issues/338#issuecomment-795331119)
        const pageIndex = collectionsAll.findIndex(p => p.url == templatePage.url);
        const page = collectionsAll[pageIndex];

        const otherItems = collectionRelated.filter(p => p.url != page.url);

        // prepare for faster scoring
        const pageTags = [...new Set(page.data.tags ? [].concat(page.data.tags) : [])];
        const pageNormalizedCategories = categories._getNormalizedCategoriesForCollectionItem(page);

        // score and sort
        const scoredOtherItems = otherItems
            .map(pageToScore => ({
                page: pageToScore,
                score: self._getScore(page, pageTags, pageNormalizedCategories, pageToScore)
            }))
            .sort((a, b) => (a.score - b.score) * -1 /* desc */);

        const trimmedScoredOtherItems = take > 0
            ? scoredOtherItems.slice(0, take)
            : scoredOtherItems;        

        // return navigation links with prev/next pages
        return {
            prev: pageIndex > 0 ?  collectionRelated[pageIndex - 1] : undefined,
            links: trimmedScoredOtherItems,
            next: pageIndex < collectionRelated.length - 1 ? collectionRelated[pageIndex + 1] : undefined
        }
    }

}



/*
<!--
 Recommend the other 3 posts according to the tags and categories of the current post,
 if the number is not enough, use the other latest posts to supplement.

 v2.0
 https://github.com/cotes2020/jekyll-theme-chirpy
 © 2019 Cotes Chung
 Published under the MIT License
-->

<!-- The total size of related posts  -->
{% assign TOTAL_SIZE = 3 %}

<!-- An random integer that bigger than 0  -->
{% assign TAG_SCORE = 1 %}

<!-- Equals to TAG_SCORE / {max_categories_hierarchy}  -->
{% assign CATEGORY_SCORE = 0.5 %}

{% assign SEPARATOR = ":" %}

{% assign score_list = "" | split: "" %}
{% assign last_index = site.posts.size | minus: 1 %}

{% for i in (0..last_index) %}
  {% assign post = site.posts[i] %}

  {% if post.url == page.url %}
    {% continue %}
  {% endif %}

  {% assign score = 0 %}

  {% for tag in post.tags %}
    {% if page.tags contains tag %}
      {% assign score = score | plus: TAG_SCORE %}
    {% endif %}
  {% endfor %}

  {% for category in post.categories %}
    {% if page.categories contains category %}
      {% assign score = score | plus: CATEGORY_SCORE %}
    {% endif %}
  {% endfor %}

  {% if score > 0 %}
    {% capture score_item %}{{ score }}{{ SEPARATOR }}{{ i }}{% endcapture %}
    {% assign score_list = score_list | push: score_item %}
  {% endif %}

{% endfor %}


{% assign index_list = "" | split: "" %}

{% if score_list.size > 0 %}
  {% assign score_list = score_list | sort | reverse %}
  {% for entry in score_list limit: TOTAL_SIZE %}
    {% assign index = entry | split: SEPARATOR | last %}
    {% assign index_list = index_list | push: index %}
  {% endfor %}
{% endif %}

<!-- Fill with the other newlest posts  -->
{% assign less = TOTAL_SIZE | minus: index_list.size %}

{% if less > 0 %}

  {% for i in (0..last_index) %}
    {% assign post = site.posts[i] %}
    {% if post.url != page.url  %}
      {% capture cur_index %}{{ i }}{% endcapture %}
      {% unless index_list contains cur_index %}
        {% assign index_list = index_list | push: cur_index %}
        {% assign less = less | minus: 1 %}
        {% if less <= 0 %}
          {% break %}
        {% endif %}
      {% endunless %}
    {% endif %}
  {% endfor %}

{% endif %}
*/



/*
{% if index_list.size > 0 %}
  <div id="related-posts" class="mt-5 mb-2 mb-sm-4">
    <h3 class="pt-2 mt-1 mb-4 ml-1" data-toc-skip>{{ site.data.label.post.relate_posts }}</h3>
    <div class="card-deck mb-4">
    {% for entry in index_list %}
      {% assign index = entry | plus: 0 %}
      {% assign post = site.posts[index] %}
      <div class="card">
        <a href="{{ post.url | relative_url }}">
          <div class="card-body">
            {% include timeago.html date=post.date class="small" %}
            <h3 class="pt-0 mt-1 mb-3" data-toc-skip>{{ post.title }}</h3>
            <div class="text-body-secondary small">
              <p>
                {% include no-linenos.html content=post.content %}
                {{ content | markdownify | strip_html | truncate: 200 }}
              </p>
            </div>
          </div>
        </a>
      </div>
    {% endfor %}
    </div> <!-- .card-deck -->
  </div> <!-- #related-posts -->
{% endif %}
*/
