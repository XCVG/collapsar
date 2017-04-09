/**
 Treasure
 Handles display and rewards for loot
 */

var TREASURE_ICON_SIZE = 32;
var TREASURE_POS_X = 64;
var TREASURE_POS_Y = 88;

var treasure = new Object();

treasure.img = new Image();
treasure.img_loaded = false;

/*** Initialize **********************/
function treasure_init() {

  treasure.img.src = "images/treasure/treasure.png";
  treasure.img.onload = function() {treasure_img_onload();};  
  
}

/*** Image loading Helpers **********************/
function treasure_img_onload() {treasure.img_loaded = true;}

/**
 * This function renders a gold pile
 * with correct gold value up to 1023 currently
 */
 //replaced with a lazy version by XCVG
function treasure_render_gold(total_value) {

    //stepped render like Heroin Dusk did
    //green crystal, green cluster, blue crystal, blue cluster, purple crystal, purple cluster, bigass pile
    //go orange/green/purple actually

    //guesstimate amount (designed for Heroin Dusk)

    if (total_value < 10)
        treasure_render_gold_icon(0);
    else if (total_value < 50)
        treasure_render_gold_icon(1);
    else if (total_value < 100)
        treasure_render_gold_icon(2);
    else if (total_value < 250)
        treasure_render_gold_icon(3);
    else if (total_value < 500)
        treasure_render_gold_icon(4);
    else if (total_value < 1000)
        treasure_render_gold_icon(5);
    else
        treasure_render_gold_icon(6);
	

}

function treasure_render_gold_icon(item_id) {

    treasure_render_item(item_id);
}

function treasure_render_item(item_id) {
  ctx.drawImage(
    treasure.img,
    (item_id * TREASURE_ICON_SIZE) * PRESCALE,
    0,
    TREASURE_ICON_SIZE * PRESCALE,
    TREASURE_ICON_SIZE * PRESCALE,
    TREASURE_POS_X * SCALE,
    TREASURE_POS_Y * SCALE,
    TREASURE_ICON_SIZE * SCALE,
    TREASURE_ICON_SIZE * SCALE 
  );
}


