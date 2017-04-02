/**
 Conversation and shop handling
 */

var DIALOG_PICTURE_COUNT = 18;

var DIALOG_BUTTON_NONE = 0;
var DIALOG_BUTTON_BUY = 1;
var DIALOG_BUTTON_EXIT = 2;

var BUTTON_POS_OPT0 = {x:0, y:60, w:20, h:20};
var BUTTON_POS_OPT1 = {x:0, y:80, w:20, h:20};
var BUTTON_POS_OPT2 = {x:0, y:100, w:20, h:20};

var dialog = new Object();

dialog.select_pos = BUTTON_POS_OPT2;
dialog.button_img = new Image();
dialog.button_img_loaded = false;
dialog.picture_img = new Array();
dialog.picture_img_loaded = false;
dialog.picture_img_loadcount = 0;
dialog.option = new Array();
dialog.message = "";
dialog.shop_id = 0;
dialog.items_for_sale = false;

for (i=0; i<DIALOG_PICTURE_COUNT; i++) {
  dialog.picture_img[i] = new Image();
}

for (var i=0; i<3; i++) {
  dialog.option[i] = new Object();
}

/**** Initialize ***************/
function dialog_init() {
  dialog.button_img.src = "images/interface/dialog_buttons.png";
  dialog.button_img.onload = function() {dialog_button_onload();};
  
  dialog.picture_img[0].src = "images/pictures/null.png";
  dialog.picture_img[0].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[1].src = "images/pictures/tavern.png";
  dialog.picture_img[1].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[2].src = "images/pictures/smith.png";
  dialog.picture_img[2].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[3].src = "images/pictures/inn.png";
  dialog.picture_img[3].onload = function() {dialog_picture_onload();};

  dialog.picture_img[4].src = "images/pictures/weapons.png";
  dialog.picture_img[4].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[5].src = "images/pictures/armor.png";
  dialog.picture_img[5].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[6].src = "images/pictures/blackmarket.png";
  dialog.picture_img[6].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[7].src = "images/pictures/portrait1.png";
  dialog.picture_img[7].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[8].src = "images/pictures/spellmaster.png";
  dialog.picture_img[8].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[9].src = "images/pictures/techpicture.png";
  dialog.picture_img[9].onload = function() {dialog_picture_onload();};

  dialog.picture_img[10].src = "images/pictures/null.png";
  dialog.picture_img[10].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[11].src = "images/pictures/level1.png";
  dialog.picture_img[11].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[12].src = "images/pictures/level2.png";
  dialog.picture_img[12].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[13].src = "images/pictures/level3.png";
  dialog.picture_img[13].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[14].src = "images/pictures/level4.png";
  dialog.picture_img[14].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[15].src = "images/pictures/levelnull.png";
  dialog.picture_img[15].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[16].src = "images/pictures/level6.png";
  dialog.picture_img[16].onload = function() {dialog_picture_onload();};
  
  dialog.picture_img[17].src = "images/pictures/null.png";
  dialog.picture_img[17].onload = function() {dialog_picture_onload();};

  shop_set(0);

}

function dialog_button_onload() {dialog.button_img_loaded = true;}

function dialog_picture_onload()
{
    dialog.picture_img_loadcount += 1;
    if(dialog.picture_img_loadcount >= DIALOG_PICTURE_COUNT)
        dialog.picture_img_loaded = true;
}

/**** Logic Functions ****/


function dialog_logic() {
  // use arrows to move select cursor
  dialog_logic_moveselect();

  // check use options
  if (dialog.option[0].button != DIALOG_BUTTON_NONE) {
    if (dialog_checkuse(BUTTON_POS_OPT0)) {
      shop_act(dialog.shop_id, 0);
    }
  }
  
  if (dialog.option[1].button != DIALOG_BUTTON_NONE) {
    if (dialog_checkuse(BUTTON_POS_OPT1)) {
      shop_act(dialog.shop_id, 1);
    }
  }

  if (dialog.option[2].button != DIALOG_BUTTON_NONE) {
    if (dialog_checkuse(BUTTON_POS_OPT2)) {
      shop_act(dialog.shop_id, 2);
    }
  }

}

