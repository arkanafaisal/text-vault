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
- dashboard pagination (limit 30)




updates:
v3.0.1 —— 28/04/2026
- added feedback feature (dashboard & public)
- added public data pagination
- added delete user feature
- added invalid JSON request handler
- fixed copy button in dashboard & public card (mobile & tablet) 
- fixed last update miss value
- adjusted rate limit
- redesigned public data card
- dynamic title fontsize (length based)
- updated landing page footer
- updated project name in package.json, folder, and repository
- removed frontend folder, renamed frontend2 -> frontend (modify docker build config)
- implemented i18n (english) in dashboard & public page


v3.0.0 —— 27/04/2026 
- changed subdomain textvault2 -> textvault
- updated error message logging
- updated subdomain url on mailer function
- updated html head (title & logo)


v2.0.0 —— 10/03/2026 ~ 26/04/2026 :
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
- input validation (length, regex, required) 







to do:
- alert server error + button open modal report admin
- tags input
- sticky public page input form
- testing, logging
- cover all error potential
- redis ok check consistency
- global layer rate limit (identify by url path and method)
- warn level for id access token not found in db
 
- copy from dashboard bento (hit getContent to get the data content)
- review responsiveness
- frontend encrypting choice ( random key + derive password )
- server health tracker
- word count tracker
- profile modal state url
- window.location.href push, possible to do undo redo
- skeleton loading
- docker compose for frontend only

- tutorial / help
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