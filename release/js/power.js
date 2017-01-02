/**
 * Resolve power use
 */

//HEAL DOESN'T SHOW UP!

var POWER_HEAL = 0;
var POWER_SLAM = 1;
var POWER_GUST = 2;
var POWER_QUAKE = 3;
var POWER_TORCH = 4;
var POWER_WAVE = 5;
var POWER_ZORCH = 6;
var POWER_REND = 7;

var POWER_TYPE_FORCE = 0;
var POWER_TYPE_WIND = 1;
var POWER_TYPE_EARTH = 2;
var POWER_TYPE_FIRE = 3;
var POWER_TYPE_ELECTRIC = 4;
var POWER_TYPE_WATER = 5;
var POWER_TYPE_DARK = 6;

var POWER_TYPE_MELEE = 11;
var POWER_TYPE_RANGED = 12;

var ENEMY_POWER_ATTACK = 0;
var ENEMY_POWER_SCORCH = 1;
var ENEMY_POWER_HPDRAIN = 2;
var ENEMY_POWER_MPDRAIN = 3;

var powers = new Array();
powers[0] = {name: "Heal"}; //implement with function
//TODO: add SFX
powers[1] = {name: "Slam", type: POWER_TYPE_FORCE, damage: 10};
powers[2] = {name: "Gust", type: POWER_TYPE_WIND, damage: 10, miss_chance: 0.3};
powers[3] = {name: "Quake", type: POWER_TYPE_EARTH, damage: 10, damage_random: 5};
powers[4] = {name: "Torch", type: POWER_TYPE_FIRE, damage: 10, damage_random: 5, miss_chance: 0.3};
powers[5] = {name: "Wave", type: POWER_TYPE_WATER, damage: 10, damage_random: 5, miss_chance: 0.3};
powers[6] = {name: "Zorch", type: POWER_TYPE_ELECTRIC, damage: 10, damage_random: 5, miss_chance: 0.3};
powers[7] = {name: "Rend", type: POWER_TYPE_DARK, damage: 10, damage_random: 5, miss_chance: 0.3};

function power_special_use(power_id)
{
    //do we put power checking here?
    
    //switch on input index and call appropriate function
    
    //if 0, call heal
    if(power_id == 0)
    {
        power_heal();
    }
    
    //if 1-7, call elemental attack
    if(power_id > 0 && power_id <=7)
    {
        power_hero_elemental(powers[power_id]);
    }
}

//my_power is an actual power object, not an index!
function power_hero_elemental(my_power)
{
    //elemental attack
    
    //TODO use mp as an option
    if (avatar.mp == 0) return;
    avatar.mp--;
    
    //text (default: name of spell+!)
    if('text' in my_power)
    {
        combat.offense_action = my_power.text;
    }
    else
    {
        combat.offense_action = my_power.name + "!";
    }
    
    //bone_shield handling, nah, we won't use it
    
    //do hit change (TODO add to spell) (default: perfect accuracy)
    var hit_chance = Math.random();
    var miss_chance = 0.0;
    if('miss_change' in my_power)
        miss_chance = my_power.miss_chance;
    
    if (hit_chance < miss_chance)
    {
      combat.offense_result = "Miss!";
      sounds_play(SFX_MISS);
      return;
    }
    
    //calculate damage (from base and bonus) (default norandom)
    var attack_damage = my_power.damage + avatar.bonus_atk;
    if('damage_random' in my_power)
    {
        var attack_bonus = ((Math.random() * 2) - 1) * my_power.damage_random;
        attack_damage = Math.round(attack_damage + attack_bonus);
    }
    
    //if damage would be 0 or negative, make it 1
    if(attack_damage < 1)
        attack_damage = 1;
        
    //calculate type advantage/disadvantage
    var attack_type = my_power.type;
    if(combat.enemy.weaknesses.indexOf(attack_type) != -1)
    {
        //is weak to this
        attack_damage *= 2;
    }
    else if(combat.enemy.strengths.indexOf(attack_type) != -1)
    {
        //is strong against this
        attack_damage *= 0.5;
    }    
        
    //play sound (and animation?) (TODO add to spell) (default: lookup name)
    //TODO allow crits?
    if('sound' in my_power)
        sounds_play(my_power.sound);
    else
        sounds_play(my_power.name);

    //do damage
    combat.enemy.hp -= attack_damage;
    combat.offense_result = attack_damage + " damage";

    combat.enemy_hurt = true;
}

