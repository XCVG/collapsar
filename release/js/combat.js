/**
 Combat routines

 */

var COMBAT_PHASE_INTRO = 0;
var COMBAT_PHASE_INPUT = 1;
var COMBAT_PHASE_OFFENSE = 2;
var COMBAT_PHASE_DEFENSE = 3;
var COMBAT_PHASE_VICTORY = 4;
var COMBAT_PHASE_DEFEAT = 5;

var COMBAT_INTRO_DELAY = 15;

var COMBAT_BUTTON_POS_ATTACK = {x:25, y:80, w:20, h:20};
var COMBAT_BUTTON_POS_DEFEND = {x:5, y:80, w:20, h:20};
var COMBAT_BUTTON_POS_RANGED = {x:45, y:80, w:20, h:20};
var COMBAT_BUTTON_POS_RUN = {x:25, y:100, w:20, h:20};
var COMBAT_BUTTON_POS_POWER1 = {x:5, y:100, w:20, h:20};
var COMBAT_BUTTON_POS_POWER2 = {x:45, y:100, w:20, h:20};

// object setup
var combat = new Object();

combat.timer = 0;
combat.phase = COMBAT_PHASE_INTRO;

combat.enemy = new Object();

combat.offense_action = "";
combat.offense_result = "";
combat.defense_action = "";
combat.defense_result = "";
combat.reward_result = "";
combat.gold_treasure = 0;

combat.victory_status = "";
combat.hero_defending = false;
combat.enemy_hurt = false;
combat.hero_hurt = false;
combat.run_success = false;

function combat_init() {
  combat_clear_messages();
  
}

/**
 * Set the variable info for this enemy
 * Anything that changes during combat goes here (e.g. hp)
 * Otherwise we read values from the enemy list
 * TODO switch things to use combat.enemy because dynamic
 */
function combat_set_enemy(enemy_id) {
  combat.enemy.type = enemy_id;
  //combat.enemy.hp = enemy.stats[enemy_id].hp;
  //combat.enemy.category = enemy.stats[enemy_id].category;
  Object.assign(combat.enemy, enemy.stats[enemy_id]); //sorry, ie users
  //semi-deep copy
  combat.enemy.powers = enemy.stats[enemy_id].powers.slice();
  combat.enemy.weaknesses = enemy.stats[enemy_id].weaknesses.slice();
  combat.enemy.strengths = enemy.stats[enemy_id].strengths.slice();
  
  //for debug
  //console.log(combat.enemy);
  
  boss_reset();
  combat.victory_status = "";
  sounds_play("emerge");
}

/**** Logic **************************/
function combat_logic() {
  
  switch (combat.phase) {
    case COMBAT_PHASE_INTRO:
	  combat_logic_intro();
	  break;
	case COMBAT_PHASE_INPUT:
	  combat_logic_input();
	  break;
	case COMBAT_PHASE_OFFENSE:
	  combat_logic_offense();
	  break;
	case COMBAT_PHASE_DEFENSE:
	  combat_logic_defense();
	  break;
	case COMBAT_PHASE_VICTORY:
	  combat_logic_victory();
	  break;
	case COMBAT_PHASE_DEFEAT:
	  combat_logic_defeat();
	  break;
  }
  
}

function combat_logic_intro() {
	mazemap_set_music("combat");

    if (OPTIONS.animation == true) {
      combat.timer--;
      
      // animated sliding in from the left
      enemy.render_offset.x = 0 - combat.timer * 10;
      redraw = true;
    }
    else {
      combat.timer = 0;
    }
 
    if (combat.timer == 0) {
      combat.phase = COMBAT_PHASE_INPUT;	
      redraw = true;
    }
}

function combat_logic_input() {

  combat.enemy_hurt = false;
  combat.hero_hurt = false;
  combat.run_success = false;
  combat.hero_defending = false;

  var used_action = false;
     
   //newinput
   if(action_checkUseEx(COMBAT_BUTTON_POS_ATTACK,"up"))
   {
       power_hero_attack();
       used_action = true;
   }
   else if (action_checkUseEx(COMBAT_BUTTON_POS_RANGED,"action"))
   {
       power_hero_rangedattack();
       used_action = true;
   }
   else if (action_checkUseEx(COMBAT_BUTTON_POS_DEFEND,"query"))
   {
       power_hero_defend();
       used_action = true;
   }
   else if (action_checkUseEx(COMBAT_BUTTON_POS_RUN,"down"))
   {
       power_run();
       used_action = true;
   }
   else if (action_checkUseEx(COMBAT_BUTTON_POS_POWER1,"left") && avatar.mp > 0 && avatar.power_left >= 0)
   {
       
       used_action = power_special_use(avatar.power_left);
   }
   else if (action_checkUseEx(COMBAT_BUTTON_POS_POWER2,"right") && avatar.mp > 0 && avatar.power_right >= 0)
   {
       
       used_action = power_special_use(avatar.power_right);
   }

  if (used_action) {
    combat.phase = COMBAT_PHASE_OFFENSE;
    redraw = true;
    if (OPTIONS.animation == true) {
      combat.timer = 30;
    }
    else {
      combat.timer = 1;
    }
    return;
  }

  action_logic();

}

