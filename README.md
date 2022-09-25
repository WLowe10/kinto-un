
# Kinto-un

The simplest React JS server side rendering framework. Uses esbuild for insanely fast build times. 


## Install

```bash
  npm install kinto-un
```
    
## First create a component
#### A view must be named with .view to be recognized by the kinto compiler


```javascript
/* Home.view.(js/ts)x */

const Home = ({message}) => {
  return (
    <div>
      <h1>Home: {message} </h1>
    </div>
  )
};

export default Home;
```


## Now build the app

```bash
npm run build
```
#### this outputs a directory with the built css and javascript
## Now render with Kinto-un!
#### A view must be named with .view to be recognized by the kinto compiler


```javascript
/* index.ts */
import Kinto from "kinto-un";

//set the build directory
Kinto.set("./build");

const main = async () => {
  let html = await Kinto.render("Home", {
    //props
      message: `Hello World @${Date.now()}`
  })

  res.send(html)
};

main();
```


## Usage with Express

```javascript
/* index.ts */
import Kinto from "kinto-un";
import express from "express";

const app = express();

//Set the build directory
Kinto.set("./build");

//Serve the bundled css and js. Kinto-un automatically will import css into the render if the view has css.
app.use("/static", express.static("./build/static"))

app.get("/", async (req, res) => {
  let html = await Kinto.render("Home", {
    //Props
      message: `Hello World @${Date.now()}`
  });
});
```


## FAQ

#### Why should I use Kinto-un instead of Next JS?

My inspiration for building Kinto-un came from wanting to be detached from Next JS. Next js has a steep learning curve and it is opinionated.
Another downside of Next JS is the built in server which is cumbersome. Spend less time learning next js and dive in with Kinto-un!

#### How does Kinto-un work?

Kinto-un compiles views, named in the convention hello.view.(js/ts)x, into javacript and css. When rendering these views, Kinto-un automatically imports the bundled js and css into the view when needed. This greatly reduces the bundle size.