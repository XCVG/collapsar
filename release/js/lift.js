/* 
 * Lift game scene
 * Copyright 2017 Chris Leclair, Clint Bellanger
 */

var lift = new Object();

lift.cursorPos = 0; //should follow current level
lift.currentFloor = -1;
//TODO: add array with level maps/locations/keys
lift.floors = new Array();
lift.floors[1] = {name:"Village",key:null};
lift.floors[2] = {name:"Catacombs",key:"key_l2"};
lift.floors[3] = {name:"Maintenance",key:"key_l3"};
lift.floors[4] = {name:"Facilities",key:"key_l4"};
lift.floors[5] = {name:"Production",key:"key_l5"};
lift.floors[6] = {name:"The Core",key:"key_l6"};
lift.button_img = new Image();
lift.button_img_loaded = false;

function lift_init()
{
    //TODO load buttons and pictures (?)
    lift.button_img.src = "images/interface/lift.png";
    lift.button_img.onload = function() {lift_button_onload();};
}

function lift_button_onload()
{
    lift.button_img_loaded = true;
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
    bitfont_render(lift.floors[lift.currentFloor].name, 80, 2, JUSTIFY_CENTER);
    
    //TODO draw specific stuff
    if(!lift.button_img_loaded)
        return;
    
    for(var i = 1; i < lift.floors.length; i++)
    {
        var button_prepos = 8;
        var button_pos = 18;
        var button_drawoffset;
        if(i>1)
        {
            button_drawoffset = avatar.campaign.indexOf(lift.floors[i].key) >= 0 ? BUTTON_SIZE : 0;
        }
        else
        {
            button_drawoffset = BUTTON_SIZE;
        }
        
        
        ctx.drawImage(lift.button_img, (i-1)*BUTTON_SIZE*PRESCALE, button_drawoffset*PRESCALE, BUTTON_SIZE * PRESCALE, BUTTON_SIZE * PRESCALE, 12 * SCALE, (i-1)*button_pos*SCALE+button_prepos * SCALE,BUTTON_SIZE * SCALE, BUTTON_SIZE * SCALE);
    }
    
    
}

//reused code from info; really ought to generalize it
function lift_render_button() {

  if (!info.button_img_loaded) return; //reuse it
  
  var button_x = BUTTON_SIZE*7;  
  
  ctx.drawImage(
    lift.button_img,
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
  avatar_save();
  redraw = true; 
}


