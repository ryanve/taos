/*!
 * TAOS         Toggle Areas Or Styles
 * @author      Ryan Van Etten (c) 2011-2012
 * @license     MIT
 * @link        http://github.com/ryanve/taos
 * @version     0.5.0
 * @requires    jQuery 1.7+
 *              or Jeesh (ender.no.de/#jeesh)
 *              or Zepto 0.8+ (zeptojs.com)
 */

/*jslint browser: true, devel: true, node: true, passfail: false, bitwise: true
, continue: true, debug: true, eqeq: true, es5: true, forin: true, newcap: true
, nomen: true, plusplus: true, regexp: true, undef: true, sloppy: true, stupid: true
, sub: true, white: true, indent: 4, maxerr: 50 */

(function(root, factory) {
    // Module logic could be put here (e.g. `define(['jquery'], factory)`)
    // Otherwise just run it. Nothing gets exposed:
    factory(root['jQuery'] || root['ender'] || root['Zepto']);
}(this, function($) {

    if ( typeof $ !== 'function' ) {// Exit gracefully if dependency is missing:
        try { console.log('[!] taos unable to run due to missing dep'); }
        catch(e) {}
        return;
    }

    var ready = $['domReady'] || $
      , isJquery = $ === this['jQuery']
      , Modernizr = this['Modernizr']
      , $easing = $['easing'] || {}
      , clickName = 'click.taos'                      // event type w/ namespace
      , trimReplace = /^\s+|\s+$/                     // replacer
      , spaces = /\s+/                                // splitter, splits by 1 or more spaces
      , equals = /\s*\=\s*/                           // splitter, splits by =
      , pipes = /\s*\|(?!\=)\s*/                      // splitter, splits by | but not |=
      , exclamations = /\s*\!(?!\=)\s*/               // splitter, splits by ! but not !=
      , commasOrPipes = /\s*\,\s*|\s*\|(?!\=)\s*/     // splitter, splits by , or | but not |=
      , onlyAlphas = /^[a-zA-Z]+$/                    // tagName|className|attrName|easingType
      , selectorish = /[\[\#\:\.\+\~\*\>\^\$\\]|[\|\!](?=\=)/ // maybe a selector
      , dataAttrName = /^data-[a-z0-9\-\_]+$/
      , attrNameOnly = /^[a-z]+[a-z0-9\-\_]*$/i       // not a selector
      , attrWithValue = /^[a-z]+[a-z0-9\-\_]*\s*\=/i  // not a selector
    ;

    /**
     * @param {string}   key
     */
    function taos(key) {
        return $('[data-taos-' + key + ']');
    }

    /**
     * @param {Object|null}  elem
     * @param {string}       key
     */
    function getData(elem, key) {
        if (null == elem) { return void 0; }
        var data = elem.getAttribute('data-taos-' + key);
        return null == data ? void 0 : ('' + data).replace(trimReplace, '');
    }
    
    /**
     * @param  {Object}  elem
     * @return {boolean}
     */
    function isVisible(elem) {// inlined @ minification
        // See @link docs.jquery.com/Release:jQuery_1.3.2#:visible.2F:hidden_Overhauled
        return !!(elem.offsetWidth || elem.offsetHeight);
    }

    /**
     * Trim strings in an array or object and return a new compact array.
     * @param {Object|Array|*}   ob
     */
    function prune(ob) {
        var l, i = 0, v, ret = [];
        if ( ob ) {
            l = ob.length;
            while (i < l) {
                (v = ob[i++]) && (typeof v !== 'string' || (v = v.replace(trimReplace, ''))) && ret.push(v);
            }
        }
        return ret;
    }
    
    /**
     * @param  {string}    type
     * @return {boolean}
     */
    function easingTypeExists(type) {
        // stackoverflow.com/questions/8619155/check-if-jquery-ui-easing-methods-are-available
        return onlyAlphas.test(type) && $easing.hasOwnProperty(type) && typeof $easing[type] === 'function';
    }

    /**
     * Test if an element supports a given attribute.
     * @param  {Object|*}   el        is a DOM element to test on
     * @param  {string|*}   attrName  is the name of an attribute to test for
     * @return {boolean}
     */
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

    /*
     * find()  return the first `ob` value that passes test`
     * @param  {Object|Array}    ob
     * @param  {function(...)}   test
     function find(ob, test) {
        var l, v, i = 0;
        if ( ob ) {
            l = ob.length;
            while (i < l) {
                if (test((v = ob[i]), i++, ob)) { return v; }
            }
        }
        return void 0;
    }*/
    
    /**
     * event handler for the <details> shim
     * @param {Object}             details
     * @param {Object}             $summary
     * @param {(boolean|number)=}  init
     */
    function toggleDetails(details, $summary, init) {
        var open = 'string' === typeof details.getAttribute('open');
        if (init) { open = !open; } // handle init state
        open ? details.removeAttribute('open') : details.setAttribute('open', '');
        $summary['siblings']()[open ? 'hide' : 'show']();
    }

    ready(function() {

        // START shim
        var shim;
        Modernizr && !Modernizr['details'] // only shim where needed
        && (shim = getData(taos('shim')[0], 'shim')) // future compat
        && ~shim.indexOf('details') // contains
        && $('details')['each'](function() {
            var details = this, $summary = $(details.getElementsByTagName('summary'));
            toggleDetails(details, $summary, 1); 
            $summary['on'](clickName, function(){
                toggleDetails(details, $summary); 
            });
        });// END shim

        // START area
        taos('area')['each'](function() {

            var n, i = 0, parts, areas, areaCount, $elems
              , hasFx, easing = false, duration = 0, halfDuration = 0
              , $this = $(this)
              , dataRaw = getData(this, 'area');

            if ( !dataRaw ) { return; }
            parts = prune(dataRaw.split(exclamations));
            if ( !parts.length ) { return; }
            (n = parts[0]) && (isFinite(n) || easingTypeExists(n)) && parts.reverse(); // old syntax
            areas = parts.shift().split(pipes);
            areaCount = areas.length;
            if ( !areaCount ) { return; }
            
            while (n = parts[i++]) {// can do the loop like this b/c `parts` was made via `.split`
                if ( n >= 0 ) { halfDuration = (duration = n >> 0)/2 >> 0; } // convert to integers
                else { easing = easing || (easingTypeExists(n) && n); }
            }/* Or we could do:
                n = find(parts, isFinite);
                duration = n > 0 ? n >> 0 : 0; // ensure positive integer or zero
                easing = find(parts, easingTypeExists) || false;
                halfDuration = (duration/2) >> 0;
            */

            hasFx = !!(duration || easing);
            $elems = $(areas.join());
            $this['on'](clickName, function() {
               
                var i, $nextShow;
                   
                // For checking visiblity, we use .css('display') !== 'none' 
                // rather than .is(':visible') for better compatibility with
                // frameworks other than jQuery. 
                // stackoverflow.com/questions/10066630/how-to-check-if-element-is-visible-in-zepto

                // If there's a duration or easing fn, .then stop() it too so
                // that if a user clicks twice in a row, then the easing from the 
                // first click is truncated if it hasn't already finished:
                hasFx && $elems['stop'] && $elems['stop'](false, true);
                    
                if (1 === areaCount) {// Toggle on/off:
                    // If there's only one, then it will be the only one in 
                    // $elems (which has already cached, so use it).
                    isJquery ? $elems['toggle'](duration, easing) : $elems['toggle'](); 
                } else if (1 < areaCount) {// Cycling a group:

                    if (2 === areaCount) {
                        $nextShow = $(areas[ isVisible(areas[0]) ? 1 : 0 ]);
                     } else {
                        for ( $nextShow = i = 0; !$nextShow && i < areaCount; i++ ) {
                            isVisible(areas[i]) && ($nextShow = $(areas[i+1]));
                        }
                        $nextShow = $nextShow || $(areas[0]);
                    }
                      
                    if (hasFx && $elems['fadeOut'] && $nextShow['fadeIn']) {
                        $elems['fadeOut'](halfDuration, easing);
                        $nextShow['fadeIn'](halfDuration, easing);
                    } else {
                        $elems['hide']();
                        $nextShow['show']();           
                    }
                }
            });//click
        });// END area

        // START style
        taos('style')['each'](function() {

            var dataRaw = getData(this, 'style')
              , $this = $(this)
              , parts, classes, classesCount, $elems;

            if ( !dataRaw ) { return; }
            parts = prune(dataRaw.split(exclamations));
            classes = parts.length ? parts.pop().split(commasOrPipes) : [];
            classesCount = classes.length;
            if ( !classesCount ) { return; }

            // Include exclamations replacement in the next line to support old syntax.
            $elems = parts.length ? $(parts.join().replace(exclamations, ',')) : $this; // target selector or self

            $this['on'](clickName, function() {
            
                var i, nextClass, ssvGroup, n;
                
                if (1 === classesCount) {
                    $elems['toggleClass'](classes[0]);
                } else if (1 < classesCount) {
            
                    if (2 === classesCount) {
                        nextClass = $elems['hasClass'](classes[0]) ? classes[1] : classes[0];
                    } else {
                        for (nextClass = i = 0; !nextClass && i < classesCount; i++) {
                            if (classes[i]) {
                                // For better compat with frameworks
                                // other than jQuery, test each SSV
                                // rather than all at once, which 
                                // fails depending on implementation
                                // of the hasClass method.
                                ssvGroup = classes[i].split(spaces);
                                n = ssvGroup.length;
                                while ( !nextClass && n && n-- ) {
                                    $elems['hasClass'](ssvGroup[n]) && (nextClass = classes[i+1]);
                                }
                            }
                        }
                        nextClass = nextClass || classes[0];
                    }

                    $elems['removeClass'](classes.join(' '))['addClass'](nextClass);
                }
            });//click
        });//END style

        // START attr
        taos('attr')['each'](function() {

            var n, parts, p0, $p0, partsLen, $elems, elemsLen
              , attrs, nthPair, count, attrPairs = {}
              , $this = $(this)
              , dataRaw = getData(this, 'attr');

            if ( !dataRaw ) { return; }
            parts = prune(dataRaw.split(exclamations));
            partsLen = parts.length;
            if ( !partsLen ) { return; }
            p0 = parts[0];
        
            if (1 === partsLen) {
                if (!selectorish.test(p0) || attrWithValue.test(p0)) {
                    attrs = [p0];
                    $elems = $this;
                } else {
                    // It's either a selector or a syntax error. In either
                    // case there's nothing to do, so exit the iteration.
                    return;
                }
            } else {// 2 or more parts:
                // The tricky part here is figuring out whether the 
                // first part is a selector or an attribute, e.g. discerning
                //     data-taos-attr="body!contentEditable"
                // vs. data-taos-attr="contentEditable!checked" 
                // vs. data-taos-attr="contentEditable!checked" 
                // vs. data-taos-attr="src = 1.jpg | 2.jpg ! title = one | two" 
                // vs. data-taos-attr="src = 1.jpg , 2.jpg ! title = one , two" 
                // vs. data-taos-attr="img.example ! src = 1.jpg | 2.jpg ! title = one | two" 
                // If no selector is provided, the attrs are applied to the element itself.

                if ((onlyAlphas.test(p0) && elSupportsAttr(this, p0)) || attrWithValue.test(p0) || dataAttrName.test(p0)) {
                    // The `p0 in this` here checks if the element supports the attribute stored as p0.
                    $elems = $this;
                    attrs = parts.slice();
                } else if (selectorish.test(p0) || ($p0 = $(p0)).length) {
                    // Do this check 2nd in case there are attrs with values that look like selectors.
                    $elems = $p0;
                    attrs = parts.slice(1);
                } else { return; }
            }

            elemsLen = $elems.length;
            nthPair = attrs.length;
            if ( !elemsLen || !nthPair ) { return; }
            
            // Convert attrs string into an object (key/value pairs). This 
            // way we only need to test regexes and split values once.
            // Booleanish attrs like `checked` are equiv to `checked=""`

            while ( nthPair-- ) {
                n = attrs[nthPair];
                if (attrNameOnly.test(n)) {
                    // state attributes, e.g. checked|selected|hidden|contentEditable|data-*|etc.
                    attrPairs[n] = [''];  // <p hidden> is equivalent to <p hidden=""> in all browsers
                } else if (attrWithValue.test(n)) {
                    n = n.split(equals);
                    attrPairs[n[0]] = prune(n.slice(1).join('').split(commasOrPipes));
                }
            }

            $this['on'](clickName, function() {

                $elems['each'](function() {
                    var i, nextValue, attrName, attrValues, currValue;

                    for (attrName in attrPairs) {
                        if (attrPairs.hasOwnProperty(attrName) && (elSupportsAttr(this, attrName) || dataAttrName.test(attrName))) {

                            attrValues = attrPairs[attrName];
                            count = attrValues.length; // one or more values
                            currValue = this.getAttribute(attrName);
                                
                            if (1 === count) {// state attributes
                                // Check `null ==` rather than hasAttribute for better old browser
                                // support. If the attr is not present it will be null|undefined.
                                if (null == currValue) {
                                    this.setAttribute(attrName, attrValues[0]);
                                } else { this.removeAttribute(attrName); }
                            } else if (2 === count) {
                                nextValue = currValue === attrValues[1] ? attrValues[0] : attrValues[1];
                                this.setAttribute(attrName, nextValue);
                            } else if (2 < count) {
                                for (nextValue = i = 0; !nextValue && i < count; i++) {
                                    currValue === attrValues[i] && (nextValue = attrValues[i+1]);
                                }
                                nextValue = typeof nextValue === 'string' ? nextValue : attrValues[0];
                                i = count; // reset i
                                while (i--) { this.removeAttribute(attrValues[i]); }
                                this.setAttribute(attrName, nextValue);
                            }
                        }
                    }
                });//each
            });//click
        });//END attr

        // Remove .no-taos class from html tag (if it's there) and add .taos (for styling purposes)
        $('html')['removeClass']('no-taos')['addClass']('taos');

    });//ready

}));//anonymous