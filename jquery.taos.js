/*!
 * TAOS (Toggle Areas Or Styles) jQuery Plugin
 * @author      Ryan Van Etten/2011
 * @license     MIT
 * @link        http://github.com/ryanve/taos
 * @version     0.3.1
 * @requires    jQuery 1.7+
 */

!function(context, doc, undef) {

    var taosMethods
      , $ = context.jQuery || context.$
      , trimReplace = /^\s+|\s+$/g      // regex for trimming whitespace
      , isArray = Array.isArray || $.isArray // use native when possible
    ;//var
    
    // Define local functions:
    
    function toSSV(maybeArr) {
        // If array, join with spaces and return. Otherwise return as is.
        return isArray(maybeArr) ? maybeArr.join(' ') : maybeArr;
    }
    
    function $dataTaos(name) {
        return $('[data-taos-' + name + ']');
    }
    
    function getData(nativeElem, name) {
        var data = nativeElem.getAttribute('data-taos-' + name);
        return typeof data === 'string' ? (data.replace(trimReplace, '') ? data : '') : undef;
    }
                
    function removeNonStrings(arr) {
        // Remove non-strings and empty strings from array:
        return isArray(arr) ? $.grep(arr, function(n,i) {
            return typeof n === 'string' && n.replace(trimReplace, '');
        }) : false;
    }

    function removeNonNumeric(arr) {
        // Remove array values that cannot be converted to integers:
        return isArray(arr) ? $.grep(arr, function(n,i) {
            return !isNaN(parseInt(n, 10)); 
        }) : false;
    }
                    
    function stripFlags(str) {
        // Remove flags and return an array of the remaining values.
        var parts = str.split('!'); 
        return parts[parts.length-1].split(','); // Array
    }
                
    function getFlags(str) {
        // Get all the flags in an array or return false if none.
        // For example 'body!html!anything' becomes ['body', 'html']
                    
        // First check if str contains any ! marks.
        if ( ! /!/.test(str) ) {
            return false;
        }
                    
        // Split str into parts and remove empty values.
        var parts = removeNonStrings(str.split('!'));
                    
        // Remove last value, unless it's the only one.
        if (1 < parts.length) {
            parts.pop();
        }
                
        // If any parts are left, return the array. Otherwise return false.
        return 0 < parts.length ? parts : false;
    }
                
    function getDuration(arr) {
        // Return the first integer from array or 0 if none.
        return isArray(arr) ? parseInt(removeNonNumeric(arr)[0], 10) || 0 : 0;
    }
                
    function getEasing(arr) {
        // stackoverflow.com/questions/8619155/check-if-jquery-ui-easing-methods-are-available
        arr = removeNonStrings(arr);
        return 'linear' === arr[0] || ($.easing && $.easing.hasOwnProperty(arr[0])) ? arr[0] : false;
    }
    
    function init() {

        $dataTaos('area').each(function() {//AREA
        
            var dataRaw = getData(this, 'area');

            if (dataRaw) {
                var $this = $(this)
                  , areas = stripFlags(dataRaw)           // Get array of values.
                  , areaCount = areas.length              // Count values.
                  , options = getFlags(dataRaw)           // Duration and/or easing.
                  , selectAll = $(areas.join())
                  , flags = getFlags(dataRaw)
                  , duration = getDuration(flags)
                  , easing = getEasing(flags)
                ;//var

                $this.click(function (nextShow) {
                
                    var i, visible = ':visible';
                    
                    if (1 === areaCount) {
                        // If there's only one, then it will be the only one in 
                        // selectAll (which has already cached, so use it). If 
                        // there's a duration, .then stop() it too so that if 
                        // a user clicks twice in a row, then the easing from the 
                        // first click is truncated if it hasn't already finished.
                        // Save the stop fn to the local i for scope optimization.
                        if (duration && selectAll.stop) { 
                            selectAll.stop(false, true);
                        }
                        selectAll.toggle(duration, easing);
                    }

                    else if (1 < areaCount) {
                
                        if (2 === areaCount) {
                            nextShow = $(areas[0]).is(visible) ? $(areas[1]) : $(areas[0]);
                        }
                    
                        else {
                            i = -1;
                            nextShow = undef;

                            while(!nextShow && i++ < areaCount) {
                                if ($(areas[i]).is(visible)) {
                                    nextShow = $(areas[i+1]);
                                }
                            }//while
                            
                            nextShow = nextShow || $(areas[0]);
                        }
                        
                        selectAll.hide();
                        nextShow.show();
                        
                    }
                });//click
            }
        });//AREA


        $dataTaos('style').each(function() {//STYLE

            var dataRaw = getData(this, 'style');

            if (dataRaw) {
                var $this = $(this)
                  , classes = stripFlags(dataRaw)             // Get array of values.
                  , classesCount = classes.length             // Count classes.
                  , flags = getFlags(dataRaw)                 // Get array of flags.
                  , elems = flags ? $(flags.join()) : $this   // Select flags or self.
                ;//var
                    
                $this.click(function (nextClass) {
                     
                    if (1 === classesCount) {
                        elems.toggleClass(classes[0]);
                    }
                    
                    else if (1 < classesCount) {
                
                        if (2 === classesCount) {
                            nextClass = elems.hasClass(classes[0]) ? classes[1] : classes[0];
                        }
                    
                        else {
                            var i = -1;
                            nextClass = undef;
                        
                            while( !nextClass && i++ < classesCount ) {
                                if ( elems.hasClass(classes[i]) ) {
                                    nextClass = classes[i+1];
                                }
                            }//while
                            
                            nextClass = nextClass || classes[0];
                        }
                    
                        elems.taos('cycleClass', classes, nextClass);
                    }
                });//click
            }
        });//STYLE
                    
        // Remove .no-taos class from html tag (if it's there) and add .taos (for styling purposes)
        $(doc).ready(function(docElem){
            docElem = doc.documentElement;
            docElem.className = docElem.className.replace(/(^|\s)(no-)?taos(\s|$)/, '$1$3') + ' taos ';
        });

    }//init

    // Methods exposed on the taos object:
    taosMethods = {
        init: init
      , cycleClass: function (removes, adds) {
            // might remove this in future version
            adds = toSSV(adds);
            removes = toSSV(removes);
            return $(this).removeClass(removes).addClass(adds);
        }
    };

    // docs.jquery.com/Plugins/Authoring#Namespacing
    $.fn.taos = function(method) {
        // Method calling logic:
        if (taosMethods[method]) {
            return taosMethods[method].apply(this, [].slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return taosMethods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' +  method + ' does not exist on $.fn.taos');
        }
    };
    
    $().taos(); // call init
    
}(this, document);

/*jslint sloppy: true, white: true, plusplus: true, regexp: true, maxerr: 50, indent: 4 */