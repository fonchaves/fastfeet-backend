# Necessidades que apareceram

- [] Colocar as validações num arquivo separado
- [x] Adicionar paginação
- [] Afinar os valores de paginação conforme frontend
- [] Modificar Routes pasa usar authenticação mais organizada
- [] Na rota de Orders, incluir o retorno dos dados de endereço de entrega

# Roteiro de passos

- [Desafio 02 - O início](#desafio-02---O-início)
- [Desafio 03 - Continuando a aplicação](#desafio-03---continuando-a-aplicação)

# Passos

### Desafio 02 - O início

1. Start package.json with Yarn
   `yarn init -y`

2. Install Express to help in routes on Node.JS
   `yarn add express`

3. Create `src` forlder, and inside make files route.js, app.js and server.js

4. Make a constructor of `Class App` in app.js, and your functions
   `Middlewares` and `Routes`

5. Install Sucrase (Babel alternative) to enable use `import` instead of `const`
   `yarn add sucrase -D`

6. Install Nodemon to monitore and autoreload application in developmente mode.
   `yarn add nodemon -D`

7. Make changes of `imports` on files to JS6 import/export

8. Make file `nodemon.json` to work with sucrase

9. Dev the script `dev` on package.json

10. And configure script `dev:debug` to debug the app on VSCode

11. Open or create launch.json on VSCode Debug to configure to run with sucrase and nodemon

12. Install Docker and create a container with command above.
    `docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

13. Install Postbird, connect on container and create a database with name `gobarber`

14. Install eslint to standardize the code
    `yarn add eslint -D`

15. Run eslint
    `yarn eslint --init`

16. The eslint download dependences on npm, so we exclude file `package-lock.json`
    and run `yarn` on terminal to update dependences list.
    `yarn`

17. Install ESlint plugin on VSCode

18. Write the code below on settings.json of VSCode to autofix with eslint

```json
"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    }
  },
  "[javascriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    }
  }`
```

19. Add rules of eslint on .eslintrc.js

```js
  rules: {
    'class-methods-use-this': 'off',
    'no-params-reassign': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  }
```

20. Install prettier and auxiliar dependences
    `yarn add prettier eslint-config-prettier eslint-plugin-prettier -D`

21. Add prettier to extends, plugins and rules in `.eslintrc`

```js
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  }
```

22. Create `.prettierrc` file to overwirte some rules of eslint.

```js
  {
    "singleQuote": true,
    "trailingComma": "es5"
  }
```

23. To fix all the files with eslint, run:
    `yarn eslint --fix src --ext .js`

24. Install editor config plugin for VSCode

25. Create and configure .editorconfig on VSCode, pay attention to:

```json
  trim_trailing_whitespace = true
  insert_final_newline = true
```

26. Create folder and files:
    src/config/database.js
    src/database/migrations
    src/app/controllers
    src/app/models

27. Install Sequelize dependence to work with ORM databases
    `yarn add sequelize`

28. Install sequelize-cli to facilitate model creation
    `yarn add sequelize-cli -D`

29. Create file `.sequelizerc` to configure paths of sequelize on app

30. To use postgres with sequelize, instal pg dependences
    `yarn add pg pg-hstore`

31. Go to `src/config/database.js` and configure parameters to use sequelize

32. Run sequelize-cli to create migration of users
    `yarn sequelize migration:create --name=create-users`

33. Developer fields of each column of table on migration

34. Run migration via CLI to migrate fields to database
    `yarn sequelize db:migrate`

35. If I want return a migrate, i can run:
    `yarn sequelize db:migrate:undo`

36. Create model of User in app/models/User.js

37. Create database/index.js to make connection with BD

38. Import database/index.js in app.js file.

39. Create a controller of User in app/controller/UserController.js
    Function Store to add a new User on database,

40. Import UserController in Routes.js to configure a route to add User.

41. Code a test to identify double entry on database in moment of add User

42. We don't need return all parameters, so we wipe some parameters to return in
    `UserController.store()`

43. Install bcrypt to create hashs of passwords
    `yarn add bcryptjs`

44. Code the model User to make hash on passwords of users in models/User.js

45. Run sequelize-cli to create a seed of admin-user
    `yarn sequelize seed:generate --name admin-user`

46. Run seed via CLI to seed fields to database
    `yarn sequelize db:seed:all`

47. Install Json Web Token to work with JWT
    `yarn add jsonwebtoken`

48. Create `config/auth.js` file to put autentication data of application.

49. Create function checkpassword to compare hashs in Model User.

50. Create method store on Controller `app/controlllers/SessionController.js`

51. Create a route `/session` in routes.js to access SessionController

52. Create a Middleware to intercept requests and verify authorization
    `app/middlewares/auth.js`

53. In `auth.js` we get the bearer token, split then and use promisify to convert
    a old promises in a new ecms2015 format using async/await.

54. With the token decoded, we atribute id to req.userId and call `next()`.

55. In `routes.js`, import middleware auth and use to protect routes.

56. Create function update on `UserController.js` to make some checks and update
    the user in case of pass for checks.

57. Install Yup Schema Validation to work with validations on functions of app.
    `yarn add yup`

58. Apply the funcionality where there is user input, as in UserController and SessionController

59. Run sequelize-cli to create migration of recipients
    `yarn sequelize migration:create --name=create-recipients`

60. Developer fields of each column of table on migration recipients

61. Run migration via CLI to migrate fields to database
    `yarn sequelize db:migrate`

62. Create method store and update of Controller `app/controllers/RecipientController.js`

63. Configure routes of Recipient in `routes.js`

64. Make Imnsonia calls and export data, put json in root directory

65. Initialize git
    `git init`

66. Create .gitignore and add `node_modules`

67. Make first git push to remote repository
    `git add .`
    `git commit -m "Initial commit"`

68. Create a new repository in Github and sync with local repository
    `git remote add origin https://github.com/leandrochavesf/fastfeet-backend.git`
    `git push -u origin master`

### Desafio 03 - Continuando a aplicação

69. Create a new migration of deliverymans
    `yarn sequelize migration:create --name=create-deliverymans`

70. Run migration via CLI to migrate fields to database
    `yarn sequelize db:migrate`

71. So, I need configure Files support to permite attribute avatar_id
    in deliveryman.

72. Create a FileController.js and adjust routes.js to call this Controller

73. With migrations, create a new table in BD to Files
    `yarn sequelize migration:create --name=create-files`

74. Configure migration `create-files` and run migration through the CLI
    `yarn sequelize db:migrate`

75. Create a model `File.js` to Files

76. Import File model in index.js on `/app/database/index.js`

77. Code FileController to insert data of File in BD

78. With migrations, create a column to relate User with File in BD `deliverymans`
    `yarn sequelize migration:create --name=add-avatar-field-to-deliverymans`

79. Run again migrate through the CLI
    `yarn sequelize db:migrate`

80. Create a model `Deliveryman.js` to Deliveryman

81. Create a associate `belongsTo` in Model Deliveryman

82. Configure in `/app/database/index.js` a map to `associate` created

83. Create controller `DeliverymanController.js` and CRUD methods

84. Configure `routes.js` to permite access DeliverymanController

85. Create a new migration of delivery
    `yarn sequelize migration:create --name=create-deliverys`

86. Run migration via CLI to migrate fields to database
    `yarn sequelize db:migrate`

87. Create a model `Delivery.js` to Deliveries

88. Create a associate `belongsTo` of FKs in Model `Delivery.js`

89. Configure in `/app/database/index.js` a map to `associate` created

90. Create controller `DeliveryController.js` and begin to code CRUD

91. Install library to work with dates in `DeliveryController.update`
    `yarn add date-fns`

92. Create a new route to get orders by deliveryman

93. Create `src/app/controllers/OrderController.js`

94. Create `OrderController.index` method to show all orders of an deliveryman

95. Create `OrderController.show` method to show only orders delivered of an deliveryman

96. Create `OrderController.store` method to permit deliveryman to start a delivery

97. Create `OrderController.update` method to permit deliveryman to end a delivery

98. Create a new migration of delivery_problems
    `yarn sequelize migration:create --name=create-delivery_problems`

99. Run migration via CLI to migrate fields to database
    `yarn sequelize db:migrate`

100.  Create group of routes to register a `delivery_problem` in `routes.js`

101.  Create file `app/controllers/DeliveryProblemController.js` to make control of
      delivery problems.

102.  Create a model of DeliveryProblem in `app/models/DeliveryProblem.js` and import
      in `DeliveryProblemController`

103.  Add model `DeliveryProblem` to initiate in list of models `src/database/index.js`

104.  Create method `DeliveryProblem.store` to register a problem of delivery

105.  Create method `DeliveryProblem.index` to return all problems registered

106.  Create method `DeliveryProblem.show` to return a especific problem of delivery

107.  Create method `DeliveryProblem.delete` to delete a especific problem of delivery

108.  In `DeliveryController.js`, in index method add functions to search deliveries with
      a query name.

109.  In `DeliverymanController.js`, in index method add functions to search deliverymans with
      a query name.

110.  In `RecipientController.js`, in index method add functions to search recipients with
      a query name.

111.  Add a new route to `RecipientController.index` in `routes.js`

112.  Define and refine routes as Protect or not in `Routes.js`
