const electron = require('electron');
//menu is use dto create custom menu
const {app,BrowserWindow,Menu} = electron;
let mainWindow;


app.on('ready',()=>{
  //empty object beacause we dont wan to provide any for now
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});


//create a menu template
const menuTemplate = [
  {
    label: 'File',
    submenu:[
      {label:'Add New Todo'}
    ]
  }
];
