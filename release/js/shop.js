/**
 Dialog info for game shops
 */

var SHOP_COUNT = 16;

var SHOP_WEAPON = 0;
var SHOP_ARMOR = 1;
var SHOP_SPELL = 2;
var SHOP_ROOM = 3;
var SHOP_MESSAGE = 4;
var SHOP_ENDING = 5; //old ending script for Heroin Dusk
var SHOP_RANGED = 6;

var shop = new Array();
for (var i=0; i<SHOP_COUNT; i++) {
  shop[i] = new Object();
  shop[i].item = new Array();
}

// Cedar Village Shops
shop[0].name = "Weapon Shop";
shop[0].item[0] = {type:SHOP_WEAPON, value:2};
shop[0].item[1] = {type:SHOP_RANGED, value:2};
shop[0].background = 3;
shop[0].picture = 4;

shop[1].name = "Armor Shop";
shop[1].item[0] = {type:SHOP_ARMOR, value:2};
shop[1].item[1] = {type:SHOP_ARMOR, value:3};
shop[1].background = 3;
shop[1].picture = 5;

shop[2].name = "Inn";
shop[2].item[0] = {type:SHOP_MESSAGE, msg1:"Be careful, stranger.", msg2:""};
shop[2].item[1] = {type:SHOP_ROOM, value:10};
shop[2].background = 3;
shop[2].picture = 3;

shop[3].name = "Spellmaster";
shop[3].item[0] = {type:SHOP_SPELL, value:1};
shop[3].item[1] = {type:SHOP_SPELL, value:2};
shop[3].background = 3;

//Lone hosue
shop[4].name = "Tavern";
shop[4].item[0] = {type:SHOP_MESSAGE, msg1:"We walled off the", msg2:"tunnels years ago."};
shop[4].item[1] = {type:SHOP_MESSAGE, msg1:"There is a back way", msg2:"for brave souls."};
shop[4].background = 3;
shop[4].picture = 1;

//gate
shop[5].name = "Gate";
shop[5].item[0] = {type:SHOP_MESSAGE, msg1:"The gate has", msg2:"been sealed"};
shop[5].item[1] = {type:SHOP_MESSAGE, msg1:"", msg2:""};
shop[5].background = 3;

shop[6].name = "Shifty Individual";
shop[6].item[0] = {type:SHOP_MESSAGE, msg1:"I can show you how to", msg2:"open any locked door."};
shop[6].item[1] = {type:SHOP_SPELL, value:3};
shop[6].background = 3;

shop[7].name = "Arms Dealer";
shop[7].item[0] = {type:SHOP_WEAPON, value:4};
shop[7].item[1] = {type:SHOP_RANGED, value:4};
shop[7].background = 3;
shop[7].picture = 6;

//begin message
shop[8].name = "Midnight";
shop[8].item[0] = {type:SHOP_MESSAGE, msg1:"You've arrived", msg2:"too late."};
shop[8].item[1] = {type:SHOP_MESSAGE, msg1:"The village is", msg2:"already destroyed."};
shop[8].background = 2;

//additional shops
shop[9].name = "Automatic Doctor";
shop[9].item[0] = {type:SHOP_MESSAGE, msg1:"The machine can", msg2:"repair your body"};
shop[9].item[1] = {type:SHOP_ROOM, value:25};
shop[9].background = 3;

shop[10].name = "AA ENDING";
shop[10].item[0] = {type:SHOP_MESSAGE, msg1:"Aw, fuck, man!", msg2:""};
shop[10].item[1] = {type:SHOP_MESSAGE, msg1:"I ain't got no", msg2:"fucking smack!"};
shop[10].background = 2;

//additional messages
shop[11].name = "Illisia";
shop[11].item[0] = {type:SHOP_MESSAGE, msg1:"There are strange", msg2:"keys hidden here"};
shop[11].item[1] = {type:SHOP_MESSAGE, msg1:"These make the", msg2:"lift thing work"};
shop[11].background = 3;
shop[11].picture = 7;

shop[12].name = "Vending Machine";
shop[12].item[0] = {type:SHOP_ARMOR, value:6};
shop[12].item[1] = {type:SHOP_RANGED, value:6};
shop[12].background = 3;

shop[13].name = "msg03";
shop[13].item[0] = {type:SHOP_MESSAGE, msg1:"Aw, fuck, man!", msg2:""};
shop[13].item[1] = {type:SHOP_MESSAGE, msg1:"I ain't got no", msg2:"fucking smack!"};
shop[13].background = 3;

