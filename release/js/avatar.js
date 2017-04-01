/**
 Maze Avatar
 **/
 
var avatar = new Object();
avatar.campaign = new Array();
var avatar_continue = false;

//---- Public Functions ---------------------------------------------
function avatar_init() {

  // check save games
  var json_save = getCookie("mazesave");
  if (json_save != null) {
    avatar = JSON.parse(json_save);

    if (avatar.hp > 0) {

      // normal continue
      mazemap_set(avatar.map_id);
      avatar_continue = true;
    }
    else if (avatar.sleeploc) {
      avatar_respawn();
	  avatar_continue = true;
    }
    else {
      avatar_reset();
      mazemap_set(avatar.map_id); 
    }
    return;
  }

  avatar_reset();
}

function avatar_save() {
  var json_save = JSON.stringify(avatar);
  setCookie("mazesave",json_save,90);
}

function avatar_reset() {
  avatar.x = 9;
  avatar.y = 9;
  avatar.facing = "north";
  avatar.moved = false;
  avatar.map_id = 0;
  avatar.weapon = 0;
  avatar.gun = 0;
  avatar.armor = 1;
  avatar.hp = 25;
  avatar.max_hp = 25;
  avatar.mp = 4;
  avatar.max_mp = 4;
  avatar.gold = 0;
  avatar.powers = new Array();
  avatar.power_left = -1;
  avatar.power_right = -1;
  avatar.bonus_atk = 0;
  avatar.bonus_def = 0;
  avatar.spellbook = 0; //will be unused in new combat system
  avatar.sleeploc = [0,8,8]; // map_id, x, y
  avatar.campaign = new Array();
}

/**
 * Sleeping restores HP and MP and sets the respawn point
 */
function avatar_sleep() {
  avatar.hp = avatar.max_hp;
  avatar.mp = avatar.max_mp;
  avatar.sleeploc = [mazemap.current_id, avatar.x, avatar.y];
}

function avatar_respawn() {
  // previously died. restart at last sleep point
  mazemap_set(avatar.sleeploc[0]);
  avatar.x = avatar.sleeploc[1];
  avatar.y = avatar.sleeploc[2];
  
  avatar.hp = avatar.max_hp;
  avatar.mp = avatar.max_mp;
  
  // cost of death: lose all gold (NOPE)
  //cost of death: lose half your money (like GTA)
  avatar.gold = Math.round(avatar.gold / 2); //fixed
}

function avatar_explore() {
  avatar.moved = false;

  var input_up = pressing.up && !input_lock.up;
  var input_down = pressing.down && !input_lock.down;
  var input_left = pressing.left && !input_lock.left;
  var input_right = pressing.right && !input_lock.right;
  
  if (pressing.mouse && !input_lock.mouse) {
    input_up = input_up || (pressing.mouse && !input_lock.mouse && isWithin(mouse_pos, clickarea_up));
    input_down = input_down || (pressing.mouse && !input_lock.mouse && isWithin(mouse_pos, clickarea_down));
    input_left = input_left || (pressing.mouse && !input_lock.mouse && isWithin(mouse_pos, clickarea_left));
    input_right = input_right || (pressing.mouse && !input_lock.mouse && isWithin(mouse_pos, clickarea_right));
  }
  
  // check movement
  if (input_up) {
    if (pressing.up) input_lock.up = true;
    if (pressing.mouse) input_lock.mouse = true;
    
    if (avatar.facing == "north") avatar_move(0,-1);
    else if (avatar.facing == "west") avatar_move(-1,0);
    else if (avatar.facing == "south") avatar_move(0,1);
    else if (avatar.facing == "east") avatar_move(1,0);
  }
  else if (input_down) {
    if (pressing.down) input_lock.down = true;
    if (pressing.mouse) input_lock.mouse = true;
    
    if (avatar.facing == "north") avatar_move(0,1);
    else if (avatar.facing == "west") avatar_move(1,0);
    else if (avatar.facing == "south") avatar_move(0,-1);
    else if (avatar.facing == "east") avatar_move(-1,0);
  }
  else if (input_left) {
    if (pressing.left) input_lock.left = true;
    if (pressing.mouse) input_lock.mouse = true;
    
    avatar_turn_left();
  }
  else if (input_right) {
    if (pressing.right) input_lock.right = true;
    if (pressing.mouse) input_lock.mouse = true;
    
    avatar_turn_right();
  }  
  
}

function avatar_move(dx,dy) {
  var target_tile = mazemap_get_tile(avatar.x+dx,avatar.y+dy);
  if (tileset.walkable[target_tile]) {
    avatar.x += dx;
    avatar.y += dy;
    redraw = true;
    avatar.moved = true;
    avatar_save();
  }
  else {
    sounds_play(SFX_BLOCKED);  
  }
}

function avatar_turn_left() {
  if (avatar.facing == "north") avatar.facing = "west";
  else if (avatar.facing == "west") avatar.facing = "south";
  else if (avatar.facing == "south") avatar.facing = "east";
  else if (avatar.facing == "east") avatar.facing = "north";
  redraw = true;
  avatar_save();

}

function avatar_turn_right() {
  if (avatar.facing == "north") avatar.facing = "east";
  else if (avatar.facing == "east") avatar.facing = "south";
  else if (avatar.facing == "south") avatar.facing = "west";
  else if (avatar.facing == "west") avatar.facing = "north";
  redraw = true;
  avatar_save();
}

function avatar_badly_hurt() {
  if (avatar.hp <= avatar.max_hp/3) return true;
  return false;
}

