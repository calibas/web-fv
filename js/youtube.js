/************************************************************
 * youtube.js
 * Demonstration of a local playlist using the IFrame API.
 ************************************************************/

/**
 * Immediately load the YouTube IFrame Player API script
 * by creating and inserting a <script> tag.
 */
// (function() {
//     const tag = document.createElement('script');
//     tag.src = "https://www.youtube.com/iframe_api";
//     const firstScriptTag = document.getElementsByTagName('script')[0];
//     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//   })();
  
  // let player;
  
  // Maintain a local array of YouTube video IDs
  let localPlaylist = [];
  
  /**
   * This function is called automatically when the IFrame API is ready.
   * It must be named exactly "onYouTubeIframeAPIReady" so that the
   * YouTube API recognizes and invokes it.
   */
  // function onYouTubeIframeAPIReady() {
  //   player = new YT.Player('player', {
  //     height: '360',
  //     width: '640',
  //     // Don’t load an initial video if you prefer to start “empty.”
  //     videoId: '',
  //     events: {
  //       'onReady': onPlayerReady,
  //       'onStateChange': onPlayerStateChange
  //     }
  //   });
  // }
  
  /**
   * Called when the player is ready.
   */
  // function onPlayerReady(event) {
  //   console.log('YouTube Player is ready.');
  // }

  // function onPlayerStateChange(event) {
  //   if (event.data === YT.PlayerState.ENDED) {
  //     // Move to next video
  //     if (localPlaylist.length > 0) {
  //       const nextId = localPlaylist.shift(); 
  //       player.loadVideoById(nextId);
  //       refreshLocalPlaylistDisplay();
  //     }
  //   }
  // }
  
  /**
   * Adds a video ID to the local playlist array
   * and updates the on-page display of the playlist.
   */
  // function addToLocalPlaylist() {
  //   const input = document.getElementById('video-id-input');
  //   const videoId = input.value.trim();
  
  //   // Simple validation
  //   if (!videoId) {
  //     alert('Please enter a valid video ID.');
  //     return;
  //   }
  
  //   // Add to array
  //   localPlaylist.push(videoId);
  
  //   // Clear out the text field
  //   input.value = '';
  
  //   // Update display
  //   refreshLocalPlaylistDisplay();
  // }
  
  /**
   * Displays the local playlist on the page.
   */
  function refreshLocalPlaylistDisplay() {
    const playlistContainer = document.getElementById('local-playlist');
    playlistContainer.innerHTML = '';
    localPlaylist.forEach(id => {
      const li = document.createElement('li');
      li.textContent = id;
      playlistContainer.appendChild(li);
    });
  }
  
  /**
   * Instructs the player to load the entire local playlist array.
   * This will begin playing the first video in the array.
   */
  // function loadLocalPlaylist() {
  //   if (player) {
  //     if (localPlaylist.length > 0) {
  //       // player.loadPlaylist(localPlaylist, /* startIndex= */ 0, /* startSeconds= */ 0);
  //       const nextId = localPlaylist.shift(); 
  //       player.loadVideoById(nextId);
  //       refreshLocalPlaylistDisplay();
  //     } else {
  //       alert('Your local playlist is empty!');
  //     }
  //   } else {
  //     console.error('Player not yet initialized.');
  //   }
  // }

  // function playVideo(videoId){
  //   if (player) {
  //       player.loadVideoById(videoId);
  //   }
  // }

  /**
   * Skip to the previous video in the local playlist.
   */
//   function previousVideo() {
//     if (player) {
//       player.previousVideo();
//     }
//   }
  
  /**
   * Skip to the next video in the local playlist.
   */
  // function nextVideo() {
  //   if (player) {
  //       if (localPlaylist.length > 0) {
  //           const nextId = localPlaylist.shift(); 
  //           player.loadVideoById(nextId);
  //           refreshLocalPlaylistDisplay();
  //       }
  //   }
  // }

  function addToPlaylist(videoId) {
    // Keeping URL length under 2,000 characters
    if (localPlaylist.length >= 162) {
      alert('Max playlist length reached.');
      return;
    }
    localPlaylist.push(videoId);
    refreshLocalPlaylistDisplay();
    createPlaylist();
  }

function createPlaylist() {
    // https://www.youtube.com/watch_videos?video_ids=M7lc1UVf-VE,9bZkp7q19f0
    let videoIds = '';
    localPlaylist.forEach(id => {
        videoIds += id;
        if (localPlaylist.indexOf(id) < localPlaylist.length - 1)
            videoIds += ','
      });
    const playlistLink = `https://www.youtube.com/watch_videos?video_ids=${videoIds}`;
    document.getElementById("playlist-link").textContent = playlistLink;
}