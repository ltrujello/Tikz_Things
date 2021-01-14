# Tikz_Things

This is a tool for TiKZ that helps create "blobs." It outputs TikZ code and [the current page is here.](https://ltrujello.github.io/Tikz_Things/) 

I made this because TikZ is powerful, but it (obviously) cannot be programmed to understand what looks "human" and "natural" to the user, and so designing TikZ images can be very time-consuming. This is better than Inkscape because this is dead simple and you don't have to download anything.

### Dependencies 
To use the generated code as-is, you need to add  `\usetikzlibrary{hobby}` to your header. Here, `hobby` invokes a nice drawing algorithm implemented by Andrew Stacey for TikZ.

If, for some reason, you prefer using TikZ's default drawing algorithm (which is not very good in my opinion), simply replace each `\draw \plot[closed hobby]...` with `\draw plot[smooth cycle]...`. 

If your TeX engine cannot find the TikZ library `hobby`, then don't use it. However, that probably means your TeX distribution is outdated (and the good news is now you know!).  

## Background

In computer graphics, control points are human-specified reference points used by smooth curve-drawing algorithms.

TikZ implements various such algorithms that allow users to draw very nice pictures by specifying control points. The downside of this technology is that this is very time consuming. We have to guess control points, do point-slope calculations in our head, repeatedly hit backspace and type in a new guesses, wait 2 or 3 seconds while the drawing compiles, examine error messages and find the annoying extraneous commas left behind, examine the picture, and repeat.

Having a "white-board" like canvas that allows us to easily see, draw, remove, and change control points makes creating nice TikZ pictures much faster. The difference now is that the user is not guessing coordinates; the user is guessing their desired object shape (very quickly with the drawing tool) and the computer is now collecting the control points/generating all of the commands. Also, there are no possible silly bugs because the computer writes the code.

## Example One

Suppose I want to draw a random topological blob for some lecture notes. But I don't want to waste 10 minutes doing so. Using the canvas, I can just use 5 seconds to draw what kind of topological blob I'm thinking of. 

<img src="https://ltrujello.github.io/Tikz_Things/example_one/ex_one.gif" height="300px" />

I then ask to output the code. It tells me the code is:
```
\usetikzpackage{hobby}
\begin{tikzpicture}
    \draw plot[closed hobby] coordinates {
    (6.7, 11.1) (4.7, 12) (3.4, 10.1) (4.8, 7.6) (4.4, 5.5) (7, 4.9) (8, 6.5) (10.6, 5.8) (10.6, 9.7) (9.6, 12.4) };
\end{tikzpicture}
```

So then I style this by adding `\draw[fill = ProcessBlue!15]` (you need `\usepackage{xcolor}[dvipsnames]` for `ProcessBlue`) and compile to get:

<img src="https://ltrujello.github.io/Tikz_Things/example_one/ex_one.png" height="300px" />

[Source is here.](https://github.com/ltrujello/Tikz_Things/tree/main/examples/example_one/ex_one_source.tex)

## Example Two
You can also draw multiple blobs. Suppose I just drew this picture; it's an example of two members of an open cover having a nonempty intersection (ignore the bad hand writing). Now I want to include it in some TeX lecture notes.

<img src="https://ltrujello.github.io/Tikz_Things/example_two/ex_two_handdrawn.jpg" height="300px" />

This picture consists of three components: the big blob and the two little blobs. I will need three different `\draw` statements. To achieve this, I first draw the larger blob. Then, I click "Get TikZ code," so that I may draw a new figure. I draw the leftmost blob. Once I'm done with that, I click "Get TikZ code" to start drawing the right most blob. 

<img src="https://ltrujello.github.io/Tikz_Things/example_two/ex_two.gif" height="300px" />

I ask for the code:
```
\usetikzpackage{hobby}
\begin{tikzpicture}
    \draw plot[closed hobby] coordinates {
    (6.5, 12.5) (4.5, 13) (3.5, 11.9) (2, 11.5) (2.7, 8.1) (2.4, 5.1) (6.2, 4.9) (9, 4.6) (9.6, 7.1) (8.4, 9) (9.2, 12.3) (8, 12.9) };
    \draw plot[closed hobby] coordinates {
    (3.4, 10.1) (3.3, 7.5) (3.2, 5.6) (5.7, 7.5) (7.3, 9.6) (5.2, 11.8) };
    \draw plot[closed hobby] coordinates {
    (4.6, 10.1) (5.5, 7.9) (6.2, 7) (8.3, 5.5) (8.1, 8.6) (7.2, 11.9) (5.5, 12.3) };
\end{tikzpicture}
```

I style it a little, and I get this:

<img src="https://ltrujello.github.io/Tikz_Things/example_two/ex_two.png" height="300px" />

[Source is here.](https://github.com/ltrujello/Tikz_Things/tree/main/examples/example_two/ex_two_source.tex) 


## Example Three

Suppose you want to talk about [Van Kampen's theorem](https://en.wikipedia.org/wiki/Seifert%E2%80%93van_Kampen_theorem), and you want to motivate the requirement that the two open sets in question have to have a nonempty, path-connected intersection. To do this, you need to draw two open sets which overlap in a way such that their intersection is not path-connected. Manually doing this would be annoying and time consuming, but it is very quick with this tool:

<img src="https://ltrujello.github.io/Tikz_Things/example_three/ex_three.gif" height="300px" />

We get the code: 

```
\usetikzpackage{hobby}
\begin{tikzpicture}
    \draw plot[closed hobby] coordinates {
    (6.5, 11.8) (4.3, 12.6) (3.1, 11.1) (2.8, 7.4) (4.3, 6.7) (6.3, 8.8) (8.1, 7.4) (8.9, 7) (10.7, 8.4) (9.9, 11.5) (8.6, 12.8) };
    \draw plot[closed hobby] coordinates {
    (3.3, 9) (2.3, 7) (3.1, 4.8) (5.8, 4.3) (10.1, 4.6) (10.3, 7.7) (8.7, 9.5) (7.6, 6.6) (5.7, 6.6) (5, 9.8) };
\end{tikzpicture}

```

and after a bit of styling gets us:

<img src="https://ltrujello.github.io/Tikz_Things/example_three/ex_three.png" height="300px" />

[Source is here.](https://github.com/ltrujello/Tikz_Things/tree/main/examples/example_three/ex_three_source.tex)
 


## Example Four
Here is a fun application: Drawing an open cover of an arbitrary topological space.

First, draw your desired blob that you'd like to cover. Then, draw as many open sets over it as you want. (There is no need to be accurate with the next blobs, because you will use the `\clip` tool from TikZ.) 

<img src="https://ltrujello.github.io/Tikz_Things/example_four/ex_four.gif" height="300px" />

Gather the code:
```
\usetikzpackage{hobby}
\begin{tikzpicture}
    \draw plot[closed hobby] coordinates {
    (7, 11.4) (5, 12.7) (2.9, 11) (3.9, 9.3) (3.5, 5.8) (5, 3.8) (6.8, 5.1) (9.3, 4.3) (10.1, 6.7) (9.3, 8.4) (10.3, 11.7) (8.5, 12.6) };
    \draw plot[closed hobby] coordinates {
    (3.6, 12.5) (4.5, 10.6) (5, 9.1) (5, 7.3) (4.4, 5.1) (3.4, 4) (2, 8.4) (2.3, 11.7) };
    \draw plot[closed hobby] coordinates {
    (3.4, 8.6) (6.6, 8.6) (7.4, 9.5) (7.7, 11.7) (7, 12.9) (3.3, 12.8) };
    \draw plot[closed hobby] coordinates {
    (4, 7.1) (7.5, 6.8) (7.8, 5) (7.7, 3.9) (6.3, 3.8) (4, 3.8) (2.4, 5.3) };
    \draw plot[closed hobby] coordinates {
    (6.2, 10.2) (6.2, 7.2) (7.6, 5.6) (9.5, 5.1) (10.7, 5.1) (11.6, 10.5) (10.1, 12.6) };
    \draw plot[closed hobby] coordinates {
    (5.2, 10.6) (8.2, 10.6) (9.2, 12) (9.1, 12.9) (7.2, 12.9) (6, 12.7) };
    \draw plot[closed hobby] coordinates {
    (2.5, 9.4) (2.6, 7.8) (4.8, 7.1) (5.9, 6.2) (7.9, 6.9) (7.4, 10) (4.9, 11.1) };
\end{tikzpicture}
```
and now use `\clip`. This command basically says "Hey TikZ, do not draw anything that leaves this blob." The result is this:

<img src="https://ltrujello.github.io/Tikz_Things/example_four/ex_four.png" height="300px" />

The result is a topological blob covered by open sets! By hand, this would take about 30 minutes.

[Source is here.](https://github.com/ltrujello/Tikz_Things/tree/main/examples/example_three/ex_three_source.tex)


## Further Work

Some further work that I am not going to do but could be done is (1) Allowing the canvas to draw continuous curves, so that the user may literally draw their desired figure; then the control points would be guessed, and can be used in TikZ to recreate an approximation. (2) Set up a server so that, after the control points are set, the TikZ figure is automatically compiled and displayed to the user. This would save even more time in designing. (2.5) Use Overleaf API so that you can easily do (2); although this assumes the user has an Overleaf account, and you will also end up flooding the user's file directory with "Untiled (n+1)" tex documents of random TiKZ blobs that they probably don't really care about and will have to go back and delete. Perhaps Overleaf has a less messy way of doing this. (3) Add a color tool so that users can select a blob, pick a color that they want to color it, and then have this color added to the TikZ code. (4) Allow the option to draw general 2D curves, not just blobs. (5) Allow the option to annotate an image (which is usually annoying and painful to do manually) wit some TeX. (6) Allow the option to draw arrows, so one could draw an arbitrary mapping between blobs and the arrow tips could be easily styled. 