// check an action by the button location
function dialog_checkuse(check_pos) {

  // option 1: mouse click
  if (pressing.mouse && !input_lock.mouse && isWithin(mouse_pos, check_pos)) {
	input_lock.mouse = true;
    return true;
  }

  // option 2: action button
  if (pressing.action && !input_lock.action && dialog.select_pos == check_pos) {
    input_lock.action = true;
    return true;
  }

  return false;
}

function dialog_logic_moveselect() {

  // bottom position, can move up
  if (dialog.select_pos == BUTTON_POS_OPT2) {
    if (pressing.up && !input_lock.up) {
      if (dialog.option[1].button != DIALOG_BUTTON_NONE) {
        dialog.select_pos = BUTTON_POS_OPT1;
        input_lock.up = true;
        redraw = true;
        return;
      }
      else if (dialog.option[0].button != DIALOG_BUTTON_NONE) {
        dialog.select_pos = BUTTON_POS_OPT0;
        input_lock.up = true;
        redraw = true;
        return;
      }
    }
  }

  // middle position, can move up or down
  if (dialog.select_pos == BUTTON_POS_OPT1) {
    if (pressing.up && !input_lock.up) {
      if (dialog.option[0].button != DIALOG_BUTTON_NONE) {
        dialog.select_pos = BUTTON_POS_OPT0;
        input_lock.up = true;
        redraw = true;
        return;
      }
    }
    if (pressing.down && !input_lock.down) {
      dialog.select_pos = BUTTON_POS_OPT2;
      input_lock.down = true;
      redraw = true;
      return;     
    }
  }

  // top position, can move down
  if (dialog.select_pos == BUTTON_POS_OPT0) {
    if (pressing.down && !input_lock.down) {
      if (dialog.option[1].button != DIALOG_BUTTON_NONE) {
        dialog.select_pos = BUTTON_POS_OPT1;
        input_lock.down = true;
        redraw = true;
        return;
      }
      else if (dialog.option[2].button != DIALOG_BUTTON_NONE) {
        dialog.select_pos = BUTTON_POS_OPT2;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }
  }

}

/**** Render Functions ****/

function dialog_render() {

  tileset_background_render(shop[dialog.shop_id].background);
  
  if(shop[dialog.shop_id].picture)
  {
      dialog_render_picture(shop[dialog.shop_id].picture);
  }

  bitfont_render(dialog.title, 80, 2, JUSTIFY_CENTER);

  // only render gold if there is something for sale
  if (dialog.items_for_sale) {
    info_render_gold();
  }

  dialog_render_button(dialog.option[0].button, BUTTON_POS_OPT0);
  dialog_render_button(dialog.option[1].button, BUTTON_POS_OPT1);
  dialog_render_button(dialog.option[2].button, BUTTON_POS_OPT2);
  
  dialog_render_text(dialog.option[0], BUTTON_POS_OPT0);
  dialog_render_text(dialog.option[1], BUTTON_POS_OPT1);
  dialog_render_text(dialog.option[2], BUTTON_POS_OPT2);

  action_render_select(dialog.select_pos);

  if (dialog.message != "") {
    bitfont_render(dialog.message, 80, 40, JUSTIFY_CENTER);
    dialog.message = "";
  }
}

function dialog_render_picture(picture)
{
    //console.log(picture);
    ctx.drawImage(dialog.picture_img[picture],16*SCALE,12*SCALE,128*SCALE,48*SCALE);
}

function dialog_render_text(option, pos) {
  if (option.msg1 == "" && option.msg2 == "") return;

  if (option.msg2 == "") {
    bitfont_render(option.msg1, pos.x + 22, pos.y + 6, JUSTIFY_LEFT);
  }
  else {
    bitfont_render(option.msg1, pos.x + 22, pos.y + 1, JUSTIFY_LEFT);
    bitfont_render(option.msg2, pos.x + 22, pos.y + 11, JUSTIFY_LEFT);
  }
}

function dialog_render_button(button_id, pos) {
  if (button_id == 0) return;

  ctx.drawImage(
    dialog.button_img,
    (button_id-1) * BUTTON_SIZE * PRESCALE,
    0,
    BUTTON_SIZE * PRESCALE,
    BUTTON_SIZE * PRESCALE,	
    (pos.x + BUTTON_OFFSET) * SCALE,
    (pos.y + BUTTON_OFFSET) * SCALE,
    BUTTON_SIZE * SCALE,
    BUTTON_SIZE * SCALE
  );
}




