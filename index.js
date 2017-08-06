const electron = require('electron');
//menu is use dto create custom menu
const {app,BrowserWindow,Menu,ipcMain} = electron;
let mainWindow;
let addWindow;


app.on('ready',()=>{
  //empty object beacause we dont wan to provide any for now
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  //event listener for wiindow close
  //when maiin window closes all the elceton wndows should closes
  mainWindow.on('closed',()=>{
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

//create new add wiindow
function createAddWindow(){
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add New todo'
  });
  addWindow.loadURL(`file://${__dirname}/addTodo.html`);
  addWindow.on('closed',()=>{
    addWindow=null;
  })
}
//event liisterner for todo:add event from addTodod.html
ipcMain.on('todo:add',(event,todo)=>{
  mainWindow.webContents.send('todo:add',todo);
  addWindow.close();
  //to prevent the memory leak
  //addWindow = null;
});

//create a menu template
const menuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label:'Add New Todo',
        click(){
          createAddWindow();
        }
      },
      {
        label:'Clear All Todo\'s',
        click(){
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: 'Quit',
        //hot keys for closiiing window works diifferently for mac and windows
        accelerator:(()=>{
          if(process.platform === 'darwin')
            return 'Command+Q';
          else
            return 'Ctrl+Q';
        })(),
        click(){
          app.quit();
        }
      }
    ]
  }
];

//ti make it consistent in macos
//darwin is similar to mac as NT is for windows
if(process.platform === 'darwin'){
  menuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production' ){
  menuTemplate.push({
    label:'View',
    submenu:[
      {
        role:'reload'
      },
      {
        label:'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+Shift+I',
        click(item,focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
