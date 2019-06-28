# create-mura-app

## Project setup

Navigate to your the directory where you would like to install the JS app.

```
npm install -g create-mura-apps
```

Note that the NPM package currently called `create-mura-apps`. I plan to change this back to `create-mura-app` (I accidentally temporarily blocked this name)

### Answer prompts

1. Select the template
2. Give your app a name
3. Enter the relative path to Mura's `modules` directory

### Install the new app's dependencies

`cd` into the new app's directory and run

```
npm install
```

### Start the Dev server

```
npm run serve
```

### Reload Mura and drag module onto page
