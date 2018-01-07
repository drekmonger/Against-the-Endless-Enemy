# Against-the-Endless-Enemy
entry for Gynvael's Winter GameDev Challenge 2017

For more information about the challenge: [http://gynvael.coldwind.pl/?id=668]

To play the game itself, download and run ./dist/index.html in a browser. Or it can be downloaded from  [https://drive.google.com/file/d/1zXXWwCIPb-xUle5rTedBY_8Z3x9EE44X/view?usp=sharing]. The final compressed version weighs 19.4KB. 

It was 85% fun, and I learned things doing it. I didn't manage to squeeze sound into the package, stripped away a few intended game mechanics, and didn't do all the fancy UI animations I had orginally hoped to do, but otherwise the game ended up looking pretty close to my original ideas.

I did have some early setbacks. I started using [https://github.com/sveltejs/svelte] as my framework before moving to Hyperapp, but Svelte just weighed too much, and I prefer JSX over Svelte's templating language. I also cobbled together my own compressor using [http://pieroxy.net/blog/pages/lz-string/index.html] lz-string, but RegPack did the job better.

## Stuff used to make this thing:

* [https://github.com/hyperapp/hyperapp] Hyperapp, a microscopic framework
* [https://github.com/Siorki/RegPack] RegPack for compression
* [https://www.redblobgames.com/pathfinding/tower-defense/] This awesome tutorial for pathfinding with depth-first 
* [https://github.com/jaxgeller/tweezer.js/] Tweezer, modified, for tweening values
* [http://game-icons.net/] Game-Icons for the SVG icons. Specifically, the icons I used came from Lorc.  They were modified with:
* [https://inkscape.org/en/] Inkscape and then compressed with [https://jakearchibald.github.io/svgomg/] SVGOMG.
