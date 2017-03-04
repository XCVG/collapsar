/* 
 * Lift game scene
 * Copyright 2017 Chris Leclair, Clint Bellanger
 */

var lift = new Object();

lift.cursorPos = 0; //should follow current level
lift.currentFloor = -1;
//TODO: add array with level maps/locations/keys

function lift_init()
{
    //TODO load buttons and pictures (?)
}

function lift_logic()
{
    //TODO moving up/down and checking keys
    
    //exit button (stolen from info.js)
    if (pressing.action && !input_lock.action)
    {
          input_lock.action = true;	
          lift_exit();
    }
    if (pressing.mouse && !input_lock.mouse && isWithin(mouse_pos, BUTTON_POS_INFO))
    {
          input_lock.mouse = true;
          lift_exit();
  }
    
}

function lift_render()
{
    //draw background, buttons, current and exit button
    tileset_background_render(7);
    lift_render_button();
    
    //TODO draw specific stuff
}

//reused code from info; really ought to generalize it
function lift_render_button() {

  if (!info.button_img_loaded) return; //reuse it
  
  var button_x;
  
  // show button up on explore, down on info, and hidden any other state
  button_x = BUTTON_SIZE;  
  
  ctx.drawImage(
    dialog.button_img,
    button_x * PRESCALE,
    0,
    BUTTON_SIZE * PRESCALE,
    BUTTON_SIZE * PRESCALE,	
    (BUTTON_POS_INFO.x + BUTTON_OFFSET) * SCALE,
    (BUTTON_POS_INFO.y + BUTTON_OFFSET) * SCALE,
    BUTTON_SIZE * SCALE,
    BUTTON_SIZE * SCALE
  );
}

function lift_exit() {
    explore.message = "";
  sounds_play(SFX_CLICK);
  gamestate = STATE_EXPLORE;
  redraw = true; 
}


