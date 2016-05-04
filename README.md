# Sounder

## Project goal: 
Initially the purpose of this project was a sound measuring device that would allow the user to monitor the sound level in specific areas. With the help of the professor, the potential of sound level monitoring was discover, and a new approaches to the project was taken. The new project is focused on the collection of a database of sound intensity around the world, with the aid of mobile users. This database would be accessible to the public via a web application. Unwanted sound also known as noise pollution can causes a number of short- and long-term health problems, such as; sleep disturbance, cardiovascular effects, poorer work and school performance, hearing impairment, etc. other harmful effects [1]. This Ubiquitous computing technology aims to detect area with noise pollution and help the users to avoid such areas and health problems mentioned above. 

## Project features: 
A mobile application was developed to record the sound level from the environment; and send it to the database upon change of location or every one minute. The mobile application is also capable of measuring the current sound level around the user, and displays it on a progress bar. The data collected is accessible from the web application; this web application features a heat map that graphs the sound level data collected by the mobile application. The color of the graph can vary from red to green; red being an areas polluted with noise, and green being a quiet areas. The web application also allows the users to select different time of the day and a specific area, on which the users desire to verify for noise pollution; these features can be seem on the project design of this report. As mentioned before, noise pollution causes a number of short- and long-term health problems. This application can assist the user to find quiet areas for different purposes.  For example; a family seeking for a new neighborhood to move in with their newborn child, or a student seeking for a quiet area to read could also use this application to find such places. Even thou, the main goal of this project is to help the user to avoid noise polluted areas, the team also find other potential used for this application such as finding an event or a place. Figure 1 is a chart of noise level of everyday sound [2]; this chart could be use to classify the noised polluted area, and help the user to find an events such as a rock concert or a parade that the user would like to partake.  

