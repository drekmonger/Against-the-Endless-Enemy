# Against-the-Endless-Enemy
entry for [http://gynvael.coldwind.pl/?id=66](Gynvael's Winter GameDev Challenge 2017).

To play the game itself, download and run ./dist/index.html via Chrome. Or it can be downloaded from  [https://drive.google.com/file/d/1zXXWwCIPb-xUle5rTedBY_8Z3x9EE44X/view?usp=sharing]. The final packed version weighs 19.4KB. 

It was 85% fun, and I learned things doing it. I didn't manage to squeeze sound into the package, stripped away a few intended game mechanics, and didn't do all the fancy UI animations I had orginally hoped to do, but otherwise the game ended up looking pretty close to my original ideas.

I did have some early setbacks. I started using [https://github.com/sveltejs/svelte] as my framework before moving to Hyperapp. Svelte just weighed too much, and I prefer JSX over Svelte's templating language. I cobbled together my own packer using [http://pieroxy.net/blog/pages/lz-string/index.html] lz-string, but RegPack did the job better. I also spent an afternoon fighting with Google's Closure Compiler before giving up and just using uglify-es.

## Stuff used to make this thing:

* [https://github.com/hyperapp/hyperapp] Hyperapp, a microscopic framework
* Rollup, babel (for JSX parsing only), cssnano for minifying the CSS, and uglify-es for minifying the JS.  
* [https://github.com/Siorki/RegPack] RegPack for compression
* [https://www.redblobgames.com/pathfinding/tower-defense/] This awesome tutorial for pathfinding with depth-first 
* [https://github.com/jaxgeller/tweezer.js/] Tweezer (modified for my use case) for tweening values
* [http://game-icons.net/] Game-Icons for the SVG icons. Specifically, the icons I used came from Lorc.  They were modified with:
* [https://inkscape.org/en/] Inkscape and then minified with [https://jakearchibald.github.io/svgomg/] SVGOMG.
