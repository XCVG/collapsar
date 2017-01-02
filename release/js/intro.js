/**
 * Intro screen
 */

//reworked into slideshow for AA2

var _INTRO_SLIDES_NAMES = ["intro_silhouette1.png", "intro_worldchanging.png", "intro_map.png", "intro_forge.png", "intro_boat.png", "intro_silhouette2.png", "intro_notover.png"]; //get ALL them

var intro = new Object();

//lolwut
intro.slides = new Array();
intro.loadedSlides = 0;
intro.loaded = false;

intro.pos = 0;

intro.slideDelay = 300;
intro.delayCounter = 0;

function intro_init()
{
    //load ALL  the things
    for(var i = 0; i < _INTRO_SLIDES_NAMES.length; i++)
    {
        intro.slides[i] = new Image();
        intro.slides[i].src = "images/intro/" + _INTRO_SLIDES_NAMES[i];
        intro.slides[i].onload = function() {intro_slide_onload();};
        //console.log(intro.slides[i]);
    }
    
  redraw = true;
}

function intro_slide_onload() {
    intro.loadedSlides++;
    //console.log("loaded " + intro.loadedSlides + "/" + intro.slides.length);
    if(intro.loadedSlides == intro.slides.length)
        intro.loaded = true;
    }


function intro_logic()
{
	if ((pressing.mouse && !input_lock.mouse) || (pressing.action && !input_lock.action))
	{  
		if(pressing.action)
			input_lock.action = true;

		//on mouse press, go to the next scene
		intro_startGame();
	}
	
	if(intro.pos < intro.slides.length)
	{
		if(intro.delayCounter >= intro.slideDelay)
		{
			intro.delayCounter = 0;
			intro.pos++;
			redraw = true;
		}
		else
		{
			intro.delayCounter++;
		}
	}
	else
	{
		intro_startGame();
	}
	//console.log(intro.pos);
		
}

function intro_render()
{
  //console.log(intro.pos);
  
  if (!bitfont.loaded || !intro.loaded) {
    redraw = true;
    return;
  }
  
  x_audio_playMusic("intro");
  
  ctx.drawImage(intro.slides[intro.pos], 0, 0, 160*SCALE, 120*SCALE);

}

function intro_startGame()
{
  gamestate = STATE_EXPLORE;
  mazemap_set_music(atlas.maps[mazemap.current_id].music);
  redraw = true;
}
