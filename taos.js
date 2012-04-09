/*!
 * TAOS (Toggle Areas Or Styles) jQuery Plugin
 * @author      Ryan Van Etten (c) 2011-2012
 * @license     MIT
 * @link        http://github.com/ryanve/taos
 * @version     0.4.0
 * @requires    jQuery 1.7+ or Jeesh (ender.no.de/#jeesh)
 */

(function(win) {

    var $ = win.jQuery || win.$ || {}
      , $easing = $.easing || {}
      , ready = $.domReady || $
      , isJquery = $ === win.jQuery
      , console = win.console
      , doc = win.document
      , docElem = doc.documentElement
      , isFinite = win.isFinite
      , clickTaos = 'click.taos'
      , trimReplace = /^\s+|\s+$/                     // replacer
      , spaces = /\s+/                                // splitter, splits by 1 or more spaces
      , equals = /\s*\=\s*/                           // splitter, splits by =
      , pipes = /\s*\|(?!\=)\s*/                      // splitter, splits by | but not |=
      , exclamations = /\s*\!(?!\=)\s*/               // splitter, splits by ! but not !=
      , commasOrPipes = /\s*\,\s*|\s*\|(?!\=)\s*/     // splitter, splits by , or | but not |=
      , onlyAlphas = /^[a-zA-Z]+$/                    // tagName|className|attrName|easingType
      , selectorish = /[\[\#\:\.\+\~\*\>\^\$\\]|[\|\!](?=\=)/   // selectorish
    //, dashedAlphas = /^[a-z]+\-[a-z]+[a-z\-]*$/i
      , dataAttrName = /^data-[a-z0-9\-\_]+$/
      , attrNameOnly = /^[a-z]+[a-z0-9\-\_]*$/i // not a selector
      , attrWithValue = /^[a-z]+[a-z0-9\-\_]*\s*\=/i // not a selector
      , manualFilter = [].filter ? 0 : function (arr, callback) {
            // Backup for when native filter is not supported:
            var i = -1, ret = []
              , len = arr.length;
            while (i++ < len) {
                if (callback(arr[i], i)) {
                    ret.push(arr[i]);
                }
            }
            return ret;
        }
      , taos = function() {
            // For now $('...').taos() does nada. It just continues the chain.
            // But keep this like this so devs can check !!$.fn.taos if needed 
            // and keep the namespace reserved for possible future functionality.
            return this;
        }
    ;//var

    if (typeof $ !== 'function' && console && typeof console.log === 'function') {
        console.log('[!] taos unable to run b/c $ was undefined');
        return;
    }
        
    function $dataTaos(name) {
        return $('[data-taos-' + name + ']');
    }

    function trim(n) {
        return n ? n.replace(trimReplace, '') : '';
    }
    
    function getData(nativeElem, name) {
        var data = nativeElem.getAttribute('data-taos-' + name);
        return typeof data === 'string' ? (trim(data) ? data : '') : null;
    }
    
    function sift(arr, fn) {
        // This is an abbreviated version of the sift @link github.com/ryanve/response.js
        fn = fn || trim; // Default the callback to the local trim function b/c we mainly 
        // need it here for removing empty/whitespace strings from arrays of strings.   
        return arr.filter ? arr.filter(fn) : manualFilter(arr, fn);
    }

    function easingTypeExists(s) {
        // stackoverflow.com/questions/8619155/check-if-jquery-ui-easing-methods-are-available
        return !!(onlyAlphas.test(s) && $easing.hasOwnProperty(s));
    }
    
    function elSupportsAttr(el, attrName) {
        // Before this is called we know el is
        // an element and attrName is a string.
        var prop;
        if (attrName in el) {
            // case-sensitive check
            // In most scenarios we'll exit here.
            // e.g. elSupportsAttr(this, 'hidden')
            // or   elSupportsAttr(this, 'contentEditable') 
            return true;
        }
        for (prop in el) {
            // case-insensitive check
            // If we haven't returned yet, we have to run thru all 
            // the props in el and try the lowercasing them name so
            // that elSupportsAttr(this, 'contenteditable') works too.
            // Needed to omit hasOwnProperty test to make this work
            // in FF. The way this is setup it will exit as soon as 
            // a match is found, but still this is not ideal.
            if (prop.toLowerCase() === attrName.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    
    function find(arr, test, scope) {
        // return the first arr value that passes test
        // @param  object|array  arr can be array or array-like object
        // @param  callback      test
        // compat w/ documentcloud.github.com/underscore/#find
        var len, v, ret
          , i = -1;
        if (arr && (len = arr.length) && test) {
            while (!ret && i++ < len) {
                if (i in arr) {
                    v = arr[i];
                    ret = test.call(scope, v, i, arr) ? v : ret;
                }
            }
        }
        return ret;    
    }

    ready(function() {

        $dataTaos('area').each(function() {//AREA

            var dataRaw = getData(this, 'area')
              , $this = $(this)
              , n, parts, areas, areaCount, $elems, duration, easing, halfDuration, hasFx;

            if (dataRaw) {

                parts = sift(dataRaw.split(exclamations));
                if (parts.length > 1) {
                    n = parts[0];
                    if (isFinite(n) || easingTypeExists(n)) {
                        parts = parts.reverse();
                    }
                }
                areas = parts.length ? parts.shift().split(pipes) : [];
                areaCount = areas.length;
                if (!areaCount) { return; }
                $elems = $(areas.join());
                n = find(parts, isFinite);
                duration = n ? (parseFloat(n) || 0) : 0;
                halfDuration = duration/2;
                hasFx = !!(duration || easing);
                easing = find(parts, easingTypeExists) || false;

                $this.on(clickTaos, function () {
               
                    var i, $nextShow, $a0, display = 'display', none = 'none';
                    
                    // For checking visiblity, we use .css('display') !== 'none' 
                    // rather than .is(':visible') for better compatibility with
                    // frameworks other than jQuery. 
                    // stackoverflow.com/questions/10066630/how-to-check-if-element-is-visible-in-zepto

                    // If there's a duration or easing fn, .then stop() it too so
                    // that if a user clicks twice in a row, then the easing from the 
                    // first click is truncated if it hasn't already finished:
                    
                    if (hasFx && $elems.stop) {
                        $elems.stop(false, true);
                    }
                    
                    // Toggling on/off:
                    if (1 === areaCount) {
                        // If there's only one, then it will be the only one in 
                        // $elems (which has already cached, so use it).
                        if (!isJquery) {
                            $elems.toggle();
                        }
                        else {
                            $elems.toggle(duration, easing);
                        }
                    }

                    // Cycling a group:
                    else if (1 < areaCount) {
                
                        if (2 === areaCount) {
                            $a0 = $(areas[0]);
                            $nextShow = $a0.css(display) === none ? $a0 : $(areas[1]);
                        }
                    
                        else {
                            i = -1;
                            $nextShow = null;

                            while(!$nextShow && i++ < areaCount) {
                                if ($(areas[i]).css(display) !== none) {
                                    $nextShow = $(areas[i+1]);
                                }
                            }//while
                            
                            $nextShow = $nextShow || $(areas[0]);
                        }
                        
                        if (hasFx && $elems.fadeOut && $nextShow.fadeIn) {
                            $elems.fadeOut(halfDuration, easing);
                            $nextShow.fadeIn(halfDuration, easing);
                        }
                        else {
                            $elems.hide();
                            $nextShow.show();                        
                        }
                    }
                });//click
            }
        });//AREA

        $dataTaos('style').each(function() {//STYLE

            var dataRaw = getData(this, 'style')
              , $this = $(this)
              , parts, classes, classesCount, $elems;

            if (dataRaw) {

                parts = sift(dataRaw.split(exclamations));
                classes = parts.length ? parts.pop().split(commasOrPipes) : [];
                classesCount = classes.length;
                if (!classesCount) { return; }
                // Include .replace(exclamations, ',') in the next line to back support old syntax.
                $elems = parts.length ? $(parts.join().replace(exclamations, ',')) : $this; // Target selector or self.
                    
                $this.on(clickTaos, function () {
                
                    var i, nextClass, ssvGroup, n;
                    
                    if (1 === classesCount) {
                        $elems.toggleClass(classes[0]);
                    }
                    
                    else if (1 < classesCount) {
                
                        if (2 === classesCount) {
                            nextClass = $elems.hasClass(classes[0]) ? classes[1] : classes[0];
                        }
                    
                        else {
                            i = -1;
                            nextClass = null;

                            while(!nextClass && i++ < classesCount) {
                                if (classes[i]) {
                                    // For better compat with frameworks
                                    // other than jQuery, test each SSV
                                    // rather than all at once, which 
                                    // fails depending on implementation
                                    // of the hasClass method.
                                    ssvGroup = classes[i].split(spaces);
                                    n = ssvGroup.length;
                                    while(!nextClass && n && n--) {
                                        if ($elems.hasClass(ssvGroup[n])) {
                                            nextClass = classes[i+1];
                                        }
                                    }
                                }
                                //if ($elems.hasClass(classes[i])) {
                                    //nextClass = classes[i+1];
                                //}
                            }//while
                            
                            nextClass = nextClass || classes[0];
                        }

                        $elems.removeClass(classes.join(' ')).addClass(nextClass);
                    }
                });//click
            }
        });//STYLE

        $dataTaos('attr').each(function() {//ATTR

            var dataRaw = getData(this, 'attr')
              , $this = $(this)
              , n, parts, p0, $p0, partsLen, elemsLen, attrs, nthPair, count, $elems, attrPairs = {};

            if (dataRaw) {

                parts = sift(dataRaw.split(exclamations));
                partsLen = parts.length;
                if (!partsLen) { return; }
                p0 = parts[0];
            
                if (1 === partsLen) {
                    if (!selectorish.test(p0) || attrWithValue.test(p0)) {
                        attrs = [p0];
                        $elems = $this;
                    }
                    else {
                        // It's either a selector or a syntax error. In either
                        // case there's nothing to do, so exit the iteration.
                        return;
                    }
                }
                
                else {// 2 or more parts:
                    // The tricky part here is figuring out whether the 
                    // first part is a selector or an attribute, e.g. discerning
                    //     data-taos-attr="body!contentEditable"
                    // vs. data-taos-attr="contentEditable!checked" 
                    // vs. data-taos-attr="contentEditable!checked" 
                    // vs. data-taos-attr="src = 1.jpg | 2.jpg ! title = one | two" 
                    // vs. data-taos-attr="src = 1.jpg , 2.jpg ! title = one , two" 
                    // vs. data-taos-attr="img.example ! src = 1.jpg | 2.jpg ! title = one | two" 
                    // If no selector is provided, the attrs are applied to the element itself.

                    // The `p0 in this` here checks if the element supports the attribute stored as p0.
                    if ((onlyAlphas.test(p0) && elSupportsAttr(this, p0)) || attrWithValue.test(p0) || dataAttrName.test(p0)) {
                        $elems = $this;
                        attrs = parts.slice(0);
                    }
                    // Do this check 2nd in case there are attrs with values that look like selectors.
                    else if (selectorish.test(p0) || ($p0 = $(p0)).length) {
                        $elems = $p0;
                        attrs = parts.slice(1);
                    }
                    else {
                        return;
                    }
                }

                elemsLen = $elems.length;
                nthPair = attrs.length;
                if (!elemsLen || !nthPair) {
                    return; 
                }
                
                // Convert attrs string into an object (key/value pairs). This 
                // way we only need to test regexes and split values once.
                // Booleanish attrs like `checked` are equiv to `checked=""`

                while (nthPair--) {
                    n = attrs[nthPair];
                    if (attrNameOnly.test(n)) {
                        // state attributes, e.g. checked|selected|hidden|contentEditable|data-*|etc.
                        attrPairs[n] = [''];  // <p hidden> is equivalent to <p hidden=""> in all browsers
                        // Could add support for space-separated state attrs but would also 
                        // have to add some complexity to the p0 checks above. Does not seem 
                        // worth it b/c the exclamation syntax reads clearer anyway.
                        //n = n.split(spaces);
                        //i = n.length;
                        //while (i--) {
                        //    attrPairs[n[i]] = [''];
                        //}
                    }
                    else if (attrWithValue.test(n)) {
                        n = n.split(equals);
                        attrPairs[n[0]] = sift(n.slice(1).join('').split(commasOrPipes));
                    }
                }//while

                $this.on(clickTaos, function () {
                
                    $elems.each(function() {
                        var i, nextValue, attrName, attrValues, currValue;

                        for (attrName in attrPairs) {
                            if (attrPairs.hasOwnProperty(attrName) && (elSupportsAttr(this, attrName) || dataAttrName.test(attrName))) {
                        
                                attrValues = attrPairs[attrName];
                                count = attrValues.length; // one or more values
                                currValue = this.getAttribute(attrName);
                                    
                                if (1 === count) {
                                    // state attributes
                                    // Use string check rather than hasAttribute b/c getAttribute 
                                    // is better supported than hasAttribute in old IE. 
                                    // If the attr is not present it will be null or undefined.
                                    if (typeof currValue === 'string') {
                                        this.removeAttribute(attrName);
                                    }
                                    else {
                                        this.setAttribute(attrName, attrValues[0]);
                                    }
                                }
                                
                                else if (2 === count) {
                                    nextValue = currValue === attrValues[1] ? attrValues[0] : attrValues[1];
                                    this.setAttribute(attrName, nextValue);
                                }

                                else if (2 < count) {
                                    i = -1;
                                    nextValue = null;
                        
                                    while(!nextValue && i++ < count) {
                                        if (currValue === attrValues[i]) {
                                            nextValue = attrValues[i+1];
                                        }
                                    }//while

                                    nextValue = typeof nextValue === 'string' ? nextValue : attrValues[0];
                                    i = count; // reset i
                                    while (i--) {
                                        this.removeAttribute(attrValues[i]);
                                    }
                                    this.setAttribute(attrName, nextValue);
                                }
                            }
                        }//for/in
                    });//each
                });//click
            }
        });//ATTR
    
        // Remove .no-taos class from html tag (if it's there) and add .taos (for styling purposes)
        docElem.className = docElem.className.replace(/(^|\s)(no-)?taos(\s|$)/, '$1$3') + ' taos ';

    });//ready
    
    // expose the taos method to the chain:
    if ($.fn) {
        $.fn.taos = taos;
    }

}(window));

/*jslint sloppy: true, white: true, plusplus: true, regexp: true, maxerr: 50, indent: 4 */