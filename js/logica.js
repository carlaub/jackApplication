/**
 * Logic JackApp
 */






(function() {

    var spotify = Spotify();
    var recommend = Recommendation();

    const SONG_INFO = "card-content";
    var recommendations=[];
    var Layout = {


        setImages: function(tracks, numTracks) {

            //borrar busqueda anterior
            var generalSection=document.getElementById("general");
            var section=document.getElementById("section-id");


            if (section != null) {
                section.parentNode.removeChild(section);
            }

            var sectionTitle = document.createElement("h3");

            section = document.createElement("div");
            section.id = "section-id";

            sectionTitle.appendChild(document.createTextNode("Busqueda"));
            section.appendChild(sectionTitle);

            section.className="row";


            generalSection.appendChild(section);


            console.log(tracks);

            if (tracks.length < numTracks) {
                alert("No hay resultados para su búsqueda.");
            } else {
                for (var i = 0; i < numTracks; i ++) {
                    Layout.renderThumbnail(tracks[i], i);

                    //players.add(i, 'Xa0Q0J5tOP0');

                }
            }

        },
        renderThumbnail: function(track, numTrack) {

            var section = document.getElementById("section-id");

            var cardImg= document.createElement("div");
            cardImg.className = "card-image";

            var img = document.createElement("img");
            img.src = track.album.images[0].url;
            img.width = 640;
            img.height = 240;
            cardImg.appendChild(img);

            var cardContent = document.createElement("div");
            cardContent.className = SONG_INFO;

            var title = document.createElement("p");
            title.appendChild(document.createTextNode(track.name));
            title.className ="p-card";
            var album = document.createElement("p");
            album.appendChild(document.createTextNode(track.artists[0].name));
            album.className ="p-card";
            var artist = document.createElement("p");
            artist.className ="p-card";
            if (track.album.name != null) artist.appendChild(document.createTextNode(track.album.name));

            cardContent.appendChild(title);
            cardContent.appendChild(album);
            cardContent.appendChild(artist);

            //PLAY & FAVORITE BUTTON

            /****
             *
             */

            var div_buttons = document.createElement("div");
            div_buttons.className = "card-action";
            div_buttons.value = numTrack;

            var play_content = document.createElement("button");
            play_content.id= "button-play-pause";
            play_content.value="doPlay";
            play_content.dataset.playing="false";
            play_content.dataset.idNum=numTrack;



            play_content.className = "btn-floating waves-effect btn";
            var play = document.createElement("i");
            play.className="material-icons";
            play_content.addEventListener("click", Listener.eventPlay, false);

            play.appendChild(document.createTextNode("play_arrow"));
            play_content.appendChild(play);

            var favorite_content = document.createElement("button");
            favorite_content.id = "button-favorite";

            favorite_content.className = "btn-floating waves-effect btn";
            favorite_content.addEventListener("click", Listener.eventFavorite, false);
            favorite_content.className = "btn-floating waves-effect btn btn-favorite";
            favorite_content.dataset.favorite ="false";

            var favorite = document.createElement("i");
            favorite.className ="material-icons";

            favorite.appendChild(document.createTextNode("loyalty"));
            favorite_content.appendChild(favorite);

            div_buttons.appendChild(play_content);
            div_buttons.appendChild(favorite_content);


            var div_card = document.createElement("div");
            div_card.className = "card";
            div_card.appendChild(cardImg);
            div_card.appendChild(cardContent);
            div_card.appendChild(div_buttons);

            var div_col = document.createElement("div");
            div_col.className = "col s12";
            div_col.appendChild(div_card);

            var div_row = document.createElement("div");
            div_row.className = "row";
            div_row.appendChild(div_col);

            var div_col_ext = document.createElement("div");
            div_col_ext.className = "col s12 m6 l3";
            div_col_ext.appendChild(div_row);



            section.appendChild(div_col_ext);


        },
        renderSection: function(title){
            //borrar busqueda anterior
            var generalSection=document.getElementById("general");
            var section=document.getElementById("section-id");


            if (section != null) {
                section.parentNode.removeChild(section);
            }

            var sectionTitle = document.createElement("h3");

            section = document.createElement("div");
            section.id = "section-id";

            sectionTitle.appendChild(document.createTextNode(title));
            section.appendChild(sectionTitle);

            section.className="row";


            generalSection.appendChild(section);



        }
    }

    var Track = {

        getName: function (track) {

            return track["name"];
        },
        getArtist: function (track) {


            console.log("artist: " + track["artists"]);
            return track["artists"][0]["name"];
        },
        JSONtoTrack: function (json_response) {
            var track = JSON.parse(json_response);
            console.log("track:");
            console.log(track);
        }

    }


    var tracks;
    var Search = {
        //tracks: "",
        addListener: function() {
            var button = document.getElementById("search-button");

            Listener.add (button, "click", Listener.eventSearch, false);
        },
        searchSong: function(song) {
           // var myRequest = prepareSearchRequest("the killers", "track", "5");
            var myRequest = spotify.prepareSearchRequest(song, "track", "8");

             spotify.spotifySearch(myRequest, Search.getTracks);

        },
        getTracks: function(responseData) {
            var json_response_tracks = JSON.parse(responseData);

            //Update Layout
            Layout.setImages(json_response_tracks.tracks.items, 8);
            tracks = json_response_tracks.tracks.items;


        },
        getTrack: function(idTrack) {
            console.log(tracks[idTrack]);
            return tracks[idTrack];
        }
    }

    var Recommendations = {
        addRecommendation: function (JSON_track) {
            var track_recommen = JSON.parse(JSON_track);
            var num = recommendations.length;
            recommendations[num] = track_recommen.tracks.items[0];
        }
    }

    var player = {
        loadSong: function (src) {
            var playerAudio = document.getElementById("player-audio");
            playerAudio.src = src;
            playerAudio.load();
            playerAudio.play();

        },
        play: function() {
            var playerAudio = document.getElementById("player-audio");
            playerAudio.play();

        },
        pause: function() {
            var playerAudio = document.getElementById("player-audio");
            playerAudio.pause();

        },
        muteButtons: function() {
            var buttons = document.getElementsByClassName("btn-floating waves-effect btn");
            console.log("length: "+buttons.length);
            for (var i = 0; i < buttons.length; i++) {
                console.log("entra2");
                buttons[i].dataset.playing = "false";

                buttons[i].removeChild(buttons[i].firstChild);

                var icon = document.createElement("i");
                icon.className = "material-icons";

                icon.appendChild(document.createTextNode("play_arrow"));

                buttons[i].appendChild(icon);

                buttons[i].value= "doPlay";

                player.pause();

            }
        }
    };


    var Listener = {
        add: function(object, event, callback, capture) {
            object.addEventListener(event,callback,capture);
        },
        eventSearch: function eventSearch (event) {
            event.preventDefault();
            var textField = document.getElementById("search-input");


            if (textField.value.length === 0) {
                alert("No has introducido ninguna busqueda.");
            } else {

                Search.searchSong(textField.value);
            }

        },

        eventPlay: function (event) {

           // var buttonPlayPause = document.getElementById("button-play-pause");
            var buttonPlayPause = event.srcElement.parentNode;

            console.log("button play pause: " + buttonPlayPause);
            //if (buttonPlayPause.value != null) {
                buttonPlayPause.removeChild(buttonPlayPause.firstChild);

                var icon = document.createElement("i");
                icon.className = "material-icons";

                if (buttonPlayPause.value == "doPlay") {

                    var id_track = buttonPlayPause.parentNode.value;

                    var trackInfo = Search.getTrack(id_track);

                    if(buttonPlayPause.dataset.playing != "true") {
                        console.log("playing false");
                        player.muteButtons();
                        player.loadSong(trackInfo.preview_url);
                        buttonPlayPause.dataset.playing = "true";
                    } else {

                        player.play();

                    }
                    buttonPlayPause.removeChild(buttonPlayPause.firstChild);
                    icon.appendChild(document.createTextNode("pause"));
                    buttonPlayPause.appendChild(icon);
                    //event.srcElement.appendChild(icon);

                    //id is the position of the track into tracks Array in Search obj

                    // now we send the request to youtube to play the track selected
                    //Listener.playSong(Search.getTrack(id_track));

                    buttonPlayPause.value= "doPause";

                    console.log(buttonPlayPause);

                    console.log(trackInfo);






                    //PLAY SONG
                } else {
                    icon.appendChild(document.createTextNode("play_arrow"));
                    //event.srcElement.appendChild(icon);
                    buttonPlayPause.appendChild(icon);
                    console.log(buttonPlayPause.parentNode.value);
                    buttonPlayPause.value= "doPlay";

                    player.pause();

                    //PAUSE SONG
                }

            //}

        },

        eventFavorite: function () {
            var buttonFavorite=event.srcElement.parentNode;

            console.log(buttonFavorite.dataset.favorite);

            if (buttonFavorite.dataset.favorite == true) {
                buttonFavorite.dataset.favorite = false;

            }
        },
        playSong: function (track) {

            var song = youtube.play(Track.getArtist(track), Track.getName(track));
            console.log(song);
        },

        eventCancionesRecomendadas: function () {
            alert("cancionesRecomendadas");
            Layout.renderSection("Canciones Recomendadas");

            for (var i = 0; i < recommendations.length; i++) {
                console.log("track"+i+":");
                console.log(recommendations[i]);
                if (recommendations[i] != null) Layout.renderThumbnail(recommendations[i], i);

            }


        }
    }

    recommend.getRecommendedTracks("spotify:track:6vQNfrrrtwgeqg2tty5garfSgWcm74KEZYfD", "ABBA",
        "Mamma mia", "5", Recommendations.addRecommendation);

    var Application = {
        start: function() {
            Search.addListener();

            var aux = document.getElementById("canciones-recomendadas");
            Listener.add (aux, "click", Listener.eventCancionesRecomendadas, false);
        }
    }





    //Init application when DOM is loaded
    Listener.add (
        document,
        "DOMContentLoaded",
        Application.start(),
        false
    );
}());
