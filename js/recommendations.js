/**
 * Created by Albertpv on 21/12/16.
 *
 *
 * @author Jorge Melguizo Torres
 * @author Carla Urrea Blazquez
 * @author Albert Pernia Vazquez
 *
 * Use example:
 *
 *  var recommend = Recommendation();
 *
 *  recommend.getRecommendedTracks("spotify:track:6vQNfrrrtwgeqg2tty5garfSgWcm74KEZYfD", "ABBA",
 *  "Mamma mia", "5", Recommendations.addRecommendation);
 *
 */

var Recommendation = function() {

    const API_URL_TRACKS_RECOMMEND  = "http://musicovery.com/api/V3/";
    const RESPONSE_UNKNOWN_TRACK    = "330";
    const RESPONSE_MAX_REQUESTS     = "103";
    const SECONDARY_SERVICE         = "deezer";
    const ENDPOINT_TRACK            = "track.php?";
    const ENDPOINT_PLAYLIST         = "playlist.php?";
    const MAX_RESULTS               = "5";

    function prepareParameters(fct, id, bucket, limit) {

        var request = "fct=" + fct + "&id=" + id + "&bucket=" + bucket + "&format=json";
        if (limit != null) request += "&songsnumber=" + limit;

        return request;
    }

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
                callback(JSON.parse(request.responseText));
            }
            else console.log("error during the request: " + request.status);

        };

        request.open('GET', myRequest);
        request.send();
    }


    function onDeezerRecommendedTracksResponse(data, renderCallback) {

        if (data["root"]["response"]["anwser"] === "valid" && data["root"]["totalResults"] !== "0") {

            var length = parseInt(data["root"]["request"]["resultsnumber"]);

            // the array of similar tracks
            var tracks = data["root"]["tracks"]["track"];
            for (var i = 0; i < length; i++) {

                var spotify = Spotify();

                var track = tracks[i];
                var artist = track["artist"]["name"];

                var request = spotify.prepareSearchRequest(artist + " " + track["title"], "track", "1");
                spotify.spotifySearch(request, renderCallback);
            }
        }
        else console.log("recommended tracks could not be found.");
    }


    function onDeezerSearchResponse(data, renderCallback) {

        if (data["root"]["response"]["anwser"] === "valid" && data["root"]["totalResults"] !== "0") {

            var secondaryTrackId = data["root"]["tracks"]["track"][0][SECONDARY_SERVICE]["id"];

            var newRecommendationsRequest = API_URL_TRACKS_RECOMMEND + ENDPOINT_PLAYLIST +
                                                prepareParameters("getfromtrack", SECONDARY_SERVICE + ":track:"
                                                                    + secondaryTrackId, "id:" + SECONDARY_SERVICE, null);
            newRecommendationsRequest += "&resultsnumber=" + MAX_RESULTS;

            sendRequest(newRecommendationsRequest, function(data) {

                onDeezerRecommendedTracksResponse(data, renderCallback);
            });
        }
        else console.log("Recommendations for the track could not be found finally.");
    }

    function onSpotifyRecommendedTracksResponse(artist, song, data, renderCallback) {

        // we could not find the spotify track directly in the db, so we will need more steps
        if (data["root"]["response"]["code"] === RESPONSE_UNKNOWN_TRACK) {

            var request = API_URL_TRACKS_RECOMMEND + ENDPOINT_TRACK + "fct=search&title=" + song.replace(/\s+/g,"+")
                + "&artistname=" + artist.replace(/\s+/g,"+") + "&format=json&bucket=id:" + SECONDARY_SERVICE;
            console.log("new request try result: " + request);

            sendRequest(request, function(data) {

                onDeezerSearchResponse(data, renderCallback);
            });

        } else if (data["root"]["response"]["code"] == RESPONSE_MAX_REQUESTS) {

            console.log("No se pueden realizar más peticiones porque ha superado el máximo" +
                " permitido por la API.");
        }
        else {
            console.log("spotify track found! let's parse the result and be happy :)");
            renderCallback(data);
        }
    }

    return {

        /**
         *
         * @description This method tries to find similar tracks for a song.
         *
         * @param spotifyTrackId    The track provided by spotify, ex: spotify:id:code
         * @param artist            The name of the artist
         * @param song              The name of the song
         * @param limit
         * @param renderCallback
         */
        getRecommendedTracks: function(spotifyTrackId, artist, song, limit, renderCallback) {

            var request = API_URL_TRACKS_RECOMMEND + ENDPOINT_TRACK +
                            prepareParameters("getsimilar", spotifyTrackId, "id:spotify", limit);

            sendRequest(request, function(data) {

                onSpotifyRecommendedTracksResponse(artist, song, data, renderCallback);
            });
            //console.log("recommendations request: " + request);

        }

    }



}


