/**
 Scripting for various maps
 */


var mapscript = new Object();

function mapscript_exec(map_id) {
    
    //refactored into methods
        
    //abort!
    if (!init_complete) return false;
    
    var result = _mapscript_executeAllScripts(map_id, avatar.x, avatar.y);
    return result;
}

function mapscript_execAutorun(map_id)
{
    //this runs in a few special places:
    //-when player returns from combat
    //-when the game loads
    //-when the player enters a new level
    //may also add returning from shops and chests
    
    //new idea about loading status
    var mapscripts = atlas.maps[map_id].scripts;
    _mapscript_chest_load(mapscripts);
    
    _mapscript_executeAllScripts(map_id,-1,-1);
}

function _mapscript_executeAllScripts(map_id, x, y)
{
    //this has been completely rewritten from the original system
    
    //then check location and execute script
    var mapscripts = atlas.maps[map_id].scripts;
    _mapscript_chest_load(mapscripts);

    //console.log(mapscripts);

    var result = false;
    //var script;
    
    for(var key in mapscripts)
    { 
        //we now have a key/value pair (index/attr)
       var value = mapscripts[key];

       //search for a matching script
       if(value.x == x && value.y == y)
       {
           if(_mapscript_executeScript(value))
               result = true;
           //break;
       }
    }
    
    return result;    
}

function _mapscript_executeScript(script)
{
    var result;
     
    if(script)
    {
        //if we have a script, determine type and execute
        //console.log(script);

        switch(script.type)
        {
            case "bed":
                result = _mapscript_bed();
                break;
            case "exit":
                result = _mapscript_exit(script.dest_map, script.dest_x, script.dest_y);
                break;
            case "chest":
                result = _mapscript_chest(script.status, script.item, script.qty);
                break;
            case "ending":
                result = _mapscript_ending(script.ending_id);
                break;
            case "enemy":
                result = _mapscript_enemy(script.enemy_id, script.status, script.dest_x, script.dest_y);
                break;
            case "shop":
                result = _mapscript_shop(script.shop_id, script.dest_x, script.dest_y);
                break;
            case "lift":
                result = _mapscript_lift(script.floor, script.dest_x, script.dest_y); //dest x/y are gross hacks which will likely be removed
                break;
            case "message":
                result = _mapscript_message(script.status, script.message);
                break;
            case "mod":
                result = _mapscript_mod(script.flag, script.dest_x, script.dest_y, script.tile);
                break;
            case "script":
                result = _mapscript_script(script.script);
                break;
        }
    }
    
    return result;
}

// general script types
//huh. this is never used AFAICT
//added status 0 for no check
function mapscript_message(x, y, status, message) {
  if (avatar.x == x && avatar.y == y) {

    // if the player has already read this message, skip it
	if(status != 0)
	{
		if (avatar.campaign.indexOf(status) > -1) {
		  return false;
		}
	}
    explore.message = message;
	if(status != 0)
		avatar.campaign.push(status);
		
    return true;

  }
  return false;
}

/**
 Found items have permanent unique effects, handle those here
 */
 //yes, it checks strings, Tyson-style
function mapscript_grant_item(item, item_count) {

  sounds_play(SFX_COIN);

  if (item_count == 1) {
    explore.message = "Found " + item + "!";
  }
  else if (item_count > 1) {
    explore.message = "Found " + item_count + " " + item;
  }

  if (item == "Gold" || item == "Crystal") {
    avatar.gold += item_count;

    // flag gold treasure for display while exploring    
    explore.gold_value = item_count;
  }
  else if (item == "Stick") {
    // only keep the stick if it's better than what you already have
    if (avatar.weapon == 0) avatar.weapon = 1;
    explore.treasure_id = 10;
  }
  else if (item == "Adventurer")
  {
      if(avatar.gun < 3)
      {
          explore.message = "Found Crossbow!";
          explore.treasure_id = 21;
          avatar.gun = 3;
      }
      else if(avatar.weapon < 3)
      {
          explore.message = "Found Longsword!";
          explore.treasure_id = 22;
          avatar.weapon = 3;
      }
      else if(avatar.armor < 4)
      {
          explore.message = "Found Plate Maille!";
          explore.treasure_id = 23;
          avatar.armor = 4;
      }
      else
      {
          explore.gold_value = 100;
          explore.message = "Found " + explore.gold_value + " gold!";
      }
  }
  else if (item == "Rifle") {
    //console.log("TODO give rifle"); //TODO setup rifle give and make graphic
    if (avatar.gun < 6)
      {
          avatar.gun = 6;
          explore.treasure_id = 9;
      }
      else
      {
          explore.gold_value = 1000;
          explore.message = "Found " + explore.gold_value + " gold!";
      }
  }
  else if (item == "Sling")
  {
      if (avatar.gun == 0)
      {
          avatar.gun = 1;
          explore.treasure_id = 10;
      }
      else
      {
          explore.gold_value = 4;
          explore.message = "Found " + explore.gold_value + " gold!";
      }
  }
  else if (item == "Spell: Heal") {
    if (avatar.spellbook == 0) avatar.spellbook = 1;
    explore.treasure_id = 11;
  }
  else if (item == "Stamina Dust") {
    avatar.mp += 2;
    avatar.max_mp += 2;
    explore.treasure_id = 12;
  }
  else if (item == "Magic Dust") {
    avatar.mp += 2;
    avatar.max_mp += 2;
    avatar.hp += 10;
    avatar.max_hp += 10;
    explore.treasure_id = 12;
  }
  else if (item == "Endurance Dust") {
    avatar.hp += 5;
    avatar.max_hp += 5;
    explore.treasure_id = 13;
  }
  else if (item == "Boosted Dust") {
    avatar.mp += 4;
    avatar.max_mp += 4;
    avatar.hp += 20;
    avatar.max_hp += 20;
    explore.treasure_id = 12;
  }
  else if (item == "Strength Dust") {
    avatar.bonus_atk += 2;
    explore.treasure_id = 14;
  }
  else if (item == "Toughness Dust") {
    avatar.bonus_def += 2;
    explore.treasure_id = 15;
  }
  else if (item == "Red Key")
  {
      avatar.campaign.push("key_l2");
      explore.treasure_id = 16;
  }
  else if (item == "Yellow Key")
  {
      avatar.campaign.push("key_l3");
      explore.treasure_id = 17;
  }
  else if (item == "Green Key")
  {
      avatar.campaign.push("key_l4");
      explore.treasure_id = 18;
  }
  else if (item == "Blue Key")
  {
      avatar.campaign.push("key_l5");
      explore.treasure_id = 19;
  }
  else if (item == "Black Key")
  {
      avatar.campaign.push("key_l6");
      explore.treasure_id = 20;
  }
  
}