![Image of Noise Level of Everyday Sounds](https://octodex.github.com/images/Figure1NoiseLevelChart.png)

Figure 1: Noise Level of Everyday Sounds [2]

Future features for the applications were planned; the same heat map found on the web application will be implemented on the mobile application allowing the user to check noise pollution at any moment. A more friendly UI will be developed for both, mobile and web applications; due to time constraints, the team focused on developing the functionality of the app instead of the visual and feature of the applications.

## Project design:
This project started as a sound monitoring application for domestic use such as; monitoring sound level on a classroom that could alter other classes, it could be also be used to monitor sound level in a house that could distort a baby sleep. After seeing the potential of sound level monitoring, the project slowly turn into a global noise pollution monitor. The design of the project consists of two main applications; mobile application and the web application. 

As mentioned before, the mobile application is capable of displaying the sound level around the user on a progress bar as seen in figure 2. This application is simply, but functional; the “GET SOUND” bottom allows the user to manually send data to the database, and the “DELETE DATA” bottom deletes the current database to ease of testing the application. 

![Mobile APP](https://octodex.github.com/images/Figure2MobileApp.png)

Figure 2: Mobile Application

The website utilized Google map API to graph the heatmap as seen in figure 3. This heatmap is actually live, allowing the user to see the change of noise pollution throughout the day. Note that the heatmap displayed on figure 3 was generated with generated data, in order to show the full potential of this application. Due to time constrain the team was only able to collect a limited amount of data, as seen in figure 4. This data was collected in Lowell, near the school campus. 

![Live Heatmap](https://octodex.github.com/images/Figure3LiveHeatmap.png)

Figure 3: Live heatmap with generated data.

![Real Data Heatmap](https://octodex.github.com/images/Figure4RealDataHeatmap.png)

Figure 4: Real data heatmap

Search feature was also implemented on the web application. This allows the user to verify a specific area for noise pollution. This feature can be seen in figure 5.

![Search Feature](https://octodex.github.com/images/Figure5SearchHeatmap.png)

Figure 5: Search Feature

## File structure: 

### Folder: heatMap / Content JavaScript Object Files, Main Website Handler, Done by Luis Perez, Initial Setup by Carlos Chen.
There is not much that is in this specific file, it houses the main user interactivity module, fancy name for website, and allows the user to attain the data that they need for a given time period, or for the purpose of our demonstration to the class, provide a future view of the product. The code, where needed, is documented. It houses 2 external dependencies, both courtesy of the makers of Heatmap.JS, which allows us to display our data through a relevant, and ever updating medium in google maps. These two files were imported, and are the gmaps-heatmap.js, and heatmap.js file. There also exists the myHeatData.js file, which houses a lot of the heatmap operations, used to obtain the user data, and adequately display it to them as well(Comments within the code yield a better explanation than could be given here.)The other file, mainly the website, exists in index.html, which just displays the state of the data back to the user, and allows them to poll their collected data, and display it based on location and/or time.

### Folder: PhoneApp (Android Application) and nodejs (server side + mongodb) done by Khyteang Lim

The PhoneApp is written in java and we used a few external libraries such as Apache HttpClient and ProgressDonut. Other android services that we implemented included LocationManager and MediaRecorder. The main java file for the PhoneApp is in src under the name MainActivity.java and in that file, I added comments for each variables and functions that work together to product this mobile application. The UI file is located in the activity_main.xml which includes the ProgressDonut. Inside the AndroidManifest.xml, it includes the uses-

permissions that are required in order to use the android system services such as internet, record audio, location, and write to external storage.

### Folder: Old Website(Removed) by Carlos Chen
Initially the website was setup with express, and express-handlebar. Express was used to setup the framework of the website, and handlebar was used to organize the files. Bootstrap was also implemented in this version of the website for the visual of the web. Google map API, and a simple market was initially used to test website. Due to time constrain, the team eventually focused on functionality of the application instead of the visual and this website was scrapped.

## Graduate Student Paper (Done By Khyteang Lim)

Sounder is an application that collects sound level data from users and publishes them onto a database. From the database, a web application will display the data and make statistical analysis of the information. Our application focuses mainly on helping families allocate to location where they can live a better and healthier life and to avoid unnecessary noise pollution that may cause health hazards. There are a few similar applications that focus on neighborhood improvement, specifically on noise pollution. These applications are HowLoud and WideNoise. HowLoud is a web application that maps the world of noise based on traffic, airport traffic and stores, restaurants, school, and other local sources3. WideNoise is a mobile application that helps the users to better understand the soundscape around them and to live a better healthier life4. Sounder, HowLoud, and WideNoise may have similar goals but they have different features that focus on solving different usecases. HowLoud focuses on real-estate and providing clients the local information they want and need in order to make their real-estate more attractive3. WideNoise monitors local sounds and helps users to become more aware of the constant noise pollution that surrounds them2. However, with Sounder, we focus on both the large scale and the small local information we can present to the users so that they can be aware of their surrounding. Sounder provides users locally with the statistic of the sound level of their environment through the mobile application so that they are aware of their surrounding. With awareness, users will be able to avoid any potential noise pollution that can cause harm to the well-being of the human body. At the same time, users will be able to plan out their paths to work or for a quiet afternoon walk with their children. On top of that, Sounder provides a larger scale database that can benefit everyone who are looking to find a better neighborhood to live in. Unlike the other applications, we take into account the time and date because depending on the time and date, the sound level may differ. With Sounder, users can view the sound level as heat maps and they can filter out the data based on time, date, and location.

## Project Timeline (Goals, and the manners in which they were achieved)

### AIMS:
- Begin Framework for Android Side App
- Scrape for Location Data
- Scrape for Sound collected from microphone
- Normalize the Data
- Push Data to the needed Database
- Establish link to Server from Android Apps side
- Establish link to the Database from Android side
- Log Location Data
- Log Sound Level Data
- Post Data to a Database
- Begin production of the website
- Establish the link to the Google Api
- Establish Link to Server from Website side
- Establish link to Database from Website side
- Pull the Data from the Database, post to Node Website side(, in JSON format?)
- Display the Data collected on map.
- Normalize the Data
- Fully Display the Data
- Finalize our mission statement
- Pre- Presentation Markup
- Present

### Progress Made

#### Week Of April 11, 2016
We have established the link to a database, and have moved forward with the manner in which we can post the data that is collected by the user. We have taken that data, and are logging it to the needed DB, through some post requests to the server, and accepting that data and moving forward from there. 
We have normalized the data that is presented to the DB, logging the time of the event, the latitude, and the longitude of the sound that is being collected. 
The connection to the database is throgh the post command, that is available in jave, to which we are sending out the given database. 
The Website side is going to log the data that is in the database directly, and move forward from there. 
Logging the data from the given database is not going to be too difficult of a turn forward. 

#### Week of April 18, 2016
We were able to finalize what we actively want the project to do as a whole. We began, and completed the sound scrubbing from the phone, and were able to bring that data, as well as the needed location data to the server, and use it as the basis for loading node points into the database. Cleaned up the code base, and the git base a bit. Removed dummy database logs. 

#### Week of April 25, 2016
Cleaned up the data that is sent back to the server. Made use of some of the functions that have yet to be implemented. Continued pushing forward with the points that would make the project fully encompass the vision that we had. Brainstormed, and decided that for the presentation it would be a good idea to have some type of data overlayed, and displayed to the user, to display the full functionality of the project, and the full power that could be given to the users, and streamlined the market that could come to use the program as a whole.

#### Prepresentation week. (Anticipated May 2, 2016)
More code cleanup, commenting the code semi heavily, attempts to make it readable, and up to par of a more or less company write up. Finished the project papers, and the write up. Begun / Finished the video performance for the project. Added a few functions to the code base. Made the website more user friendly.

#### Presentation Week (May 2, 2016)
Made it through the presentation to the class in itself, and finalized some of the more aesthetic points of the project. Finished up the project presentation, and finalized the manner in which we were going to be presenting the project/product, and streamlined out goal on the manner that we believe it could be fully used.