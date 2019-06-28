# create-mura-app

## Project setup

Navigate to your the directory where you would like to install the JS app.

```
npm install -g create-mura-apps
```

Note that the NPM package is currently called `create-mura-apps` (with an 's'). I plan to change this back to `create-mura-app` (I accidentally temporarily blocked this name)

### Create a new app

```
create-mura-app
```

Note that the command does not have an 's'. Sorry again for the confusion... This will be fixed shortly.

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
