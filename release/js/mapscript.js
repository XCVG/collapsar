/**
 Scripting for various maps
 */


var mapscript = new Object();

mapscript.bone_piles = new Array();
mapscript.bone_piles = [
  {map_id:8, x:4, y:7, status:"bone1"},
  {map_id:8, x:4, y:2, status:"bone2"},
  {map_id:8, x:13, y:7, status:"bone3"},
  {map_id:8, x:11, y:5, status:"bone4"},
  {map_id:9, x:5, y:5, status:"bone5"},
  {map_id:9, x:8, y:2, status:"bone6"},
  {map_id:10, x:2, y:4, status:"bone7"},
  {map_id:10, x:4, y:2, status:"bone8"}
];

mapscript.locked_doors = new Array();
mapscript.locked_doors = [
  {map_id:8, x:4, y:12, status:"door1"},
  {map_id:10, x:11, y:3, status:"door2"},
  {map_id:10, x:13, y:3, status:"door3"}
];


function mapscript_exec(map_id) {

  var result = false;
  switch (map_id) {

    case 0: // Serf Quarters (Your Apartment)
      result = mapscript_haybale(1,1);
      // result = result || mapscript_message(1,2,"serfmsg","This place is no longer safe");
      return result;

    case 1: // Gar'ashi Monastery (Sunflower Projects)
      return false;

    case 2: // Monk Quarters (Somebody's Apartment)
      return mapscript_chest(1,1,"stick", "Stick", 1);

    case 3: // Meditation Point (Rooftop)
      return mapscript_chest(2,1,"heal", "Spell: Heal", 1);

    case 4: // Monastery Trail (Brush Park)
      return mapscript_chest(2,2,"hp1", "Endurance Crystal", 1);

    case 5: // Cedar Village (Mack Avenue)
      return mapscript_chest(7,10,"g1", "Gold", 10);

    case 6: // Zuruth Plains (Wyoming Street)
      return mapscript_chest(9,4,"mp1", "Stamina Crystal", 1);

    case 7: // Canal Boneyard (Decrepit Graveyard)
      return mapscript_chest(13,5,"def1", "Toughness Crystal", 1);

    case 8: // Mausoleum (Abandoned Church)
      mapscript_bone_pile_load(8);
      mapscript_locked_door_load(8);
      result = mapscript_haybale(11,9);
      result = result || mapscript_chest(3,2,"atk1", "Strength Crystal", 1);
      result = result || mapscript_chest(3,12,"mp2", "Stamina Crystal", 1);
      result = result || mapscript_chest(6,9, "g2", "Gold", 25);

      return result;
    
    case 9: // Dead Walkways
      mapscript_bone_pile_load(9);
      boss_alter_map();
      result = mapscript_enemy(4,9, ENEMY_MIMIC, "");
      result = result || mapscript_enemy(11,5, ENEMY_DEATH_SPEAKER, "dspeak");
      return result;

    case 10: // Trade Tunnel
      mapscript_locked_door_load(10);
      mapscript_bone_pile_load(10);
      
      result = mapscript_chest(11,2, "hp2", "Endurance Crystal", 1);
      result = result || mapscript_chest(13,2, "g3", "Gold", 100);
      result = result || mapscript_enemy(14,9, ENEMY_MIMIC, "");
      result = result || mapscript_enemy(6,4, ENEMY_MIMIC, "");
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

//NOT IMPLEMENTED: DO NOT USE
//this is supposed to display a fullscreen message with background, but it's not implemented
function mapscript_fsmessage(x, y, status, message) {
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

function mapscript_haybale(x, y) {

  // don't rest if just starting the game
  if (!avatar.moved) return false;

  if (avatar.x == x && avatar.y == y) { 
    explore.message = "You rest for awhile.";
    avatar_sleep();
	sounds_play(SFX_COIN);
    return true;
  }
  return false;
}

function mapscript_chest(x, y, status, item_type, item_count) {

  // if the player has already opened this chest, hide the chest
  if (avatar.campaign.indexOf(status) > -1) {

    // interior chest
    if (mazemap_get_tile(x,y) == 8) {
      mazemap_set_tile(x, y, 5);
    }
    // exterior chest
    else if (mazemap_get_tile(x,y) == 9) {
      mazemap_set_tile(x, y, 1);
    }

  }

  // if this is a new chest, open it and grant the reward.
  else {
    if (avatar.x == x && avatar.y == y) { 
      avatar.campaign.push(status);
      mapscript_grant_item(item_type, item_count);
      return true;
    }
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
  else if (item == "Stamina Crystal") {
    avatar.mp += 4;
    avatar.max_mp += 4;
    explore.treasure_id = 12;
  }
  else if (item == "Endurance Crystal") {
    avatar.hp += 10;
    avatar.max_hp += 10;
    explore.treasure_id = 13;
  }
  else if (item == "Strength Crystal") {
    avatar.bonus_atk += 2;
    explore.treasure_id = 14;
  }
  else if (item == "Toughness Crystal") {
    avatar.bonus_def += 2;
    explore.treasure_id = 15;
  }
  
}

function mapscript_bone_pile_save(x, y) {

  // the player has just burned bones, lookup and save the status
  for (var i=0; i < mapscript.bone_piles.length; i++) {
    if (mazemap.current_id == mapscript.bone_piles[i].map_id &&
        x == mapscript.bone_piles[i].x &&
        y == mapscript.bone_piles[i].y) {

      avatar.campaign.push(mapscript.bone_piles[i].status);
    }
  }
}

function mapscript_bone_pile_load(map_id) {

  // check all bones previously burned
  for (var i=0; i < mapscript.bone_piles.length; i++) {
    if (mapscript.bone_piles[i].map_id == map_id) {
    
      if (avatar.campaign.indexOf(mapscript.bone_piles[i].status) > -1) {
        mazemap_set_tile(mapscript.bone_piles[i].x, mapscript.bone_piles[i].y, 5);
      }
    }
  }
}

function mapscript_locked_door_save(x, y) {

  // the player has just unlocked a door, lookup and save the status
  for (var i=0; i < mapscript.locked_doors.length; i++) {
    if (mazemap.current_id == mapscript.locked_doors[i].map_id &&
        x == mapscript.locked_doors[i].x &&
        y == mapscript.locked_doors[i].y) {

      avatar.campaign.push(mapscript.locked_doors[i].status);
    }
  }
}

function mapscript_locked_door_load(map_id) {

  // check all doors previously unlocked
  for (var i=0; i < mapscript.locked_doors.length; i++) {
    if (mapscript.locked_doors[i].map_id == map_id) {
    
      if (avatar.campaign.indexOf(mapscript.locked_doors[i].status) > -1) {
        mazemap_set_tile(mapscript.locked_doors[i].x, mapscript.locked_doors[i].y, 3);
      }
    }
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