shop[14].name = "msg04";
shop[14].item[0] = {type:SHOP_MESSAGE, msg1:"Aw, fuck, man!", msg2:""};
shop[14].item[1] = {type:SHOP_MESSAGE, msg1:"I ain't got no", msg2:"fucking smack!"};
shop[14].background = 3;

shop[15].name = "msg05";
shop[15].item[0] = {type:SHOP_MESSAGE, msg1:"Aw, fuck, man!", msg2:""};
shop[15].item[1] = {type:SHOP_MESSAGE, msg1:"I ain't got no", msg2:"fucking smack!"};
shop[15].background = 3;

//---- Set choice options for shops --------


function shop_set(shop_id) {
  
  dialog.shop_id = shop_id;
  dialog.title = shop[shop_id].name;
  dialog.select_pos = BUTTON_POS_OPT2;
  dialog.items_for_sale = false;
  //dialog.picture = shop[shop_id].picture;

  // most shops should use the exit button as the third option
  dialog.option[2].button = DIALOG_BUTTON_EXIT;
  dialog.option[2].msg1 = "Exit";
  dialog.option[2].msg2 = "";

  // shops can have two items for purchase
  for (var i=0; i<=1; i++) {
    if (shop[shop_id].item[i]) {
      if (shop[shop_id].item[i].type == SHOP_WEAPON) {
        shop_set_weapon(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_ARMOR) {
        shop_set_armor(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_SPELL) {
        shop_set_spell(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_ROOM) {
        shop_set_room(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_MESSAGE) {
        shop_set_message(i, shop[shop_id].item[i].msg1, shop[shop_id].item[i].msg2);
      }
      else if (shop[shop_id].item[i].type == SHOP_ENDING) {
        shop_set_msgend(i, shop[shop_id].item[i].msg1, shop[shop_id].item[i].msg2);
      }
      else if (shop[shop_id].item[i].type == SHOP_RANGED) {
        shop_set_ranged(i, shop[shop_id].item[i].value);
      }
    }
    else {
      shop_clear_slot(i);
    }
  }

}

function shop_set_weapon(slot, weapon_id) {
  var disable_reason = "";
  if (weapon_id == avatar.weapon) disable_reason = "(You own this)";
  else if (weapon_id < avatar.weapon) disable_reason = "(Yours is better)";

  shop_set_buy(slot, info.weapons[weapon_id].name, info.weapons[weapon_id].gold, disable_reason);
}

function shop_set_ranged(slot, weapon_id) {
  var disable_reason = "";
  if (weapon_id == avatar.gun) disable_reason = "(You own this)";
  else if (weapon_id < avatar.gun) disable_reason = "(Yours is better)";

  shop_set_buy(slot, info.guns[weapon_id].name, info.guns[weapon_id].gold, disable_reason);
}

function shop_set_armor(slot, armor_id) {
  var disable_reason = "";
  if (armor_id == avatar.armor) disable_reason = "(You own this)";
  else if (armor_id < avatar.armor) disable_reason = "(Yours is better)";

  shop_set_buy(slot, info.armors[armor_id].name, info.armors[armor_id].gold, disable_reason);
}

function shop_set_spell(slot, spell_id) {
  var disable_reason = "";
  if (avatar.powers.indexOf(spell_id) >= 0 ) disable_reason = "(You know this)";
  //else if (spell_id > avatar.spellbook +1) disable_reason = "(Too advanced)"; //this was always stupid
  
  shop_set_buy(slot, "Ability: " + powers[spell_id].name, powers[spell_id].gold, disable_reason); 
}

function shop_set_room(slot, room_cost) {
  var disable_reason = "";
  if (avatar.hp == avatar.max_hp && avatar.mp == avatar.max_mp) disable_reason = "(You are well rested)";
  shop_set_buy(slot, "!ROOM", room_cost, disable_reason);
}

function shop_set_message(slot, msg1, msg2) {
  dialog.option[slot].button = DIALOG_BUTTON_NONE;
  dialog.option[slot].msg1 = msg1;
  dialog.option[slot].msg2 = msg2;
}

function shop_set_msgend(slot, msg1, msg2) {
  dialog.option[slot].button = DIALOG_BUTTON_NONE;
  dialog.option[slot].msg1 = msg1;
  dialog.option[slot].msg2 = msg2;
  
  //GROSS HACK AHOY!
  dialog.option[2].button = DIALOG_BUTTON_NONE;
  dialog.option[2].msg1 = "You fail, bro!";
  dialog.option[2].msg2 = "";
  mazemap_set_music("911");
}

function shop_set_buy(slot, name, cost, disable_reason) {

  dialog.option[slot].msg1 = "Buy " + name;
  
  if(name == "!ROOM")
  {
      dialog.option[slot].msg1 = "Rest here ";
  }

  // show the gold cost or the reason you can't
  if (disable_reason != "") {
    dialog.option[slot].msg2 = disable_reason;
  }
  else {
    dialog.option[slot].msg2 = "for " + cost + " Crystal";
  }

  // display the dialog button if the item can be purchased
  var can_buy = true;
  if (avatar.gold < cost) can_buy = false;
  if (disable_reason != "") can_buy = false;

  if (can_buy) {
    dialog.option[slot].button = DIALOG_BUTTON_BUY;
  }
  else {
    dialog.option[slot].button = DIALOG_BUTTON_NONE;
  }
  
  // used to determine whether to display current gold
  dialog.items_for_sale = true;
}

function shop_clear_slot(slot) {
  dialog.option[slot].msg1 = "";
  dialog.option[slot].msg2 = "";
  dialog.option[slot].button = DIALOG_BUTTON_NONE;
}

//---- Handle choices for shops --------

function shop_act(shop_id, slot_id) {

  if (slot_id == 2) {
    shop_exit(shop_id);
    return;
  }

  if (shop[shop_id].item[slot_id].type == SHOP_WEAPON) {
    shop_buy_weapon(shop[shop_id].item[slot_id].value);
    return;
  }
  
  if (shop[shop_id].item[slot_id].type == SHOP_RANGED) {
    shop_buy_ranged(shop[shop_id].item[slot_id].value);
    return;
  }

  if (shop[shop_id].item[slot_id].type == SHOP_ARMOR) {
    shop_buy_armor(shop[shop_id].item[slot_id].value);
    return;
  }

  if (shop[shop_id].item[slot_id].type == SHOP_SPELL) {
    shop_buy_spell(shop[shop_id].item[slot_id].value);
    return;
  }
  
  if (shop[shop_id].item[slot_id].type == SHOP_ROOM) {
    shop_buy_room(shop[shop_id].item[slot_id].value);
    return;
  }  
}

function shop_buy_weapon(weapon_id) {
    //this is fine; TODO add one for ranged weapons
  var cost = info.weapons[weapon_id].gold;
  if (avatar.gold < cost) return;

  avatar.gold -= cost;
  sounds_play(SFX_COIN);
  avatar.weapon = weapon_id;
  dialog.message = "Bought " + info.weapons[weapon_id].name;
  shop_set(dialog.shop_id);
  redraw = true;

}

function shop_buy_ranged(weapon_id) {
    
  var cost = info.guns[weapon_id].gold;
  if (avatar.gold < cost) return;

  avatar.gold -= cost;
  sounds_play(SFX_COIN);
  avatar.gun = weapon_id;
  dialog.message = "Bought " + info.guns[weapon_id].name;
  shop_set(dialog.shop_id);
  redraw = true;

}

function shop_buy_armor(armor_id) {
    //this is also fine
  var cost = info.armors[armor_id].gold;
  if (avatar.gold < cost) return;

  avatar.gold -= cost;
  sounds_play(SFX_COIN);
  avatar.armor = armor_id;
  dialog.message = "Bought " + info.armors[armor_id].name;
  shop_set(dialog.shop_id);
  redraw = true;
}

function shop_buy_spell(spell_id) {
  var cost = info.spells[spell_id].gold;
  if (avatar.gold < cost) return;
  
  avatar.gold -= cost;
  sounds_play(SFX_COIN);
  //avatar.spellbook = spell_id; 
  avatar.powers.push(spell_id);
  dialog.message = "Learned " + powers[spell_id].name;
  shop_set(dialog.shop_id);
  redraw = true;
}

function shop_buy_room(cost) {
  if (avatar.gold < cost) return;
  
  avatar.gold -= cost;
  sounds_play(SFX_COIN);
  dialog.message = "You have rested";
  
  avatar_sleep();
  shop_set(dialog.shop_id);
  redraw = true;
}

function shop_exit(shop_id) {
  sounds_play(SFX_CLICK);
  gamestate = STATE_EXPLORE;
  redraw = true; 
}




