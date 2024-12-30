# Elf Minder 9000

## Challenge Information
- **Difficulty**: 1 / 5
- **Description**: Assist Poinsettia McMittens with playing a game of Elf Minder 9000.

## Table of Contents
0. [Challenge Information](#challenge-information)
1. [Dialog](#dialog)
2. [Solution: Silver](#solution-silver)
    - [Sandy Start](#sandy-start)
    - [Waves and Crates](#waves-and-crates)
    - [Tidal Tresures](#tidal-treasures)
    - [Dune Dash](#dune-dash)
    - [Coral Cove](#coral-cove)
    - [Shell Seekers](#shell-seekers)
    - [Palm Grove Shuffle](#palm-grove-shuffle)
    - [Tropical Tangle](#tropical-tangle)
    - [Crate Caper](#crate-caper)
    - [Shoreline Shuffle](#shoreline-shuffle)
    - [Beachy Bounty](#beachy-bounty)
    - [Driftwood Dunes](#driftwood-dunes)
3. [Solution: Gold](#solution-gold)

## Dialog
Poinsettia McMittens:
```
> Center your mind, and become one with the island!
> Relax...
> This isn't working! I'm trying to play this game but the whole "moving back to the North Pole" thing completely threw me off. 
> Say, how about you give it a try. It's really simple. All you need to do is help the elf get to the exit.
> The faster you get there, the better your score!
> I've run into some weirdness with the springs though. If I had created this game it would've been a lot more stable, but I won't comment on that any further.
```

## Solution: Silver

To achieve silver in this challenge, 12 levels must be completed. This can be done without exploiting any vulnerabilities. Below, I will show how the 12 levels are solved. These are not the most efficient solutions, but they will allow you to complete the levels.

### Sandy Start
![Sandy Start](images/Sandy%20Start.png)

### Waves and Crates
![Waves and Crates](images/Waves%20and%20Crates.png)

### Tidal Treasures
![Tidal Treasures](images/Tidal%20Treasures.png)

### Dune Dash
![Dune Dash](images/Dune%20Dash.png)

### Coral Cove
![Coral Cove](images/Coral%20Cove.png)

### Shell Seekers
![Shell Seekers](images/Shell%20Seekers.png)

### Palm Grove Shuffle
![Palm Grove Shuffle](images/Palm%20Grove%20Shuffle.png)

### Tropical Tangle
![Tropical Tangle](images/Tropical%20Trangle.png)

### Crate Caper
> In this level, you need to change the elf's walking direction from the tunnel in the middle. To do this, click on the tunnel in the middle when the elf is at the tunnel in the right corner.

![Crate Caper](images/Crate%20Caper.png)


### Shoreline Shuffle
> In this level, you need to change the elf's walking direction at the spring in the middle. To do this, click on the road to the left of the spring when the elf is at the box in the middle.

![Shoreline Shuffle](images/Shoreline%20Shuffle.png)

### Beachy Bounty
![Beachy Bounty](images/Beachy%20Bounty.png)

### Driftwood Dunes
![Driftwood Dunes](images/Driftwood%20Dunes.png)

## Solution: Gold
After completing the first 12 levels, a hidden level `A Real Pickle` is unlocked. This level must be completed to earn gold.

Below is an image of the level, where it is clearly visible that the level cannot be solved in the same way as the first 12 levels.

![A Real Pickle](images/A%20Real%20Pickle.png)

Since the level cannot be completed without cheating, I decide to inspect the source code to see if there are any commented-out sections, as there might be hints about this in the initial dialogue.

In the source code, I don't immediately see anything that is commented out, but I do find a div with the class `admin-controls hidden` which seems interesting. The div is shown below, and the full code can be found [here](files/game.html).

```HTML
<div class="admin-controls hidden">
            <!-- <button id="startBtn">Start</button> -->
            <button id="resetBtn">Reset</button>
            <button id="clearPathBtn">Clear Path</button>
            <button id="clearEntitiesBtn">Clear Entities</button>
            <fieldset id="tools">
                <legend>Select a tool:</legend>
            
                <input type="radio" id="path" name="tool-select" value="path" checked />
                <label for="path">Path</label>

                <input type="radio" id="eraser" name="tool-select" value="eraser" />
                <label for="eraser">Eraser</label>
                
                <input type="radio" id="portal" name="tool-select" value="portal" />
                <label for="portal">Tunnel</label>
            
                <input type="radio" id="start" name="tool-select" value="start" />
                <label for="start">Start</label>
            
                <input type="radio" id="end" name="tool-select" value="end" />
                <label for="end">End</label>
            
                <input type="radio" id="crate" name="tool-select" value="crate" />
                <label for="crate">Crate</label>

                <input type="radio" id="blocker" name="tool-select" value="blocker" />
                <label for="blocker">Blocker</label>
            
                <input type="radio" id="hazard" name="tool-select" value="hazard" />
                <label for="hazard">Hazard</label>
            
                <input type="radio" id="steam" name="tool-select" value="steam" />
                <label for="steam">Steam</label>
            
                <input type="radio" id="spring" name="tool-select" value="spring" />
                <label for="spring">Spring</label>
            </fieldset>
        </div>
```

I attempt to remove the `hidden` class to see what happens, and to my surprise, a toolbar appears, as seen in the image below.

![Admin Toolbar](images/Admin%20Toolbar.png)

I play around with the toolbar and accidentally click on `Clear Entities` which removes everything from the level, as seen below.

![A Real Pickle Cleared](images/A%20Real%20Pickle%20Cleared.png)

Even though everything on the level has been cleared, I try to build again, and surprisingly, I can. I then retrieve the level and build the setup shown below after clearing everything.

To get the level back, I go back by clicking on `Go Home` and then I open the level again.

![A Real Pickle Cleared and Solved](images/A%20Real%20Pickle%20Cleared%20and%20Solved.png)
![A Real Pickle Solved](images/A%20Real%20Pickle%20Solved.png)

In this level, you need to change the elf's walking direction at the two boxes in the middle. To do this, click on the path between the two boxes when the elf is at the box above them.

After this, the challenge is registered as solved.