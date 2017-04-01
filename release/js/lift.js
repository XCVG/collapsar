/* 
 * Lift game scene
 * Copyright 2017 Chris Leclair, Clint Bellanger
 */

var lift = new Object();

//lift.cursorPos = 0; //should follow current level
lift.currentFloor = -1;
//TODO: add array with level maps/locations/keys
lift.floors = new Array();
lift.floors[1] = {name:"Village",key:null,dest_x:8, dest_y:2,dest_map:1,msg1:"A village built",msg2:"above the Forge"};
lift.floors[2] = {name:"Catacombs",key:"key_l2",dest_x:20, dest_y:2,dest_map:2,msg1:"Trecherous tunnels",msg2:"winding below ground"};
lift.floors[3] = {name:"Maintenance",key:"key_l3",dest_x:6, dest_y:21,dest_map:3,msg1:"A strange facility",msg2:"lined with treasures"};
lift.floors[4] = {name:"Facilities",key:"key_l4",dest_x:10, dest_y:18,dest_map:4,msg1:"A city of the dead",msg2:"deep underground"};
lift.floors[5] = {name:"Production",key:"key_l5",dest_x:1, dest_y:1,dest_map:5,msg1:"A dangerous factory",msg2:"alive but dead"};
lift.floors[6] = {name:"The Core",key:"key_l6",dest_x:1, dest_y:1,dest_map:6,msg1:"The mysterious",msg2:"heart of the Forge"};
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
    //moving up/down and checking keys
    if (pressing.up && !input_lock.up)
    {
        //attempt to move up
        do
        {
            if(lift.currentFloor <= 1) //<=?
            {
               //reset!
               lift.currentFloor = lift.floors.length-1;
            }
            else lift.currentFloor--;
                
            var found = false;
            
            if(avatar.campaign.indexOf(lift.floors[lift.currentFloor].key) >= 0 || lift.currentFloor == 1)
            {
                found = true;
            }
       
        }while(!found);
        
        x_audio_playSound("click");
        
        input_lock.up = true;
        redraw = true;
        return;
    }
    if (pressing.down && !input_lock.down)
    {
        //attempt to move down
        do
        {
            if(lift.currentFloor >= lift.floors.length-1) //<=?
            {
               //reset!
               lift.currentFloor = 1;
            }
            else lift.currentFloor++;
                
            var found = false;
            
            if(avatar.campaign.indexOf(lift.floors[lift.currentFloor].key) >= 0 || lift.currentFloor == 1)
            {
                found = true;
            }
       
        }while(!found);
        
        x_audio_playSound("click");
        
        input_lock.down = true;
        redraw = true;
        return;     
    }
    //using the mouse
    if (pressing.mouse && !input_lock.mouse)
    {        
        if(mouse_pos.x > 12 && mouse_pos.x < 28)
        {
            var pos = Math.ceil((mouse_pos.y-8)/18);
            //console.log(pos);
            
            if(avatar.campaign.indexOf(lift.floors[pos].key) >= 0 || pos == 1)
            {
                lift.currentFloor = pos;
            }
            
            input_lock.mouse = true;
            redraw=true;
            return;
        }
    }
    
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
    dialog_render_picture(lift.currentFloor+10); //hardcoded because derp
    lift_render_button();
    bitfont_render(lift.floors[lift.currentFloor].name, 80, 2, JUSTIFY_CENTER);
    
    //TODO draw specific stuff
    if(!lift.button_img_loaded)
        return;
    
    //draw buttons
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
        
        //a stupid place to do it but meh
        if(lift.currentFloor == i)
        {
            ctx.drawImage(
            action.select_img,
            0,
            0,
            SELECT_SIZE * PRESCALE,
            SELECT_SIZE * PRESCALE,	
            10 * SCALE,
            ((i-1)*button_pos*SCALE+button_prepos*SCALE)-2*SCALE,
            SELECT_SIZE * SCALE,
            SELECT_SIZE * SCALE
          );
        }
    }
    
    //draw picture (TODO) and description
    bitfont_render(lift.floors[lift.currentFloor].msg1, 36, 85, JUSTIFY_LEFT);
    bitfont_render(lift.floors[lift.currentFloor].msg2, 36, 95, JUSTIFY_LEFT);
    
    
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
  
  var data = lift.floors[lift.currentFloor];
    avatar.x = data.dest_x;
    avatar.y = data.dest_y;
    mazemap_set(data.dest_map);
  
  gamestate = STATE_EXPLORE;
  avatar_save();
  redraw = true; 
}


