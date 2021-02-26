# CoffiDa #

### Repository ###

* [GitHub Project Repository](https://github.com/axwll/CoffiDa)

### How do I get set up? ###

Assuming you have your database seeded and API running on port 3333 you can do the following:

* Clone the repository onto your local machine
* In the Root directory run ``npm install`` or ``npm i``
* Open android studio and start an emulator (preferably one with the Play Store installed)
* Open a terminal window in the project root and run ``npx react-native run-android``
* The app should now be running on your emulator

Note: the API port can be changed in [api-request.js](https://github.com/axwll/CoffiDa/blob/master/src/utils/api-requests.js#L5)

### Style Guide ###

The styleguide configuration can be found in [.eslintrc.json](https://github.com/axwll/CoffiDa/blob/master/.eslintrc.json)

As you will see I have opted to use the [AirBnB Style Guide](https://github.com/airbnb/javascript) and have extended the ``react/recommended`` styles.

Running ``npm run lint`` will lint all the files in the project. As I upload this on Friday 26th February 2021, no lint errors exist. 

### Screencast ###

My Screencast video exceeded 100 MB, so it has been uploaded to OnDrive. The link to both a .mp4 and .mov of the video can be found [here](https://github.com/axwll/CoffiDa/blob/master/screencast.txt) 

### Extension Tasks ###

Further to all the required endpoints I have completed both of the extension tasks. See the Screencast for a visual demonstration.

The profanity filter uses [a JSON file](https://github.com/axwll/CoffiDa/blob/master/src/assets/data/profanity-filter.json) to determine which words are profanity. This can be modified to increase the scope of restricted words. 

### Accessibility ###

I considered accessibility of my app from a few different angles but was unfortunately unable to implement all the desired features in the time I had. 

My app currently supports two Languages (English & French), this is covered in the Screencast. However, the other features I was unable to implement include
* Light/Dark themes
* Multiple Font Size options 

### Additional Information ###

#### Patches ####

During the development of the Map I blocked by a "Require Cycle" warning similar to the one in [this GitHub issue](https://github.com/react-native-maps/react-native-maps/issues/3352). One of the replies to this turned out to be a viable solution. The code on the patches folder applies a patch to ``react-native-maps`` that fixes this issue for me. 

#### Future Development ####

During development, I thought of few things I would implement if the API had the capabilities:
 * Data validation e.g. "Email already exists". (I would have done this on the client side but this really belongs on the server side.)
 * Timestamps on reviews
 * More information about the location itself
    * Opening times
    * Menus
    * Shop amenities e.g. "WiFi - Yes", "Pets Allowed - No", "Outdoor Seating - No"
    * User Avatars

### Author ###

Maxwell Johnson

Stu ID: 16033645
