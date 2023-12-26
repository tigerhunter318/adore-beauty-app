## addressfinder webview
- sourcecode `/webviews/src/addressfinder/index.js`
- start dev server `npm run webviews:dev:addressfinder`
- open `http://localhost:8080/` in web-browser
- `npm run webviews:build:addressfinder` to build production
- asset is compiled to `/assets/webviews/build/addressfinder/index.html`
- compiled `index.html` should be added to the nuxt site within the static folder
  - e.g. https://bitbucket.org/adore-beauty/adore-beauty-nuxt-app/commits/379c594f5741eb9b6edb7fa16b8390c4bb457d9f
- compiled `index.html` are also deployed to S3 as a routing fallback
