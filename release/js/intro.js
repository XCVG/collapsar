/**
 * Intro screen
 */

//new for Corgi Dungeon Crawler
//TODO: rework into the "slideshow" for AA2

var _INTRO_SLIDES_NAMES = ["intro1.png"]; //get ALL them

var intro = new Object();

//lolwut
intro.slides = new Array();
intro.loadedSlides = 0;
intro.loaded = false;

intro.pos = 0;

function intro_init()
{
    //TODO write loading function
    
    //TODO load loop
    
  redraw = true;
}

//function ending_onload() {
//  ending.img_loaded = true;
//}
/*** Image loading Helpers **********************/

function intro_slide_onload() {
    intro.loadedSlides--;
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
	
	if(intro.pos < intro.posEnd)
	{
		if(intro.delayCounter >= intro.scrollDelay)
		{
			intro.delayCounter = 0;
			intro.pos += intro.scrollSpeed;
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
