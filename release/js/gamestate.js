/**
 Primary game state switcher
 
 */
 
var STATE_EXPLORE = 0;
var STATE_COMBAT = 1;
var STATE_INFO = 2;
var STATE_DIALOG = 3;
var STATE_TITLE = 4;
var STATE_ENDING = 5;
var STATE_INTRO = 6;
var STATE_LIFT = 7;
 
var gamestate = STATE_TITLE;

function gamestate_logic() {

  switch(gamestate) {
    case STATE_EXPLORE:
	  explore_logic();
	  break;
	case STATE_INFO:
	  info_logic();
	  break;
	case STATE_COMBAT:
	  combat_logic();
	  break;
    case STATE_DIALOG:
      dialog_logic();
      break;
	case STATE_TITLE:
	  title_logic();
	  break;
	case STATE_ENDING:
	  ending2_logic();
	  break;
      case STATE_INTRO:
          intro_logic();
          break;
      case STATE_LIFT:
          lift_logic();
          break;
  } 
}

function gamestate_render() {

  bitfont_determinecolor();

  switch(gamestate) {
    case STATE_EXPLORE:
	  explore_render();
	  break;
	case STATE_INFO:
	  info_render();
	  break;
	case STATE_COMBAT:
	  combat_render();
	  break;
    case STATE_DIALOG:
      dialog_render();
      break;
	case STATE_TITLE:
	  title_render();
	  break;
	case STATE_ENDING:
	  ending2_render();
	  break;
      case STATE_INTRO:
          intro_render();
          break;
      case STATE_LIFT:
          lift_render();
          break;
  }
}

