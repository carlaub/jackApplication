/**
 * Logic JackApp
 */






(function() {


    /******************************************************************************************************
     *
     ******************************************************************************************************/

    function myCallbackExample(data) {

        console.log("done! " + data);
    }


    var Search = {
        addListener: function() {
            var button = document.getElementById("search-button");

            Listener.add (button, "click", Listener.eventSearch, false);
        },
        searchSong: function(song) {
           // var myRequest = prepareSearchRequest("the killers", "track", "5");
            var spotify = Spotify();

            var myRequest = spotify.prepareSearchRequest(song, "track", "6");

             spotify.spotifySearch(myRequest, myCallbackExample);
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
