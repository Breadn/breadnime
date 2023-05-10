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

// Function to open an "anime card" item, requires that the onclick
// handler's anchor ID is set to the animeID
function openAnime(e) {
    const aniID = e.id;
    const episodeSuffix = "-episode-1";
    window.location.href = `stream?animeid=${e.id}&episodeid=${e.id}${episodeSuffix}`;
}

// Pseudo-form Search handler
$('#search').submit(e => {
    e.preventDefault();
    const searchInput = $('#anime-search').val();
    window.location.href = `search?search=${searchInput}`;
});