function power_hero_attack() {

  combat.offense_action = "Hit!";
  
  // special: override hero action if the boss has bone shield up
  if (boss.boneshield_active) {
    boss_boneshield_heroattack();
    return;
  }
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.20) {
    combat.offense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  // Hit: calculate damage
  var atk_min = info.weapons[avatar.weapon].atk_min + avatar.bonus_atk;
  var atk_max = info.weapons[avatar.weapon].atk_max + avatar.bonus_atk;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  //TODO: check strength/weakness
  
  // check crit
  // hero crits add max damage
  var crit_chance = Math.random();
  if (crit_chance < 0.10) {
    attack_damage += atk_max;
    combat.offense_action = "Critical!";
    sounds_play(SFX_CRITICAL);
  }
  else {
    sounds_play(SFX_ATTACK);
  }
  
  if(combat.enemy.weaknesses.indexOf(POWER_TYPE_MELEE) != -1)
  {
      //is weak to this
      attack_damage *= 2;
  }
  else if(combat.enemy.strengths.indexOf(POWER_TYPE_MELEE) != -1)
  {
      //is strong against this
      attack_damage *= 0.5;
  }
  
  combat.enemy.hp -= attack_damage;
  combat.offense_result = attack_damage + " damage";
  
  combat.enemy_hurt = true;
  
}

function power_hero_rangedattack() {

  combat.offense_action = "Shoot!";
  
  // special: override hero action if the boss has bone shield up
  if (boss.boneshield_active) {
    boss_boneshield_heroattack();
    return;
  }
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.offense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  // Hit: calculate damage
  var atk_min = info.guns[avatar.gun].atk_min + avatar.bonus_atk;
  var atk_max = info.guns[avatar.gun].atk_max + avatar.bonus_atk;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // check crit
  // hero crits add max damage
  var crit_chance = Math.random();
  if (crit_chance < 0.10) {
    attack_damage += atk_max;
    combat.offense_action = "Critical!";
    sounds_play(SFX_CRITICAL);
  }
  else {
    sounds_play(SFX_ATTACK);
  }
  
  //check strength/weakness
  if(combat.enemy.weaknesses.indexOf(POWER_TYPE_RANGED) != -1)
  {
      //is weak to this
      attack_damage *= 2;
  }
  else if(combat.enemy.strengths.indexOf(POWER_TYPE_RANGED) != -1)
  {
      //is strong against this
      attack_damage *= 0.5;
  }
  
  combat.enemy.hp -= attack_damage;
  combat.offense_result = attack_damage + " damage";
  
  combat.enemy_hurt = true;
  
}

function power_hero_defend()
{
    combat.offense_action = "Block!";
    combat.offense_result = "";
    combat.hero_defending = true;
    combat.enemy_hurt = false;
}


/**
 * Choose a random power from the enemy's available powers
 */
function power_enemy(enemy_id) {

  // override for boss action
  if (enemy_id == ENEMY_DEATH_SPEAKER) {
    boss_power();
    return;
  }

  var power_options = enemy.stats[enemy_id].powers.length;
  var power_roll = Math.floor(Math.random() * power_options);
  var power_choice = enemy.stats[enemy_id].powers[power_roll];

  switch (power_choice) {
    case ENEMY_POWER_ATTACK:
      power_enemy_attack();
      return;
    case ENEMY_POWER_SCORCH:
      power_scorch();
      return;
    case ENEMY_POWER_HPDRAIN:
      power_hpdrain();
      return;
    case ENEMY_POWER_MPDRAIN:
      power_mpdrain();
      return;
  }
}

