| Name          |Student Num|
|---------------|-----------|
|Ivan Zenin     | C21406436 |
|David Niculita | C20513979 |

# Web Dev Project

## Getting Started

### Prerequisites
- Node.js
- MongoDB, MongoDBCompass(installs with MongoDB) & MongoDB Command Line Database Tools

### Installation and Setup
1. Clone the repository: "git clone [repository_url]"
2. Install necessary dependencies: "npm install" or "npm install express mongoose cors bcrypt express-session connect-mongo"
3. Copy & Replace the mongod.cfg file included in the Database_Dump folder into "C:\Program Files\MongoDB\Server\X\bin"
(X stands for the version of the MongoDB server, Currently 7.0. Location of the server is this path by default unless
set otherwise)
4. Edit dbPath: and path: in mongod.cfg where you would like the storage and systemLog of the Database to be. 
Create the folder structure shown and create a new text file called "mongod.log" in db\log.
5. Start the database by running this command from the mongod.cfg directory: "mongod.exe --config mongod.cfg".
(Open CMD and cd into "C:\Program Files\MongoDB\Server\X\bin"). Verify that the database is running by connecting
to it with MongoDBCompass.
6. Now you can restore the database via the database dump by running the following command:
""C:\Program Files\MongoDB\Tools\100\bin\mongorestore.exe" X\Web-Dev-Dep-Project-\Database_Dump"
(The path of mongorestore.exe is set by default unless set otherwise, X stands for the path of the cloned repository)
7. The database should be set up and running now, open a new CMD and CD into the "js" folder in the repository
and run node js server: "node server.js".
8. Open a browser and enter the url: "http://localhost:3000/" (unless set otherwise)