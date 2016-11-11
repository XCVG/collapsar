/**
 Data collection for Enemies
 Includes the base stats for enemies
 Includes the images for enemies
 */

var ENEMY_COUNT = 11;

//leave these in until we're sure we can get rid of them
var ENEMY_SHADOW_TENDRILS = 0;
var ENEMY_IMP = 1;
var ENEMY_SHADOW_SOUL = 2;
var ENEMY_ZOMBIE = 3; //oops?
var ENEMY_SKELETON = 4;
var ENEMY_DRUID = 5;
var ENEMY_MIMIC = 6;
var ENEMY_DEATH_SPEAKER = 7;

//new enemies!
var ENEMY_CRIMINAL = 0;
var ENEMY_RAT = 1;
var ENEMY_RAIDER = 2;
var ENEMY_SNAKE = 3;
var ENEMY_GESTA = 4;
var ENEMY_ZOMBIE = 5;
var ENEMY_CYBORG = 6;
var ENEMY_DRONE = 7;
var ENEMY_KILLBOT = 8;
var ENEMY_SENTINEL = 9;
var ENEMY_CORE = 10;

//effectively deprecated by individual type weaknesses/strengths
var ENEMY_CATEGORY_SHADOW = 0; //monster
var ENEMY_CATEGORY_DEMON = 1; //human
var ENEMY_CATEGORY_UNDEAD = 2; //altered human
var ENEMY_CATEGORY_AUTOMATON = 3; //boss

var enemy = new Object();

enemy.load_counter = 0;
enemy.img = new Array();
enemy.img_loaded = false;
enemy.stats = new Array();
enemy.render_offset = {x:0, y:0};