function combat_logic_offense() {
  combat.timer--;

  // assist text delay
  if (combat.timer == 25) redraw = true;
  
  if (combat.timer > 15 && combat.enemy_hurt) {
    enemy.render_offset.x = Math.round(Math.random() * 4) - 2;
    enemy.render_offset.y = Math.round(Math.random() * 4) - 2;
	redraw = true;
  }
  else if (combat.timer == 15) {
    enemy.render_offset = {x:0, y:0};
	redraw = true;
  }
  
  if (combat.timer == 0) {
  
    // check for defeated enemy
    if (combat.enemy.hp <= 0) {
	  combat.phase = COMBAT_PHASE_VICTORY;
	  sounds_play(SFX_COIN);
	  redraw = true;
	  combat_determine_reward();
	  return;
	}
	// check for successfully running away
	else if (combat.run_success) {	
      combat_clear_messages();
	  mazemap_set_music(atlas.maps[mazemap.current_id].music);
      gamestate = STATE_EXPLORE;
      redraw = true;
	  avatar_save();
      return;
	}
	else {
	
      power_enemy(combat.enemy.type);
      combat.phase = COMBAT_PHASE_DEFENSE;
	  redraw = true;
	  combat.timer = 30;
    if (OPTIONS.animation == true) {
      combat.timer = 30;
    }
    else {
      combat.timer = 1;
    }
	  return;
	}
  }

}

function combat_logic_defense() {
  combat.timer--;

  if (combat.timer > 15 && combat.hero_hurt) {
    tileset.render_offset.x = Math.round(Math.random() * 4) - 2;
    tileset.render_offset.y = Math.round(Math.random() * 4) - 2;
	redraw = true;
  }
  else if (combat.timer == 15) {
    tileset.render_offset = {x:0, y:0};
	redraw = true;
  }
  
  if (combat.timer == 0) {
  
    // check for defeated hero
	if (avatar.hp <= 0) {
	  combat.phase = COMBAT_PHASE_DEFEAT;
      avatar_save();
	  redraw = true;
	  sounds_play(SFX_DEFEAT);
	  return;
	}
	else {
      combat.phase = COMBAT_PHASE_INPUT;
	  redraw = true;
	  return;
	}
  }

}

function combat_logic_victory() {
  
  // end combat by clicking or pressing the action button  
  if (pressing.mouse && !input_lock.mouse) {  
    input_lock.mouse = true;
    combat_clear_messages();
	//music gross hack
	mazemap_set_music(atlas.maps[mazemap.current_id].music);
	//boss special
	if(combat.enemy.type == ENEMY_DEATH_SPEAKER)
	{
		ending.id = ENDING_GOOD;
		gamestate = STATE_ENDING;
	}
	else
	{
		gamestate = STATE_EXPLORE;
	}
    redraw = true;
    return;  
  }
  
  if (pressing.action && !input_lock.action) {
    input_lock.action = true;
    combat_clear_messages();
	//music gross hack
	mazemap_set_music(atlas.maps[mazemap.current_id].music);
	//boss special
	if(combat.enemy.type == ENEMY_DEATH_SPEAKER)
	{
		ending.id = ENDING_GOOD;
		gamestate = STATE_ENDING;
	}
	else
	{
		gamestate = STATE_EXPLORE;
	}
    redraw = true;
    return;  	
  }
}

function combat_logic_defeat() {
	mazemap_set_music("defeat");
        
        //TODO fix this handling please
	if(combat.enemy.type == ENEMY_DEATH_SPEAKER)
	{
		ending.id = ENDING_BAD;
		gamestate = STATE_ENDING;
		redraw = true;
	}	
	
  return;
}

function combat_clear_messages() {
  combat.offense_action = "";
  combat.offense_result = "";
  combat.defense_action = "";
  combat.defense_result = "";
}

function combat_determine_reward() {

  // for now, just gold rewards
  var gold_min = enemy.stats[combat.enemy.type].gold_min;
  var gold_max = enemy.stats[combat.enemy.type].gold_max;
  
  var gold_reward = Math.round(Math.random() * (gold_max - gold_min)) + gold_min;
  combat.reward_result = "Crystal +" + gold_reward;
  
  avatar.gold += gold_reward;
  combat.gold_treasure = gold_reward;
  
  // if killed a named creature, remember
  if (combat.victory_status != "") {
    avatar.campaign.push(combat.victory_status);  
  }
  
  avatar_save();

}


