# UnlimitedWebChat
a friendly web chat app :)

## Features
UnlimitedWebChat enables highly responsive live chatting with several users across multiple chatrooms.  Users can create their own chatrooms and delete ones that they've created.  A websocket allows for live send and incoming chats with no need to reload.

The app communicates with a MongoDB via Mongoose, and user passwords and hashed and salted.

## Live Version/Demo
The latest version of this app is always live at [https://chat.unlimitedweb.us/](https://chat.unlimitedweb.us/)

![UnlimitedWebChat screenshot](https://chat.unlimitedweb.us/screenshot.png)

## Update Log

- v1.0.4
- [x] fixed positioning on desktop to make more sense

- v1.0.3
- [x] configured session-authorized websocket message sending on desktop
- [x] changed timestamp formatting and updated to UTC
- [x] fixed some error routing
- [x] added comments and removed unnecessary console logs

- v1.0.2
- [x] fixed logo & profile on mobile
- [x] added ability to go back to chatroom list on mobile
- [x] can create chatroom in mobile

- v1.0.1
- [x] fixed spacing for message input on desktop
- [x] fixed spacing on login for desktop/mobile
- [x] added support for mobile version