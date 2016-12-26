/**
 * Created by Albertpv on 26/12/16.
 */



var LocalStorage = function() {

    var storage = localStorage;

    const KEY_PLAYLIST  = "playlist";

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
        }
    }

}