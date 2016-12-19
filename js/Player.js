
var Player = function() {

    var players = [];



    return {

        add: function (i, idVideo) {
            console.log("ENTRO");

            window.onYouTubePlayerAPIReady= function() {



                player = new YT.Player('video-placeholder', {
                    width: '0',
                    height: '0',
                    //videoId: 'Xa0Q0J5tOP0',
                    videoId: idVideo,
                    playerVars: {
                        color: 'white',
                        playlist: 'taJ60kskkns,FG0fTKAqZ5g'
                    },
                    events: {
                        onReady: function () {

                            console.log("ready");
                            player.setPlaybackQuality("small");
                            toggleButton(player.getPlayerState() !== YT.PlayerState.CUED);
                        }
                    }
                });

                players[i] = YT.Player;
            }
        }
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