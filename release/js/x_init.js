/**
 x_init.js
 Extended init for Collapsar 2.0
 Preloads maps into Atlas, preloads TEXTURES for sprites and tilesets
 */
 
function x_init_preload()
{
	console.log("Starting Collapsar pre2.0...");
        
        // load some user preferences
        //TODO change this to not a cookie
        var json_save = getCookie("options");
        if (json_save != null)
        {
          OPTIONS = JSON.parse(json_save);
        }
        else
        {
            var ua = navigator.userAgent;
            console.log(ua);
            
            //set default filtering differently for Chrome and Fx
            
            //if it contains "AppleWebkit", disable filtering
            if(ua.includes("AppleWebkit"))
            {
                OPTIONS.filtering = false;
            }        
            //if it contains "Gecko" and either "Firefox" or "Fennec", enable filtering
            if(ua.includes("Gecko") && (ua.includes("Firefox") || ua.includes("Fennec")))
            {
                OPTIONS.filtering = true;
            }
            
            //otherwise follow config.js default
        }
}

function x_init_postload()
{
	console.log("...done!");
        
        document.title = "Ascension Adventure 2";
}