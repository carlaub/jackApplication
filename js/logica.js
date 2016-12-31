/**
 * Logic JackApp
 */






(function() {

    var spotify     = Spotify();
    var recommend   = Recommendation();
    var storage     = LocalStorage();

    const SONG_INFO = "card-content";
    const ID_PRELOAD_COMPONENT  = "preload-section";

    var recommendations=[];

    /**
     * @type {Array} Array of sections. Each section represents an array of tracks.
     */
    var sectionTracks = [];

    /**
     * Section indexes.
     */
    const Section = {

        RECOMMENDED_ARTISTS : 1,
        RECOMMENDED_SONGS   : 2,
        PLAYLIST            : 3,
        SEARCHES            : 4
    };

    /**
     * @type {number} The current tab selected on the website. By default the first one.
     */
    var currentSection = Section.RECOMMENDED_ARTISTS;
    var currentSong = 0;


    var Layout = {

        /**
         * @deprecated This method should be replaced by renderSection and renderThumbnail.
         *
         * @param tracks
         * @param numTracks
         */
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

            sectionTitle.appendChild(document.createTextNode("Búsqueda"));
            section.appendChild(sectionTitle);

            section.className = "row";

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

        removeLastSection: function() {

            console.log("removing last section");

            //borrar busqueda anterior
            var generalSection=document.getElementById("general");
            var section=document.getElementById("section-id");


            if (section != null) {
                section.parentNode.removeChild(section);
            }
        },

        renderEmptySectionMessage: function(title) {

            console.log("rendering empty result message");
            Layout.removeLastSection();

            var generalSection = document.getElementById("general");
            var sectionTitle = document.createElement("h3");
            sectionTitle.appendChild(document.createTextNode(title));

            var section = document.createElement("div");
            section.id = "section-id";
            section.className="row";

            var message = document.createElement("h4");
            message.appendChild(document.createTextNode("No se han encontrado resultados."));
            section.appendChild(sectionTitle);
            section.appendChild(message);

            generalSection.appendChild(section);
        },

        renderThumbnail: function(track, numTrack, favoriteThumbnail) {

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
            title.value=track.name;
            var album = document.createElement("p");
            album.appendChild(document.createTextNode(track.artists[0].name));
            album.className ="p-card";
            album.value=track.artists[0].name;
            var artist = document.createElement("p");
            artist.className ="p-card";

            if (track.album.name != null){
                artist.appendChild(document.createTextNode(track.album.name));
                artist.value=track.album.name;
            }

            cardContent.appendChild(title);
            cardContent.appendChild(album);
            cardContent.appendChild(artist);

            //PLAY & FAVORITE BUTTON


            var div_buttons = document.createElement("div");
            div_buttons.className = "card-action";
            div_buttons.value = numTrack;

            var play_content = document.createElement("button");
            play_content.id= "button-play-pause";
            play_content.value = "doPlay";
            play_content.dataset.playing = "false";
            play_content.dataset.idNum = numTrack;



            play_content.className = "btn-floating waves-effect btn play";
            var play = document.createElement("i");
            play.className="material-icons";
            play_content.addEventListener("click", Listener.eventPlay, false);

            play.appendChild(document.createTextNode("play_arrow"));
            play_content.appendChild(play);

            var favorite_content = document.createElement("button");
            favorite_content.id = "button-favorite";

            favorite_content.className = "btn-floating waves-effect btn play";
            favorite_content.addEventListener("click", Listener.eventFavorite, false);
            favorite_content.className = "btn-floating waves-effect btn btn-favorite";
            favorite_content.dataset.favorite ="false";

            var favorite = document.createElement("i");
            favorite.className ="material-icons";

            //Change icon if render section if favorites songs. Add next and previous buttons
            if (favoriteThumbnail == true) {
                favorite.appendChild(document.createTextNode("not_interested"));
                favorite_content.appendChild(favorite);

                var next_content = document.createElement("button");
                next_content.id = "button-next";

                next_content.className = "btn-floating waves-effect btn";
                next_content.addEventListener("click", Listener.nextSong, false);

                var next = document.createElement("i");
                next.className= "material-icons";
                next.appendChild(document.createTextNode("fast_forward"));
                next_content.appendChild(next);

                var previous_content = document.createElement("button");
                previous_content.id = "button-previous";

                previous_content.className = "btn-floating waves-effect btn";
                previous_content.addEventListener("click", Listener.previousSong, false);

                var previous = document.createElement("i");
                previous.className= "material-icons";
                previous.appendChild(document.createTextNode("fast_rewind"));
                previous_content.appendChild(previous);

                div_buttons.appendChild(previous_content);
                div_buttons.appendChild(play_content);
                div_buttons.appendChild(next_content);
                div_buttons.appendChild(favorite_content);
            } else {
                favorite.appendChild(document.createTextNode("loyalty"));
                favorite_content.appendChild(favorite);

                div_buttons.appendChild(play_content);
                div_buttons.appendChild(favorite_content);
            }




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

        // to load the recommendations section
        renderSection: function(title){

            Layout.removeLastSection();

            var generalSection=document.getElementById("general");

            var sectionTitle = document.createElement("h3");

            var section = document.createElement("div");
            section.id = "section-id";

            sectionTitle.appendChild(document.createTextNode(title));
            section.appendChild(sectionTitle);

            section.className="row";

            // if there arent recommendations loaded wh show a circular progress while
            // any recommendation is visible
            if (recommendations == null || recommendations.length == 0) {

                var preload = Layout.renderPreload();
                section.appendChild(preload);
            }

            generalSection.appendChild(section);

        },

        selectTab: function(tabId) {

            //$("#tab-searches").click();
            //$("#tab-searches2").click()

        },
        /**
         * @description Renders a circular progress component.
         *
         * @returns {Element} To be added into a DOC node.
         *
         * NOTE: Not working as desired u.u
         */
        renderPreload: function() {

            var progress = document.createElement("div");
            progress.className = "preloader-wrapper small active";
            progress.id = ID_PRELOAD_COMPONENT;

            var spinner = document.createElement("div");
            spinner.className = "spinner-layer spinner-green-only";

            var circleAnimation = document.createElement("div");
            circleAnimation.className = "circle-clipper left";

            var circle1 = document.createElement("div");
            circle1.className = "circle";
            circleAnimation.appendChild(circle1);

            var gap = document.createElement("div");
            gap.className = "gap-patch";

            var circle2 = document.createElement("div");
            circle2.className = "circle";
            gap.appendChild(circle2);

            var circleRightAnimation = document.createElement("div");
            circleRightAnimation.className = "circle-clipper right";

            var circle3 = document.createElement("div");
            circle3.className = "circle";
            circleRightAnimation.appendChild(circle3);

            spinner.appendChild(circleAnimation);
            spinner.appendChild(gap);
            spinner.appendChild(circleRightAnimation);
            progress.appendChild(spinner);

            return progress;
        },

        /**
         * @description If exists, removes a circular progress component.
         */
        removePreload: function() {

            var progress = document.getElementById(ID_PRELOAD_COMPONENT);
            if (progress) progress.parentNode.removeChild(progress);
        }
    };

    var Track = {

        getName: function (track) {

            return track["name"];
        },
        getArtist: function (track) {

            console.log("artist: " + track["artists"]);
            return track["artists"][0]["name"];
        },
        /**
         * Finds a track in the playlist.
         *
         * @param track The track to find.
         *
         * @returns {boolean} true if the track exists, false if not.
         */
        existsInPlaylist: function (track) {

            for (var i = 0; i < sectionTracks[Section.PLAYLIST].length; i++)

                if (sectionTracks[Section.PLAYLIST][i] === track) return true;  // shame

            return false;
        },
        /**
         * Removes a track from the playlist.
         *
         * @param track The track to be removed.
         */
        // Pre: the playlist does not have duplicated tracks
        removeFromPlayList: function(track) {

            var index = sectionTracks[Section.PLAYLIST].indexOf(track);
            if (index >= 0) sectionTracks[Section.PLAYLIST].splice(index, 1);
        }
    };


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

            currentSection = Section.SEARCHES;
            sectionTracks[Section.SEARCHES] = json_response_tracks.tracks.items;
            //Listener.eventSearchesTabSelected();
            //Update Layout
            //Layout.setImages(json_response_tracks.tracks.items, 8);

            Layout.selectTab("tab-searches");

        },
        getTrack: function(idTrack) {
            console.log("get track: " + sectionTracks[currentSection][idTrack]);
            return sectionTracks[currentSection][idTrack];
        }
    };

    var Recommendations = {

        addRecommendation: function (JSON_track) {
            var track_recommen = JSON.parse(JSON_track);
            var num = recommendations.length;
            recommendations[num] = track_recommen.tracks.items[0];
            sectionTracks[Section.RECOMMENDED_SONGS] = recommendations;

            Materialize.toast('¡Nuevas recomendaciones listas!', 4000) // 4000 is the duration of the toast
            //Listener.eventCancionesRecomendadas();
            Layout.removePreload();
        }
    };

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
            var buttons = document.getElementsByClassName("btn-floating waves-effect btn play");
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
                Materialize.toast('No has introducido tu búsqueda', 3000);
            } else {
                Search.searchSong(textField.value);
                Materialize.toast('Busqueda realizada', 3000);
            }
        },

        eventPlay: function (event) {


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
                        currentSong = id_track;
                        console.log("current song" + currentSong);
                        player.muteButtons();
                        player.loadSong(trackInfo.preview_url);
                        buttonPlayPause.dataset.playing = "true";
                    } else {
                        currentSong = id_track;
                        console.log("current song" + currentSong);
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


                } else {
                    icon.appendChild(document.createTextNode("play_arrow"));
                    //event.srcElement.appendChild(icon);
                    buttonPlayPause.appendChild(icon);
                    console.log(buttonPlayPause.parentNode.value);
                    buttonPlayPause.value= "doPlay";

                    player.pause();


                }

            //}

        },

        eventFavorite: function () {
            var buttonFavorite=event.srcElement.parentNode;

            console.log(buttonFavorite.dataset.favorite);

            if (buttonFavorite.dataset.favorite === 'true') {
                console.log("hola"); // hola carla :D
                buttonFavorite.dataset.favorite = 'false';
            } else {
                console.log(buttonFavorite.parentNode.parentNode.childNodes[1].childNodes[0].value);
                console.log(buttonFavorite.parentNode.parentNode.childNodes[1].childNodes[1].value);
                console.log(buttonFavorite.parentNode.parentNode.childNodes[1].childNodes[2].value);
                var cardsList = document.getElementById("section-id");

                // so funny hahah
                var toCompareWith = buttonFavorite.parentNode.parentNode.parentNode.parentNode.parentNode;

                // the idea is simple, just find the selected card to pass the FULL info of the track
                // to the playList position in sectionTracks!
                for (var i = 0; i < cardsList.childElementCount; i++) {

                    if (cardsList.childNodes[i] === toCompareWith) {

                        //in case we are in the playlist section, we remove the element instead of adding it again
                        if (currentSection === Section.PLAYLIST) {

                            Track.removeFromPlayList(sectionTracks[currentSection][i - 1]);
                            storage.savePlaylist(sectionTracks[Section.PLAYLIST]);
                            Materialize.toast('Canción eliminada de la lista', 3000); // 4000 is the duration of the toast
                            Listener.eventPlayListTabSelected();
                            // TODO: check how to click again on the tab programatically
                            //window.location.reload(true);
                            break;
                        }
                        if (Track.existsInPlaylist(sectionTracks[currentSection][i - 1])) {
                            alert("Esta canción ya se encuentra en la lista de reproducción.");
                            break;
                        }
                        else {

                            sectionTracks[Section.PLAYLIST].push(sectionTracks[currentSection][i - 1]);
                            storage.savePlaylist(sectionTracks[Section.PLAYLIST]);
                            Materialize.toast('Añadida a tu lista de reproducción', 3000); // 3000 is the duration of the toast
                            //window.location.reload(true);
                            break;
                        }
                    }
                }
                buttonFavorite.dataset.favorite = 'true';
            }
        },


        eventCancionesRecomendadas: function () {
            //alert("cancionesRecomendadas");
            Layout.renderSection("Canciones Recomendadas");
            currentSection = Section.RECOMMENDED_SONGS;

            //tracks = recommendations;

            if (recommendations.length === 0) Layout.renderEmptySectionMessage("Canciones Recomendadas");

            for (var i = 0; i < recommendations.length; i++) {
                console.log("track"+i+":");
                console.log(recommendations[i]);
                if (recommendations[i] != null) Layout.renderThumbnail(recommendations[i], i);
            }
        },

        eventSearchesTabSelected: function() {

            Layout.renderSection("Resultados de tu búsqueda");
            currentSection = Section.SEARCHES;

            if (sectionTracks[currentSection] == null)
                Layout.renderEmptySectionMessage("Resultados de tu búsqueda");
            else {

                if (sectionTracks[currentSection].length === 0)
                    Layout.renderEmptySectionMessage("Resultados de tu búsqueda");

                for (var i = 0; i < sectionTracks[currentSection].length; i++) {

                    Layout.renderThumbnail(sectionTracks[currentSection][i], i);
                }
            }
            Layout.removePreload();
        },

        eventPlayListTabSelected: function() {

            Layout.renderSection("Tu Lista de Reproducción");
            currentSection = Section.PLAYLIST;

            if (sectionTracks[currentSection] == null)
                Layout.renderEmptySectionMessage("Tu Lista de Reproducción");
            else {

                if (sectionTracks[currentSection].length === 0)
                    Layout.renderEmptySectionMessage("Tu Lista de Reproducción");

                for (var i = 0; i < sectionTracks[currentSection].length; i++) {

                    Layout.renderThumbnail(sectionTracks[currentSection][i], i, true);
                }
            }
            Layout.removePreload();
        },

        previousSong: function() {

        },
        nextSong: function() {
            var cards_songs = document.getElementById("section-id");
            console.log("parent Node");

            if(currentSong == (sectionTracks[currentSection].length -1 )) {
                currentSong = 0;
            } else {
                currentSong = currentSong + 1;

            }
            player.muteButtons();

            var card = cards_songs.childNodes[currentSong + 1];
            console.log(card.lastChild.lastChild.lastChild.lastChild.childNodes[1]);
            var buttonPlayPause = card.lastChild.lastChild.lastChild.lastChild.childNodes[1];

            buttonPlayPause.removeChild(buttonPlayPause.firstChild);
            buttonPlayPause.dataset.playing = "true";
            buttonPlayPause.value= "doPause";



            var icon = document.createElement("i");
            icon.className = "material-icons";
            icon.appendChild(document.createTextNode("pause"));
            buttonPlayPause.appendChild(icon);

            var trackInfo = Search.getTrack(currentSong);

            player.loadSong(trackInfo.preview_url);


        }
    };

    recommend.getRecommendedTracks("spotify:track:6vQNfrrrtwgeqg2tty5garfSgWcm74KEZYfD", "ABBA",
        "Mamma mia", "5", Recommendations.addRecommendation);

    var Application = {
        start: function() {
            Search.addListener();

            sectionTracks[Section.PLAYLIST] = storage.getSavedPlaylist();

            var aux = document.getElementById("canciones-recomendadas");
            Listener.add (aux, "click", Listener.eventCancionesRecomendadas, false);

            var searchesTab = document.getElementById("tab-searches");
            Listener.add(searchesTab, "click", Listener.eventSearchesTabSelected, false);

            var playlistTab = document.getElementById("tab-playlist");
            Listener.add(playlistTab, "click", Listener.eventPlayListTabSelected, false);
        }
    };


    //Init application when DOM is loaded
    Listener.add (
        document,
        "DOMContentLoaded",
        Application.start(),
        false
    );
}());
