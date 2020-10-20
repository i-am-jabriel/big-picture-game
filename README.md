## Big Picture ##
![Big Picture](img/logo.png)
## A game I made to make the world a better place ##

## Live wireframe can be found [here](https://www.figma.com/file/4oLjD5CH7xBoTE7a5zH2ou/Big-Picture?node-id=0%3A1)


## Tasks: ##
 * [✔] Create Folder Structure
    * [✔] Hooked to github
    * [✔] Create baseline html
    * [✔] Create folders to pull images of <s>shapes</s> animals from
    * [✔] Create deailed readme file for all to marvel at

* [✔] <s>Shape</s> Animal Selector Screen
    * [✔] Load images
    * [✔] Use buttons to select different types of <s>shapes</s> animals
    * [✔] Using slider to change paramaters of the <s>shape</s> animals
    * [✔] Create button that randomizes all settings
    * [✔] Add Play button

* [✔] Gameplay Loop
    * [✔] Populate the world with other <s>shapes</s> animals that are larger and smaller than you
    * [✔] Make all the <s>shapes</s> animals move in various directions
    * [✔] Have mc's <s>shape</s> animal follow mouse
    * [✔] Have the camera follow the mc
    * [✔] Handle collisions of <s>shapes</s> animals, if similar size bounce otherwise smaller <s>shapes</s> animals get eaten by larger ones
    * [✔] Level up which allows you to see more of the bigger picture and also reverts you to being a small fish in a big pond

* [✔] <s>shape</s> Animal Class
    * [✔] Always slowly moving forwards
    * [✔] OnCollision Either bumps if similar sized or is consumed by the larger one
    * [✔] Has a cache of energy that can consumed for turbo speed used anytime that refills pasivly or by eating food

* [✔] Food Class
    * [✔] Spawn Food randomly in random positions
    * [✔] Are consumed more quickly but give less size
    * [✔] Enemy AI will prioritize food / but not over running away.

* [✔] Animal AI
    * [✔] Animals have a brain
    * [✔] Animals will surveoy the land and nearby nodes to decide a plan of attack
    * [✔] Will run from bigger enemies
    * [✔] Will chase smaller / more vulenerable enemies.
    * [✔] Will path towards food
    * [✔] Prioritzes living over everything else

* [ ] Player Class
    * [✔] Players character follows mouse around
    * [✔] Player can click the mouse to use turbo
    * [✔] Player can pause the game with spacebar
    * [✔] Player can restart the game with enter
    * [✔] Player can die
    * [] Player sees a gameover screen remindind them that they can restart or can watch AI just eat.

* [ ] Stretch Goals
    * [✔] Implement a r-tree to significantly bolster speed of calculations of collisions
    * [ ] Create my own version of a r-tree
    * [ ] Implement a soundtrack and various other sound effects
    * [ ] Add a dynamic moving background
    * [ ] Make it multiplayer / filled with bots when no ones online