function enemy_init() {
  for (i=0; i<ENEMY_COUNT; i++) {
    enemy.img[i] = new Image();
  }

  // load enemy images
  enemy.img[ENEMY_CRIMINAL].src = "images/enemies/shadow_tendrils.png";
  enemy.img[ENEMY_CRIMINAL].onload = function() {enemy_onload();};

  enemy.img[ENEMY_RAT].src = "images/enemies/imp.png";
  enemy.img[ENEMY_RAT].onload = function() {enemy_onload();};

  enemy.img[ENEMY_RAIDER].src = "images/enemies/shadow_soul.png";
  enemy.img[ENEMY_RAIDER].onload = function() {enemy_onload();};

  enemy.img[ENEMY_SNAKE].src = "images/enemies/zombie.png";
  enemy.img[ENEMY_SNAKE].onload = function() {enemy_onload();};

  enemy.img[ENEMY_GESTA].src = "images/enemies/skeleton.png";
  enemy.img[ENEMY_GESTA].onload = function() {enemy_onload();};

  enemy.img[ENEMY_ZOMBIE].src = "images/enemies/druid.png";
  enemy.img[ENEMY_ZOMBIE].onload = function() {enemy_onload();}

  enemy.img[ENEMY_CYBORG].src = "images/enemies/mimic.png";
  enemy.img[ENEMY_CYBORG].onload = function() {enemy_onload();}

  enemy.img[ENEMY_DRONE].src = "images/enemies/death_speaker.png";
  enemy.img[ENEMY_DRONE].onload = function() {enemy_onload();}
  
  enemy.img[ENEMY_KILLBOT].src = "images/enemies/death_speaker.png";
  enemy.img[ENEMY_KILLBOT].onload = function() {enemy_onload();}
  
  enemy.img[ENEMY_SENTINEL].src = "images/enemies/death_speaker.png";
  enemy.img[ENEMY_SENTINEL].onload = function() {enemy_onload();}
  
  enemy.img[ENEMY_CORE].src = "images/enemies/death_speaker.png";
  enemy.img[ENEMY_CORE].onload = function() {enemy_onload();}

  // set enemy stats

  enemy.stats[ENEMY_CRIMINAL] = {name:"Slime", hp:6, atk_min:2, atk_max:4, gold_min:1, gold_max:2, category:ENEMY_CATEGORY_SHADOW};
  enemy.stats[ENEMY_CRIMINAL].powers = [ENEMY_POWER_ATTACK];

  enemy.stats[ENEMY_RAT] = {name:"Giant Rat", hp:7, atk_min:2, atk_max:6, gold_min:1, gold_max:3, category:ENEMY_CATEGORY_SHADOW};
  enemy.stats[ENEMY_RAT].powers = [ENEMY_POWER_ATTACK];

  enemy.stats[ENEMY_RAIDER] = {name:"Cave Bat", hp:8, atk_min:3, atk_max:8, gold_min:2, gold_max:4, category:ENEMY_CATEGORY_SHADOW};
  enemy.stats[ENEMY_RAIDER].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_ATTACK, ENEMY_POWER_MPDRAIN];

  enemy.stats[ENEMY_SNAKE] = {name:"Highwayman", hp:16, atk_min:4, atk_max:10, gold_min:6, gold_max:20, category:ENEMY_CATEGORY_DEMON};
  enemy.stats[ENEMY_SNAKE].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_ATTACK, ENEMY_POWER_HPDRAIN];

  enemy.stats[ENEMY_GESTA] = {name:"Creeper", hp:20, atk_min:2, atk_max:6, gold_min:5, gold_max:10, category:ENEMY_CATEGORY_UNDEAD};
  enemy.stats[ENEMY_GESTA].powers = [ENEMY_POWER_ATTACK];
  
  enemy.stats[ENEMY_ZOMBIE] = {name:"Berserker", hp:10, atk_min:7, atk_max:14, gold_min:5, gold_max:10, category:ENEMY_CATEGORY_UNDEAD};
  enemy.stats[ENEMY_ZOMBIE].powers = [ENEMY_POWER_ATTACK]; 
  
  enemy.stats[ENEMY_CYBORG] = {name:"Cultist", hp:30, atk_min:10, atk_max:16, gold_min:16, gold_max:25, category:ENEMY_CATEGORY_DEMON};
  enemy.stats[ENEMY_CYBORG].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_SCORCH];

  enemy.stats[ENEMY_DRONE] = {name:"Cult Leader", hp:84, atk_min:8, atk_max:15, gold_min:225, gold_max:275, category:ENEMY_CATEGORY_AUTOMATON};
  enemy.stats[ENEMY_DRONE].powers = [ENEMY_POWER_ATTACK];
  
  enemy.stats[ENEMY_KILLBOT] = {name:"Cult Leader", hp:84, atk_min:8, atk_max:15, gold_min:225, gold_max:275, category:ENEMY_CATEGORY_AUTOMATON};
  enemy.stats[ENEMY_KILLBOT].powers = [ENEMY_POWER_ATTACK];
  
  enemy.stats[ENEMY_SENTINEL] = {name:"Cult Leader", hp:84, atk_min:8, atk_max:15, gold_min:225, gold_max:275, category:ENEMY_CATEGORY_AUTOMATON};
  enemy.stats[ENEMY_SENTINEL].powers = [ENEMY_POWER_ATTACK];
  
  enemy.stats[ENEMY_CORE] = {name:"Cult Leader", hp:84, atk_min:8, atk_max:15, gold_min:225, gold_max:275, category:ENEMY_CATEGORY_AUTOMATON};
  enemy.stats[ENEMY_CORE].powers = [ENEMY_POWER_ATTACK];
  
}

function enemy_onload() {
  enemy.load_counter++;
  if (enemy.load_counter == ENEMY_COUNT) enemy.img_loaded = true;
}

function enemy_render(enemy_id) {

  if (!enemy.img_loaded) return;

  ctx.drawImage(
    enemy.img[enemy_id],
    0,
    0,
    160 * PRESCALE,
    120 * PRESCALE,
    enemy.render_offset.x * SCALE,
    enemy.render_offset.y * SCALE,
    160 * SCALE,
    120 * SCALE
  );
  
  // optional enemy overlays
  boss_boneshield_render();
}

