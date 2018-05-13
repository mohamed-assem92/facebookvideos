# facebookvideos

### Setup Dependencies
```
npm install

```
### insert your ACCESS_TOKEN which have the Following Scope
####  {read_insights , manage_pages }
##### open videos.js file

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
### the data will be send back to you and will be saved locally too

```
[
  {"videoID":"1040923836072303","videoTitle":"يا سيدتي ومولاتي حبي لكي أهديته مراد بوريقي يغني بالمغربي","pageNameID":"برنامج معكم منى الشاذلي","likesCount":35,"commentsCount":3,"sharesCount":5},

  ....,
  {"performed in Seconds":6273}
]

```

### the data will be saved to public/pagesData/

```
{currentTimeStamp}_{pageName}

```
