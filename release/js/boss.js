/**
 * Boss encounter logic and special art
 */
 
var boss = new Object();

boss.boneshield_img = new Image();
boss.boneshield_loaded = false;
boss.boneshield_active = false;
boss.boneshield_count = 0;
boss.boneshield_offset = {x:0, y:0};

function boss_init() {
  boss.boneshield_img.src = "images/enemies/bone_shield.png";
  boss.boneshield_img.onload = function() {boss_boneshield_onload();};
}

function boss_reset() {
  boss.boneshield_active = false;
  boss.boneshield_count = 0;
  //boss_alter_map();
}

function boss_boneshield_onload() {
  boss.boneshield_loaded = true;
}

function boss_alter_map() {
  if (avatar.campaign.indexOf("dspeak") > -1) {
    if (mazemap.current_id == 9) {
      mazemap_set_tile(11,5,6);
	}
  }
}


function boss_boneshield_activate() {
  boss.boneshield_active = true;
  boss.boneshield_hp = 100;
  combat.defense_action = "Shield!";
  combat.defense_result = "";
  combat.hero_hurt = false;
  sounds_play(SFX_BONESHIELD);
}

function boss_heal()
{
    var heal_hp = Math.floor((Math.random() * 100) + 1);;
    sounds_play("boss_heal");
    combat.defense_action = "Heal!";
    combat.defense_result = "+" + heal_hp + " HP!";
    combat.enemy.hp += heal_hp;
    combat.hero_hurt = false;
}

// if the boss' bone shield is up, override the regular hero attack
function boss_boneshield_heroattack(type,damage)
{
  if(type == POWER_TYPE_MELEE)
  {
      combat.offense_result = "Absorbed!";
    sounds_play(SFX_BLOCKED);
    combat.enemy_hurt = false;
  }
  else if(type == POWER_TYPE_RANGED)
  {      
      combat.enemy_hurt = true;
      combat.hit_shield = true;
      boss.boneshield_hp -= damage;
      
      combat.offense_result = damage + " damage";
      
      if(boss.boneshield_hp <= 0)
      {
          boss.boneshield_active = false;
      }
  }
  
}

function boss_boneshield_render() {
  if (!boss.boneshield_loaded) return;
  if (!boss.boneshield_active) return;
  ctx.drawImage(boss.boneshield_img, boss.boneshield_offset.x, boss.boneshield_offset.y, 160*SCALE, 120*SCALE);
}

/**
 * The boss chooses which action to perform
 */
function boss_power() {

  var power_roll = Math.random();

  // 2/3rds chance to simply attack
  if (power_roll < 0.66) {
	return false;
  }
  else {
  
    power_roll = Math.random();	
  
    // otherwise use scorch or boneshield (up to 3x)
    if (boss.boneshield_active || boss.boneshield_count >= 3 || power_roll < 0.33) {
            boss_heal();
	  return true;
	}
	else {
	  boss_boneshield_activate();
	  boss.boneshield_count++;
	  return true;
	}
  }

}
