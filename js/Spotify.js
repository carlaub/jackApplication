/**
 * Created by Albertpv on 13/12/16.
 */




(function () {


    /**
     * Prepares the parameters for the http GET.
     *
     * @param infoToSearch anything (the killers, queen, jet...)
     * @param type can be [track,artist,album] or combined with ","
     * @param limit a number that represents the maximum results
     */
    function prepareSearchRequest(infoToSearch, type, limit) {

        return "q=" + infoToSearch.replace(/\s+/g,"+") + "&type=" + type.replace(/\s+/g,"") + "&limit=" + limit;
    }


    function spotifySearch(searchRequest, callback) {

        sendRequest("https://api.spotify.com/v1/search?" + searchRequest, callback);
    }

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

    /**
     * The method which would parse the json response data before
     * showing it on the website.
     *
     * @param responseData the Json data obtained from the httpRequest
     */
    function myCallback(responseData) {

        alert("myCallback: received! " + responseData);
    }

    /**
     * This could be another method to parse a specific request response.
     *
     * @param responseData the Json data obtained from the httpRequest
     */
    function myCallback2(responseData) {

        alert("myCallback2: received! " + responseData);

    }

    // use example

    // var myRequest = prepareSearchRequest("the killers", "track", "5");
    //
    // spotifySearch(myRequest, myCallback);
    // spotifySearch(myRequest, myCallback2);


}());



