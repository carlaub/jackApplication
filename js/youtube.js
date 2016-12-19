

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


    return {

        youtubeSearch: function(searchText, callback) {
            var defaultLimit = 1;

            searchText = searchText.replace(/\s+/g,"+"); // replaces whitespaces by '+'

            var request = apiLink + "search?part=snippet&videoEmbeddable=true&order=viewCount&q=" + searchText
                + "&type=video" + "&maxResults=" + defaultLimit + "&key=" + googleApiKey + "&part=snippet,playerYT";

            sendRequest(request, callback);
        }
    }
};
