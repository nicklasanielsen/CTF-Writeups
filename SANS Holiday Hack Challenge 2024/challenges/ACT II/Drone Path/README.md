# Drone Path

## Challenge Information
- **Difficulty**: 3 / 5
- **Description**: Help the elf defecting from Team Wombley get invaluable, top secret intel to Team Alabaster. Find Chimney Scissorsticks, who is hiding inside the DMZ.

## Table of Contents
0. [Challenge Information](#challenge-information)
1. [Dialog](#dialog)
2. [Solution: Silver](#solution-silver)
3. [Solution: Gold](#solution-gold)

## Dialog
Chimney Scissorsticks:
```
> Hey. Psst, over here. Hey, I'm Chimney Scissorsticks.
> I'm not liking all the tension brewing between the factions, so even though I agreed with how Wombley was handling things, I get the feeling this is going to end poorly for everyone. So I'm trying to get this data to Alabaster's side. Can you help?
> Wombley's planning something BIG in that toy factory. He's not really making toys in there. He's building an armada of drones!
> They're packed with valuable data from the elves working on the project. I think they hide the admin password in the drone flight logs. We need to crack this to prevent this escalating snowball showdown.
> You'll be working with KML files, tracking drone flight paths. Intriguing, right? We need every detail to prepare for what’s ahead!
> Use tools like Google Earth and some Python scripting to decode the hidden passwords and codewords locked in those files.
> Ready to give it a go? It’s going to be a wild ride, and your skills might just turn the tide of this conflict!
```

## Solution: Silver

When I access the machine, I am greeted by a web app. There's not much I can do on the homepage, but in the top right corner, there's a menu with two other pages `Login` and `FileShare`.

![](images/Elf%20Drone%20Workshop.png)

I navigate to the login page and see that there is only an option to log in with a username and a password.

![](images/Login.png)

I now navigate to the FileShare page and see that there is a file named [fritjolf-Path.kml](files/fritjolf-Path.kml), which I proceed to download.

![](images/FileShare.png)

 KML files contains information such as placemarks, paths, and polygons that can be displayed on a map. I opened the KML file in Google Earth to view the geographic data it contained.

 The file revealed `GUMDROP1`, which was drawn over the North Pole.

![](images/GoogleEarth.png)

I wasn't sure what to do with this information, but I suspected it had something to do with the login page. After trying different combinations and attempts, I concluded that `fritjolf` is a username, and `GUMDROP1` is the password.

After I was able to login, I was directed to a new page, where I can search for drones.

![](images/Search%20for%20a%20Drone.png)

I checked the menu, and new three new pages been avaiable including the search page. The two others are `Profile` and `Admin Console`.

I navigated to the `Admin Console` but a code was needed in order to do anything.

![](images/Admin%20Page.png)

I navifated to the `Profile` page, and found the following note:

```
Note to self, remember drone name, it is the same location as secret snowball warehouses /files/secret/Preparations-drone-name.csv
```

![](images/Profile%20Page.png)

After reviewing the [CSV file](files/Preparations-drone-name.csv), I couldn't find any hints regarding the locations of the warehouse or the drone.

So, I decided to return to the search function and experiment with different inputs. Eventually, after trying a few SQL injection techniques, I discovered that the input field was vulnerable to SQL injection. This allowed me to extract the following data:

![](images/SQLi%20Results.png)

|Name|Quantity|Weapons|
|-|-|-|
|ELF-HAWK|40|Snowball-launcher|
|Pigeon-Lookalike-v4|20|Surveillance Camera|
|FlyingZoomer|4|Snowball-Dropper|
|Zapper|5|CarrotSpike|

I noticed a comment regarding `Zapper`, so I decided to search for the other names to see if there were more comments. Sure enough, I found several more, including:

Comments for ELF-HAWK
```
- These drones will work great to find Alabasters snowball warehouses. I have hid the activation code in the dataset ELF-HAWK-dump.csv. We need to keep it safe, for now it's under /files/secret.

- We need to make sure we have enough of these drones ready for the upcoming operation. Well done on hiding the activation code in the dataset. If anyone finds it, it will take them a LONG time or forever to carve the data out, preferably the LATTER.
```

Comments for Pigeon-Lookalike-v4
```
- This is a great drone for surveillance, but we need to keep it out of the rain.

- I cant believe we are using pigeons for surveillance. If anyone finds out, there will most likely be a conspiracy theory about it.

- I heard a rumor that there is something fishing with some of the files. There was some talk about only TRUE carvers would find secrets and that FALSE ones would never find it.
```

Comments for FlyingZoomer
```
- This drone is perfect for dropping snowballs on unsuspecting targets.
```

Comments for Zapper
```
- This is sort of primitive, but it works!
```

Based on the comments above, it was only ELF-HAWK that contained relevant information.

I downloaded the [CSV file](files/ELF-HAWK-dump.csv), and after some lengthy thinking and countless attempts, I concluded that the coordinates in the file weren't for a map, but rather for a drawing.

So, I wrote the following Python script.

```Python
import pandas
import matplotlib.pyplot as pyplot

# Import file
csv_file : str = "ELF-HAWK-dump.csv"
csv_data = pandas.read_csv(csv_file)

# Load coordinates
x = csv_data["OSD.longitude"]
y = csv_data["OSD.latitude"]

# Plot coordinates
pyplot.figure(figsize=(60, 6))
pyplot.scatter(x, y, color='black', marker='o', s=2)
pyplot.grid(True)
pyplot.show()
```
![](images/Plot.png)

The graph could be read as `DroneDataAnalystExpertMedal`, which I entered as the admin activation code.


![](images/Admin%20Code%20accepted.png)

After this, the challenge is registered as solved.

## Solution: Gold