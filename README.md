# facebookvideos

### Setup Dependencies
```
npm install

```
### insert your ACCESS_TOKEN
#### open videos.js

```
const request = require('request-promise');
const express = require("express");
const router = express.Router();
const https = require('https');
const path = require('path');
const fs = require("fs");
const token = "_____Generated_Token_Here_____";

```

### get your desired facebookPageName

```
https://www.facebook.com/MTVEgyptt/

facebookPageName = MTVEgyptt;

```

### call the api from your Browser or Postman as Following

```
https://localhost:9050/api/videos/{facebookPageName}

```

### the data will be saved to public/pagesData/

```
{currentTimeStamp}_{pageName}

```