function mapscript_grant_power(power_id) {
    //TODO: message?
    sounds_play(SFX_COIN);
    explore.message = "Found power: " + powers[power_id].name + "!";
    explore.treasure_id = 11;
    
    avatar.powers.push(power_id);
    
    //gross hack for "first power"
    if(power_id == 0)
    {
        avatar.power_left = 0; 
    }
}

//exit, shop, chest, bed, enemy, script

function _mapscript_exit(dest_map, dest_x, dest_y)
{
    avatar.x = dest_x;
    avatar.y = dest_y;
    mazemap_set(dest_map);
    mapscript_execAutorun(dest_map);

    return true;
}

function _mapscript_shop(shop_id, dest_x, dest_y)
{
    shop_set(shop_id);

    // put avatar back outside for save purposes
    avatar.x = dest_x;
    avatar.y = dest_y;
    
    gamestate = STATE_DIALOG;

    return true;
}

function _mapscript_lift(floor, dest_x, dest_y)
{
    lift.currentFloor = floor;
    avatar_save();

    // put avatar back outside for save purposes
    avatar.x = dest_x;
    avatar.y = dest_y;
    
    gamestate = STATE_LIFT;
    //redraw = true;

    return true;
}

function _mapscript_bed()
{
    // don't rest if just starting the game
    if (!avatar.moved) return false;

    explore.message = "You rest for awhile.";
    avatar_sleep();
        sounds_play(SFX_COIN);
    return true;

}

function _mapscript_chest(status, item, qty)
{
    //we don't update the map tile here; that's what the load function is for
    
    if (!(avatar.campaign.indexOf(status) > -1))
    {
        //this is a new chest, so give the reward and push flag
        avatar.campaign.push(status);
        if(item === "!POWER")
        {
            mapscript_grant_power(qty); //yes it's a hack
        }
        else
        {
            mapscript_grant_item(item, qty);
        }        
        
        return true;
    }
    else return false;
}

function _mapscript_chest_load(mapscripts)
{
    
    for(var key in mapscripts)
    { 
        //we now have a key/value pair (index/attr)
       var value = mapscripts[key];

       //search for a matching script
       if(value.type == "chest")
       {
           if (avatar.campaign.indexOf(value.status) > -1)
           {
               // interior chest
                if (mazemap_get_tile(value.x,value.y) == 8)
                {
                  mazemap_set_tile(value.x, value.y, 5);
                }
                // exterior chest
                else if (mazemap_get_tile(value.x,value.y) == 9)
                {
                  mazemap_set_tile(value.x, value.y, 1);
                }
                //TODO: tech chests
                else if (mazemap_get_tile(value.x,value.y) == 26)
                {
                  mazemap_set_tile(value.x, value.y, 25);
                }
                else if (mazemap_get_tile(value.x,value.y) == 27)
                {
                  mazemap_set_tile(value.x, value.y, 20);
                }
           }
       }
    }
}

function _mapscript_enemy(enemy_id, status, dest_x, dest_y)
{
    if (!init_complete) return false;
    
    if (status != "")
    {
      if (avatar.campaign.indexOf(status) > -1)
      {
        return false;
      }
    }
    
    // prepare combat mode
    explore.encounter_chance = 0.0;
    gamestate = STATE_COMBAT;
    action.select_pos = BUTTON_POS_ATTACK;
    combat.timer = COMBAT_INTRO_DELAY;
    combat.phase = COMBAT_PHASE_INTRO;
    combat_set_enemy(enemy_id);
    combat.victory_status = status;
    
    if(dest_x)
    {
        combat.override_x = avatar.x;
        combat.override_y = avatar.y;
        
        avatar.x = dest_x;
        avatar.y = dest_y;
    }

    return true;   
}

//will probably totally reimplement
function _mapscript_ending(ending_id)
{
    //ending.id = ENDING_GOOD;
    //ending.id = ENDING_BAD;

    // don't spawn the enemy if just loading
    if (!init_complete) return false;

    // switch to ending
    gamestate = STATE_ENDING;

    //nuke savegame (?)

    return true;

}

function _mapscript_message(status, message)
{
    // if the player has already read this message, skip it
    if(status != 0)
    {
            if (avatar.campaign.indexOf(status) > -1) {
              return false;
            }
    }
    explore.message = message;
    if(status != 0)
            avatar.campaign.push(status);

    return true;
}

function _mapscript_mod(flag, x, y, tile)
{
    //console.log("Mod:" + "(" + x + "," + y + ")");
    
    if (avatar.campaign.indexOf(flag) > -1)
    {
       // console.log("flag " + flag + " found, modding tile to " + tile);
        
        mazemap_set_tile(x, y, tile);
        
        return true;
    }

}

function _mapscript_script(script)
{
    return eval(script); //this is fine
}

