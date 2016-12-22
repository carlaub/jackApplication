/**
 * Created by karlaurrea on 13/12/16.
 */

function onYouTubeIframeAPIReady() {

    var player;

        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });


    function onPlayerReady(event) {

        console.log("ENTROOOOOOOO");
        event.target.playVideo();
    }
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
    }
    function stopVideo() {
        player.stopVideo();
    }


}



// /**
//  * Created by karlaurrea on 13/12/16.
//  */
// window.onYouTubePlayerAPIReady= function() {
//     var ctrlq = document.getElementById("youtube-audio");
//     player = new YT.Player('video-placeholder', {
//         width: '0',
//         height: '0',
//         videoId: 'Xa0Q0J5tOP0',
//         playerVars: {
//             color: 'white',
//             playlist: 'taJ60kskkns,FG0fTKAqZ5g'
//         },
//         events: {
//             onReady: function () {
//                 console.log("ready");
//                 player.setPlaybackQuality("small");
//                 toggleButton(player.getPlayerState() !== YT.PlayerState.CUED);
//             }
//         }
//     });
//
//
//     var icon = document.createElement("img");
//     icon.setAttribute("id", "youtube-icon");
//     icon.style.cssText = "cursor: pointer;cursor:hand";
//     ctrlq.appendChild(icon);
//
//     var div = document.createElement("div");
//     div.setAttribute("id", "youtube-player");
//     ctrlq.appendChild(div);
//
//     var toggleButton = function (play) {
//         var img = play ? "pause.png" : "play.png";
//         icon.setAttribute("src", img);
//     }
//
//
//     ctrlq.onclick = function () {
//         console.log(player);
//         player.playVideo();
//         if (player.getPlayerState() === YT.PlayerState.PLAYING ||
//             player.getPlayerState() === YT.PlayerState.BUFFERING) {
//             player.pauseVideo();
//             toggleButton(false);
//         } else {
//             var fn = function(){ player.playVideo(); }
//             //player.playVideo();
//             fn();
//             toggleButton(true);
//         }
//     };
//
// }