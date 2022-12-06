//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const _ = require("lodash");
const useragent = require('express-useragent');

const app = express();

app.use(express.static(__dirname + '/public'));

app.use(useragent.express());

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

const sessionMiddleware = session({ secret: process.env.OURLILSECRET, resave: false, saveUninitialized: false });

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/uwschatprod", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 16
  },
  password: {
    type: String,
  }
});

const chatroomSchema = new mongoose.Schema({
  room: {
    type: String,
    uppercase: true,
    maxlength: 20
  },
  description: {
    type: String,
    maxlength: 182
  },
  owner: {
    type: String,
    maxlength: 12
  }
});

const messageSchema = new mongoose.Schema({
  room: {
    type: String,
    uppercase: true,
    maxlength: 20
  },
  username: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 16
  },
  contents: {
    type: String,
    minlength: 1,
    maxlength: 1396
  },
  created: {
    type: String
  }
}, {
  timestamps: true
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Chatroom = new mongoose.model("Chatroom", chatroomSchema);
const Message = new mongoose.model("Message", messageSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/test", function(req, res) {
  // Testing area.  If it is commented out, it works.  Keeping it for reference.
  // ---------------------------------------------------------------------------

  // == Adding Users ==
  // ==================

  //-add a singular user, with an encrypted password, no duplicates (gold standard)
  // User.findOne({username: 'imdeve'}, function(err, foundUser){
  //   if (!err){
  //     if (!foundUser){
  //       User.register({username: 'imdeve'}, 'mkay', function(err, user){
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           console.log("user created");
  //         }
  //       });
  //     } else {
  //       console.log("user exists already");
  //     }
  //   }
  // });

  //-add a singular user if they don't exist, unencrypted password (bad idea)
  // User.findOne({username: 'imdave'}, function(err, foundUser){
  //   if (!err){
  //     if (!foundUser){
  //       const user = new User({
  //         username: 'imdave',
  //         password: 'notsure'
  //       });
  //       user.save();
  //     } else {
  //       console.log("user exists already");
  //     }
  //   }
  // });

  //-add a singular user with an encrypted password, even if the username has been registered (bad idea)
  // User.register({username: 'testinguno'}, 'mkay', function(err, user){
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     // create user
  //   }
  // });

  //-add multiple users, no duplicate checks, with unencrypted passwords (terrible ideas)
  // User.insertMany([{username: 'yaya', password: 'yoyo'}, {username: 'hoho', password: 'yoyo'}, {username: 'mil', password: 'yoyo'}], (err, users) => {console.log(err)});

  // == Adding Chatrooms ==
  // ======================

  //-adds a singular chatroom if it doesn't already exist (gold standard)
  // Chatroom.findOne({room: 'room3'}, function(err, foundRoom){
  //   if (!err){
  //     if (!foundRoom){
  //       const chatroom = new Chatroom({
  //         room: 'room3',
  //         description: 'not sure'
  //       });
  //       chatroom.save();
  //     } else {
  //       console.log("room exists: " + foundRoom.room + " : " + foundRoom.description);
  //     }
  //   }
  // });

  //-adds multiple chatrooms at once, doesn't check for duplicates (don't see a reason for use in production)
  //  Chatroom.insertMany([{room: 'room1', description: 'i hope this works'}, {room: 'room2', description: 'mkay'}], (err, rooms) => {console.log(err)});

  //console.log((myVar.replace(/\s\s+/g, ' ').trim()));    // this replaces all extra spaces before, after, middle

  // == Adding Messages To Chat ==
  // =============================

  //-adds a singular message to a chatroom (gold standard)
  // const message = new Message({
  //   username: 'dave',
  //   room: 'room1',
  //   contents: 'mkay here we go tho'
  // });
  //
  // if(message.contents.trim()!=""){
  // message.save(function(err){
  // if(err){console.log(err)}
  // else{console.log("message saved")}
  // });
  // }

  // == The Full Procedure : Putting Everything Together ==
  // ======================================================
  //
  //First, we create a user

  //   User.findOne({username: 'dave'}, function(err, foundUser){
  //     if (!err){
  //       if (!foundUser){
  //         User.register({username: 'dave'}, 'dave', function(err, user){
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             console.log("user created");
  //           }
  //         });
  //       } else {
  //         console.log("user exists already");
  //       }
  //     }
  //   });
  //
  //   //Then, we create a chatroom
  //
  //   Chatroom.findOne({room: 'room 1'}, function(err, foundRoom){
  //     if (!err){
  //       if (!foundRoom){
  //         const chatroom = new Chatroom({
  //           room: 'room 1',
  //           description: 'not sure'
  //         });
  //         chatroom.save();
  //         console.log("chatroom saved");
  //       } else {
  //         console.log("room exists: " + foundRoom.room + " : " + foundRoom.description);
  //       }
  //     }
  //   });
  //
  //   //Finally, we add a message
  //
  //   //////
  //   let message = new Message({
  //     username: 'dave',
  //     room: 'room 1',
  //     contents: 'mkay here we go tho'
  //   });
  //
  // if(message.contents.trim()!=""){
  // message.save(function(err){
  //   if(err){console.log(err)}
  //   else{console.log("message saved")}
  // });
  // }
  //   ///////

  // res.render("test");
}); // End of testing area

