#!/bin/bash

export $(xargs < /scripts/.env)

mongo <<EOF
var config = {
"_id": "dbrs",
"version": 1,
"members": [
{
"_id": 1,
"host": "mongo1:27017",
"priority": 3
},
{
"_id": 2,
"host": "mongo2:27017",
"priority": 2
},
{
"_id": 3,
"host": "mongo3:27017",
"priority": 1
}
]
};
rs.initiate(config, { force: true });
rs.status();


EOF

# Without it replica set members don't have time to determine the main replica set and next commands won't work
sleep 30

mongo <<EOF

use $MONGO_DATABASE

if(!(db.getUser("$MONGO_USER"))){
db.createUser( { user: "$MONGO_USER",
pwd: "$MONGO_PASSWORD",
roles: [ { role: "readWrite", db: "$MONGO_DATABASE" } ]
} );
print("Database user was created successfully");
} else{
print("Database user already exists");
}

EOF