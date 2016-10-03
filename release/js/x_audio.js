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
	
	//_x_audio_music = new Audio(song_path);
	_x_audio_music = x_audio_loadAudio(music);
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
 
 //load an audio file into an Audio object and return
 //soundType can be sounds, music, path, or both
 function x_audio_loadAudio(soundName, soundType="path")
 {
	 var soundPath;
	 var audio;
	 
	 if(soundType === "sounds")
	 {
		 //look in sounds folder
		 audio = _x_audio_loadAudioFromPath("sounds/" + soundName);
	 }
	 else if(soundType === "music")
	 {
		 //look in music folder
		 audio = _x_audio_loadAudioFromPath("music/" + soundName);
	 }
	 else if(soundType === "path")
	 {
		 //treat soundName as a full path
		 audio = _x_audio_loadAudioFromPath(soundName);
	 }
	 else if(soundType === "both")
	 {
		//try music, then sounds
		audio = _x_audio_loadAudioFromPath("music/" + soundName);
		if(!audio)
			audio = _x_audio_loadAudioFromPath("sounds/" + soundName);
	 }
	 else
	 {
		 console.log("Unknown sound path type " + soundType);
	 }
	 
	 if(!audio)
		 console.log("Failed to load " + soundName);
	 
	 return audio;
 }
 
 //internal function tries to load audio from path
 //return null on failure
 function _x_audio_loadAudioFromPath(soundPath)
 {
	 var audio;
	 //try WAV, then OGG, then MP3
	 audio = new Audio(soundPath + ".wav");
	 console.log(audio.error);
	 if(!audio)
		 audio = new Audio(soundPath + ".ogg");
	 if(!audio)
		 audio = new Audio(soundPath + ".mp3");
	 
	 return audio;
	 
 }
 