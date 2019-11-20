const axios = require('axios');

/**
 * Takes in the spotifyApi instnance and a user's access token and retrieves their 
 *  current playback state.
 *  
 * Returns pertinent information for matching the retrieved playback state.
 */
const retrievePlaybackData = async (spotifyApi, accessToken) => {
    // Sets access token to the current user
    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getMyCurrentPlaybackState();
    const playbackState = {
        trackUri: response.body.item.album.uri,
        trackNum: response.body.item.track_number,
        trackTime: response.body.progress_ms,
        timestamp: response.body.timestamp,
    }
    return playbackState;
}

const playTrack = async (spotifyApi, accessToken, albumUri, trackNumber, trackTime) => {
    try {
        // Sets access token to the current user
        // spotifyApi.setAccessToken(accessToken);
        let trackData = {
            context_uri: albumUri,
            offset: {
                position: trackNumber - 1,
            },
            position_ms: trackTime // Will need to calculate an offset to deal with network lag.
        }
        // Manually makes request, bug in node.js library
        const response = await axios.put(
            "https://api.spotify.com/v1/me/player/play",
            trackData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        // const response = await spotifyApi.play();
        if (response.data == '');
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    retrievePlaybackData,
    playTrack
}
