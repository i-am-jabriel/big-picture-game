## Big Picture ##
![Big Picture](img/logo.png)
## A game I made to make the world a better place ##

## Live wireframe can be found [here](https://www.figma.com/file/4oLjD5CH7xBoTE7a5zH2ou/Big-Picture?node-id=0%3A1)


## Tasks: ##
 * [✔] Create Folder Structure
    * [✔] Hooked to github
    * [✔] Create baseline html
    * [✔] Create folders to pull images of shapes from
    * [✔] Create deailed readme file for all to marvel at
* [✔] Shape Selector Screen
    * [✔] Load images
    * [✔] Use buttons to select different types of shapes
    * [✔] Using slider to change paramaters of the shape
    * [✔] Create button that randomizes all settings
    * [✔] Add Play button
* [] Gameplay Loop
    * [] Populate the world with other shapes that are larger and smaller than you
    * [] Make all the shapes move in various directions
    * [] Have mc's shape follow mouse
    * [] Have the camera follow the mc
    * [] Handle collisions of shapes, if similar size bounce otherwise smaller shapes get eaten by larger ones
    * [] Level up which allows you to see more of the bigger picture and also reverts you to being a small fish in a big pond
* [] Shape Class
    * [] Always slowly moving towards their target
    * [] OnCollision Either bumps if similar sized or is consumed by the larger one
    * [] Has a cache of turbo speed that can be used anytime that refills by eating smaller shapes
    * [] AI is not random. Small shapes will run from big ones big ones will chase small ones, but wont tunnel too hard on hard to catch ones
* [] Powerup  Class
    * [] Picked up by shapes to give them temporary buffs
    * [] Gluttony Causes increased growth rate but causes shapes to stick to you
    * [] Wrath allows you to cut bigger shapes in half
    * [] Envy gives you movement speed buffs running towards smaller and away from bigger
* [] Envy gives you movement speed buffs running towards smaller and away from bigger
