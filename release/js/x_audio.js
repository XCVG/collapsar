/**
 x_audio.js
 New music playback engine, may eventually handle sfx as well.
 */
 
 var _x_audio_music = null;
 var _x_audio_looping = true;
 
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
	_x_audio_music.loop = _x_audio_looping;
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
 
 function x_audio_setLooping(looping)
 {
     _x_audio_looping = looping;
 }
 
 function x_audio_playSound(sfx_id)
 {
    if (OPTIONS.sfx == false) return;
    
    //check alias first
    var sfx_alias = _x_audio_aliases[sfx_id];    
    if(sfx_alias)
        sfx_id = sfx_alias;
    
    //perform lookup
    var sound = _x_audio_sounds[sfx_id];
    
    if(!sound)
    {
        console.log("Sound " + sfx_id + " not found!");
        return;
    }

     try {
       sound.currentTime = 0;
           sound.play();
     }
     catch(err)
     {
           console.log("cound not play sound #" + sfx_id);
           console.log(err);
     }
 }
 
 function x_audio_playSoundEx(soundName)
 {
     console.log("playSoundEx is deprecated!");
     
    if (OPTIONS.sfx == false)
            return;
        
     //check alias first
    var sfx_alias = _x_audio_aliases[soundName];    
    if(sfx_alias)
        soundName = sfx_alias;
    
    //perform lookup
    var sound = _x_audio_sounds[soundName];
    
    if(!sound)
    {
        //fallback to fixed path+name
        try
        {
            var soundPath = "sounds/" + soundName + ".wav";
            var sound = new Audio(soundPath);
            sound.play();
        }
        catch (err)
        {
            console.log("cound not play sound #" + soundName);
            console.log(err);
        }
    }
    else
    {
        //otherwise play normally
        try
        {
            sound.currentTime = 0;
            sound.play();
        }
        catch(err)
        {
            console.log("cound not play sound #" + soundName);
            console.log(err);
        }
    }

 }


 