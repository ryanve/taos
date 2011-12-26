/*!
 * TAOS (Toggle Areas Or Styles) jQuery Plugin
 * @author Ryan Van Etten/2011
 * @license MIT
 * @version 0.1.0
 * @requires jQuery 1.7+
 */
 
;(function($, undefined) {

  "use strict"; // invoke strict mode

	// Define local vars and functions:
	var data = { // stuff for each data attribute
				area : {
				  key : 'taos-area' 
				, selector : $('[data-taos-area]')
				}
				, 
				style : {
				  key : 'taos-style' 
				, selector : $('[data-taos-style]')
				}
			}
	, toSSV = function (maybeArr)
				{   // If array, join with spaces and return. Otherwise return as is.
					return $.isArray(maybeArr) ? maybeArr.join(' ') : maybeArr;
				}
	
	, isVoid = function (maybeStr)
				{	// Return boolean (true for non-strings or pure whitespace). 
					return typeof maybeStr !== 'string' ? true : maybeStr.replace(/^\s+|\s+$/g,'').length < 1;
				}
				
	, hasData = function (needle, haystack)
				{	// Return true if attr contains data.
					if ( !needle || !haystack ) {
						return undefined;
					}
					return !isVoid(haystack.data(needle)); // boolean
				}
				
	, removeNonStrings = function(arr)
				{	// Remove non-strings and empty strings from an array.
					return $.isArray(arr) ? $.grep(arr, function(n, i) { return !isVoid(n); }) : false;
				}

	, removeNonNumeric = function(arr)
				{	// Remove array values that cannot be converted to integers.
					return $.isArray(arr) ? $.grep(arr, function(n, i) { return !isNaN(parseInt(n, 10)); }) : false;
				}
					
	, stripFlags = function (str)
				{   // Remove flags and return an array of the remaining values.
					var parts = str.split('!'); 
					return parts[parts.length-1].split(','); // Array
				}
				
	, getFlags = function (str)
				{   // Get all the flags in an array or return false if none.
				    // For example 'body!html!anything' becomes ['body', 'html']
					
					// First check if str contains any ! marks.
					if ( ! /!/.test(str) ) {
						return false;
					}
					
					// Split str into parts and remove empty values.
					var parts = removeNonStrings(str.split('!'));
					
					// Remove last value, unless it's the only one.
					if ( 1 < parts.length ) {
						parts.pop();
					}
				
					// If any parts are left, return the array. Otherwise return false.
					return 0 < parts.length ? parts : false;
				}
				
	, getDuration = function (arr)
				{
					// Return the first integer from array or 0 if none.
					return $.isArray(arr) ? parseInt(removeNonNumeric(arr)[0], 10) || 0 : 0;
				}
				
	, getEasing = function (arr)
				{	// stackoverflow.com/questions/8619155/check-if-jquery-ui-easing-methods-are-available
					var arr = removeNonStrings(arr);
					return 'linear' === arr[0] || ($.easing && $.easing.hasOwnProperty(arr[0])) ? arr[0] : false;
				}

	// Define methods that get exposed on the taos object:
    , methods = {

		cycleClass : function (removes, adds)
				{
					var adds = toSSV(adds)
					  , removes = toSSV(removes)
					;
					return $(this).removeClass(removes).addClass(adds);
				}
		,
		init : function()
				{	// STYLE
					$.each(data.style.selector, function() {
		
						var $this = $(this); // Cache selector.

						if ( hasData(data.style.key, $this) ) {
				
							var dataRaw = $this.data(data.style.key)      // Read data attr.  
							  , classes = stripFlags(dataRaw)             // Get array of values.
							  , classesCount = classes.length             // Count classes.
							  , flags = getFlags(dataRaw)                 // Get array of flags.
							  , elems = flags ? $(flags.join()) : $this   // Select flags or self.
							;
					
							$this.click(function () {
					 
								if ( 1 === classesCount ) {
									elems.toggleClass(classes[0]);
								}
					
								else if ( 1 < classesCount ) {
									if ( 2 === classesCount ) {
										var nextClass = elems.hasClass(classes[0]) ? classes[1] : classes[0];
									}
									else {
										var i = -1
										  , nextClass = undefined
										;
										while( !nextClass && i++ < classesCount ) {
											if ( elems.hasClass(classes[i]) )
											{
												var nextClass = classes[i+1];
											}
										}
										var nextClass = nextClass || classes[0];
									}
									elems.taos('cycleClass', classes, nextClass);
								}
							});//click
						}
					});//each
					
					// It might be better to select both area/style attrs at once
					// and group everything into one each function.
					
					// AREA
					$.each(data.area.selector, function() {
		
						var $this = $(this); // Cache selector.

						if ( hasData(data.area.key, $this) ) {
				
							var dataRaw = $this.data(data.area.key)  // Read data attr.  
							  , areas = stripFlags(dataRaw)           // Get array of values.
							  , areaCount = areas.length              // Count values.
							  , options = getFlags(dataRaw)           // Duration and/or easing.
							  , selectAll = $(areas.join())
							  , flags = getFlags(dataRaw)
							  , duration = getDuration(flags)
							  , easing = getEasing(flags)
							;
					
							$this.click(function () {
					 
								if ( 1 === areaCount ) {
									// If there's only one, then it will
									// be the only one in selectAll, so 
									// use that b/c it's already cached.
									selectAll.toggle(duration, easing);
								}
					
								else if ( 1 < areaCount ) {
									if ( 2 === areaCount ) {
										var nextShow = $(areas[0]).is(':visible') ? $(areas[1]) : $(areas[0]);
									}
									else {
										var i = -1
										  , nextShow = undefined
										;
										while( !nextShow && i++ < areaCount ) {
											if ( $(areas[i]).is(':visible') )
											{
												var nextShow = $(areas[i+1]);
											}
										}
										var nextShow = nextShow || $(areas[0]);
									}
									selectAll.hide();
									nextShow.show();
								}
							});//click
						}
					});//each

				}//init
		}//methods
	;//var
	
	// docs.jquery.com/Plugins/Authoring#Namespacing
	$.fn.taos = function(method)
	{
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.taos' );
		}
	};
	
	$().taos(); // call init
	
}(jQuery));