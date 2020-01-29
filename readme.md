<img src="lightpath-logo.png" alt="Logo" style="max-width:100%;" height="150">

# LightPath

Another Browser based HTTP request wrapper.

### Why?

- Promise Based
- Supports Async Await
- Less opinonated than axios
- Easy Error handeling

### Install

```terminal
> npm i lightpath
```

### Usage

```javascript
import LightPath from "lightpath";

// Create Instances
let api = new LightPath({
  baseURL: "http://localhost:5000",
  timeout: 8000,
  headers: { authorization: "Bearer token" },
  query: "?api_key=1234567"
});

async function testGetInstance(url) {
  try {
    await api.get(url);
  } catch (e) {
    console.log(e);
  }
}

// Or use directly
async function testGet(url) {
  try {
    await Drider.get(url);
  } catch (e) {
    console.log(e);
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

### Configure Instance Options

```javascript
let instance = new LightPath({
  baseURL = "",
  headers = {},
  query = "",
  timeout = 8000,
  onRequest = (url, options) => {},
  onComplete = data => {},
  onError = err => {}
})
```
