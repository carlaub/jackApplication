/**
 * Created by Albertpv on 13/12/16.
 *
 * @author Jorge Melguizo Torres
 * @author Carla Urrea Blazquez
 * @author Albert Pernia Vazquez
 *
 *
 * Use example:
 *
 * var spotify = Spotify();
 *
 * var myRequest = spotify.prepareRequest("the killers", "track", "5");
 * spotify.searchRequest(myRequest, callbackFunction);
 *
 */


var Spotify = function () {


    /**
     * Sends an asynchronous request and, if everything goes well, sends the data to the
     * callback passed as param.
     *
     * @param myRequest The request to be send.
     * @param callback  The function which will receive the information.
     */

    function sendRequest(myRequest, callback) {

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {

            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {

                //console.log(request.responseText);
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

    return {

        /**
         * Prepares the parameters for the http GET.
         *
         * @param infoToSearch anything (the killers, queen, jet...)
         * @param type can be [track,artist,album] or combined with ","
         * @param limit a number that represents the maximum results.
         */
        prepareSearchRequest: function(infoToSearch, type, limit) {

            return "q=" + infoToSearch.replace(/\s+/g,"+") + "&type=" + type.replace(/\s+/g,"") + "&limit=" + limit;
        },
        /**
         * Searches data in Spotify and returns it to the callback function passes as param.
         *
         * @param searchRequest  The data that will be searched.
         * @param callback       The function which will handle the response.
         */
        spotifySearch: function(searchRequest, callback) {

            sendRequest("https://api.spotify.com/v1/search?" + searchRequest, callback);
        }
    }
}



