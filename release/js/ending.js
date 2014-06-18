/**
 * Ending screen
 */

//new for Collapsar

var ENDING_BAD = 0;
var ENDING_GOOD = 1;
 
var ending = new Object();

ending.good_img = new Image();
ending.good_img_loaded = false;
ending.bad_img = new Image();
ending.bad_img_loaded = false;

ending.id = ENDING_BAD;

//probably don't need these
ending.menu_id = -1;
ending.text_h = 11;

function ending_init() {
  //that... probably shouldn't have gone there
  //mazemap_set_music("title");
  ending.good_img.src = "images/backgrounds/ending.png";
  ending.good_img.onload = function() {ending_good_onload();};
  ending.bad_img.src = "images/backgrounds/busted.png";
  ending.bad_img.onload = function() {ending_bad_onload();};
  redraw = true;
}

//function ending_onload() {
//  ending.img_loaded = true;
//}
/*** Image loading Helpers **********************/
function ending_good_onload() {ending.good_img_loaded = true;}
function ending_bad_onload() {ending.bad_img_loaded = true;}


function ending_logic() {

	//lolwut

}

function ending_render() {


  if (!bitfont.loaded || !ending.bad_img_loaded || !ending.good_img_loaded) {
    redraw = true;
    return;
  }


  if(ending.id == ENDING_GOOD)
  {
	ctx.drawImage(ending.good_img, 0, 0, 160*SCALE, 120*SCALE);
	mazemap_set_music("victory");
  }
  else
  {
	ctx.drawImage(ending.bad_img, 0, 0, 160*SCALE, 120*SCALE);
	mazemap_set_music("defeat");
  }

    bitfont_render("XCVG Systems 2014", 80, 100, JUSTIFY_CENTER);
    bitfont_render("", 80, 110, JUSTIFY_CENTER);

}