app.get("/", function(req, res) {
  res.redirect("/login");
});

app.get("/login", function(req, res) {
  if (req.isAuthenticated()) {
    if (req.useragent.isMobile==true){
      res.redirect("/mobile1");
    }else{
      res.redirect("/desktop");
    }
  } else {
    res.render("login");    // if not authenticated
  }
});

app.get("/register", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/desktop");
  } else {
    res.render("login");
  }
});

app.get("/desktop", function(req, res) {
  if (req.isAuthenticated()) {
    if (req.useragent.isMobile==true){
      res.redirect("/mobile1");  //  mobile chatroom list route
    } else {
      res.redirect("/rooms/ROOM%201");  //  default desktop route
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/mobile1", function(req, res) {
  if (req.isAuthenticated()) {
    if (req.useragent.isMobile==true){
      Chatroom.find({}, function(err, foundChatrooms) {
        if (err) {
          console.log(err);
        } else {
          if (foundChatrooms.length == 0) {
            console.log("We did not find any chatrooms, so we will create ROOM 1");
            Chatroom.findOne({
              room: 'room 1'
            }, function(err, foundRoom) {
              if (!err) {
                if (!foundRoom) {
                  const chatroom = new Chatroom({
                    room: 'room 1',
                    description: 'The home room chat, where everyone is welcome 😊'
                  });
                  chatroom.save();
                  console.log("Chatroom created");
                } else {
                  console.log("Room already exists: " + foundRoom.room + " : " + foundRoom.description);
                }
              }
            });
            res.redirect("/rooms/ROOM%201");
          } else {
            // at least one chatroom already exists in DB
            Message.find({}, function(err, foundMessages) {
              if (err) {
                console.log(err);
              } else {
                res.render("mobile1", {
                  foundMessages: foundMessages,
                  foundChatrooms: foundChatrooms,
                  theUser: req.user.username,
                  currentRoom: "ROOM 1"
                });
              }
            });
          }
        }
      });
    } // end of -if client is mobile device-
    else {
      res.redirect("/desktop");  // desktop browser
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/rooms/:customChat", function(req, res) {
  if (req.isAuthenticated()) {
    let customChatroom = _.upperCase(req.params.customChat);
    Chatroom.find({}, function(err, foundChatrooms) {
      if (err) {
        console.log(err);
      } else {
        if (foundChatrooms.length == 0) {
          console.log("We did not find any chatrooms, so we will create ROOM 1");
          Chatroom.findOne({
            room: 'room 1'
          }, function(err, foundRoom) {
            if (!err) {
              if (!foundRoom) {
                const chatroom = new Chatroom({
                  room: 'room 1',
                  description: 'The home room chat, where everyone is welcome 😊'
                });
                chatroom.save();
                console.log("Chatroom created");
              } else {
                console.log("Room already exists: " + foundRoom.room + " : " + foundRoom.description);
              }
            }
          });
          res.redirect("/rooms/ROOM%201");
        } else {
          // at least one chatroom already exists in DB
          Message.find({
            room: customChatroom
          }, function(err, foundMessages) {
            if (err) {
              console.log(err);
            } else {
              if (req.useragent.isMobile==true){
                res.render("mobile2", {
                  foundMessages: foundMessages,
                  foundChatrooms: foundChatrooms,
                  theUser: req.user.username,
                  currentRoom: customChatroom
                });
              } else {
              res.render("desktop", {
                foundMessages: foundMessages,
                foundChatrooms: foundChatrooms,
                theUser: req.user.username,
                currentRoom: customChatroom
              });
            }
            }
          });
        }
      }
    })
  } else {
    res.redirect("/login");
  }
});

app.get("/delete/:delChat", function(req, res) {
  if (req.isAuthenticated()) {
    let delChatReq = _.upperCase(req.params.delChat);
    Chatroom.findOne({
      room: delChatReq
    }, function(err, foundChat) {
      if (!err) {
        if (foundChat.owner === req.user.username) {
          Chatroom.find({
            room: delChatReq
          }).deleteMany().exec();
          console.log("successfully deleted chat");
          Message.find({
            room: delChatReq
          }).deleteMany().exec();
          console.log("successfully deletes messages");
        }
      }
    })
    res.redirect("/desktop");
  } else {
    res.redirect("/login");
  }
})

app.get("/logout", function(req, res) {
  req.logout(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/desktop',
  failureRedirect: '/login',
}));

app.post("/register", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/desktop");
      });
    }
  });
});