/**** Render **************************/
function combat_render() {

  // visuals common to all combat phases
  tileset_background();
  mazemap_render(avatar.x, avatar.y, avatar.facing);

  switch (combat.phase) {
    case COMBAT_PHASE_INTRO:
	  combat_render_intro();
	  break;
	case COMBAT_PHASE_INPUT:
	  combat_render_input();
	  break;
	case COMBAT_PHASE_OFFENSE:
	  combat_render_offense();
	  break;
	case COMBAT_PHASE_DEFENSE:
	  combat_render_defense();
	  break;
	case COMBAT_PHASE_VICTORY:
	  combat_render_victory();
	  break;
	case COMBAT_PHASE_DEFEAT:
	  combat_render_defeat();
	  break;
  }
}

function combat_render_intro() {

  // TEMP: skip first frame if we want to animate in combat logic()
  if (combat.timer < COMBAT_INTRO_DELAY) enemy_render(combat.enemy.type);
  bitfont_render(enemy.stats[combat.enemy.type].name, 80, 2, JUSTIFY_CENTER);
}

function combat_render_input() {
  enemy_render(combat.enemy.type);
  bitfont_render(enemy.stats[combat.enemy.type].name, 80, 2, JUSTIFY_CENTER);
  _combat_render_hpmp();
  //action_render();
  _combat_render_buttons();
  combat_render_offense_log();
  combat_render_defense_log();
}

function combat_render_offense() {
  enemy_render(combat.enemy.type);
  bitfont_render(enemy.stats[combat.enemy.type].name, 80, 2, JUSTIFY_CENTER);  
  
  // make text disappear for a short moment
  if (combat.timer <= 25) combat_render_offense_log();
}

function combat_render_defense() {
  enemy_render(combat.enemy.type);
  bitfont_render(enemy.stats[combat.enemy.type].name, 80, 2, JUSTIFY_CENTER);  

  combat_render_offense_log();
  combat_render_defense_log();    
}

function combat_render_victory() {
  combat_render_offense_log();
  bitfont_render(enemy.stats[combat.enemy.type].name, 80, 2, JUSTIFY_CENTER); 
  _combat_render_hpmp();
  bitfont_render("You win!", 80, 60, JUSTIFY_CENTER);
  bitfont_render(combat.reward_result, 80, 70, JUSTIFY_CENTER);
  treasure_render_gold(combat.gold_treasure);
  //info_render_gold();
}

function combat_render_defeat() {
  enemy_render(combat.enemy.type);
  bitfont_render(enemy.stats[combat.enemy.type].name, 80, 2, JUSTIFY_CENTER);  
  combat_render_offense_log();
  combat_render_defense_log();
  _combat_render_hpmp();
  bitfont_render("You lost!", 80, 60, JUSTIFY_CENTER);
  //info_render_gold();
}

function combat_render_offense_log() {
  if (combat.offense_action != "") {
    bitfont_render("You:", 2, 20, JUSTIFY_LEFT);
	bitfont_render(combat.offense_action, 2, 30, JUSTIFY_LEFT);
	bitfont_render(combat.offense_result, 2, 40, JUSTIFY_LEFT);
  }
}

function combat_render_defense_log() {
  if (combat.defense_action != "") {
    bitfont_render("Enemy:", 158, 20, JUSTIFY_RIGHT);
	bitfont_render(combat.defense_action, 158, 30, JUSTIFY_RIGHT);
	bitfont_render(combat.defense_result, 158, 40, JUSTIFY_RIGHT);	
  }
}

function _combat_render_hpmp()
{ 
  bitfont_render("HP " + avatar.hp + "/" + avatar.max_hp, 156, 100, JUSTIFY_RIGHT);
  bitfont_render("MP " + avatar.mp + "/" + avatar.max_mp, 156, 110, JUSTIFY_RIGHT); 
}

//new/button stuff

function _combat_render_buttons()
{
    //render fixed attack icons
    action_render_button(0, COMBAT_BUTTON_POS_ATTACK);
    action_render_button(1, COMBAT_BUTTON_POS_RUN);
    action_render_button(3, COMBAT_BUTTON_POS_DEFEND);
    action_render_button(4, COMBAT_BUTTON_POS_RANGED);
    
    if(avatar.power_left >= 0)
    {
        action_render_power(avatar.power_left, COMBAT_BUTTON_POS_POWER1);
    }
    if(avatar.power_right >= 0)
    {
        action_render_power(avatar.power_right, COMBAT_BUTTON_POS_POWER2);
    }
}