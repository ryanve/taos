TAOS (**T**oggle **A**reas **O**r **S**tyles) is a [jQuery](http://jquery.com) plugin that helps designers easily setup efficient toggles and style switchers via HTML5 data attributes. I wrote the plugin because I wanted insanely simple but flexible ways to make style switchers and element toggles without rewriting JavaScript each time. It is compatible with the [Jeesh](http://ender.no.de/#jeesh).

## Areas 

An **area** toggle is activated by adding the `data-taos-area` attribute to the element that should be its control. The value of the attribute should be the selector for the element you want to toggle. Multiple elements can be cycled by separating selectors with pipes `|`. Flags for duration (in milliseconds) and easing method can be added. In basic jQuery the two easing methods are `swing` (default) and `linear`. If using jQuery UI's effects package then [these easing methods](http://jqueryui.com/demos/effect/easing.html) are also available.

#### 1-way (show/hide)


```html
<!-- Toggle visiblity of #content -->
<a data-taos-area="#content">Toggle content</a>

<!-- Toggle visiblity of #content with 3000ms transition -->
<a data-taos-area="#content !3000">Toggle content</a>

<!-- Toggle visiblity of #content with easing method from jQuery UI -->
<a data-taos-area="#content !easeInBounce">Toggle content</a>

<!-- Toggle visiblity of #content with linear easing method and 800ms transition -->
<a data-taos-area="#content !linear !800">Toggle content</a>

<!-- Toggle visiblity of all .details elems inside #content -->
<a data-taos-area="#content .details">Toggle details</a>
```

#### Multiple (cycle shown elems)

Use the pipe `|` to delimit areas:

```html
<!-- Cycle visiblity between #photo1, #photo2, and #photo3 -->
<a data-taos-area="#photo1 | #photo2 | #photo3">Next photo</a>

<!-- Cycle visiblity between figure img and figure figcaption with 300ms transition -->
<a data-taos-area="figure img | figure figcaption !300">Show info</a>

<!-- Cycle visiblity between .entry and .widget elems with linear easing and 300ms transition -->
<a data-taos-area=".entry | .widget !linear !300">Show info</a>
```

## Styles

A **style** toggle is activated by adding the `data-taos-style` attribute to the element that should be its control. The format for attribute is `selector ! class(es)` where the selector represents the element(s) whose class you want to toggle. If the selector is omitted, the toggle will affect the element on which it is placed. If you just put one class, then it will simply toggle on and off. Delimit with spaces to toggle multiple classes at once. Delimit with pipes `|` to cycle between classes. Examples:

#### 1-way (on/off)
```html

<!-- Toggle .dark on/off the link itself. -->
<a data-taos-style="dark">Toggle styles</a> 

<!-- Toggle .dark on/off the html tag -->
<a data-taos-style="html ! dark">Toggle styles</a> 

<!-- Toggle .dark on/off the #main element -->
<a data-taos-style="#main ! dark">Toggle styles</a> 

<!-- Toggle .dark on/off all .a and .b elems -->
<a data-taos-style=".a, .b ! dark">Toggle styles</a> 

<!-- Toggle *both* .red and .heart on/off the html tag -->
<a data-taos-style="html ! red heart">Toggle styles</a> 
````

#### Multiple (cycle classes)
```html

<!-- Cycle between .dark and .light on the html tag -->
<a data-taos-style="html ! dark | light">Toggle styles</a> 

<!-- Cycle between .dark, .light, .retro, and .neon on #main -->
<a data-taos-style="#main ! dark | light | retro | neon">Toggle styles</a> 

<!-- Cycle between pairs of classes on the body tag -->
<a data-taos-style="body ! red heart | red diamond | black ace | black club">Toggle styles</a> 
````

## License

### TAOS is available under the [MIT license](http://en.wikipedia.org/wiki/MIT_License)

Copyright (C) 2011 by [Ryan Van Etten](https://github.com/ryanve)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.