/**
 * Logic JackApp
 */






(function() {


    var spotify = Spotify();
    var players = Player();
    var youtube = Youtube();

    const SONG_INFO = "card-content";

    var Layout = {


        setImagesSearch: function(tracks) {

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

            if (tracks.length < 8) {
                alert("No hay resultados para su búsqueda.");
            } else {
                for (var i = 0; i < 8; i ++) {
                    Layout.renderThumbnail(tracks[i], i);
                    players.add(i, 'Xa0Q0J5tOP0');

                }
            }

        },
        renderThumbnail: function(track, numTrack) {

            var section = document.getElementById("section-id");

            var cardImg= document.createElement("div");
            cardImg.className = "card-image";

            var img = document.createElement("img");
            img.src = track.album.images[0].url;
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
            artist.appendChild(document.createTextNode(track.album.name));

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



            play_content.className = "btn-floating waves-effect btn";
            var play = document.createElement("i");
            play.className="material-icons";
            play_content.addEventListener("click", Listener.eventPlay, false);

            play.appendChild(document.createTextNode("play_arrow"));
            play_content.appendChild(play);

            div_buttons.appendChild(play_content);

            //

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


        }
    }

    var Track = {

        getName: function (track) {

            return track["name"];
        },
        getArtist: function (track) {


            console.log("artist: " + track["artists"]);
            return track["artists"][0]["name"];
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
            Layout.setImagesSearch(json_response_tracks.tracks.items);
            tracks = json_response_tracks.tracks.items;


        },
        getTrack: function(idTrack) {

            return tracks[idTrack];
        }

    }


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

                    icon.appendChild(document.createTextNode("pause"));
                    buttonPlayPause.appendChild(icon);
                    //event.srcElement.appendChild(icon);

                    //id is the position of the track into tracks Array in Search obj
                    var id_track = buttonPlayPause.parentNode.value;
                    // now we send the request to youtube to play the track selected
                    Listener.playSong(Search.getTrack(id_track));

                    buttonPlayPause.value= "doPause";

                    var trackInfo = Search.getTrack(id_track);
                    console.log(trackInfo);

                    //PLAY SONG
                } else {
                    icon.appendChild(document.createTextNode("play_arrow"));
                    //event.srcElement.appendChild(icon);
                    buttonPlayPause.appendChild(icon);
                    console.log(buttonPlayPause.parentNode.value);
                    buttonPlayPause.value= "doPlay";

                    //PAUSE SONG
                }

            //}

        },
        playSong: function (track) {

            var song = youtube.play(Track.getArtist(track), Track.getName(track));
            console.log(song);
        }
    }

    var Application = {
        start: function() {
            Search.addListener();
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
