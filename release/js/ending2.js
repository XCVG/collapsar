/**
 * Intro screen
 */

//new for Corgi Dungeon Crawler

var ending2 = new Object();

//lolwut
ending2.bg = new Image();
ending2.bg_loaded = false;
ending2.fg = new Image();
ending2.fg_loaded = false;
ending2.fg2 = new Image();
ending2.fg2_loaded = false;
ending2.pos = -60; //a hack
ending2.posEnd = 440; //remember, screen coords are 160x120
ending2.posKill = 1000;
ending2.delayCounter = 0;
ending2.scrollDelay = 0;
ending2.scrollSpeed = 0.1;
ending2.transparencyFactor = 0.05;
ending2.drawFG2 = false;

function ending2_init()
{
  ending2.bg.src = "images/backgrounds/ending_bg.png";
  ending2.bg.onload = function() {ending2_bg_onload();};
  ending2.fg.src = "images/backgrounds/ending_fg.png";
  ending2.fg.onload = function() {ending2_fg_onload();};
  ending2.fg2.src = "images/backgrounds/ending_fg2.png";
  ending2.fg2.onload = function() {ending2_fg2_onload();};
  redraw = true;
}

function ending2_bg_onload() {ending2.bg_loaded = true;}
function ending2_fg_onload() {ending2.fg_loaded = true;}
function ending2_fg2_onload() {ending2.fg2_loaded = true;}


function ending2_logic()
{
    // set music
    if(!ending2.musicSet)
    {
        x_audio_setLooping(false);
        x_audio_playMusic("ending");
        ending2.musicSet = true;
    }

	if(ending2.pos < ending2.posEnd)
	{
		if(ending2.delayCounter >= ending2.scrollDelay)
		{
			ending2.delayCounter = 0;
			ending2.pos += ending2.scrollSpeed;
			redraw = true;
		}
		else
		{
			ending2.delayCounter++;
		}
	}
	else if(ending2.pos < ending2.posKill)
	{
            //x_audio_stopMusic(); //because I'm too lazy to set up looping/nonlooping
		//ending2_startGame();
                //TODO: endgame
                ending2.drawFG2 = true;
                ending2.pos += ending2.scrollSpeed;
                redraw = true;
                
                if ((pressing.mouse && !input_lock.mouse) || (pressing.action && !input_lock.action))
                {  
                        //on mouse press, go to the next scene
                        window.location.reload();
                }
	}
        else
        {
            gamestate = STATE_TITLE;
            window.location.reload(); //broken
        }

}

function ending2_render()
{
  //console.log(ending2.pos);
  
  //the onload in this thing is a bit broken
  if (!bitfont.loaded || !ending2.bg_loaded || !ending2.fg_loaded) {
    redraw = true;
    return;
  }
  
  //x_audio_playMusic("ending2");
  
  tileset_background();
  mazemap_render(avatar.x, avatar.y, avatar.facing);  
  
  //fadein via disgusting hack
  ctx.save();
  ctx.globalAlpha = (ending2.transparencyFactor * (ending2.pos + 60));
  ctx.drawImage(ending2.bg, 0, 0, 160*SCALE, 120*SCALE);
  ctx.restore();
  
  if(!ending2.drawFG2)
  {
      ctx.drawImage(ending2.fg, 0, -ending2.pos*SCALE, 160*SCALE, 120*SCALE*4);
  }
  else
  {
      var correctedPos = ending2.pos - ending2.posEnd;
      //TODO: fadein FG2
      ctx.save();
      ctx.globalAlpha = (ending2.transparencyFactor * (correctedPos));
      ctx.drawImage(ending2.fg2, 0, 0, 160*SCALE, 120*SCALE);
      ctx.restore();
  }
  

  

}

