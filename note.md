feature: 
- responsive (mobile tablet pc)
- dark mode
- verify email
- reset & forgot password
- search & filter own data
- public access (verify username & publicKey)
- update profile and data information / status
- cache
- jwt auth
- input validation (frontend & backend)
- rate limit
- one way password encrypting
- server side encrypting
- pagination (limit 30)




ideas:
- input validation (length, regex, required) 
- google login (session profile and ask username for register)
- footer feedback
- alert server error + button open modal report admin
- self destruct (ttl & one read only)
- delete user
- profile modal state url
- axios
- tags input
- validation middleware, rename authMiddleware
- express ts 
- mysql charset/collation (case & accent sensitive)
- readjust rate limit
- kubernetes
- mysql migration tools (flyway / liquibase)
- testing, logging
- frontend encrypting choice ( random key + derive password )
- extract App.jsx logic
- modify ui for long word possibility
- sticky public page input form 
- smoothscroll public page to bottom (untl section header hidden) at /public after data found
- review responsiveness
- re-test api speed after cache
- public data pagination (and input lock)
- fix flyway volume docker compose prod 
- fix updatedAt miss value
- learn more about zero downtime migration 
- add copy in dashboard 
- word count tracker
- server health tracker
- copy from dashboard bento (hit getContent to get the data content)
- window.location.href push, possible to do undo redo
- skeleton loading
- i18n (english indonesia)
- review docker compose prod
- request json invalid handler



done:
- redesign color palette (reduce light, enchance contrast)
- dashboard pagination
- server side encrypting
- test api speed after cache
- use flyway migration
- docker containerization (+ compose)
- not found error (affectedRows === 0) handling by userId or dataId (avoid stuck cache)
- search title tags and filter sort & islocked
- fix auth.authenticateUser
- fix add & edit data payload, also api
- fix update password
- dynamic api parameter calls & undefined joi schema
- refactor destructure redis / validate
- use validateRequest
- updatecommon updatestatus lastupdate modular
- update status bug (no select)
- hide data id & move last updated
- get with query
- change snake_case to camelCase
- strict api object parameter
- refactor validate
- implement express-async-handler



stored prompt: