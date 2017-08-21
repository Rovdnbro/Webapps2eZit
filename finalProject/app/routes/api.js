var User = require('../models/user');
var Post = require('../models/post');
var jwt = require('jsonwebtoken');
var secret = "RichardTheBastard";

module.exports = function (router) {


    //User Registrations route
    //http://localhost:port/api/users
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        //Criteria for creating user
        if (req.body.username == null || req.body.username == '') {
            res.json({
                success: false,
                message: 'Ensure username is provided'
            });
        } else if (req.body.password == null || req.body.password == '') {
            res.json({
                success: false,
                message: 'Ensure password is provided'
            });
        } else if (req.body.email == null || req.body.email == '') {
            res.json({
                success: false,
                message: 'Ensure email is provided'
            });
        } else if (req.body.name == null || req.body.name == '') {
            res.json({
                success: false,
                message: 'Ensure name is provided'
            });
        } else {
            user.save(function (err) {
                if (err) {
                    if (err.errors != null) {

                        if (err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if (err.errors.username) {
                            res.json({
                                success: false,
                                message: err.errors.username.message
                            });
                        } else if (err.errors.email) {
                            res.json({
                                success: false,
                                message: err.errors.email.message
                            });
                        } else if (err.errors.password) {
                            res.json({
                                success: false,
                                message: err.errors.password.message
                            });
                        } else {
                            res.json({
                                succes: false,
                                message: err
                            });
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            res.json({
                                succes: false,
                                message: 'Username or e-mail already taken.'
                            });
                        } else {
                            res.json({
                                succes: false,
                                message: err
                            });
                        }
                    }
                } else {
                    res.json({
                        success: true,
                        message: 'User created'
                    });
                }
            });
        }
    });


    //user login route
    //http://localhost:port/api/authenticate
    router.post('/authenticate', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('email username password').exec(function (err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                res.json({
                    success: false,
                    message: 'Could not authenticate user'
                });
            } else if (user) {
                if (req.body.password && req.body.password != "") {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({
                            success: false,
                            message: 'Could not authenticate password'
                        });
                    } else {
                        var token = jwt.sign({
                            username: user.username,
                            email: user.email
                        }, secret, {
                            expiresIn: '4h'
                        });

                        res.json({
                            success: true,
                            message: 'User authenticated.',
                            token: token
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        message: 'No password provided'
                    });
                }
            }
        });
    });


    //check voor user met dezelfde naam
    router.post('/checkusername', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('username').exec(function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                res.json({
                    success: false,
                    message: 'That username is already taken'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Valid username'
                });
            }
        });
    });

    //check voor user met dezelfde email
    router.post('/checkemail', function (req, res) {
        User.findOne({
            email: req.body.email
        }).select('email').exec(function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                res.json({
                    success: false,
                    message: 'That e-mail is already taken'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Valid e-mail'
                });
            }
        });
    });


    router.post('/posts', function (req, res) {
        var post = new Post();
        post.title = req.body.title;
        post.upvotes = req.body.upvotes;
        
        if (req.body.upvotes == null) {
            post.upvotes = 0;
        }
        if (req.body.title == null) {
            res.send('Ensure title is provided');
        }
        post.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send('post created');
            }
        });
        res.send('post created');
    });
    
    
    router.get('/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            return next(err);
        }

        res.json(posts);
    });
});



    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                    //res.json({ success: true, message: 'Token valid'});
                }
            })
        } else {
            res.json({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    return router;
}
