/*
 * docdown.js v1.0 
 * 17.12.2020
 * 
 * For serving .md files under IIS add to web.config
 	<remove fileExtension=".md" />
	<mimeMap fileExtension=".md" mimeType="text/markdown" />
*/

'use strict';
var docdown = (function () {
    var config = {
        title: "Documentation",
        currentHeading: "",
        containerContent: "#content",
        containerToc: "#toc",
        containerSearch: "#search",
        classHeading: "heading",
        tocHeadings: "h1,h2,h3",
        converter: new showdown.Converter(),
        rePathNoIndex: /(\w+.md)#?(\w+)?/,
        searchShowFragmentLength: 120,
        searchShowFragmentLengthBefore: 20,
        urlSearchBaseUrl: 'index.html?page={page}#{titleId}',// konvertiraj skraceni .md format u full format za otvaranje u novom tabu
        urlBase: 'index.html',//?page=',
        showdown: {
            literalMidWordUnderscores: true,
            tables: true,
            noHeaderId: false
        },
        timestamp: Date.now()
    };

    //init();

    var pages = []; // { file, titles, headings , content }
    var currentPage = null;

    function setShowDownOptions() {
        // https://github.com/showdownjs/showdown
        for (var prop in config.showdown) {
            config.converter.setOption(prop, config.showdown[prop]);
        }
    }

    function showPageContents(pageFile) {
        //var useTimeout = currentPage == null || currentPage.file != pageFile;
        var page = pages.find((p) => p.file == pageFile);
        currentPage = page;
        if (!page) {
            console.error("No page found:", pageFile);
            return;
        }

        $(config.containerContent).html(page.content);
        refreshToc();
        var firstTitle = $(page.content).first(".heading").text();
        document.title = document.title + (firstTitle ? ' - ' + firstTitle : '');
        scrollPageToAnchor(window.location.hash);
    }

    function changeCurrentPage(path) {
        if (!path) path = window.location.href;
        var pageFile = null,
            anchor = null,
            pathItems = null;

        pathItems = config.rePathNoIndex.exec(path);
        if (pathItems && pathItems.length == 3) {
            pageFile = pathItems[1];
            anchor = pathItems[2] || ''; // optional
        }

        if (!pageFile)
            pageFile = pages[0].file;

        // set current url
        if (pageFile) {
            var currPath = buildPagePath(pageFile, anchor);
            setPagePath(currPath);
        }

        showPageContents(pageFile);

        highlightMenuItem(pageFile, anchor);

    }

    function refreshToc() {
        $(config.containerToc).empty();
        pages.forEach(p => {
            //var pageLink = p.file;
           // var pageLink = config.urlSearchBaseUrl.replace('{page}', p.file);
			
            // first heading is H0 to build page title and distinguish from others
            if (p.file == currentPage.file) {
                for (var i = 0, j = p.titles.length; i < j; i++) {
                    var t = p.titles[i];
                    $('<a>')
                        .text(t.text || 'No title')
                        //.attr('href', pageLink.replace('{titleId}', t.id))
                        .attr('href', buildPagePath(p.file, t.id))
                        .addClass('md_override')
                        .appendTo($('<li>')
                            .attr('class', (i == 0 ? "headingH0 current" : 'heading' + t.type))
                            .appendTo(config.containerToc))
                };
            } else if (p.file) {
                $('<a>')
                    .text(p.titles.length > 0 ? (p.titles[0].text || 'No title') : 'No title')
                    //.attr('href', pageLink.replace('{titleId}', ''))
                    .attr('href', buildPagePath(p.file, ''))
                    .addClass('md_override')
                    .appendTo($('<li class="headingH0">').appendTo(config.containerToc))
            }
        });
    }

    function buildPagePath(pageFile, anchor) {
        //var pageLink = config.urlBase + pageFile + '#' + (anchor || '');

        //////var url = new URL(window.location);
        ////var params = new URLSearchParams(document.location.search.slice(1));
        //var pageLink = config.urlSearchBaseUrl
        //    .replace('{page}', pageFile)
        //    .replace('{titleId}', anchor || '')
        //    .replace('{timestamp}', config.timestamp);
        ////console.log("params", params);

        var pageLink = config.urlBase + "?" + "page=" + pageFile;
        if (anchor)
            pageLink += "#" + anchor;
        return pageLink;

        // napravi apsolutni url sa http i otvara nam u novom prozoru
        //var url = new URL(window.location.origin + window.location.pathname);
        //url.searchParams.append("page", pageFile);
        //url.searchParams.append("t", config.timestamp);
        //if (anchor)
        //    url.hash = anchor;
        //console.log(url);
        //return url.href;
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return null;
    };

    function setPagePath(path) {
        window.history.pushState({}, '', path)
    }

    // useTimeout jer kod prvog loada stranica jos nije ucitana i browser nema na sto poskrolati
    function scrollPageToAnchor(anchor) {
        var elem;
        if (anchor)
            elem = document.getElementById(anchor.replace("#", ""));
        if (!elem)
            elem = document.getElementById("content");

        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        //console.log("scrollPageToAnchor");

        //if (useTimeout) {
        //    setTimeout(function () {
        //        console.log("scrollPageToAnchor");

        //    }, 500);
        //} else {
        //    scrollf();
        //}
    }

    // loads page content during init
    function loadPage(href) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", href + '?t=' + config.timestamp, false);
        xmlhttp.send();
		if (xmlhttp.status == 200)
			return xmlhttp.responseText;
		console.error('Error loading page', href);
		return '';
    }

    // get global search with capturing groups
    // matchAll still not available in all browsers
    // https://blog.tildeloop.com/posts/javascript-the-difference-between-match-and-matchall
    function matchAll(pattern, haystack) {
        var regex = new RegExp(pattern, "g")
        var matches = [];

        var match_result = haystack.match(regex);

        for (let index in match_result) {
            var item = match_result[index];
            matches[index] = item.match(new RegExp(pattern));
        }
        return matches;
    }

    // fill html with helper nodes
    function adjustHtml(contentHtml) {
        var $html = $($.parseHTML(contentHtml)); // object sa elementima
        // za lakse buildanje TOCa
        for (i = 1; i <= 6; i++) {
            var headers = $html.filter('h' + i);
            for (j = 0; j < headers.length; j++) {
                headers[j].className = config.classHeading;
            }
        }
        // rekreiraj pravi link zbog otvaranja u novom tabu
        var re = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/;
        for (i = 0, j = $html.length; i < j; i++) {
            if ($html[i].innerHTML) {
                //var matches = $html[i].innerHTML.matchAll(re); // ne radi u starijem Chromeu
                var matches = matchAll(re, $html[i].innerHTML);
                for (var match of matches) {
                    if (match[1] && match[1].indexOf('http') == -1 && match[1].indexOf(config.urlBase) == -1) {
                        //$html[i].innerHTML = $html[i].innerHTML.replaceAll(match[1],  config.urlBase + match[1]);
                        var parts = match[1].split('#');
                        var url = buildPagePath(parts[0], parts[1]);
                        //$html[i].innerHTML = $html[i].innerHTML.replaceAll(match[1],  url);
                        $html[i].innerHTML = $html[i].innerHTML.replace(match[1], url);
                    }
                }
            }
        }
        // rekreiraj string iz liste nodova
        var html = '';
        for (var i = 0, j = $html.length; i < j; i++) {
            html += $html[i].outerHTML || '';
        }
        return html;
    }

    function getCurrentHeadingFromScrollPosition() {
        var headingsAll = document.getElementsByClassName('heading');
        var headings = [];
        // having all headings in content and not having them in toc will not highlight toc correctly
        var tocHeadings = config.tocHeadings.toUpperCase().split(',');
        for (var i = 0; i < headingsAll.length; i++) {
            if (tocHeadings.includes(headingsAll[i].tagName))
                headings.push(headingsAll[i]);
        }
        var winheight = window.innerHeight;
        var scrollHeadingId = null;
        for (var i = 0; i < headings.length; i++) {
            //console.log("y", i, pageYOffset, headings[i].offsetTop);
            if (i == 0) {
                //console.log(headings[i].textContent);
            } else {
                if (pageYOffset + 20 < headings[i].offsetTop) {
                    //console.log(headings[i - 1].textContent);
                    // long section
                    if (pageYOffset + winheight < headings[i].offsetTop && i > 0)
                        scrollHeadingId = headings[i-1].getAttribute("id");
                    else
                        scrollHeadingId = headings[i].getAttribute("id");
                    break;
                }
            }
        }
        if (!scrollHeadingId) {
            if (headings.length > 0)
                scrollHeadingId = headings[headings.length - 1].getAttribute("id");
        }
        $(config.containerToc).find('li').not('.headingH0.current').removeClass('current');
        //$(config.containerToc).find('li').not('.headingH0').find("a[href='" + currentPage.file + "#" + scrollHeadingId + "']").parent('li').addClass('current');
        highlightMenuItem(currentPage.file, scrollHeadingId);
    }

    function highlightMenuItem(file, anchor) {
        if (file && anchor)
            //$(config.containerToc).find('li').not('.headingH0').find("a[href='" + file + "#" + anchor + "']").parent('li').addClass('current');
            $(config.containerToc).find('li').not('.headingH0').find("a[href='" + buildPagePath(file, anchor)+"']").parent('li').addClass('current');
    }


    function showSearchResults(text) {
        if (!text || text.length < 2) return false;
        $(config.containerContent).empty();

        var searchContainer = $('<ul>')
            .addClass('searchResults');
        
        var res = searchDocuments(text);

        res.forEach(item => {
            var theRegEx = new RegExp("(" + text + ")", "igm");
            var highlightedFragment = item.fragment.replace(theRegEx, '<span class="found">$1</span>');
            console.log("item.page", item.page);
            //var url = config.urlSearchBaseUrl.replace('{page}', item.page).replace('{titleId}', item.titleId);
            var url = buildPagePath(item.page, item.titleId);
            $('<li>')
                .append(
                    $('<a>')
                        .text(item.title || 'No title')
                        .attr('href', url)
                        .addClass('md_override')
                )
                .append(
                    $('<span class="fragment">')
                        .html('..'+ highlightedFragment +'..')
                )
                .appendTo(searchContainer);
        });
        $(config.containerContent).append($('<h1>').text('Rezultati pretraživanja: ' + text));
        if (res.length)
            searchContainer.appendTo($(config.containerContent));
        else
            $(config.containerContent).append($('<p>').text('Traženi pojam nije pronađen.'));
    }

    function searchDocuments(text) {
        text = text.toLowerCase();
        var res = []; // {page, title, titleId, fragment}
        pages.forEach((page) => {
            var pageFile = page.file;
            var tags = $(page.content)

            for (var i = 0; i < tags.length; i++) {
                var foundAt = tags[i].textContent.toLowerCase().indexOf(text);
                if (foundAt > -1) {
                    // found, get parent heading
                    //tags[0].nodeName "H1"
                    // tags[0].getAttribute("class") "heading"
                    var fragment = tags[i].textContent;
                    // skratimo malo tekst i pokazi neki kontekst ispred
                    if (fragment.length > config.searchShowFragmentLength) {
                        if (foundAt > -1) {
                            foundAt = foundAt < config.searchShowFragmentLengthBefore ? 0 : foundAt - config.searchShowFragmentLengthBefore ;
                            fragment = fragment.substr(foundAt, config.searchShowFragmentLength);
                        } else {
                            fragment = fragment.substr(foundAt, config.searchShowFragmentLength);
                        }
                    }
                    for (var j = i; j >= 0; j--) {
                        if (tags[j].getAttribute("class") == "heading") {
                            //console.log("parent", tags[j].textContent, tags[j].getAttribute("id"));
                            var searchItem = {
                                page: pageFile,
                                title: tags[j].textContent,
                                titleId: tags[j].getAttribute("id"),
                                fragment: fragment
                            }
                            res.push(searchItem);
                            break;
                        } else {
                            if (j == 0) {
                                // no parent found
                                var searchItem = {
                                    page: pageFile,
                                    title: '',
                                    titleId: '',
                                    fragment: fragment
                                }
                            }
                        }
                    }
                }
            }

        });
        //console.log("result", res);
        return res;
    }

    function run(filenames) {
        // Chrome caches page, add parameter to force first reload
        if (!getUrlParameter('t')) {
            var url = new URL(window.location)
            url += (window.location.search ? "&" : "?") + "t=" + config.timestamp;
            window.location = url;
        }
        // load pages
        filenames.forEach((p) => {
            var contentMD = loadPage(p);
            var contentHtml = config.converter.makeHtml(contentMD);

            var titles = [];
            var $html = $($.parseHTML(contentHtml));
            var headings = $html.filter(config.tocHeadings);
            headings.each(function () {
                titles.push({
                    id: this.getAttribute("id"),
                    text: this.textContent,
                    type: this.nodeName
                });
            })
            pages.push({ file: p, titles: titles, content: adjustHtml(contentHtml) });
        });

        changeCurrentPage();

        // omoguci skraceni crosslinking (dokumentacija.md#drugi umjesto index.html?page=dokumentacija.md#drugi)
        //$(document).off("click", config.containerToc);
        $(document).on("click", "a.md_override", function (e) {
            e.preventDefault();
            //var path = e.target.href;
            //console.log("path", path);
            changeCurrentPage(e.target.href);
        });

        $(document).on("click", config.containerContent + " a", function (e) {
            e.preventDefault();
            //var href = e.target.attributes.href.value;
            var href = $(this).attr("href");
            if (href.includes("http"))
                window.open(href, "_blank"); // external link
            else
                changeCurrentPage(href);
        });

        $(document).on("scroll", function (e) {
            getCurrentHeadingFromScrollPosition();
        });

        $(document).on("click", "#btnSearch", function () {
            var text = $(config.containerSearch + " input[name='search']").val();
            showSearchResults(text);
        });

        window.onpopstate = function () {
            //console.log('back');
            showPageContents(getUrlParameter('page'));
        };
    }

    function init(config_) {
        config = Object.assign(config, config_ || {});
        //console.log(config);
        setShowDownOptions();
        $('#title a').text(config.title);
        $('#version').text('v' + (config.version || ''));
        $('#date').text(config.date || '');
    }

    return {
        run: run,
        init: init,
        // debug only:
        config: config,
        pages: pages,
        //toc: toc,
        //search: searchDocuments
        getUrlParameter: getUrlParameter
    };
})();