TAOS (**T**oggle **A**reas **O**r **S**tyles) is a jQuery plugin that allows designers easily setup efficient toggles and style switchers via HTML5 data attributes.

## Areas 

Area toggles are activated by adding a `data-taos-area` attribute to `<a>` elements (a.k.a. switches). The value of the attribute should be the selector for the element you want to toggle. Multiple elements can be cycled by separating selectors with commas. Flags for duration (in milliseconds) and easing method can be added. In basic jQuery the two easing methods are `swing` (default) and `linear`. If using jQuery UI, then [these easing methods](http://jqueryui.com/demos/effect/easing.html) are also available. (If using a custom jQuery UI build, it must include the effects package.)

#### 1-way (show/hide)

```html
<!-- Toggle visiblity of #content -->
<a data-taos-area="#content">Show content</a>

<!-- Toggle visiblity of #content with 3000ms transition -->
<a data-taos-area="3000!#content">Show content</a>

<!-- Toggle visiblity of #content with easing method from jQuery UI -->
<a data-taos-area="easeInBounce!#content">Show content</a>

<!-- Toggle visiblity of #content with linear easing method and 800ms transition -->
<a data-taos-area="linear!800!#content">Show content</a>

<!-- Toggle visiblity of all .details elems inside #content -->
<a data-taos-area="#content .details">Show details</a>
```

#### Multiple (cycle shown elems)

```html
<!-- Cycle visiblity between #photo1, #photo2, and #photo3 -->
<a data-taos-area="#photo1, #photo2, #photo3">Next photo</a>

<!-- Cycle visiblity between figure img and figure figcaption with 300ms transition -->
<a data-taos-area="300!figure img, figure figcaption">Show info</a>

<!-- Cycle visiblity between .entry and .widget elems with linear easing and 300ms transition -->
<a data-taos-area="linear!300! .entry, .widget">Show info</a>
```

## Styles

Style toggles are activated by adding a `data-taos-style` attribute to `<a>` elements (a.k.a. switches). The values of the attribute should be the class(es) you want to toggle. If you just put one class, then it will simply toggle on and off. If you put more than one (separated by commas) then they will cycle. By default, the toggles affect the element they are placed on. But often you will want to affect another element. This is done by adding flags for the element(s) you want to target at the front of the attribute value. For example, to target the `<body>` tag, you would preceed the attribute with `body!`.

#### 1-way (on/off)
```html

<!-- Toggle .dark on/off the link itself. -->
<a data-taos-style="dark">Toggle styles</a> 

<!-- Toggle .dark on/off the html tag -->
<a data-taos-style="html!dark">Toggle styles</a> 

<!-- Toggle .dark on/off the #main element -->
<a data-taos-style="#main!dark">Toggle styles</a> 

<!-- Toggle .dark on/off all `.a` and `.b` elems -->
<a data-taos-style=".a!.b!dark">Toggle styles</a> 

<!-- Toggle the *both* .red and .heart on/off the html tag -->
<a data-taos-style="html!red heart">Toggle styles</a> 
````

#### Multiple (cycle classes)
```html

<!-- Cycle between .dark and .light on the html tag -->
<a data-taos-style="html!dark,light">Toggle styles</a> 

<!-- Cycle between .dark, .light, .retro, and .neon on #main -->
<a data-taos-style="#main!dark,light,retro,neon">Toggle styles</a> 

<!-- Cycle between pairs of classes on the body tag -->
<a data-taos-style="body!red heart,red diamond,black ace,black club">Toggle styles</a> 
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