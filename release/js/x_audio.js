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

	var song_path = "music/" + music + ".ogg";
	
	//check against current song and abort on match
	if(_x_audio_music && _x_audio_music.src.substr(_x_audio_music.src.length - song_path.length) == song_path)
		return;

	//if current music exists, stop it!
	if(_x_audio_music)
		_x_audio_music.pause();
	
	_x_audio_music = new Audio(song_path);
	//_x_audio_music = x_audio_loadAudio(music);
	_x_audio_music.loop = true;
	_x_audio_music.load();
	_x_audio_music.play();

	
	 
 }
 
 function x_audio_stopMusic()
 {
	if(_x_audio_music != null)
	{
		_x_audio_music.pause();
		_x_audio_music = null;
	}
 }


 