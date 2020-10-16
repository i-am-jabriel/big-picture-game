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
* [] Gameplay Loop
    * [✔] Populate the world with other <s>shapes</s> animals that are larger and smaller than you
    * [✔] Make all the <s>shapes</s> animals move in various directions
    * [✔] Have mc's <s>shape</s> animal follow mouse
    * [✔] Have the camera follow the mc
    * [] Handle collisions of <s>shapes</s> animals, if similar size bounce otherwise smaller <s>shapes</s> animals get eaten by larger ones
    * [] Level up which allows you to see more of the bigger picture and also reverts you to being a small fish in a big pond
* [] <s>shape</s> Animal Class
    * [] Always slowly moving towards their target
    * [] OnCollision Either bumps if similar sized or is consumed by the larger one
    * [] Has a cache of turbo speed that can be used anytime that refills by eating smaller <s>shapes</s> animals
    * [] AI is not random. Small <s>shapes</s> animals will run from big ones big ones will chase small ones, but wont tunnel too hard on hard to catch ones
* [] Powerup  Class
    * [] Picked up by <s>shapes</s> animals to give them temporary buffs
    * [] Gluttony Causes increased growth rate but causes <s>shapes</s> animals to stick to you
    * [] Wrath allows you to cut bigger <s>shapes</s> animals in half
    * [] Envy gives you movement speed buffs running towards smaller and away from bigger
    * [] Envy gives you movement speed buffs running towards smaller and away from bigger
