// Functionality for creating dynamic page views

var renderAPI = {
    renderTrendingCarousel: async function() {
        let data = await searchAPI.getPopular();
        console.log("Rendering trending carousel...");
        for (let ani in data) {
            let currAni = data[ani];
            $('<div/>', {
                class: "carousel-item",
                html: $('<div/>', {
                    class: "mainview",
                    html: `                                         \
                        <div class="img">                           \
                            <img src="${currAni['animeImg']}">      \
                        </div>                                      \
                        <p>${currAni['animeTitle']}</p>             \
                    `
                }),
                click: () => {
                    searchAPI.openAnime(currAni);
                }
            }).appendTo('.carousel');
        }

    },
    renderAnimeGallery: function(data) {
        if (!localStorage.getItem("searchName")) {
            console.log("No anime searched!");
            location.replace("/index.html");
        }
        console.log("Rendering anime gallery...");
        $('#result-header').text(`Search Results: ${localStorage.getItem("searchName")}`);
        for (let ani in data) {
            let currAni = data[ani];
            $('<div/>', {
                class: "imggall",
                html: `
                <div class="img">                           \
                    <img src="${currAni['animeImg']}">      \
                </div>                                      \
                <h4>${currAni['animeTitle']}</h4>           \
                `,
                click: () => {
                    searchAPI.openAnime(currAni);
                }
            }).appendTo('.gallery');
        }
    },
    renderAnimePage: async function(data) {
        if (!localStorage.getItem("openAnime")) {
            console.log("No anime opened!")
            location.replace("/index.html");
        }

        console.log("Rendering anime page...");

        let ani = JSON.parse(localStorage.getItem("openAnime"));
        let aniDetails = JSON.parse(localStorage.getItem("openAnimeDetails"));
        const aniImg = aniDetails.animeImg
        const title = ani.animeTitle;
        const synopsis = aniDetails.synopsis;
        let eps = aniDetails.episodesList.reverse();

        // Load anime details and stats
        $('.title').text(title);
        $('#ani-description').text(synopsis);
        $('#ani-image').attr("src", aniImg);
        $('#ani-released').text(`Released: ${aniDetails.releasedDate}`);
        $('#ani-status').text(`Status: ${aniDetails.status}`);

        for (genre in aniDetails.genres) {
            let currGenre = aniDetails.genres[genre];
            let genreTag = $('<div/>', {
                text: `#${currGenre}`,
                id: `${currGenre}`,
                click: e => {
                    // TODO: implement genre search gallery
                    console.log("TODO: opening genre gallery...");
                }
            });
            genreTag.appendTo('.genre');
        }

        

        // Load streaming qualities buttons with first episode qualities
        if (eps.length) {
            let aniSrcs = await searchAPI.getAnimeStreamingSRCS(eps[0].episodeId);
            for (src in aniSrcs) {
                let currSrc = aniSrcs[src];

                let buttQol = $('<button/>', {
                    text: `${currSrc.quality}`,
                    id: `${currSrc.quality}`,
                    click: e => {
                        // Set global video quality
                        localStorage.setItem("videoQuality", e.target.id);
                        console.log(`Switched quality to ${e.target.id}`);

                        // Clear other selected button
                        if (document.querySelector(".quality .selected-button")) {
                            $(document.querySelector(".quality .selected-button")).removeClass("selected-button");
                        }

                        // Set target as selected button
                        $(e.target).addClass("selected-button");

                        // Render updated quality stream
                        this.renderAnimeStream($('.ep .selected-button').attr('id'));
                    },
                });

                // Set default video quality to default
                if (currSrc.quality == "default") {
                    localStorage.setItem("videoQuality", "default");
                    buttQol.addClass('selected-button');
                }

                buttQol.appendTo('.quality');
            }
        }

        // Load episode list buttons with anime streams
        for (let ep in eps) {
            let currEp = eps[ep];
            
            let buttEp = $('<button/>', {
                text: `${currEp.episodeNum}`,
                id: `${currEp.episodeId}`,
                click: e => {
                    this.renderAnimeStream(currEp.episodeId);

                    // Mark button as visited
                    $(e.target).addClass("visited-button");

                    // Clear other selected button
                    if (document.querySelector(".ep .selected-button")) {
                        $(document.querySelector(".ep .selected-button")).removeClass("selected-button");
                    }

                    // Set target as selected button
                    $(e.target).addClass("selected-button");
                },
            });

             // Render first episode on default
             if (ep == 0) {
                this.renderAnimeStream(currEp.episodeId);
                buttEp.addClass('selected-button');
                buttEp.addClass('visited-button');
            }

            buttEp.appendTo('.ep');
        }
    },
    renderAnimeStream: async function(episodeId) {
        // check which global video quality to use
        let quality = localStorage.getItem("videoQuality");

        let videoCache_id = episodeId + `-quality:${quality}`;
        let video = videojs('hls-video');
        let url;

        // check cache
        /* screw this cache cause current vidcdn stream doesnt support qualities
        if (localStorage.getItem(videoCache_id)) {
            console.log(`using video cache id: ${videoCache_id}`);
            url = localStorage.getItem(videoCache_id);
            console.log(url);
            video.src({
                src: url,
                type: 'application/x-mpegURL'
            });
            return true;
        }
        */

        // load sources
        let didFindQuality = false;
        srcs = await searchAPI.getAnimeStreamingSRCS(episodeId);

        for (src in srcs) {
            if (srcs[src].quality == quality) {
                url = srcs[src].file;
                didFindQuality = true;
            }
        }
        // use backup if no matching quality found
        if (!didFindQuality) {
            url = srcs[srcs.length - 1].file;
        }

        console.log(`Loaded stream with url ${url}`)
        console.log(url);
        localStorage.setItem(videoCache_id, url);
        video.src({
            src: url,
            type: 'application/x-mpegURL'
        });
        return true;
    }
}

/* Event listeners */
// Listener for carousel button interaction
// Concept: gets width of carousel item, sets scrollLeft to increment/decrement by width
$('.sub-content button').click((e) => {
    // temporarily disable snapping and button
    $('.carousel').css("scroll-snap-type","none");

    let item_width = $('.carousel-item').width() + 44;

    step = 15;
    speed = 1;
    scrollAmount = 0;
    var scrollTimer = setInterval(function(){
        let currScroll = $('.carousel').scrollLeft();
        if(e.target.id === "left-carousel"){
            $('.carousel').scrollLeft(currScroll -= step);
        } else {
            $('.carousel').scrollLeft(currScroll += step);
        }
        scrollAmount += step;
        if(scrollAmount >= item_width){
            window.clearInterval(scrollTimer);
            // reenable snapping
            $('.carousel').css("scroll-snap-type","x mandatory");
        }
    }, speed);
});


/*
<div class="carousel-item">
    <div class="mainview">
        <div class="img">
            <img src="https://i.pinimg.com/originals/4c/3d/14/4c3d14aac7a9ea327d0a080c8c2a1278.jpg">
        </div>
        <p>TITLE</p>
    </div>
</div>
*/