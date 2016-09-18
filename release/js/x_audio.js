/**
 x_audio.js
 New music playback engine, may eventually handle sfx as well.
 */
 
 var _x_audio_music = null;
 
 function x_audio_init()
 {
	 
 }
 
 function x_audio_playMusic(music)
 {
	//if we shouldn't have music, stop and abort
	if (OPTIONS.music == false)
	{
		x_audio_stopMusic();
		return;
	}
	
	//abort if it matches
	
	 
 }
 
 function x_audio_stopMusic()
 {
	if(_x_audio_music != null)
	{
		_x_audio_music.pause();
		_x_audio_music = null;
	}
 }
 
 /*
   var audio_node = document.getElementById("bgmusic");

  if (OPTIONS.music == false) {
    audio_node.pause();
    mazemap.current_song = "";
    return;
  }
  
  // don't reset song if it's already playing
  if (song_filename == mazemap.current_song) return;

  mazemap.current_song = song_filename;

  var song_path = "music/" + song_filename;
  
  // stop the current song
  audio_node.pause();

  // clear the current song
  audio_node.innerHTML = "";

  // do we need to play ogg or mp3?
  var newsource = document.createElement('source');
  //if (audio_node.canPlayType('audio/mpeg;')) {
  //  newsource.type = "audio/mpeg";
  //  newsource.src = song_path + ".mp3";
  //} else {
    newsource.type = "audio/ogg";
    newsource.src = song_path + ".ogg";
  //}
  audio_node.appendChild(newsource);
  audio_node.load();
  audio_node.play();
 */