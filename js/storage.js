/**
 * Created by Albertpv on 26/12/16.
 */


/**
 * Used to parse json stored track data.
 *
 * @type {{getArtistName: TrackStored.getArtistName}}
 */
var TrackStored = {

    getArtistName: function(track) {

        return track["artist"];
    },
    getTrackName: function(track) {

        return track["title"];
    }
};


var LocalStorage = function() {

    var storage = localStorage;

    const KEY_PLAYLIST      = "playlist";
    const KEY_TRACKS        = "tracks";


    /**
     * This method implements a binary search algorithm to find if the new track
     * is already stored in local storage. LocalStorage has its limitations and tracks will be
     * accessed a lot of times during the use of the website so, taking into account that we don't
     * have time nor experience to implement a good backend we improve the access to local storage
     * doing a O(log n) needed search (and iterative).
     *
     * @param track     The track that can be already stored
     * @param tracks    The array of tracks stored in local storage
     *
     * @returns {number} -1 if not found, else the position of the match track
     */
    function findTrack(track, tracks) {
        var found = false;
        var i = Math.floor(tracks.length / 2);
        var max = tracks.length, min = 0;

        console.log("on findTrack, number of tracks stored: " + tracks.length);
        console.log("data: " + JSON.stringify(tracks, null, 4));


        while (!found) {

            console.log("finding the track... " + i);
            console.log("comparing track id: " + track.id + " with...");
            console.log("data: " + JSON.stringify(tracks[i], null, 4));

            if (tracks[i].id.localeCompare(track.id) == 0) {

                found = true;
            }
            else {

                if (tracks[i].id.localeCompare(track.id) < 0) {

                    if (i == min) break;
                    min = i;
                    i = Math.floor((max+min)/2);
                }
                else {

                    if (i == max) break;
                    max = i;
                    i = Math.floor((max+min)/2);
                }
            }
        }

        return found? i : -1;
    }

    function TrackData(id, title, artist, album) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.timesListened = 1;

        this.getId = function() { return this.id; };
        this.getTitle = function() { return this.title; };
        this.getArtist = function() { return this.artist; };
        this.getAlbum = function() { return this.album; };
    }



    return {

        /**
         * Saves the current playlist in local storage.
         *
         * @param playlist The playlist to store.
         */
        savePlaylist: function(playlist) {

            storage.setItem(KEY_PLAYLIST, JSON.stringify(playlist));
        },
        /**
         * @returns {Array} The existing playlist or an empty array if there was no
         *                  data saved in.
         */
        getSavedPlaylist: function() {

            return storage.getItem(KEY_PLAYLIST) != null ?
                        JSON.parse(storage.getItem(KEY_PLAYLIST)) : [];
        },
        /**
         *
         * @param trackId
         * @param trackTitle
         * @param trackArtist
         * @param trackAlbum
         */
        saveListenedTrack: function(trackId, trackTitle, trackArtist, trackAlbum) {

            console.log("on saveListenedTrack");

            var track = new TrackData(trackId, trackTitle, trackArtist, trackAlbum);
            console.log("new track: " + JSON.stringify(track, null, 4));

            var tracks = storage.getItem(KEY_TRACKS) != null ? JSON.parse(storage.getItem(KEY_TRACKS)) : [];
            console.log("data: " + JSON.stringify(tracks, null, 4));

            var pos;
            if (tracks.length == 0 || (pos = findTrack(track, tracks)) < 0) {

                console.log("adding new track!");
                tracks.push(track);
            }
            else tracks[pos]["timesListened"]++;


            tracks.sort(function(a, b) {

                return a.id < b.id? -1 : a.id === b.id? 0 : 1;
            });

            storage.setItem(KEY_TRACKS, JSON.stringify(tracks));

            console.log("finally: " + JSON.stringify(LocalStorage().getListenedTracks(), null, 4));
        },
        getListenedTracks: function() {

            return storage.getItem(KEY_TRACKS) != null ? JSON.parse(storage.getItem(KEY_TRACKS)) : [];
        },
        getListenedTracksOrderedByPlays: function() {

            var tracks = this.getListenedTracks();
            tracks.sort(function (a, b) {

                return a["timesListened"] > b["timesListened"]? 1 : a["timesListened"] === b["timesListened"]? 0 : -1;
            });

            return tracks;
        }
    }

};