function power_enemy_attack() {
  combat.defense_action = "Attack!";
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  var atk_min = enemy.stats[combat.enemy.type].atk_min;
  var atk_max = enemy.stats[combat.enemy.type].atk_max;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // check crit
  // enemy crits add min damage
  var crit_chance = Math.random();
  if (crit_chance < 0.05) {
    attack_damage += atk_min;
    combat.defense_action = "Critical!";
    sounds_play(SFX_CRITICAL);
  }
  else {
    sounds_play(SFX_ATTACK);
  }
  
  // armor absorb
  attack_damage -= info.armors[avatar.armor].def;
  
  // defend factor
  if(combat.hero_defending)
      attack_damage *= 0.75;
  
  //round and clamp attack damage
  attack_damage = Math.round(attack_damage);
  if (attack_damage <= 0) attack_damage = 1;
  
  avatar.hp -= attack_damage;
  combat.defense_result = attack_damage + " damage";
  
  combat.hero_hurt = true;
}
 
function power_heal() {

  if (avatar.mp == 0) return;
  if (avatar.hp == avatar.max_hp) return;

  var heal_amount = Math.floor(avatar.max_hp/2) + Math.floor(Math.random() * avatar.max_hp/2);
  avatar.hp = avatar.hp + heal_amount;
  if (avatar.hp > avatar.max_hp) avatar.hp = avatar.max_hp;

  sounds_play(SFX_HEAL);
  avatar.mp--;
  
  if (gamestate == STATE_COMBAT) {
    combat.offense_action = "Heal!";
    combat.offense_result = "+" + heal_amount + " HP";  
  }
  else if (gamestate == STATE_INFO) {
    info.power_action = "Heal!";
    info.power_result = "+" + heal_amount + " HP";
	avatar_save();
  }
}

function power_burn() {
  if (avatar.mp == 0) return;
  
  combat.offense_action = "Burn!";
  
  var atk_min = (info.weapons[avatar.weapon].atk_min + avatar.bonus_atk);
  var atk_max = (info.weapons[avatar.weapon].atk_max + avatar.bonus_atk);
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // against undead, burn does 2x crit
  if (combat.enemy.category == ENEMY_CATEGORY_UNDEAD) {
    attack_damage += atk_max + atk_max;
  }
  // against most creatures burn does 1x crit
  else if (combat.enemy.category != ENEMY_CATEGORY_DEMON) {
    attack_damage += atk_max;
  }
  // against demons, burn does regular weapon damage.

  avatar.mp--;  
  sounds_play(SFX_FIRE);
  
  combat.enemy.hp -= attack_damage;
  combat.offense_result = attack_damage + " damage";
  
  combat.enemy_hurt = true;
  
  if (boss.boneshield_active) {
    boss.boneshield_active = false;  
  }
}

function power_run() {

  combat.offense_action = "Run!";
  sounds_play(SFX_RUN);
  
  var chance_run = Math.random();
  if (chance_run < 0.66) {
    combat.run_success = true;
    combat.offense_result = "";
    return;
  }
  else {
    combat.offense_result = "Blocked!";
    return;  
  }  
}

function power_map_burn() {
  if (avatar.mp == 0) return;
  var burn_target = false;

  // tile 16 (skull pile) burns into tile 5 (dungeon interior)
  
  // don't let the player waste mana if there is no nearby tile to burn
  burn_target = burn_target || power_map_burntile(avatar.x+1, avatar.y);
  burn_target = burn_target || power_map_burntile(avatar.x, avatar.y+1);
  burn_target = burn_target || power_map_burntile(avatar.x-1, avatar.y);
  burn_target = burn_target || power_map_burntile(avatar.x, avatar.y-1);

  if (burn_target) {
    info.power_action = "Burn!";
    info.power_result = "Cleared Path!";
    avatar.mp--;
	sounds_play(SFX_FIRE);
    avatar_save();
  }
  else {
    info.power_action = "(No Target)";
  }
}

