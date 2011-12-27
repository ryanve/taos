# TAOS
TAOS (**T**oggle **A**reas **O**r **S**tyles) is a jQuery plugin that allows designers easily setup efficient toggles and style switchers via HTML5 data attributes.

## Examples

### Styles

Style toggles are activated by adding a `data-taos-style` attribute to a `<a>` element (a.k.a. the switch). The values of the attribute should be the class(es) you want to toggle. If you just put one class, then it will simply toggle on and off. If you put more than one (separated by commas) then they will cycle. By default, the toggles affect the element they are placed on. But often you will want to affect another element. This is done by adding flags for the element(s) you want to target at the front of the attribute value. For example, to target the `<body>` tag, you would preceed the attribute with `body!`.

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

#### Multiple (cycle)
```html

<!-- Cycle between .dark and .light on the html tag -->
<a data-taos-style="html!dark,light">Toggle styles</a> 

<!-- Cycle between .dark, .light, .retro, and .neon on #main -->
<a data-taos-style="#main!dark,light,retro,neon">Toggle styles</a> 

<!-- Cycle between pairs of classes on the body tag -->
<a data-taos-style="body!red heart,red diamond,black ace,black club">Toggle styles</a> 
````