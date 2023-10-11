const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { findUserByUsername,
  getUserInfo,
  updateUserProfile,
  registerNewUser
} = require('./user-db');
const {
  addNewEducation,
  getEducationList,
  removeEducation
} = require('./education-db');
const {
  addNewWork,
  getWorkList,
  removeWork
} = require('./work-db');
const app = express();

// configurations
app.engine('.handlebars', exphbs.engine({ extname: '.handlebars', defaultLayout: "main" }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


// Configure sessions
app.use(
    session({
      secret: '7CM#5KB*LSqbPRbq&9',
      resave: false,
      saveUninitialized: true,
    })
  );


  app.use((req, res, next) => {
    res.locals.isAuthenticated = !!(req?.session?.userId);
    res.locals.isAdmin = (req?.session?.userRole === 'ROLE_ADMIN');
    next();
});


// Custom middleware to check if the user is logged-in
function authenticateUser(req, res, next) {
 if(res.locals.isAuthenticated) {
    next();
} else {
    return res.status(401).redirect('/login?error=1');    
}

}


// Routes
app.get('/', (req, res) => {
res.render('home', { title: 'Home Page' }); // Render the home.handlebars view
});

// Define a route for the login page
app.get('/login', (req, res) => {
res.render('login', { title: 'Login Page' , layout: false});
});

// Define a route for the logout page
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
      }
      // Redirect to a logout confirmation page (e.g., home)
      res.redirect('/');
  });
});



// Handle login POST request
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Use the database function to find the user by username
    findUserByUsername(username, (err, user) => {
        if (err) {
          return res.status(500).redirect('/login?error=1');
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).redirect('/login?error=1');
        }

        // Store the user's ID in the session
        req.session.userId = user.id;
        req.session.userRole = user.role;

        res.redirect('/');
      });
    });

    app.get('/register', (req, res) => {
      res.render('register', { title: 'Register new User' })
  });
  
  app.post('/register', (req, res) => {
      const { username, password, role } = req.body;
      registerNewUser(username, password, role);
      if(res.locals.isAdmin) {
        res.redirect('/register');
    } else {
        res.redirect('/login');
    }
  });


  
    app.get('/profile', authenticateUser, (req, res) => {
      
      // Retrieve the user's information from the database based on their session or user ID
     getUserInfo(req.session.userId, (err, userProfile) => {
          if (err) {
              console.log(err);
              res.status(400).redirect('/');
          }
          res.render('profile', { user: userProfile, title: 'Profile Page' });
      });
  });
  
  // POST route to handle profile updates
  app.post('/profile/update', (req, res) => {
  
      const { firstName, lastName, password } = req.body;
  
      updateUserProfile(req.session.userId, firstName, lastName, password);
  
      res.redirect('/profile');
  });



// Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' }); // Render the home.handlebars view
});

app.get('/about', authenticateUser, async (req, res) => {
  try {
    const userId = req.session.userId;
    const educationList = await getEducationList(userId);
    const workList = await getWorkList(userId);

    const data = {
        title: 'About Page',
        education: educationList,
        work: workList
    };

    console.log(data);
    res.render('about', data);
} catch (err) {
    console.error('Error fetching data:', err);
    // Handle the error and send an error response if needed
    res.status(500).send('Internal Server Error');
}
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Page' }); // Render the home.handlebars view
});

app.post('/cv/education/remove', (req, res) => {
  const { id } = req.body;

  removeEducation(req.session.userId, id);

  res.redirect('/about');
});

app.post('/cv/education/add', (req, res) => {
  const { institution, degree, major, startDate, endDate } = req.body;

  addNewEducation(req.session.userId, institution, degree, major, startDate, endDate);

  res.redirect('/about');
});


app.post('/cv/work/remove', (req, res) => {
  const { id } = req.body;

  removeWork(req.session.userId, id);

  res.redirect('/about');
});

app.post('/cv/work/add', (req, res) => {
  const { company, position, description, startDate, endDate } = req.body;

  addNewWork(req.session.userId, company,position, description, startDate, endDate);

  res.redirect('/about');
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});