function power_map_burntile(x, y) {
  if (mazemap_get_tile(x,y) == 16) {
    burn_target = true;
    mazemap_set_tile(x,y,5);
    mapscript_bone_pile_save(x,y);
    return true;
  }
  return false;
}

function power_unlock() {
  if (avatar.mp == 0) return;
  combat.offense_action = "Unlock!";
  
  var atk_min = (info.weapons[avatar.weapon].atk_min + avatar.bonus_atk);
  var atk_max = (info.weapons[avatar.weapon].atk_max + avatar.bonus_atk);
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // unlock can only be cast against Automatons
  // so apply the full damage
  attack_damage += atk_max + atk_max;

  avatar.mp--;  
  combat.enemy.hp -= attack_damage;
  combat.offense_result = attack_damage + " damage";
  
  combat.enemy_hurt = true;
  sounds_play(SFX_UNLOCK);

}

function power_map_unlock() {
  if (avatar.mp == 0) return;
  var unlock_target = false;

  // tile 16 (skull pile) burns into tile 5 (dungeon interior)
  
  // don't let the player waste mana if there is no nearby tile to burn
  unlock_target = unlock_target || power_map_unlocktile(avatar.x+1, avatar.y);
  unlock_target = unlock_target || power_map_unlocktile(avatar.x, avatar.y+1);
  unlock_target = unlock_target || power_map_unlocktile(avatar.x-1, avatar.y);
  unlock_target = unlock_target || power_map_unlocktile(avatar.x, avatar.y-1);

  if (unlock_target) {
    info.power_action = "Unlock!";
    info.power_result = "Door Opened!";
    avatar.mp--;
    avatar_save();
	sounds_play(SFX_UNLOCK);
  }
  else {
    info.power_action = "(No Target)";
	sounds_play(SFX_BLOCK);
  }
}

function power_map_unlocktile(x, y) {
  if (mazemap_get_tile(x,y) == 18) {
    unlock_target = true;
    mazemap_set_tile(x,y,3);
    mapscript_locked_door_save(x,y);
    return true;
  }
  return false;
}


// Enemy special powers

// evil enemy version of burn
function power_scorch() {

  combat.defense_action = "Scorch!";
 
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  sounds_play(SFX_FIRE);

  var atk_min = enemy.stats[combat.enemy.type].atk_min;
  var atk_max = enemy.stats[combat.enemy.type].atk_max;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;

  // scorch works like an enemy crit
  attack_damage += atk_min;

  // armor absorb
  attack_damage -= info.armors[avatar.armor].def;
  if (attack_damage <= 0) attack_damage = 1;
  
  avatar.hp -= attack_damage;
  combat.defense_result = attack_damage + " damage";
  
  combat.hero_hurt = true;
  
}

function power_hpdrain() {

  combat.defense_action = "HP Drain!";
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  sounds_play(SFX_HPDRAIN);
  
  var atk_min = enemy.stats[combat.enemy.type].atk_min;
  var atk_max = enemy.stats[combat.enemy.type].atk_max;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // armor absorb
  attack_damage -= info.armors[avatar.armor].def;
  if (attack_damage <= 0) attack_damage = 1;
  
  avatar.hp -= attack_damage;
  combat.enemy.hp += attack_damage;

  combat.defense_result = attack_damage + " damage";  
  combat.hero_hurt = true;
}

function power_mpdrain() {
  combat.defense_action = "MP Drain!";
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  sounds_play(SFX_MPDRAIN);
  
  if (avatar.mp > 0) {
    avatar.mp--;
    combat.defense_result = "-1 MP";	
  }
  else {
    combat.defense_result = "No effect";	
  }

  combat.hero_hurt = true;
}

//TODO: new power functions
