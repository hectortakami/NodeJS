# NodeJS (Backend Configuration)

## Backend Configuration

### Project Setup

1. Create app folder
2. Run the command `npm init` and fulfill command line options
3. Setup Typescript as the compilation language `tsc --init`
4. Modify on `tsconfig.json` file as follows `"outDir": "dist/"`
5. Create an index.js file in root folder to setup backend calls `touch index.ts`
6. Create an assets folder for static resources `mkdir assets/` and `mkdir dist/assets/`
7. Start automatic compilation for development `tsc -w`
8. Startup nodemon live-reload `nodemon dist`
9. (Optional) if `express-fileupload` is used, will be needed to have an `uploads` folder in both roots `mkdir uploads/` and `mkdir dist/uploads/`

_Note: Static resources in `/assets` folder will NOT be compiled into `/dist` folder, reason why we need to change the content mannually for each time any asset is added_

### Backend Dependencies (Prod & Dev Typescript Usage)

```console
npm install express body-parser cors mongoose express-fileupload jsonwebtoken bcrypt uniqid
```

```console
npm install @types/express @types/mongoose @types/cors @types/bcrypt @types/jsonwebtoken @types/express-fileupload @types/uniqid --save-dev
```

### Server Model

```console
touch server/server.ts
```

`server/server.ts`

```typescript
import express from 'express';

export default class Server {
  public app: express.Application;
  public port: number = 3000; // Can be set to any arbotrary port number

  constructor() {
    this.app = express();
  }

  start(callback: () => void) {
    this.app.listen(this.port, callback);
  }
}
```

### Index File

`index.ts`

```typescript
import Server from './server/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const server = new Server();
const database = 'invited-dev';

// CORS Configuration (allow Access-Control-Allow-Origin)
server.app.use(cors({ origin: true, credentials: true }));

// Body Parser (JSON HTTP Usage)
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(
  fileUpload({
    useTempFiles: true,
    // Creates an `uploads` & `temp` folder for fileUpload usage in root directory
    tempFileDir: path.join(__dirname, '../uploads/temp')
  })
);

// Connect to Mongo Database
mongoose.connect(
  `mongodb://localhost:27017/${database}`,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  err => {
    if (err) throw err;
    console.log(`Mongo Database '${database}' is running`);
  }
);

// REST ROUTES COLLECTIONS
server.app.use('/ROOT_ROUTE', ROUTER_COLLECTION);
// Ex. all routes that start as http://localhost:3000/user/***
// server.app.use('/user', userRoutes);

// Start Express Server
server.start(() => {
  console.log(`Server listening at port ${server.port}`);
});
```

## REST Routes (Express Router)

```console
mkdir routes
touch routes/myRoutes.ts
```

```typescript
import { Router, Request, Response } from 'express';

const myRoutes = Router();

// #################################################################
// Request Type: GET | POST | PUT | DELETE
// Function: DESCRIBE THE FUNCTION HERE
// Usage:
//        Route:    localhost:3000/myRoutes/ROUTE/123
//        Headers:  KEY: VALUE
//        Body:
//                  TYPE:  form-data | x-www-form-urlencoded
//                  KEY:   DATA TYPE
// #################################################################
myRoutes.<get|post|put|delete>('/ROUTE/:myParam', [SOME_MIDDLEWARE], (req: Request, res: Response) => {
  // Route parameters retreival
  const paramValue = req.params.myParam;
  // Body Parser key:value received by the x-www-form-urlencoded
  const key1Value = req.body.key1
  // HERE GOES ALL LOGIC IMPLEMENTED WHEN CALLING THIS ROUTE
});

// More routes goes here, before export them

export default myRoutes;
```

`index.ts`

```typescript
import myRoutes from './routes/myRoutes';
// ...
// REST ROUTES COLLECTIONS
server.app.use('/myRoutes', myRoutes);
// ...
```

## NPM Utilities

This set of utility packages will result handly for routes manipulations, logic implementation, database management and security usage for the API calls to server

### Mongoose (MongoDB)

Mongoose provides several methods to lookup, create and manipulate registers and collections in Mongo Database. Manage things like auto-generation of unique IDs before inserting them on DB.

```console
mkdir models
touch models/myCollection.ts
```

`myCollection.model.ts`

```typescript
import { Schema, Document, model } from 'mongoose';

const mySchema = new Schema({
  myAttribute: {
    unique?: true | false, // Denotes if the value provided must be unique in database
    type: String | Number | Date  ... ,
    default?: 'OPTIONAL DEFAULT VALUE',
    required?: [true, `Personalized banner when property is not provided`]
  },
  created: {
    type: Date
  },
  relation: {
    type: Schema.Types.ObjectId,
    ref: 'collection2', // MongoDB Collection name to be referenced with
    required: [
      true,
      `Any message to denote the mandatory relation between collections`
    ]
  }
});

interface IMyInterface extends Document {
  myAttribute: string;
  created: Date;
  relation: string;
  myFunction(param: number): void;
}

// The '.pre' functions is trigger before the model is stored in database
mySchema.pre<IMyInterface>('save', function(next) {
  this.created = new Date();
  next();
});

// The interface methods must be implemented before the model is exported
mySchema.method('myFunction', function( param: number ): void {
  console.log(`MyFunction: ${param}`);
});


// MyModel will be used for Mongoose to encapsulate CRUD methods outside `myCollection.model.ts` file
export const MyModel = model<IMyInterface>('collectionName', mySchema);
// Note: `collectionName` will be the name used for Mongoose to create collection in MongoDB
// and will be used for other models to reference relations between collections
```

#### Mongoose CRUD & Lookup Methods

`create()`

```typescript
// Mongoose: MyModel.create()
// Function: Creates a new register in database
myRoutes.post('/create', [SOME_MIDDLEWARE], (req: Request, res: Response) => {
  const register = {
    property1: 'something',
    property2: 123,
    property3: true,
    property4: new Date()
  };

  MyModel.create(register)
    .then(data => {
      // When succeeds the new register data from MongoDB will be accessed by `data` property
    })
    .catch(err => {
      // If couldn't create the register
    });
});
```

`find()`

```typescript
// Mongoose: MyModel.find()
// Function: Retreives all registers from the collection (10 by 10)
myRoutes.post(
  '/find',
  [SOME_MIDDLEWARE],
  async (req: Request, res: Response) => {
    const collection = await MyModel.find()
      // Fills all the attributes with it's correspondant MODEL RELATION
      // .populate('attribute_2_populate', 'values_from_attribute_2_ignore')
      .populate('relation', '-password')
      .sort({ _id: -1 }) // Sorts the post by descent order
      .skip(skip) // By pagination it skips the unnecessary registers
      .limit(10) // Shows only 10 registers by page
      .exec();
  }
);
```

`findOne()`

```typescript
// Mongoose: MyModel.findOne()
// Function: Retreives the first element with the matching attribute
myRoutes.post('/findOne', [SOME_MIDDLEWARE], (req: Request, res: Response) => {
  const searchCriteria = {
    property2: 123
  };

  MyModel.findOne(searchCriteria)
    .then(result => {
      // If an element is find it will be returned by the `result` property
    })
    .catch(err => {
      // If couldn't find any matching register
    });
});
```

`findByIdAndUpdate()`

```typescript
// Mongoose: MyModel.findByIdAndUpdate()
// Function: Looks for matching unique ID in collection and then updates the
//           element to the new values
myRoutes.post(
  '/findByIdAndUpdate',
  [SOME_MIDDLEWARE],
  (req: Request, res: Response) => {
    const updatedObj = {
      property1: 'it changes',
      property2: 123,
      property3: true,
      property4: new Date()
    };

    MyModel.findByIdAndUpdate(
      'UNIQUE_ID', // ID to search in collection
      updatedObj, // Object with the new data to replace previous register
      // Destroys previous register and create another (with same id) and updated data to prevent duplicates
      { new: true },
      (err, updated) => {
        if (err) throw err;
        // If the ellement was successfully updated it will be retreived by the `updated` property
      }
    );
  }
);
```

### JSON Web Token

https://www.npmjs.com/package/jsonwebtoken

Authenticates users basen on a JSON Token determied by various factors and unique for every user, it can have an specific expiration and its validated through a middleware.

#### Token Model

```console
touch server/token.ts
```

`token.ts`

```typescript
import jwt from 'jsonwebtoken';

export default class Token {
  private static seed: string = 'SECURE_SEED_TO_CREATE_TOKENS';
  private static expiration: string = 'TIME_EXPIRATION_FORMAT';
  // Format: 60, "2 days", "10h", "7d".
  // A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").

  constructor() {}

  static getJWToken(payload: any): string {
    return jwt.sign(
      {
        user: payload
      },
      this.seed,
      { expiresIn: this.expiration }
    );
  }

  static validateToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.seed, (err, decoded) => {
        if (err) {
          reject();
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
```

#### Authentication Middleware

```console
touch middleware/authentication.ts
```

```typescript
import { Response, NextFunction } from 'express';
import Token from '../server/token';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  // 'x-token' is the KEY NAME required in the HEADER request to authenticate the response
  const userToken = req.get('x-token') || '';

  Token.validateToken(userToken)
    .then((decoded: any) => {
      req.user = decoded.user;
      next();
    })
    .catch(err => {
      res.json({
        ok: false,
        err: 'Invalid token.'
      });
    });
};
```

#### JWT Usage

`Create token`

```typescript
// #################################################################
// Request Type: GET
// Function: Return user's data when it is correctly authenticated
//           having a valid JSON Web Token
// Usage:
//        Route:  localhost:3000/token/create
//        Headers:  x-token: USER_TOKEN
// #################################################################
myRoutes.get('/create', (req: any, res: Response) => {
  const token = Token.getJWToken({
    _id: user._id,
    name: user.name
    // More properties to add in payload goes here
  });
  res.json({
    ok: true,
    token
  });
});
```

`Get user's data by token`

```typescript
// #################################################################
// Request Type: GET
// Function: Return user's data when it is correctly authenticated
//           having a valid JSON Web Token
// Usage:
//        Route:  localhost:3000/token/getUser
//        Headers:  x-token: USER_TOKEN
// #################################################################
myRoutes.get('/getUser', [verifyToken], (req: any, res: Response) => {
  const user = req.user;
  res.json({
    ok: true,
    user
  });
});
```

### BCrypt

Ciphers by hashing any string value. Useful for password storage.

`Hashing a string`

```typescript
const unsafe = 'Hi there! Im not cipher, yet';
const safe = bcrypt.hashSync(unsafe, 10); // Hashes the plain-text 10 times
```

`Compare two hashed strings (if they match)`

```typescript
function compareHashed(hashed: string, hashed2Compare: string): boolean {
  // If `this.password` mark error disable `"noImplicitThis": false` in `tsconfig.json`
  if (bcrypt.compareSync(hashed, hashed2Compare)) {
    return true;
  } else {
    return false;
  }
}
```

### UniqID

Create unique value strings to identify primary objects avoiding redundance.

```typescript
import uniqid from 'uniqid';
// ...
function getUnique(fileName: string) {
  return uniqid();
}
```

### Express FileUpload

Enables the Express Server to receive any file (JPG, PNG, PDF...) from request body
_Note: The commands `mkdir uploads/` and `mkdir dist/uploads/` must be run first to create file upload directory_

#### FileUpload Interface

Defines all file properties to be used later on by the tslint completer

`file-upload.interface.ts`

```typescript
export interface FileUpload {
  name: string;
  data: any;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
  mv: Function;
}
```

#### FileSystem Class

Set of rules to use the Node FileSystem and the directory management to store, move from path and create unique documents in storage

`file-system.ts`

```typescript
import { FileUpload } from './fileupload.interface';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
  constructor() {}

  // Stores in cache all images to enable an async and fast response while uploading files
  storeTempFilePath(file: FileUpload, userID: string) {
    return new Promise((resolve, reject) => {
      // Create a folder for each user based on it's ID
      const path = this._createFolder(userID);
      // Renames the file, giving it an unique file name in storage
      const fileName = this._uniqueFileName(file.name);
      // Moves the file from temporary storage to the users folder
      file.mv(`${path}/temp/${fileName}`, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Once the load is completed retreives from '/temp' directory the images and
  // stores them in user's unique directory '/posts' to make files persistant
  getUploadedFiles(userID: string) {
    const tempDir = path.resolve(__dirname, `../uploads/${userID}`, 'temp');
    const postDir = path.resolve(__dirname, `../uploads/${userID}`, 'posts');
    if (!fs.existsSync(tempDir)) {
      return [];
    }
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir);
    }
    const tempFiles = this._getTempFiles(userID);
    // If the cache is full (user has uploaded files), it will be cleaned
    // by moving all from '/temp' to '/posts' folder
    tempFiles.forEach(file => {
      fs.renameSync(`${tempDir}/${file}`, `${postDir}/${file}`);
    });
    return tempFiles;
  }

  getFilePath(userID: string, fileName: string) {
    const filePath = path.resolve(
      __dirname,
      `../uploads/${userID}/posts`,
      fileName
    );
    if (!fs.existsSync(filePath)) {
      return path.resolve(__dirname, '../assets', 'no-image.png');
    } else {
      return filePath;
    }
  }

  // Creates an unique bucket to store all user's files based on it's unique id
  private _createFolder(userID: string) {
    const userDir = path.resolve(__dirname, '../uploads', userID);
    const tempDir = path.resolve(__dirname, `../uploads/${userID}`, 'temp');

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
      fs.mkdirSync(tempDir);
    }

    return userDir;
  }

  // Rename any file to have an unique name conserving it's own extension
  private _uniqueFileName(fileName: string) {
    const data = fileName.split('.');
    const fileExt = data[data.length - 1];
    return `${uniqid()}.${fileExt}`;
  }

  // Retreives all user's /temp directory content as array
  private _getTempFiles(userID: string) {
    const tempDir = path.resolve(__dirname, `../uploads/${userID}`, 'temp');
    return fs.readdirSync(tempDir) || [];
  }
}
```

#### StoreTempFile Usage

This POST Request retreives from `form-data` body call the file uploaded, verifies it's type and then stores in a temporary path a copy with an unique name in the user's particular bucket.

```typescript
// #################################################################
// Request Type: POST
// Function: Uploads a file to cloud services and then stores the URL reference
//           in the MongoDB to be used later
// Usage:
//        Route:    localhost:3000/upload
//        Body:     form-data
//                  myFile (file): file
// #################################################################
myRoutes.post('/upload', async (req: any, res: Response) => {
  // Verifies if a file has been included
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No files uploaded'
    });
  }

  // File uploaded will be retreive from `myFile` request key
  const file: FileUpload = req.files.myFile;

  // Verifies if a file has been uploaded correctly
  if (!file) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No files uploaded - `myFile`'
    });
  }

  const validTypes = ['image', 'pdf', 'video', 'audio', ...]
  if (
    // Filter only the desired file types to be uploaded
    !file.mimetype.includes(validTypes[0]) &&
    !file.mimetype.includes(validTypes[1]) && ...
  ) {
    return res.status(400).json({
      ok: false,
      err: `No ${file.mimetype} allowed, only ${validTypes} can be uploaded`
    });
  } else {
    const fileSystem = new FileSystem();
    await fileSystem.storeTempFilePath(file, req.user._id);
    return res.json({
      ok: true,
      type: file.mimetype,
      msg: `File '${file.name}' has been successfully uploaded`
    });
  }
});
```

#### GetUploadedFiles Usage

Retreives from temporary storage all files uploaded as array, to be later on processed.

```typescript
import FileSystem from '../models/filesystem';
// ...
const fileSystem = new FileSystem();
const uploadedFiles = fileSystem.getUploadedFiles(req.user._id);
```

#### GetFilePath Usage

Retreives an specific file path from an user's unique storage bucket.

```typescript
// #################################################################
// Request Type: GET
// Function: Retreives files (images) from a certain bucket
// Usage:
//        Route:    localhost:3000/attachments/:userID/:fileName
// #################################################################

postRoutes.get('/attachments/:userID/:fileName', (req: any, res: Response) => {
  const userID = req.params.userID;
  const fileName = req.params.fileName;

  const fileSystem = new FileSystem();
  const filePath = fileSystem.getFilePath(userID, fileName);
  res.sendFile(filePath);
});
```
