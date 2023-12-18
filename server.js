const cookieParser = require('cookie-parser');
const { render } = require('ejs');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;



const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('secreto'));

app.use(session({

    secret: 'secreto',
    resave: true,
    saveUninitialized: true

}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(new PassportLocal(function(username,password,done){

    if(username === 'robert' && password === '1234')
        return done(null, {id: 1, name: "Robert"});
    done(null,false);
}));

passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    done(null, {id: 1, name: "Robert"})
});
    


app.set('view engine', 'ejs');

app.get("/", (req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}, (req,res)=>{ //Esta vista se muestra si ya hemos iniciado una sesion
   
    res.send('¡Hola, Bienvenido!')
});

app.get("/login", (req,res)=>{ //Esta se muestra si no hemos iniciado sesión y queremos iniciar
    
    res.render("login")

});

app.post("/login", passport.authenticate('local',{

    successRedirect: "/",
    failureRedirect: "login"
}));


app.listen(8000, ()=> console.log('Server started'));