/**
 x_audio.js
 New music playback engine, may eventually handle sfx as well.
 */
 
 var _x_audio_music = null;
 
 var _x_audio_sounds = new Object();
 var _x_audio_aliases = new Object();
 var _x_audio_musics = new Object();
 
 function x_audio_init()
 {
     _x_audio_loadSounds();
     _x_audio_loadMusics();
 }
 
 function _x_audio_loadSounds()
 {
     var soundlist = data_soundinfo.sounds;
     //console.log(soundlist);
     for(var key in soundlist)
     { 
         //we now have a key/value pair (index/attr)
        var value = soundlist[key];
        //console.log(key + ":" + value);
        //console.log(value.src);
        //console.log(value.alias);
        
        if(value.src)
        {
            //load sound, add to list
            console.log("added sound: " + key);
            var newsound = new Audio(value.src);
            newsound.load();
            _x_audio_sounds[key] = newsound;
        }
        else if(value.alias)
        {
            console.log("added alias: " + key);
            _x_audio_aliases[key] = value.alias;
        }
     }
 }
 
 function _x_audio_loadMusics()
 {
     var musiclist = data_soundinfo.music;
     for(var key in musiclist)
     {
         var value = musiclist[key];
         
         console.log("added music: " + key);
         
         _x_audio_musics[key] = value.src;
     }
 }
 
 function x_audio_playMusic(music)
 {
	//if we shouldn't have music, stop and abort
	if (OPTIONS.music == false)
	{
		x_audio_stopMusic();
		return;
	}

        //try lookup, fallback if not found
        var song_path = _x_audio_musics[music];

        if(!song_path)
            song_path = "music/" + music + ".ogg";
        
        console.log(song_path);

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
 
 function x_audio_playSound()
 {
    if (OPTIONS.sfx == false) return;

     try {
       sounds.fx[sfx_id].currentTime = 0;
           sounds.fx[sfx_id].play();
     }
     catch(err) {
       // it's okay if sounds can't play.
           // TODO: change to "don't play if sound is not loaded yet" like images
           console.log("cound not play sound #" + sfx_id);
           console.log(err);
     };
 }
 
 function x_audio_playSoundEx()
 {
    if (OPTIONS.sfx == false)
            return;

    try
    {
            var soundPath = "sounds/" + soundName + ".wav";
            var sound = new Audio(soundPath);
            sound.play();
    }
    catch (err)
    {
            console.log("cound not play sound #" + sfx_id);
            console.log(err);
    }
 }


 