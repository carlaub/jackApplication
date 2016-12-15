/**
 * Logic JackApp
 */






(function() {



    /******************************************************************************************************
     *
     ******************************************************************************************************/

    var spotify = Spotify();

    var Layout = {
        setImagesSearch: function(tracks) {

            //la barra del titulo de busqueda
            var divRowSearch = document.getElementById("div-row-search");

            if(divRowSearch == null){

                var sectionTitleSearch = document.getElementById("about-search");
                sectionTitleSearch.className="bg-primary";

                var containerTitleSearch = document.getElementById("title-search");
                divRowSearch = document.createElement("div");
                divRowSearch.id="div-row-search";
                divRowSearch.className="col-lg-8 col-lg-offset-2 text-center";
                var h2Search = document.createElement("h2");
                h2Search.appendChild(document.createTextNode("Busqueda"));
                var hrSearch = document.createElement("hr");
                hrSearch.className = "light";
                divRowSearch.appendChild(h2Search);
                divRowSearch.appendChild(hrSearch);
                containerTitleSearch.appendChild(divRowSearch);
            }

            //borrar busqueda anterior
            var containerToRemove=document.getElementById("container-search");

            if (containerToRemove != null) {
                containerToRemove.parentNode.removeChild(containerToRemove);
            }

            //mostrar resultados nueva busqueda
            var sectionSearch=document.getElementById("section-search");
            var containerSearch = document.createElement("div");
            containerSearch.id="container-search";
            containerSearch.className="row no-gutter popup-gallery";
            sectionSearch.appendChild(containerSearch);

            console.log(tracks);//Debug

            if (tracks.length < 6) {
                alert("No hay resultados para su búsqueda.");
            } else {
                for (var i = 0; i < 6; i ++) {
                    Layout.renderThumbnail(tracks[i]);
                }
            }


        },
        renderThumbnail: function(track) {



            var containerThumbnail = document.createElement("div");
            containerThumbnail.id = "containerThumbnail";
            containerThumbnail.className = "col-lg-4 col-sm-6";

            //IMPORTANT! Click not implemented yet.
            var clickLink = document.createElement("a");
            clickLink.className="portfolio-box"
            var imgSong = document.createElement("img");
            imgSong.className="img-responsive";
            imgSong.alt="";
            imgSong.src=track.album.images[0].url;


            clickLink.appendChild(imgSong);
            containerThumbnail.appendChild(clickLink);

            document.getElementById("container-search").appendChild(containerThumbnail);
            console.log(document.getElementById("container-search"));

        }
    }
    var Search = {
        addListener: function() {
            var button = document.getElementById("search-button");

            Listener.add (button, "click", Listener.eventSearch, false);
        },
        searchSong: function(song) {
           // var myRequest = prepareSearchRequest("the killers", "track", "5");
            var myRequest = spotify.prepareSearchRequest(song, "track", "6");

             spotify.spotifySearch(myRequest, Search.getTracks);

        },
        getTracks: function(responseData) {
            var json_response_tracks = JSON.parse(responseData);

            //Update Layout
            Layout.setImagesSearch(json_response_tracks.tracks.items);
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
                alert("hola, has introducido: " + textField.value);
                Search.searchSong(textField.value);
            }

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
