/**
 Scripting for various maps
 */


var mapscript = new Object();

function mapscript_exec(map_id) {
    
    //TODO: rewrite the whole fucking thing, because, I mean, DAMN
    //we know map ID and position...
    //so we check what we need to execute here rather than in methods,
    //and call the appropriate method
    //so a map will have an array/list of scripts of a form like type="exit", x=2, y=3, args=[] etc
    //exit, shop, chest, bed, enemy, script
    //script will just exec arg0, yes it's horrible, not I don't care
    //in here we will search that list for a script reference
    //if an appropriate one is found, execute the corresponding script
    
    //abort!
    if (!init_complete) return false;
    
    //TODO: enemy and/or generalized replace load
    
    
    //then check location and execute script
    var mapscripts = atlas.maps[map_id].scripts;
    //console.log(mapscripts);
    
    //new idea about loading status
    _mapscript_chest_load(mapscripts);
    
    var result = false;
    var script;
    
    for(var key in mapscripts)
    { 
        //we now have a key/value pair (index/attr)
       var value = mapscripts[key];

       //search for a matching script
       if(value.x == avatar.x && value.y == avatar.y)
       {
           script = value;
           break;
       }
    }
    
    if(script)
    {
        //if we have a script, determine type and execute
        console.log(script);
        
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
        }
    }
    
    return result;


  switch (map_id) {

    case 0: // Serf Quarters (Your Apartment)
      result = mapscript_haybale(1,1);
      // result = result || mapscript_message(1,2,"serfmsg","This place is no longer safe");
      return result;

    case 1: // Gar'ashi Monastery (Karpos Koriis)
      return false;

    case 2: // Monk Quarters (Somebody's Apartment)
      return mapscript_chest(1,1,"stick", "Stick", 1);

    case 3: // Meditation Point (Rooftop)
      return mapscript_chest(2,1,"heal", "Spell: Heal", 1);

    case 4: // Monastery Trail (Ouropolokis Fields I)
      return mapscript_chest(2,2,"hp1", "Endurance Dust", 1);

    case 5: // Cedar Village (Idarous Polis)
      return mapscript_chest(7,10,"g1", "Gold", 10);

    case 6: // Zuruth Plains (Ouropolokis Fields II)
      return mapscript_chest(9,4,"mp1", "Stamina Dust", 1);

    case 7: // Canal Boneyard (Ouropolokis Forest)
      return mapscript_chest(13,5,"def1", "Toughness Dust", 1);

    case 8: // Mausoleum (Abandoned Temple)
      mapscript_bone_pile_load(8);
      mapscript_locked_door_load(8);
      result = mapscript_haybale(11,7);
      result = result || mapscript_chest(3,2,"atk1", "Strength Dust", 1);
      result = result || mapscript_chest(3,8,"mp2", "Stamina Dust", 1);
      result = result || mapscript_chest(6,7, "g2", "Gold", 25);

      return result;
    
    case 9: // Dead Walkways ("Hades Emerging")
      mapscript_bone_pile_load(9);
      boss_alter_map();
      //result = mapscript_enemy(4,9, ENEMY_MIMIC, "");
      //result = result || mapscript_enemy(11,5, ENEMY_DEATH_SPEAKER, "dspeak");
	  result = mapscript_enemy(11,5, ENEMY_DEATH_SPEAKER, "dspeak");
      return result;

    case 10: // Trade Tunnel (Catacombs of Epikros)
      mapscript_locked_door_load(10);
      mapscript_bone_pile_load(10);
      
      result = mapscript_chest(11,2, "hp2", "Endurance Dust", 1);
      result = result || mapscript_chest(13,2, "g3", "Gold", 100);
      //result = result || mapscript_enemy(14,9, ENEMY_MIMIC, "");
      //result = result || mapscript_enemy(6,4, ENEMY_MIMIC, "");
	  //result = result || mapscript_message(2,14, 0, "LOL MESSAGE");
	  result = result || mapscript_ending(2,14, 0);

      return result;
  }
  return false;
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

// ending screen load
function mapscript_ending(x, y, ending_id) {

	//ending.id = ENDING_GOOD;
	//ending.id = ENDING_BAD;

  // don't spawn the enemy if just loading
  if (!init_complete) return false;
  
  // if heroine is at the enemy location
  if (avatar.x == x && avatar.y == y) { 
   
    // switch to ending
    gamestate = STATE_ENDING;
	
	//nuke savegame (?)

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

  if (item == "Gold") {
    avatar.gold += item_count;

    // flag gold treasure for display while exploring    
    explore.gold_value = item_count;
  }
  else if (item == "Stick") {
    // only keep the stick if it's better than what you already have
    if (avatar.weapon == 0) avatar.weapon = 1;
    explore.treasure_id = 10;
  }
  else if (item == "Spell: Heal") {
    if (avatar.spellbook == 0) avatar.spellbook = 1;
    explore.treasure_id = 11;
  }
  else if (item == "Stamina Dust") {
    avatar.mp += 4;
    avatar.max_mp += 4;
    explore.treasure_id = 12;
  }
  else if (item == "Endurance Dust") {
    avatar.hp += 10;
    avatar.max_hp += 10;
    explore.treasure_id = 13;
  }
  else if (item == "Strength Dust") {
    avatar.bonus_atk += 2;
    explore.treasure_id = 14;
  }
  else if (item == "Toughness Dust") {
    avatar.bonus_def += 2;
    explore.treasure_id = 15;
  }
  
}

// a specific enemy is on this tile
function mapscript_enemy(x, y, enemy_id, status) {

  // don't spawn the enemy if just loading
  if (!init_complete) return false;
  
  // if heroine is at the enemy location
  if (avatar.x == x && avatar.y == y) { 

    // if heroine has not already defeated this enemy
    if (status != "") {
      if (avatar.campaign.indexOf(status) > -1) {
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

    return true;
  }
  return false;
}

//exit, shop, chest, bed, enemy, script

function _mapscript_exit(dest_map, dest_x, dest_y)
{
    avatar.x = dest_x;
    avatar.y = dest_y;
    mazemap_set(dest_map);

    return true;
}

function _mapscript_shop()
{
    
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
        mapscript_grant_item(item, qty);
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
           }
       }
    }
}

function _mapscript_enemy()
{
    
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

function _mapscript_script(script)
{
    eval(script); //this is fine
}

