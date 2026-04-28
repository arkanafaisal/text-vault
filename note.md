feature
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




updates:
~ v3.0.1 - 28/04/2026 :
- fix copy button in dashboard & public card (mobile & tablet) 


~ v3.0.0 - 27/04/2026 :
- change subdomain to textvault2
- refactor error message logging
- fix subdomain url on mailer function
- html head (title & logo)


~ 10/03/2026 - 26/04/2026 :
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
- mysql migration tools (flyway / liquibase)
- fix flyway volume docker compose prod 
- use constant variable
- review docker compose prod
- validate input tags
- add copy in dashboard 







to-do:
- readjust rate limit
- change footer, feedback
- alert server error + button open modal report admin
- delete user
- tags input
- testing, logging
- input validation (length, regex, required) 
- modify ui for long word possibility
- fix updatedAt miss value
- request json invalid handler
- sticky public page input form
- redesign public data card
 
- copy from dashboard bento (hit getContent to get the data content)
- review responsiveness
- frontend encrypting choice ( random key + derive password )
- public data pagination (and input lock)
- server health tracker
- word count tracker
- profile modal state url
- window.location.href push, possible to do undo redo
- skeleton loading
- add copy in dashboard (mobile)
- docker compose for frontend only
- change package json project name, folder name, repo name

- remove frontend folder, rename frontend2 to frontend (and build config)
- review constant variable to table schema
- smoothscroll public page to bottom (untl section header hidden) at /public after data found
- re-test api speed after cache
- validation middleware, rename authMiddleware
- i18n (english indonesia)
- mysql charset/collation (case & accent sensitive)
- self destruct (ttl & one read only)
- axios
- express ts 
- kubernetes
- learn more about zero downtime migration 
- extract App.jsx logic
- google login (session profile and ask username for register)


stored prompt: