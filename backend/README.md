# Coffee Shop API

## Note:
```
For deploy project in the real server at first do to the thing below
Remove all rows from dependencies that match in devDependencies (it’s done so that Heroku works)
```

## Install packages
```
npm install
```

## Add db configs in config directory

## Migrate all tables to database
```
npx sequelize-cli db:migrate
```

## Seed the test user
```
npx sequelize-cli db:seed:all
```

## Testing credentials
```
 - email: email@gmail.com
 - pass: 12345678
```

## RUN 
```
npm start
```

