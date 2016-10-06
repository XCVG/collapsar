/**
 * Intro screen
 */

//new for Corgi Dungeon Crawler

var intro = new Object();

//lolwut
intro.bg = new Image();
intro.bg_loaded = false;
intro.fg = new Image();
intro.fg_loaded = false;
intro.pos = 0;
intro.posEnd = 480; //remember, screen coords are 160x120
intro.delayCounter = 0;
intro.scrollDelay = 0;
intro.scrollSpeed = 0.25;

function intro_init()
{
  intro.bg.src = "images/backgrounds/intro_bg.png";
  intro.bg.onload = function() {intro_bg_onload();};
  intro.fg.src = "images/backgrounds/intro_fg.png";
  intro.fg.onload = function() {intro_fg_onload();};
  redraw = true;
}

//function ending_onload() {
//  ending.img_loaded = true;
//}
/*** Image loading Helpers **********************/

function intro_bg_onload() {intro.bg_loaded = true;}
function intro_fg_onload() {intro.fg_loaded = true;}


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
  
  if (!bitfont.loaded || !intro.bg_loaded || !intro.fg_loaded) {
    redraw = true;
    return;
  }
  
  x_audio_playMusic("intro");
  
  ctx.drawImage(intro.bg, 0, 0, 160*SCALE, 120*SCALE);
  ctx.drawImage(intro.fg, 0, -intro.pos*SCALE, 160*SCALE, 120*SCALE*4);


}

function intro_startGame()
{
  gamestate = STATE_EXPLORE;
  mazemap_set_music(atlas.maps[mazemap.current_id].music);
  redraw = true;
}