app.post("/rooms/:customChat", function(req, res) {
  let customChatroom = _.upperCase(req.params.customChat);
  let date = new Date().toUTCString();
  // GMT and UTC are the same, but UTC makes more sense universally
  date = date.replace("GMT", "UTC");
  let message = new Message({
    username: req.user.username,
    room: customChatroom,
    contents: req.body.theMessage,
    created: date
  });

  let message1 = {
    username: req.user.username,
    room: customChatroom,
    contents: req.body.theMessage
  }

  let message2 = [{
    username: req.user.username,
    room: customChatroom,
    contents: req.body.theMessage
  }]

  if (message.contents.trim() != "") {
    message.save(function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("message saved");
        io.emit('message', message);
      }
    });
  }

  Chatroom.find({}, function(err, foundChatrooms) {
    if (err) {
      console.log(err);
    } else {
      if (!foundChatrooms) {
        res.redirect("/rooms/ROOM%201");
      } else {
        Message.find({
          room: customChatroom
        }, function(err, foundMessages) {
          if (err) {
            console.log(err);
          } else {
            //
          }
          res.redirect("/rooms/" + customChatroom);
        });
      }
    }
  });

});

app.post("/createChat", function(req, res) {
  let newChatroom = _.upperCase(req.body.newChat);
  // this filter removes additional spaces before, after, and between the title
  let filterednewChatroom = newChatroom.replace(/\s\s+/g, ' ').trim();

  Chatroom.findOne({
    room: filterednewChatroom
  }, function(err, foundRoom) {
    if (!err) {
      if (!foundRoom) {
        const chatroom = new Chatroom({
          room: filterednewChatroom,
          description: req.body.chatInfo,
          owner: req.user.username
        });
        chatroom.save();
      } else {
        console.log("room exists: " + foundRoom.room + " : " + foundRoom.description);
      }
    }
  });
  res.redirect("/rooms/" + filterednewChatroom);
});

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

io.on('connection', socket => {
  socket.on('chatMessage', msg => {

    let date = new Date().toUTCString();
    // GMT and UTC are the same, but UTC makes more sense universally
    date = date.replace("GMT", "UTC");

    let message = new Message({
      username: socket.request.user.username,
      room: msg.theroom,
      contents: msg.msg,
      created: date
    });

    if (message.contents.trim() != "") {
      message.save(function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("message saved");
          io.emit('message', message);
        }
      });
    }

  });
});

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
