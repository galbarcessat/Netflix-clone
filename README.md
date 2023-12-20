# Netflix Clone (React + Firebase). 

[Live demo here](https://neflix-clone-czr8.onrender.com/ "Netflix link")
## This project is built using React, Redux, Firebase, Firestore, Stripe and SASS.

![Home page image](/src/assets/img/NetflixHoemPage.png "Home-page")

## Technologies

The technology stack I used includes React, Redux, Firebase, Firestore, Stripe, and SASS.
I employed Firebase authentication and Firestore as a database.

Movies are retrieved from the TMDB API, and trailers are obtained from the YouTube API.
A caching system is implemented, preventing redundant fetching of a specific movie from the YouTube API if it has been previously accessed.

The layout and pixel-perfect design were crafted using SASS.

## Getting started

Head to the repository on top and clone the project or download the files.

```
git clone https://github.com/galbarcessat/Netflix-clone
```

make sure you have node_modules installed. After that we will run the project with 'npm run dev':

```
npm i 
npm run dev
```

You shuold get a console ouput that the server is up and running at localhost:5173.

That's it! The App should be opened automatically, enjoy!

## Showcase

### Homepage
The landing page in which the user can sign up / login, or press the call to action button to start demo if the are limited with time.

![Home page image](/src/assets/img/NetflixHoemPage.png "Home-page")

### Signup/Login
Firebase authentication with email and password.

![Login image](/src/assets/img/NetflixLogin1.png "login-page1")
![Login image](/src/assets/img/NetflixLogin2.png "login-page2")

### Movie Details
Here, users can review movie details and watch its trailer.

![Movie details image](src/assets/img/NetflixMovieDetails.png "Movie details-page")

### Subscription plans
Here you can view your subscription plan and change it to another one using stripe checkout.

![netflix plans image](/src/assets/img/NetflixPlans.png "netlifx-plans")

### Some mobile!
Just a taste of the mobile experience.
<img src="/src/assets/img/FundayHomeMobile.png" width="25%" style="float: left"/><img src="/src/assets/img/FundayBoardMobile.png" width="25%" style="float: left;"/><img src="/src/assets/img/FundayTaskDetailsMobile.png" width="25%" style="float: left;"/><img src="/src/assets/img/FundayDashboardMobile.png" width="25%" style="float: left;"/>
