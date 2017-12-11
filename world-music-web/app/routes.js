var path = require('path');

module.exports = function(app, passport) {

    app.get('/profile', function(req, res, next) {  
    template = require('jade').compileFile(path.join(__dirname, '../',  '/source/templates/successlogin.jade'));
    try {
    var html = template({ title: 'Profile', user: req.user})
    res.send(html)
  } catch (e) {
    next(e)
  }
 

});

        app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

        app.get('/connect/facebook', passport.authorize('facebook', { scope : ['public_profile', 'email'] }));

        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
