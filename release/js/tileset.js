/**
TileSet class.
  
2013 Clint Bellanger
*/

//this is not a class. JS doesn't have classes (yet), nor is this written like a JS-fake-class
//I might redo this thing in TypeScript some day

var TILE_COUNT = 30;
var BACKGROUND_COUNT = 9;

var tileset = new Object();
tileset.tile_img = new Array();
tileset.background_img = new Array();

tileset.walkable = new Array();
tileset.mapicon = new Array();
tileset.background = new Image();
tileset.render_offset = {x:0, y:0};

for(i=0; i<TILE_COUNT; i++)
{
    tileset.mapicon[i] = -1;
}

// notice we skip 0 which means "no tile"
for (i=1; i<=TILE_COUNT; i++) {
  tileset.tile_img[i] = new Image();
}

for (i=0; i<BACKGROUND_COUNT; i++) {
  tileset.background_img[i] = new Image();
}

// image loader progress
tileset.load_counter = 0;

//---- Properties ---------------------------------------------------

//---- Tiles --------------------------------------------------------

// Each tile has the same layout on the sprite sheet
// tiles 0-12 also represent position 0-12
tileset.draw_area = [
  {"width": 80,  "height": 120, "src_x": 0,   "src_y": 0, "dest_x": 0,  "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 80,  "src_y": 0, "dest_x": 80, "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 160, "src_y": 0, "dest_x": 0,  "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 240, "src_y": 0, "dest_x": 80, "dest_y": 0},  
  {"width": 160, "height": 120, "src_x": 320, "src_y": 0, "dest_x": 0,  "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 480, "src_y": 0, "dest_x": 0,  "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 560, "src_y": 0, "dest_x": 80, "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 0,   "src_y": 120, "dest_x": 0,  "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 80,  "src_y": 120, "dest_x": 80, "dest_y": 0},
  {"width": 160, "height": 120, "src_x": 160, "src_y": 120, "dest_x": 0,  "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 320, "src_y": 120, "dest_x": 0,  "dest_y": 0},
  {"width": 80,  "height": 120, "src_x": 400, "src_y": 120, "dest_x": 80, "dest_y": 0},
  {"width": 160, "height": 120, "src_x": 480, "src_y": 120, "dest_x": 0,  "dest_y": 0}
];

//---- Public Functions ---------------------------------------------

function tileset_init() {

  // load background images
  tileset.background_img[0].src = "images/backgrounds/black.png";
  tileset.background_img[0].onload = function() {tileset_onload();};
  
  tileset.background_img[1].src = "images/backgrounds/nightsky.png";
  tileset.background_img[1].onload = function() {tileset_onload();};

  tileset.background_img[2].src = "images/backgrounds/tempest.png";
  tileset.background_img[2].onload = function() {tileset_onload();};

  tileset.background_img[3].src = "images/backgrounds/interior.png";
  tileset.background_img[3].onload = function() {tileset_onload();};
  
  tileset.background_img[4].src = "images/backgrounds/deepsky.png";
  tileset.background_img[4].onload = function() {tileset_onload();};
  
  tileset.background_img[5].src = "images/backgrounds/intsky.png";
  tileset.background_img[5].onload = function() {tileset_onload();};
  
  tileset.background_img[6].src = "images/backgrounds/nightsky3.png";
  tileset.background_img[6].onload = function() {tileset_onload();};
  
  tileset.background_img[7].src = "images/backgrounds/interior.png";
  tileset.background_img[7].onload = function() {tileset_onload();};
  
  tileset.background_img[8].src = "images/backgrounds/invback2.png";
  tileset.background_img[8].onload = function() {tileset_onload();};

  //TODO: new BG

  tileset.walkable[0] = false;
  
  // load tile images
  tileset.tile_img[1].src = "images/tiles/dungeon_floor.png";
  tileset.tile_img[1].onload = function() {tileset_onload();};
  tileset.walkable[1] = true;
  tileset.mapicon[1] = 7;
  
  tileset.tile_img[2].src = "images/tiles/dungeon_wall.png";
  tileset.tile_img[2].onload = function() {tileset_onload();};
  tileset.walkable[2] = false;
  tileset.mapicon[2] = 6;

  tileset.tile_img[3].src = "images/tiles/dungeon_door.png";
  tileset.tile_img[3].onload = function() {tileset_onload();};
  tileset.walkable[3] = true;
  tileset.mapicon[3] = 3;

  tileset.tile_img[4].src = "images/tiles/pillar_exterior.png";
  tileset.tile_img[4].onload = function() {tileset_onload();};
  tileset.walkable[4] = false;
  tileset.mapicon[4] = 6;
  
  tileset.tile_img[5].src = "images/tiles/dungeon_ceiling.png";
  tileset.tile_img[5].onload = function() {tileset_onload();};
  tileset.walkable[5] = true;
  tileset.mapicon[5] = 7;

  tileset.tile_img[6].src = "images/tiles/grass.png";
  tileset.tile_img[6].onload = function() {tileset_onload();};
  tileset.walkable[6] = true;
  tileset.mapicon[6] = 5;
  
  tileset.tile_img[7].src = "images/tiles/pillar_interior.png";
  tileset.tile_img[7].onload = function() {tileset_onload();};
  tileset.walkable[7] = false;
  tileset.mapicon[7] = 6;

  tileset.tile_img[8].src = "images/tiles/chest_interior.png";
  tileset.tile_img[8].onload = function() {tileset_onload();};
  tileset.walkable[8] = true;
  tileset.mapicon[8] = 3;

  tileset.tile_img[9].src = "images/tiles/chest_exterior.png";
  tileset.tile_img[9].onload = function() {tileset_onload();};
  tileset.walkable[9] = true;
  tileset.mapicon[9] = 3;

  tileset.tile_img[10].src = "images/tiles/medieval_house.png";
  tileset.tile_img[10].onload = function() {tileset_onload();};
  tileset.walkable[10] = false;
  tileset.mapicon[10] = 9;
  
  tileset.tile_img[11].src = "images/tiles/medieval_door.png";
  tileset.tile_img[11].onload = function() {tileset_onload();};
  tileset.walkable[11] = true;  
  tileset.mapicon[11] = 3;
  
  tileset.tile_img[12].src = "images/tiles/tree_evergreen.png";
  tileset.tile_img[12].onload = function() {tileset_onload();};
  tileset.walkable[12] = false;
  tileset.mapicon[12] = 8;

  tileset.tile_img[13].src = "images/tiles/grave_cross.png";
  tileset.tile_img[13].onload = function() {tileset_onload();};
  tileset.walkable[13] = false;

  tileset.tile_img[14].src = "images/tiles/grave_stone.png";
  tileset.tile_img[14].onload = function() {tileset_onload();};
  tileset.walkable[14] = false;

  tileset.tile_img[15].src = "images/tiles/water.png";
  tileset.tile_img[15].onload = function() {tileset_onload();};
  tileset.walkable[15] = false;
  tileset.mapicon[15] = 4;

  tileset.tile_img[16].src = "images/tiles/skull_pile.png";
  tileset.tile_img[16].onload = function() {tileset_onload();};
  tileset.walkable[16] = false;
  tileset.mapicon[16] = 3;

  tileset.tile_img[17].src = "images/tiles/hay_pile.png";
  tileset.tile_img[17].onload = function() {tileset_onload();};
  tileset.walkable[17] = true;
  tileset.mapicon[17] = 3;

  tileset.tile_img[18].src = "images/tiles/locked_door.png";
  tileset.tile_img[18].onload = function() {tileset_onload();};
  tileset.walkable[18] = false;
  tileset.mapicon[18] = 3;
  
  tileset.tile_img[19].src = "images/tiles/death_speaker.png";
  tileset.tile_img[19].onload = function() {tileset_onload();};
  tileset.walkable[19] = true;
  tileset.mapicon[19] = 2;
  
  //TODO: new tiles
  tileset.tile_img[20].src = "images/tiles/metal_floor.png";
  tileset.tile_img[20].onload = function() {tileset_onload();};
  tileset.walkable[20] = true;
  tileset.mapicon[20] = 7;
  
  tileset.tile_img[21].src = "images/tiles/metal_wall.png";
  tileset.tile_img[21].onload = function() {tileset_onload();};
  tileset.walkable[21] = false;
  tileset.mapicon[21] = 6;
  
  tileset.tile_img[22].src = "images/tiles/metal_door.png";
  tileset.tile_img[22].onload = function() {tileset_onload();};
  tileset.walkable[22] = true;
  tileset.mapicon[22] = 3;
  
  tileset.tile_img[23].src = "images/tiles/metal_pillar.png";
  tileset.tile_img[23].onload = function() {tileset_onload();};
  tileset.walkable[23] = false;
  tileset.mapicon[23] = 6;
  
  tileset.tile_img[24].src = "images/tiles/metal_machine.png";
  tileset.tile_img[24].onload = function() {tileset_onload();};
  tileset.walkable[24] = false;
  tileset.mapicon[24] = 6;
  
  tileset.tile_img[25].src = "images/tiles/metal_ceiling.png";
  tileset.tile_img[25].onload = function() {tileset_onload();};
  tileset.walkable[25] = true;
  tileset.mapicon[25] = 7;
  
  tileset.tile_img[26].src = "images/tiles/techchest_interior.png";
  tileset.tile_img[26].onload = function() {tileset_onload();};
  tileset.walkable[26] = true;
  tileset.mapicon[26] = 3;
  
  tileset.tile_img[27].src = "images/tiles/techchest_exterior.png";
  tileset.tile_img[27].onload = function() {tileset_onload();};
  tileset.walkable[27] = true;
  tileset.mapicon[27] = 3;
  
  tileset.tile_img[28].src = "images/tiles/water_ceiling.png";
  tileset.tile_img[28].onload = function() {tileset_onload();};
  tileset.walkable[28] = false;
  tileset.mapicon[28] = 4;
  
  tileset.tile_img[29].src = "images/tiles/boss_level1.png";
  tileset.tile_img[29].onload = function() {tileset_onload();};
  tileset.walkable[29] = true;
  tileset.mapicon[29] = 3;
  
  tileset.tile_img[30].src = "images/tiles/info_level1.png";
  tileset.tile_img[30].onload = function() {tileset_onload();};
  tileset.walkable[30] = true;
  tileset.mapicon[30] = 3;
  
}

function tileset_onload() {
  tileset.load_counter++;
  var percent_loaded = (tileset.load_counter * 100) / (TILE_COUNT + BACKGROUND_COUNT);
  
  if (percent_loaded == 100) redraw = true;
  
  // we can get the game moving if at least the tiles are finished loading
  else loadbar_render(percent_loaded);
  
}

/**
 * Draw the default background for this map
 */
function tileset_background() {
  tileset_background_render(atlas.maps[mazemap.current_id].background);
}

/**
 * Render a specific background (I think a different method is used for actual directional drawing)
 */
function tileset_background_render(background_id) {
    ctx.drawImage(tileset.background_img[background_id],0,0,160*PRESCALE,120*PRESCALE,0,0,160*SCALE,120*SCALE);       
}

function tileset_render(tile_id, position) {
  
  // 0 reserved for completely empty
  if (tile_id == 0) return;
  
  ctx.drawImage(
    tileset.tile_img[tile_id],
    tileset.draw_area[position].src_x * PRESCALE,
    tileset.draw_area[position].src_y * PRESCALE,
    tileset.draw_area[position].width * PRESCALE,
    tileset.draw_area[position].height * PRESCALE,
    (tileset.draw_area[position].dest_x + tileset.render_offset.x) * SCALE,
    (tileset.draw_area[position].dest_y + tileset.render_offset.y) * SCALE,
    tileset.draw_area[position].width * SCALE,
    tileset.draw_area[position].height * SCALE
  );

}


