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
// handler's ID is set to the animeID
function openAnime(e) {
    // console.log(`Opening anime ${e.id}`);
    const aniID = e.id;
    const episodeSuffix = "-episode-1";
    window.location.href = `stream?animeid=${e.id}&episodeid=${e.id}${episodeSuffix}`;
}