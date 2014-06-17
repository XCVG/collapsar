/**
 * Ending screen
 */

//new for Collapsar
 
var ending = new Object();

ending.img = new Image();
ending.img_loaded = false;
ending.menu_id = -1;
ending.text_h = 11;

function ending_init() {
  //that... probably shouldn't have gone there
  //mazemap_set_music("title");
  ending.img.src = "images/backgrounds/ending.png";
  ending.img.onload = function() {ending_onload();};
  redraw = true;
}

function ending_onload() {
  ending.img_loaded = true;
}

function ending_logic() {

	//lolwut

}

function ending_render() {

  if (!bitfont.loaded || !ending.img_loaded) {
    redraw = true;
    return;
  }

  ctx.drawImage(ending.img, 0, 0, 160*SCALE, 120*SCALE);

    bitfont_render("XCVG Systems 2014", 80, 100, JUSTIFY_CENTER);
    bitfont_render("", 80, 110, JUSTIFY_CENTER);

}
