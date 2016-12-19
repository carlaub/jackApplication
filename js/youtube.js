

var Youtube = function () {

    var googleApiKey = "AIzaSyDRKGTFi1upX-OWZI_EoFTB_Bj1vkE6vXw";
    var apiLink      = "https://www.googleapis.com/youtube/v3/";


    /**
     * Sends an asynchronous request and, if everything goes well, sends the data to the
     * callback passed as param.
     *
     * @param myRequest The request to be send.
     * @param callback  The function which will receive the information.
     */
    function sendRequest(myRequest, callback) {

        console.log("on sendRequest: " + myRequest);

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {

            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {

                callback(request.responseText);

            } else {
                return request.responseText;
            }
        };
        request.open('GET', myRequest);
        request.send();
    }

    function youtubeSearch(searchText, callback) {
        var defaultLimit = 1;


        searchText = searchText.replace(/\s+/g,"+"); // replaces whitespaces by '+'

        console.log("search: " + searchText);

        var request = apiLink + "search?part=snippet&videoEmbeddable=true&order=viewCount&q=" + searchText
            + "&type=video" + "&maxResults=" + defaultLimit + "&key=" + googleApiKey + "&part=snippet,playerYT";

        sendRequest(request, callback);
    }


    return {

        /**
         *
         * @param artist name of the artist
         * @param song   name of the song
         */
        play: function(artist, song) {

            alert("on play action");

            youtubeSearch(artist + " " + song, function(data) {

                result = JSON.parse(data);
                if (result.items.length == 0)

                    alert("No se ha podido reproducir la canción seleccionada.");
                else {


                    firstResult = result.items[0];
                    alert("first result: " + firstResult["snippet"]["title"]);
                    return firstResult["snippet"]["title"];
                }
            });
        }
    }
};
