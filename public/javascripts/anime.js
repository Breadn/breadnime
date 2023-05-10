function selectButtonCSS(e) {
    const className = e.value;
 
    // Clear other selected button of class container
    if (document.querySelector(`${className} .selected-button`)) {
        $(document.querySelector(`${className} .selected-button`)).removeClass("selected-button");
    }

    // Set target as selected button
    document.getElementById(e.id).classList.add("selected-button");
}

// Function that opens the episode, hella jank. could improve using async client-server requests
// to breadnime, receive data, jquery to dynamically update steam qualities
//
//      | consumet.ts | <--> | breadnime | <--async (websockets?)-- ep.button()
//                                  |-- response with stream data --> | jquery | --> update stream urls
//
// also then can update css dynamically
function openAnimeEpisode(e, aniID) {
    window.location.href = `stream?animeid=${aniID}&episodeid=${e.id}`;
}

function renderVideoStream(url) {
    // VideoJS library finds the player via 'hls-video' id
    let video = videojs('hls-video');
    video.src({
        src: url,
        type: 'application/x-mpegURL'
    });
}


function openGenre(type) {
    console.log(`WIP: Opened genre ${type}`);
}