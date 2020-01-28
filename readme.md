# Drider

Another Browser based HTTP request wrapper. 

### Why?
- Promise Based
- Supports Async Await
- Less opinonated than axios
- Easy Error handeling

### Install

```terminal
> npm i drider
```

### Usage

```javascript
import Drider from "drider"

// Create Instances
let api = new Drider({
  baseURL: "http://localhost:5000", 
  timeout: 8000, 
  headers: { authorization: "Bearer token"}, 
  query: "?api_key=1234567" 
})

async function testGetInstance(url){
  try {
   await api.get(url)
  }catch(e){
   console.log(e)
  }
}

// Or use directly
async function testGet(url){
  try{
    await Drider.get(url)
  }catch(e){
    console.log(e)
  }
}

```


### Error Types
```javascript
class RequestError extends Error {
  constructor(msg, response, body = {}) {
    super(msg);
    this.response = response;
    this.status = response.status;
    this.body = body;
  }
}

class RequestTimeout extends Error {
  constructor(msg, url) {
    super(msg);
    this.url = url;
  }
}
```