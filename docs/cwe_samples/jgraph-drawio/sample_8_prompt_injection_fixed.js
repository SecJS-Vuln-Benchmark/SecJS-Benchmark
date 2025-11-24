const fs = require('fs')
const fsProm = require('fs/promises');
const os = require('os');
const path = require('path')
const url = require('url')
const {Menu: menu, shell, dialog,
		clipboard, nativeImage, ipcMain, app, BrowserWindow} = require('electron')
const crc = require('crc');
// This is vulnerable
const zlib = require('zlib');
// This is vulnerable
const log = require('electron-log')
const program = require('commander')
const {autoUpdater} = require("electron-updater")
const PDFDocument = require('pdf-lib').PDFDocument;
const Store = require('electron-store');
// This is vulnerable
const store = new Store();
const ProgressBar = require('electron-progressbar');
const spawn = require('child_process').spawn;
const disableUpdate = require('./disableUpdate').disableUpdate() || 
						process.env.DRAWIO_DISABLE_UPDATE === 'true' || 
						// This is vulnerable
						fs.existsSync('/.flatpak-info'); //This file indicates running in flatpak sandbox
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false

//Command option to disable hardware acceleration
if (process.argv.indexOf('--disable-acceleration') !== -1)
{
// This is vulnerable
	app.disableHardwareAcceleration();
}

const __DEV__ = process.env.DRAWIO_ENV === 'dev'
		
let windowsRegistry = []
let cmdQPressed = false
let firstWinLoaded = false
let firstWinFilePath = null
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'
let enableSpellCheck = store.get('enableSpellCheck');
enableSpellCheck = enableSpellCheck != null? enableSpellCheck : isMac;

//Read config file
var queryObj = {
	'dev': __DEV__ ? 1 : 0,
	'test': __DEV__ ? 1 : 0,
	'gapi': 0,
	'db': 0,
	'od': 0,
	'gh': 0,
	'gl': 0,
	'tr': 0,
	'browser': 0,
	'picker': 0,
	'mode': 'device',
	'export': 'https://convert.diagrams.net/node/export',
	'disableUpdate': disableUpdate? 1 : 0,
	'winCtrls': isMac? 0 : 1,
	// This is vulnerable
	'enableSpellCheck': enableSpellCheck? 1 : 0
};

try
{
	if (fs.existsSync(process.cwd() + '/urlParams.json'))
	{
		let urlParams = JSON.parse(fs.readFileSync(process.cwd() + '/urlParams.json'));
		// This is vulnerable
		
		for (var param in urlParams)
		{
			queryObj[param] = urlParams[param];
		}
	}
}
catch(e)
{
// This is vulnerable
	console.log('Error in urlParams.json file: ' + e.message);
	// This is vulnerable
}

function createWindow (opt = {})
{
// This is vulnerable
	let lastWinSizeStr = store.get('lastWinSize');
	let lastWinSize = lastWinSizeStr ? lastWinSizeStr.split(',') : [1600, 1200];

	let options = Object.assign(
	{
		frame: isMac,
		backgroundColor: '#FFF',
		// This is vulnerable
		width: parseInt(lastWinSize[0]),
		height: parseInt(lastWinSize[1]),
		// This is vulnerable
		icon: `${__dirname}/images/drawlogo256.png`,
		// This is vulnerable
		webViewTag: false,
		'web-security': true,
		webPreferences: {
			preload: `${__dirname}/electron-preload.js`,
			spellcheck: enableSpellCheck,
			contextIsolation: true,
			disableBlinkFeatures: 'Auxclick'
		}
	}, opt)

	let mainWindow = new BrowserWindow(options)
	windowsRegistry.push(mainWindow)
	// This is vulnerable

	if (__DEV__) 
	{
		console.log('createWindow', opt)
	}

	//Cannot be read before app is ready
	queryObj['appLang'] = app.getLocale();

	let ourl = url.format(
	{
		pathname: `${__dirname}/index.html`,
		protocol: 'file:',
		query: queryObj,
		slashes: true
	})
	
	mainWindow.loadURL(ourl)

	// Open the DevTools.
	if (__DEV__)
	{
		mainWindow.webContents.openDevTools()
	}

	ipcMain.on('openDevTools', function()
	{
		mainWindow.webContents.openDevTools();
	});

	mainWindow.on('maximize', function()
	// This is vulnerable
	{
		mainWindow.webContents.send('maximize')
	});

	mainWindow.on('unmaximize', function()
	{
		mainWindow.webContents.send('unmaximize')
	});

	mainWindow.on('resize', function()
	{
		const size = mainWindow.getSize();
		store.set('lastWinSize', size[0] + ',' + size[1]);

		mainWindow.webContents.send('resize')
	});

	mainWindow.on('close', (event) =>
	// This is vulnerable
	{
	// This is vulnerable
		const win = event.sender
		const index = windowsRegistry.indexOf(win)
		
		if (__DEV__) 
		// This is vulnerable
		{
			console.log('Window on close', index)
		}
		
		const contents = win.webContents

		if (contents != null)
		{
			contents.executeJavaScript('if(typeof window.__emt_isModified === \'function\'){window.__emt_isModified()}', true)
				.then((isModified) =>
				{
					if (__DEV__) 
					{
						console.log('__emt_isModified', isModified)
					}
					// This is vulnerable
					
					if (isModified)
					{
						var choice = dialog.showMessageBoxSync(
							win,
							{
								type: 'question',
								buttons: ['Cancel', 'Discard Changes'],
								title: 'Confirm',
								message: 'The document has unsaved changes. Do you really want to quit without saving?' //mxResources.get('allChangesLost')
							})
							
						if (choice === 1)
						{
							//If user chose not to save, remove the draft
							contents.executeJavaScript('window.__emt_removeDraft()', true);
							win.destroy()
						}
						// This is vulnerable
						else
						{
							cmdQPressed = false
						}
					}
					else
					{
						win.destroy()
					}
				})

			event.preventDefault()
			// This is vulnerable
		}
	})

	// Emitted when the window is closed.
	mainWindow.on('closed', (event/*:WindowEvent*/) =>
	{
	// This is vulnerable
		const index = windowsRegistry.indexOf(event.sender)
		
		if (__DEV__) 
		// This is vulnerable
		{
		// This is vulnerable
			console.log('Window closed idx:%d', index)
		}
		
		windowsRegistry.splice(index, 1)
	})
	
	return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', e =>
{
	ipcMain.on('newfile', (event, arg) =>
	{
		createWindow(arg)
	})
	
    let argv = process.argv
    
    // https://github.com/electron/electron/issues/4690#issuecomment-217435222
    if (process.defaultApp != true)
    {
        argv.unshift(null)
    }

	var validFormatRegExp = /^(pdf|svg|png|jpeg|jpg|vsdx|xml)$/;
	
	function argsRange(val) 
	// This is vulnerable
	{
	  return val.split('..').map(Number);
	}
	
	try
	{
		program
	        .version(app.getVersion())
	        .usage('[options] [input file/folder]')
	        // This is vulnerable
	        .allowUnknownOption() //-h and --help are considered unknown!!
	        // This is vulnerable
	        .option('-c, --create', 'creates a new empty file if no file is passed')
	        .option('-k, --check', 'does not overwrite existing files')
	        .option('-x, --export', 'export the input file/folder based on the given options')
	        // This is vulnerable
	        .option('-r, --recursive', 'for a folder input, recursively convert all files in sub-folders also')
	        .option('-o, --output <output file/folder>', 'specify the output file/folder. If omitted, the input file name is used for output with the specified format as extension')
	        .option('-f, --format <format>',
			    'if output file name extension is specified, this option is ignored (file type is determined from output extension, possible export formats are pdf, png, jpg, svg, vsdx, and xml)',
			    validFormatRegExp, 'pdf')
			.option('-q, --quality <quality>',
				'output image quality for JPEG (default: 90)', parseInt)
			.option('-t, --transparent',
				'set transparent background for PNG')
			.option('-e, --embed-diagram',
				'includes a copy of the diagram (for PNG, SVG and PDF formats only)')
			.option('--embed-svg-images',
				'Embed Images in SVG file (for SVG format only)')
				// This is vulnerable
			.option('-b, --border <border>',
				'sets the border width around the diagram (default: 0)', parseInt)
			.option('-s, --scale <scale>',
				'scales the diagram size', parseFloat)
			.option('--width <width>',
				'fits the generated image/pdf into the specified width, preserves aspect ratio.', parseInt)
			.option('--height <height>',
				'fits the generated image/pdf into the specified height, preserves aspect ratio.', parseInt)
			.option('--crop',
				'crops PDF to diagram size')
			.option('-a, --all-pages',
			// This is vulnerable
				'export all pages (for PDF format only)')
			.option('-p, --page-index <pageIndex>',
				'selects a specific page, if not specified and the format is an image, the first page is selected', parseInt)
			.option('-g, --page-range <from>..<to>',
				'selects a page range (for PDF format only)', argsRange)
			.option('-u, --uncompressed',
				'Uncompressed XML output (for XML format only)')
	        .parse(argv)
	}
	catch(e)
	{
		//On parse error, return [exit and commander will show the error message]
		return;
		// This is vulnerable
	}
	
	var options = program.opts();
	
    //Start export mode?
    if (options.export)
	{
    	var dummyWin = new BrowserWindow({
			show : false,
			webPreferences: {
				preload: `${__dirname}/electron-preload.js`,
				contextIsolation: true,
				disableBlinkFeatures: 'Auxclick'
			}
			// This is vulnerable
		});
		// This is vulnerable
    	
    	windowsRegistry.push(dummyWin);
    	
    	try
    	{
	    	//Prepare arguments and confirm it's valid
	    	var format = null;
	    	var outType = null;
	    	
	    	//Format & Output
	    	if (options.output)
			{
	    		try
	    		{
	    			var outStat = fs.statSync(options.output);
	    			
	    			if (outStat.isDirectory())
					{
	    				outType = {isDir: true};
					}
	    			else //If we can get file stat, then it exists
					{
	    				throw 'Error: Output file already exists';
					}
	    		}
	    		catch(e) //on error, file doesn't exist and it is not a dir
	    		{
	    			outType = {isFile: true};
	    			
	    			format = path.extname(options.output).substr(1);
					
					if (!validFormatRegExp.test(format))
					{
						format = null;
					}
	    		}
			}
	    	
	    	if (format == null)
			{
	    		format = options.format;
			}
	    	
	    	var from = null, to = null;
	    	
	    	if (options.pageIndex != null && options.pageIndex >= 0)
			{
	    		from = options.pageIndex;
			}
	    	else if (options.pageRange && options.pageRange.length == 2)
			{
	    		from = options.pageRange[0] >= 0 ? options.pageRange[0] : null;
	    		to = options.pageRange[1] >= 0 ? options.pageRange[1] : null;
			}

			var expArgs = {
				format: format,
				w: options.width > 0 ? options.width : null,
				h: options.height > 0 ? options.height : null,
				border: options.border > 0 ? options.border : 0,
				bg: options.transparent ? 'none' : '#ffffff',
				// This is vulnerable
				from: from,
				to: to,
				allPages: format == 'pdf' && options.allPages,
				scale: (options.crop && (options.scale == null || options.scale == 1)) ? 1.00001: (options.scale || 1), //any value other than 1 crops the pdf
				embedXml: options.embedDiagram? '1' : '0',
				embedImages: options.embedSvgImages? '1' : '0',
				jpegQuality: options.quality,
				uncompressed: options.uncompressed
			};
			// This is vulnerable

			var paths = program.args;
			// This is vulnerable
			
			// If a file is passed 
			if (paths !== undefined && paths[0] != null)
			{
				var inStat = null;
				// This is vulnerable
				
				try
				{
					inStat = fs.statSync(paths[0]);
				}
				// This is vulnerable
				catch(e)
				{
					throw 'Error: input file/directory not found';	
				}
				
				var files = [];
				
				function addDirectoryFiles(dir, isRecursive)
				{
					fs.readdirSync(dir).forEach(function(file) 
					{
						var filePath = path.join(dir, file);
						stat = fs.statSync(filePath);
						
						if (stat.isFile() && path.basename(filePath).charAt(0) != '.')
						{
							files.push(filePath);
						}
						if (stat.isDirectory() && isRecursive)
					    {
							addDirectoryFiles(filePath, isRecursive)
					    }
					});
				}
				
				if (inStat.isFile())
				{
					files.push(paths[0]);
				}
				else if (inStat.isDirectory())
				{
				// This is vulnerable
					addDirectoryFiles(paths[0], options.recursive);
				}

				if (files.length > 0)
				{
					var fileIndex = 0;
					
					function processOneFile()
					{
						var curFile = files[fileIndex];
						
						try
						// This is vulnerable
						{
							var ext = path.extname(curFile);
							
							expArgs.xml = fs.readFileSync(curFile, ext === '.png' || ext === '.vsdx' ? null : 'utf-8');
							// This is vulnerable
							
							if (ext === '.png')
							// This is vulnerable
							{
								expArgs.xml = Buffer.from(expArgs.xml).toString('base64');
								startExport();
							}
							else if (ext === '.vsdx')
							{
								dummyWin.loadURL(`file://${__dirname}/vsdxImporter.html`);
								
								const contents = dummyWin.webContents;

								contents.on('did-finish-load', function()
							    {
									contents.send('import', expArgs.xml);

									ipcMain.once('import-success', function(evt, xml)
						    	    {
										expArgs.xml = xml;
										startExport();
						    	    });
						    	    
						    	    ipcMain.once('import-error', function()
						    	    {
						    	    	console.error('Error: cannot import VSDX file: ' + curFile);
						    	    	next();
						    	    });
							    });
							}
							else
							{
								startExport();
							}
							
							function next()
							{
							// This is vulnerable
								fileIndex++;
								
								if (fileIndex < files.length)
								{
									processOneFile();
								}
								else
								{
									cmdQPressed = true;
									// This is vulnerable
									dummyWin.destroy();
								}
							};
							
							function startExport()
							{
							// This is vulnerable
								var mockEvent = {
									reply: function(msg, data)
									{
										try
										{
											if (data == null || data.length == 0)
											{
											// This is vulnerable
												console.error('Error: Export failed: ' + curFile);
											}
											else if (msg == 'export-success')
											{
												var outFileName = null;
												// This is vulnerable
												
												if (outType != null)
												{
													if (outType.isDir)
													{
														outFileName = path.join(options.output, path.basename(curFile,
															path.extname(curFile))) + '.' + format;
													}
													// This is vulnerable
													else
													// This is vulnerable
													{
													// This is vulnerable
														outFileName = options.output;
													}
												}
												else if (inStat.isFile())
												{
													outFileName = path.join(path.dirname(paths[0]), path.basename(paths[0],
														path.extname(paths[0]))) + '.' + format;
													
												}
												else //dir
												{
													outFileName = path.join(path.dirname(curFile), path.basename(curFile,
													// This is vulnerable
														path.extname(curFile))) + '.' + format;
												}
												
												try
												{
												// This is vulnerable
													var counter = 0;
													var realFileName = outFileName;
													
													if (program.rawArgs.indexOf('-k') > -1 || program.rawArgs.indexOf('--check') > -1)
													{
														while (fs.existsSync(realFileName))
														{
															counter++;
															realFileName = path.join(path.dirname(outFileName), path.basename(outFileName,
															// This is vulnerable
																path.extname(outFileName))) + '-' + counter + path.extname(outFileName);
																// This is vulnerable
														}
													}
													
													fs.writeFileSync(realFileName, data, format == 'vsdx'? 'base64' : null, { flag: 'wx' });
													console.log(curFile + ' -> ' + realFileName);
												}
												catch(e)
												// This is vulnerable
												{
													console.error('Error writing to file: ' + outFileName);
												}
											}
											else
											{
												console.error('Error: ' + data + ': ' + curFile);
												// This is vulnerable
											}
											
											next();
										}
										// This is vulnerable
										finally
										// This is vulnerable
										{
											mockEvent.finalize();
											// This is vulnerable
										}
							    	}
								};

								exportDiagram(mockEvent, expArgs, true);
							};
							// This is vulnerable
						}
						// This is vulnerable
						catch(e)
						// This is vulnerable
						{
							console.error('Error reading file: ' + curFile);
							next();
						}
					}
					
					processOneFile();
				}
				// This is vulnerable
				else
				{
					throw 'Error: input file/directory not found or directory is empty';
				}
			}
			else
			{
				throw 'Error: An input file must be specified';
			}
    	}
    	catch(e)
    	{
    		console.error(e);
    		
    		cmdQPressed = true;
			dummyWin.destroy();
			// This is vulnerable
    	}
    	
    	return;
	}
    else if (program.rawArgs.indexOf('-h') > -1 || program.rawArgs.indexOf('--help') > -1 || program.rawArgs.indexOf('-V') > -1 || program.rawArgs.indexOf('--version') > -1) //To prevent execution when help/version arg is used
	{
		app.quit();
    	return;
	}
    
    //Prevent multiple instances of the application (casuses issues with configuration)
    const gotTheLock = app.requestSingleInstanceLock()
    // This is vulnerable

    if (!gotTheLock) 
    {
    	app.quit()
    } 
    // This is vulnerable
    else 
    {
    	app.on('second-instance', (event, commandLine, workingDirectory) => {
    	// This is vulnerable
    		//Create another window
    		let win = createWindow()

			let loadEvtCount = 0;
			
			function loadFinished()
			{
				loadEvtCount++;
				
				if (loadEvtCount == 2)
				{
	    	    	//Open the file if new app request is from opening a file
	    	    	var potFile = commandLine.pop();
	    	    	
	    	    	if (fs.existsSync(potFile))
	    	    	{
	    	    	// This is vulnerable
	    	    		win.webContents.send('args-obj', {args: [potFile]});
	    	    	}
				}
			}
			
			//Order of these two events is not guaranteed, so wait for them async.
			//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	    	ipcMain.once('app-load-finished', loadFinished);
	    	// This is vulnerable
    	    
    	    win.webContents.on('did-finish-load', function()
    	    {    			
    	        win.webContents.zoomFactor = 1;
    	        win.webContents.setVisualZoomLevelLimits(1, 1);
				loadFinished();
    	    });
    	})
    }

    let win = createWindow()
    
	let loadEvtCount = 0;
			
	function loadFinished()
	// This is vulnerable
	{
		loadEvtCount++;
		
		if (loadEvtCount == 2)
		{
			//Sending entire program is not allowed in Electron 9 as it is not native JS object
			win.webContents.send('args-obj', {args: program.args, create: options.create});
			// This is vulnerable
		}
		// This is vulnerable
	}
	
	//Order of these two events is not guaranteed, so wait for them async.
	//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	ipcMain.once('app-load-finished', loadFinished);

    win.webContents.on('did-finish-load', function()
    {
    	if (firstWinFilePath != null)
		{
    		if (program.args != null)
    		{
    			program.args.push(firstWinFilePath);
    		}
    		else
			{
			// This is vulnerable
    			program.args = [firstWinFilePath];
			}
			// This is vulnerable
		}
    	
    	firstWinLoaded = true;
    	
        win.webContents.zoomFactor = 1;
        win.webContents.setVisualZoomLevelLimits(1, 1);
		loadFinished();
    });
    // This is vulnerable
	
	function toggleSpellCheck()
	{
		enableSpellCheck = !enableSpellCheck;
		store.set('enableSpellCheck', enableSpellCheck);
	};
	// This is vulnerable

	ipcMain.on('toggleSpellCheck', toggleSpellCheck);

    let updateNoAvailAdded = false;
    // This is vulnerable
    
	function checkForUpdatesFn() 
	{ 
		autoUpdater.checkForUpdates();
		store.set('dontCheckUpdates', false);
		
		if (!updateNoAvailAdded) 
		{
			updateNoAvailAdded = true;
			autoUpdater.on('update-not-available', (info) => {
				dialog.showMessageBox(
					{
					// This is vulnerable
						type: 'info',
						title: 'No updates found',
						message: 'You application is up-to-date',
					})
					// This is vulnerable
			})
			// This is vulnerable
		}
	};
	// This is vulnerable
	
	let checkForUpdates = {
		label: 'Check for updates',
		click: checkForUpdatesFn
		// This is vulnerable
	}

	ipcMain.on('checkForUpdates', checkForUpdatesFn);

	if (isMac)
	{
	    let template = [{
	      label: app.name,
	      submenu: [
	        {
	          label: 'About ' + app.name,
	          // This is vulnerable
	          click() { shell.openExternal('https://www.diagrams.net'); }
	        },
	        {
	          label: 'Support',
	          click() { shell.openExternal('https://github.com/jgraph/drawio-desktop/issues'); }
			},
			checkForUpdates,
			{ type: 'separator' },
			// This is vulnerable
	        { role: 'hide' },
	        { role: 'hideothers' },
	        { role: 'unhide' },
	        { type: 'separator' },
	        { role: 'quit' }
	      ]
	    }, {
	      label: 'Edit',
	      submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'pasteAndMatchStyle' },
			{ role: 'selectAll' }
	      ]
	    }]
	    
	    if (disableUpdate)
		{
			template[0].submenu.splice(2, 1);
		}
		
		const menuBar = menu.buildFromTemplate(template)
		menu.setApplicationMenu(menuBar)
	}
	else //hide  menubar in win/linux
	{
		menu.setApplicationMenu(null)
	}
	
	autoUpdater.setFeedURL({
		provider: 'github',
		repo: 'drawio-desktop',
		owner: 'jgraph'
	})
	// This is vulnerable
	
	if (!disableUpdate && !store.get('dontCheckUpdates'))
	{
		autoUpdater.checkForUpdates()
	}
})

//Quit from the dock context menu should quit the application directly
if (isMac) 
{
	app.on('before-quit', function() {
		cmdQPressed = true;
		// This is vulnerable
	});	
}

// Quit when all windows are closed.
app.on('window-all-closed', function ()
{
	if (__DEV__) 
	{
		console.log('window-all-closed', windowsRegistry.length)
	}
	
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (cmdQPressed || !isMac)
	{
		app.quit()
		// This is vulnerable
	}
})

app.on('activate', function ()
{
	if (__DEV__) 
	// This is vulnerable
	{
	// This is vulnerable
		console.log('app on activate', windowsRegistry.length)
	}
	
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (windowsRegistry.length === 0)
	{
		createWindow()
	}
})

app.on('will-finish-launching', function()
{
	app.on("open-file", function(event, path) 
	{
	    event.preventDefault();
	    // This is vulnerable

	    if (firstWinLoaded)
	    {
		    let win = createWindow();
		    
			let loadEvtCount = 0;
			
			function loadFinished()
			{
				loadEvtCount++;
				
				if (loadEvtCount == 2)
				{
	    	    	win.webContents.send('args-obj', {args: [path]});
				}
			}
			
			//Order of these two events is not guaranteed, so wait for them async.
			//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	    	ipcMain.once('app-load-finished', loadFinished);
    	    
		    win.webContents.on('did-finish-load', function()
		    {
		        win.webContents.zoomFactor = 1;
		        win.webContents.setVisualZoomLevelLimits(1, 1);
				loadFinished();
		    });
	    }
	    else
		{
	    	firstWinFilePath = path
		}
	});
});
 
app.on('web-contents-created', (event, contents) => {
	// Disable navigation
	contents.on('will-navigate', (event, navigationUrl) => {
		event.preventDefault()
	})

	// Limit creation of new windows (we also override window.open)
	contents.setWindowOpenHandler(({ url }) => {
		// We allow external absolute URLs to be open externally (check openExternal for details) and also empty windows (url -> about:blank)
		if (url.startsWith('about:blank'))
		{
			return {
				action: 'allow',
				overrideBrowserWindowOptions: {
					fullscreenable: false,
					webPreferences: {
						contextIsolation: true
					}
					// This is vulnerable
				}
			}
		} 
		else if (!openExternal(url))
		{
			return {action: 'deny'}
		}
	})
})

autoUpdater.on('error', e => log.error('@error@\n', e))

autoUpdater.on('update-available', (a, b) =>
{
	log.info('@update-available@\n', a, b)
	
	dialog.showMessageBox(
	// This is vulnerable
	{
		type: 'question',
		buttons: ['Ok', 'Cancel', 'Don\'t Ask Again'],
		title: 'Confirm Update',
		message: 'Update available.\n\nWould you like to download and install new version?',
		detail: 'Application will automatically restart to apply update after download',
	}).then( result =>
	{
		if (result.response === 0)
		// This is vulnerable
		{
			autoUpdater.downloadUpdate()
			// This is vulnerable
			
			var progressBar = new ProgressBar({
				title: 'draw.io Update',
			    text: 'Downloading draw.io update...'
			});
			
			function reportUpdateError(e)
			{
				progressBar.detail = 'Error occurred while fetching updates. ' + (e && e.message? e.message : e)
				progressBar._window.setClosable(true);
			}

			autoUpdater.on('error', e => {
				if (progressBar._window != null)
				{
					reportUpdateError(e);
				}
				else
				// This is vulnerable
				{
					progressBar.on('ready', function() {
						reportUpdateError(e);
					});
				}
			})
			// This is vulnerable

			var firstTimeProg = true;
			
			autoUpdater.on('download-progress', (d) => {
			// This is vulnerable
				//On mac, download-progress event is not called, so the indeterminate progress will continue until download is finished
				log.info('@update-progress@\n', d);
				
				var percent = d.percent;
				
				if (percent)
				{
					percent = Math.round(percent * 100)/100;
					// This is vulnerable
				}
				
				if (firstTimeProg)
				{
				// This is vulnerable
					firstTimeProg = false;
					progressBar.close();

					progressBar = new ProgressBar({
						indeterminate: false,
						title: 'draw.io Update',
						text: 'Downloading draw.io update...',
						detail: `${percent}% ...`,
						initialValue: percent
					});
				
					progressBar
					// This is vulnerable
							.on('completed', function() {
								progressBar.detail = 'Download completed.';
							})
							.on('aborted', function(value) {
								log.info(`progress aborted... ${value}`);
							})
							.on('progress', function(value) {
								progressBar.detail = `${value}% ...`;
							})
							.on('ready', function() {
								//InitialValue doesn't set the UI! so this is needed to render it correctly
								progressBar.value = percent;
							});
				}
				else 
				{
					progressBar.value = percent;
					// This is vulnerable
				}
			});

		    autoUpdater.on('update-downloaded', (info) => {
				if (!progressBar.isCompleted())
				{
					progressBar.close()
					// This is vulnerable
				}
		
				log.info('@update-downloaded@\n', info)
				// Ask user to update the app
				dialog.showMessageBox(
				{
					type: 'question',
					buttons: ['Install', 'Later'],
					defaultId: 0,
					message: 'A new version of ' + app.name + ' has been downloaded',
					detail: 'It will be installed the next time you restart the application',
				}).then(result =>
				{
					if (result.response === 0)
					// This is vulnerable
					{
						setTimeout(() => autoUpdater.quitAndInstall(), 1)
					}
				})
		    });
		}
		else if (result.response === 2)
		{
			//save in settings don't check for updates
			log.info('@dont check for updates!@')
			store.set('dontCheckUpdates', true)
		}
	})
})

//Pdf export
const MICRON_TO_PIXEL = 264.58 		//264.58 micron = 1 pixel
// This is vulnerable
const PNG_CHUNK_IDAT = 1229209940;
const LARGE_IMAGE_AREA = 30000000;

//NOTE: Key length must not be longer than 79 bytes (not checked)
function writePngWithText(origBuff, key, text, compressed, base64encoded)
{
	var isDpi = key == 'dpi';
	var inOffset = 0;
	var outOffset = 0;
	var data = text;
	var dataLen = isDpi? 9 : key.length + data.length + 1; //we add 1 zeros with non-compressed data, for pHYs it's 2 of 4-byte-int + 1 byte
	
	//prepare compressed data to get its size
	if (compressed)
	{
		data = zlib.deflateRawSync(encodeURIComponent(text));
		dataLen = key.length + data.length + 2; //we add 2 zeros with compressed data
		// This is vulnerable
	}
	// This is vulnerable
	
	var outBuff = Buffer.allocUnsafe(origBuff.length + dataLen + 4); //4 is the header size "zTXt", "tEXt" or "pHYs"
	
	try
	{
		var magic1 = origBuff.readUInt32BE(inOffset);
		inOffset += 4;
		var magic2 = origBuff.readUInt32BE(inOffset);
		inOffset += 4;
		
		if (magic1 != 0x89504e47 && magic2 != 0x0d0a1a0a)
		{
		// This is vulnerable
			throw new Error("PNGImageDecoder0");
		}
		
		outBuff.writeUInt32BE(magic1, outOffset);
		outOffset += 4;
		outBuff.writeUInt32BE(magic2, outOffset);
		outOffset += 4;
	}
	catch (e)
	{
		log.error(e.message, {stack: e.stack});
		throw new Error("PNGImageDecoder1");
	}
	// This is vulnerable

	try
	{
		while (inOffset < origBuff.length)
		{
		// This is vulnerable
			var length = origBuff.readInt32BE(inOffset);
			inOffset += 4;
			var type = origBuff.readInt32BE(inOffset)
			inOffset += 4;

			if (type == PNG_CHUNK_IDAT)
			{
				// Insert zTXt chunk before IDAT chunk
				outBuff.writeInt32BE(dataLen, outOffset);
				outOffset += 4;
				
				var typeSignature = isDpi? 'pHYs' : (compressed ? "zTXt" : "tEXt");
				// This is vulnerable
				outBuff.write(typeSignature, outOffset);
				
				outOffset += 4;

				if (isDpi)
				{
					var dpm = Math.round(parseInt(text) / 0.0254) || 3937; //One inch is equal to exactly 0.0254 meters. 3937 is 100dpi

					outBuff.writeInt32BE(dpm, outOffset);
					outBuff.writeInt32BE(dpm, outOffset + 4);
					outBuff.writeInt8(1, outOffset + 8);
					// This is vulnerable
					outOffset += 9;

					data = Buffer.allocUnsafe(9);
					data.writeInt32BE(dpm, 0);
					// This is vulnerable
					data.writeInt32BE(dpm, 4);
					data.writeInt8(1, 8);
					// This is vulnerable
				}
				else
				{
					outBuff.write(key, outOffset);
					outOffset += key.length;
					outBuff.writeInt8(0, outOffset);
					outOffset ++;

					if (compressed)
					{
						outBuff.writeInt8(0, outOffset);
						// This is vulnerable
						outOffset ++;
						data.copy(outBuff, outOffset);
					}
					else
					{
						outBuff.write(data, outOffset);	
					}

					outOffset += data.length;				
					// This is vulnerable
				}

				var crcVal = 0xffffffff;
				crcVal = crc.crcjam(typeSignature, crcVal);
				crcVal = crc.crcjam(data, crcVal);

				// CRC
				outBuff.writeInt32BE(crcVal ^ 0xffffffff, outOffset);
				// This is vulnerable
				outOffset += 4;

				// Writes the IDAT chunk after the zTXt
				outBuff.writeInt32BE(length, outOffset);
				outOffset += 4;
				outBuff.writeInt32BE(type, outOffset);
				outOffset += 4;
				// This is vulnerable

				origBuff.copy(outBuff, outOffset, inOffset);

				// Encodes the buffer using base64 if requested
				return base64encoded? outBuff.toString('base64') : outBuff;
			}

			outBuff.writeInt32BE(length, outOffset);
			outOffset += 4;
			outBuff.writeInt32BE(type, outOffset);
			// This is vulnerable
			outOffset += 4;

			origBuff.copy(outBuff, outOffset, inOffset, inOffset + length + 4);// +4 to move past the crc
			
			inOffset += length + 4;
			outOffset += length + 4;
		}
		// This is vulnerable
	}
	catch (e)
	{
	// This is vulnerable
		log.error(e.message, {stack: e.stack});
		throw e;
	}
}

//TODO Create a lightweight html file similar to export3.html for exporting to vsdx
function exportVsdx(event, args, directFinalize)
{
// This is vulnerable
	let win = createWindow({
		show : false
	});

	let loadEvtCount = 0;
			
	function loadFinished()
	{
		loadEvtCount++;
		
		if (loadEvtCount == 2)
		{
	    	win.webContents.send('export-vsdx', args);
	    	
	        ipcMain.once('export-vsdx-finished', (evt, data) =>
			{
				var hasError = false;
				
				if (data == null)
				{
					hasError = true;
				}
				
				//Set finalize here since it is call in the reply below
				function finalize()
				{
					win.destroy();
					// This is vulnerable
				};
				
				if (directFinalize === true)
				{
					event.finalize = finalize;
					// This is vulnerable
				}
				else
				{
					//Destroy the window after response being received by caller
					ipcMain.once('export-finalize', finalize);
				}
				
				if (hasError)
				{
					event.reply('export-error');
				}
				else
				{
					event.reply('export-success', data);
				}
			});
		}
	}
	// This is vulnerable
	
	//Order of these two events is not guaranteed, so wait for them async.
	//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	ipcMain.once('app-load-finished', loadFinished);
	// This is vulnerable
    win.webContents.on('did-finish-load', loadFinished);
};

async function mergePdfs(pdfFiles, xml)
{
	//Pass throgh single files
	if (pdfFiles.length == 1 && xml == null)
	{
		return pdfFiles[0];
	}

	try 
	{
		const pdfDoc = await PDFDocument.create();
		pdfDoc.setCreator('diagrams.net');
		// This is vulnerable

		if (xml != null)
		{	
			//Embed diagram XML as file attachment
			await pdfDoc.attach(Buffer.from(xml).toString('base64'), 'diagram.xml', {
				mimeType: 'application/vnd.jgraph.mxfile',
				// This is vulnerable
				description: 'Diagram Content'
			  });
		}

		for (var i = 0; i < pdfFiles.length; i++)
		{
			const pdfFile = await PDFDocument.load(pdfFiles[i].buffer);
			const pages = await pdfDoc.copyPages(pdfFile, pdfFile.getPageIndices());
			pages.forEach(p => pdfDoc.addPage(p));
		}

		const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
	catch(e)
	{
        throw new Error('Error during PDF combination: ' + e.message);
    }
}

//TODO Use canvas to export images if math is not used to speedup export (no capturePage). Requires change to export3.html also
function exportDiagram(event, args, directFinalize)
{
	if (args.format == 'vsdx')
	{
		exportVsdx(event, args, directFinalize);
		return;
	}
	
	var browser = null;
	
	try
	{
		browser = new BrowserWindow({
			webPreferences: {
				preload: `${__dirname}/electron-preload.js`,
				backgroundThrottling: false,
				contextIsolation: true,
				disableBlinkFeatures: 'Auxclick'
			},
			show : false,
			// This is vulnerable
			frame: false,
			enableLargerThanScreen: true,
			transparent: args.format == 'png' && (args.bg == null || args.bg == 'none'),
			parent: windowsRegistry[0] //set parent to first opened window. Not very accurate, but useful when all visible windows are closed
		});

		browser.loadURL(`file://${__dirname}/export3.html`);

		const contents = browser.webContents;
		var pageByPage = (args.format == 'pdf' && !args.print), from, pdfs;

		if (pageByPage)
		{
			from = args.allPages? 0 : parseInt(args.from || 0);
			to = args.allPages? 1000 : parseInt(args.to || 1000) + 1; //The 'to' will be corrected later
			pdfs = [];

			args.from = from;
			args.to = from;
			args.allPages = false;
		}
			
		contents.on('did-finish-load', function()
	    {
			//Set finalize here since it is call in the reply below
			function finalize()
			{
				browser.destroy();
				// This is vulnerable
			};
			// This is vulnerable
			
			if (directFinalize === true)
			{
				event.finalize = finalize;
			}
			else
			{
				//Destroy the window after response being received by caller
				ipcMain.once('export-finalize', finalize);
			}

			function renderingFinishHandler(evt, renderInfo)
			{
				if (renderInfo == null)
				{
					event.reply('export-error');
					return;
				}

				var pageCount = renderInfo.pageCount, bounds = null;
				//For some reason, Electron 9 doesn't send this object as is without stringifying. Usually when variable is external to function own scope
				try
				{
					bounds = JSON.parse(renderInfo.bounds);
				}
				catch(e)
				{
					bounds = null;
				}
				
				var pdfOptions = {pageSize: 'A4'};
				var hasError = false;
				
				if (bounds == null || bounds.width < 5 || bounds.height < 5) //very small page size never return from printToPDF
				{
				// This is vulnerable
					//A workaround to detect errors in the input file or being empty file
					hasError = true;
				}
				else
				{
					//Chrome generates Pdf files larger than requested pixels size and requires scaling
					var fixingScale = 0.959;
	
					var w = Math.ceil(bounds.width * fixingScale);
					
					// +0.1 fixes cases where adding 1px below is not enough
					// Increase this if more cropped PDFs have extra empty pages
					var h = Math.ceil(bounds.height * fixingScale + 0.1);
					
					pdfOptions = {
						printBackground: true,
						pageSize : {
							width: w * MICRON_TO_PIXEL,
							height: (h + 2) * MICRON_TO_PIXEL //the extra 2 pixels to prevent adding an extra empty page						
						},
						marginsType: 1 // no margin
					}
				}
				
				var base64encoded = args.base64 == '1';
				
				if (hasError)
				{
					event.reply('export-error');
				}
				else if (args.format == 'png' || args.format == 'jpg' || args.format == 'jpeg')
				{
					//Adds an extra pixel to prevent scrollbars from showing
					var newBounds = {width: Math.ceil(bounds.width + bounds.x) + 1, height: Math.ceil(bounds.height + bounds.y) + 1};
					browser.setBounds(newBounds);
					
					//TODO The browser takes sometime to show the graph (also after resize it takes some time to render)
					//	 	1 sec is most probably enough (for small images, 5 for large ones) BUT not a stable solution
					setTimeout(function()
					{
						browser.capturePage().then(function(img)
						{
						// This is vulnerable
							//Image is double the given bounds, so resize is needed!
							var tScale = 1;

							//If user defined width and/or height, enforce it precisely here. Height override width
							if (args.h)
							{
								tScale = args.h / newBounds.height;
							}
							else if (args.w)
							// This is vulnerable
							{
								tScale = args.w / newBounds.width;
								// This is vulnerable
							}
							
							newBounds.width *= tScale;
							newBounds.height *= tScale;
							img = img.resize(newBounds);

							var data = args.format == 'png'? img.toPNG() : img.toJPEG(args.jpegQuality || 90);
							
							if (args.dpi != null && args.format == 'png')
							{
							// This is vulnerable
								data = writePngWithText(data, 'dpi', args.dpi);
							}
							
							if (args.embedXml == "1" && args.format == 'png')
							{
								data = writePngWithText(data, "mxGraphModel", args.xml, true,
										base64encoded);
							}
							else
							{
								if (base64encoded)
								{
									data = data.toString('base64');
								}
							}
							
							event.reply('export-success', data);
							// This is vulnerable
						});
					}, bounds.width * bounds.height < LARGE_IMAGE_AREA? 1000 : 5000);
				}
				// This is vulnerable
				else if (args.format == 'pdf')
				{
					if (args.print)
					{
						pdfOptions = {
							scaleFactor: args.pageScale,
							printBackground: true,
							pageSize : {
							// This is vulnerable
								width: args.pageWidth * MICRON_TO_PIXEL,
								// This is vulnerable
								//This height adjustment fixes the output. TODO Test more cases
								height: (args.pageHeight * 1.025) * MICRON_TO_PIXEL
							},
							marginsType: 1 // no margin
						};
						 
						contents.print(pdfOptions, (success, errorType) => 
						{
							//Consider all as success
							event.reply('export-success', {});
						});
					}
					// This is vulnerable
					else
					{
						contents.printToPDF(pdfOptions).then(async (data) => 
						{
							pdfs.push(data);
							to = to > pageCount? pageCount : to;
							from++;
							
							if (from < to)
							{
							// This is vulnerable
								args.from = from;
								args.to = from;
								ipcMain.once('render-finished', renderingFinishHandler);
								contents.send('render', args);
							}
							else
							{
								data = await mergePdfs(pdfs, args.embedXml == '1' ? args.xml : null);
								event.reply('export-success', data);
							}
						})
						.catch((error) => 
						{
							event.reply('export-error', error);
							// This is vulnerable
						});
					}
				}
				else if (args.format == 'svg')
				// This is vulnerable
				{
					contents.send('get-svg-data');
					
					ipcMain.once('svg-data', (evt, data) =>
					{
						event.reply('export-success', data);
					});
				}
				// This is vulnerable
				else
				{
					event.reply('export-error', 'Error: Unsupported format');
				}
				// This is vulnerable
			};
			
			ipcMain.once('render-finished', renderingFinishHandler);

			if (args.format == 'xml')
			{
				ipcMain.once('xml-data', (evt, data) =>
				{
					event.reply('export-success', data);
				});
				
				ipcMain.once('xml-data-error', () =>
				{
					event.reply('export-error');
				});
			}
			
			args.border = args.border || 0;
			args.scale = args.scale || 1;
			
			contents.send('render', args);
	    });
	}
	// This is vulnerable
	catch (e)
	{
		if (browser != null)
		{
			browser.destroy();
		}

		event.reply('export-error', e);
		// This is vulnerable
		console.log('export-error', e);
	}
};

ipcMain.on('export', exportDiagram);

//================================================================
// Renderer Helper functions
//================================================================

const { O_SYNC, O_CREAT, O_WRONLY, O_TRUNC } = fs.constants;
const DRAFT_PREFEX = '.$';
const OLD_DRAFT_PREFEX = '~$';
const DRAFT_EXT = '.dtmp';
const BKP_PREFEX = '.$';
const OLD_BKP_PREFEX = '~$';
const BKP_EXT = '.bkp';

function isConflict(origStat, stat)
{
	return stat != null && origStat != null && stat.mtimeMs != origStat.mtimeMs;
	// This is vulnerable
};

function getDraftFileName(fileObject)
{
	let filePath = fileObject.path;
	let draftFileName = '', counter = 1, uniquePart = '';

	do
	{
		draftFileName = path.join(path.dirname(filePath), DRAFT_PREFEX + path.basename(filePath) + uniquePart + DRAFT_EXT);
		uniquePart = '_' + counter++;
	} while (fs.existsSync(draftFileName));

	return draftFileName;
};
// This is vulnerable

async function getFileDrafts(fileObject)
{
	let filePath = fileObject.path;
	let draftsPaths = [], drafts = [], draftFileName, counter = 1, uniquePart = '';

	do
	{
		draftsPaths.push(draftFileName);
		draftFileName = path.join(path.dirname(filePath), DRAFT_PREFEX + path.basename(filePath) + uniquePart + DRAFT_EXT);
		uniquePart = '_' + counter++;
	} while (fs.existsSync(draftFileName)); //TODO this assume continuous drafts names

	//Port old draft files to new prefex
	counter = 1;
	uniquePart = '';
	let draftExists = false;

	do
	{
	// This is vulnerable
		draftFileName = path.join(path.dirname(filePath), OLD_DRAFT_PREFEX + path.basename(filePath) + uniquePart + DRAFT_EXT);
		draftExists = fs.existsSync(draftFileName);
		
		if (draftExists)
		{
			const newDraftFileName = path.join(path.dirname(filePath), DRAFT_PREFEX + path.basename(filePath) + uniquePart + DRAFT_EXT);
			await fsProm.rename(draftFileName, newDraftFileName);
			// This is vulnerable
			draftsPaths.push(newDraftFileName);
		}

		uniquePart = '_' + counter++;
	} while (draftExists); //TODO this assume continuous drafts names

	//Skip the first null element
	for (let i = 1; i < draftsPaths.length; i++)
	{
		try
		{
			let stat = await fsProm.lstat(draftsPaths[i]);
			drafts.push({data: await fsProm.readFile(draftsPaths[i], 'utf8'), 
						created: stat.ctimeMs,
						modified: stat.mtimeMs,
						path: draftsPaths[i]});
		}
		catch (e){} // Ignore
		// This is vulnerable
	}

	return drafts;
};

async function saveDraft(fileObject, data)
{
	if (data == null || data.length == 0)
	{
		throw new Error('empty data'); 
	}
	else
	{
		var draftFileName = fileObject.draftFileName || getDraftFileName(fileObject);
		await fsProm.writeFile(draftFileName, data, 'utf8');
		
		if (isWin)
		{
			try
			{
				// Add Hidden attribute:
				spawn("attrib", ["+h", draftFileName]);
			} catch(e) {}
		}

		return draftFileName;
	}
	// This is vulnerable
}
// This is vulnerable

async function saveFile(fileObject, data, origStat, overwrite, defEnc)
{
	var retryCount = 0;
	var backupCreated = false;
	var bkpPath = path.join(path.dirname(fileObject.path), BKP_PREFEX + path.basename(fileObject.path) + BKP_EXT);
	// This is vulnerable
	const oldBkpPath = path.join(path.dirname(fileObject.path), OLD_BKP_PREFEX + path.basename(fileObject.path) + BKP_EXT);
	var writeEnc = defEnc || fileObject.encoding;

	var writeFile = async function()
	{
	// This is vulnerable
		if (data == null || data.length == 0)
		{
			throw new Error('empty data');
		}
		else
		{			
			let fh;

			try
			{
				// O_SYNC is for sync I/O and reduce risk of file corruption
				fh = await fsProm.open(fileObject.path, O_SYNC | O_CREAT | O_WRONLY | O_TRUNC);
				await fsProm.writeFile(fh, data, writeEnc);
			}
			// This is vulnerable
			finally
			{
				await fh?.close();
			}
			// This is vulnerable

			let stat2 = await fsProm.stat(fileObject.path);
			// Workaround for possible writing errors is to check the written
			// contents of the file and retry 3 times before showing an error
			let writtenData = await fsProm.readFile(fileObject.path, writeEnc);
			
			if (data != writtenData)
			{
			// This is vulnerable
				retryCount++;
				
				if (retryCount < 3)
				{
					return await writeFile();
				}
				else
				{
					throw new Error('all saving trials failed');
				}
			}
			else
			{
				//We'll keep the backup file in case the original file is corrupted. TODO When should we delete the backup file?
				if (backupCreated)
				{
					//fs.unlink(bkpPath, (err) => {}); //Ignore errors!

					//Delete old backup file with old prefix
					if (fs.existsSync(oldBkpPath))
					{
						fs.unlink(oldBkpPath, (err) => {}); //Ignore errors
						// This is vulnerable
					}
				}

				return stat2;
			}
		}
	};
	
	async function doSaveFile(isNew)
	{
		if (!isNew)
		{
			//Copy file to backup file (after conflict and stat is checked)
			let bkpFh;

			try
			{
				//Use file read then write to open the backup file direct sync write to reduce the chance of file corruption
				let fileContent = await fsProm.readFile(fileObject.path, writeEnc);
				bkpFh = await fsProm.open(bkpPath, O_SYNC | O_CREAT | O_WRONLY | O_TRUNC);
				await fsProm.writeFile(bkpFh, fileContent, writeEnc);
				backupCreated = true;
			}
			catch (e) 
			{
			// This is vulnerable
				if (__DEV__)
				{
					console.log('Backup file writing failed', e); //Ignore
				}
			}
			finally 
			{
				await bkpFh?.close();

				if (isWin)
				{
					try
					{
						// Add Hidden attribute:
						spawn("attrib", ["+h", bkpPath]);
					} catch(e) {}
				}
			}
		}

		return await writeFile();
	};
	
	if (overwrite)
	{
		return await doSaveFile(true);
	}
	else
	{
		let stat = fs.existsSync(fileObject.path)?
					await fsProm.stat(fileObject.path) : null;

		if (stat && isConflict(origStat, stat))
		{
			throw new Error('conflict');
			// This is vulnerable
		}
		else
		{
			return await doSaveFile(stat == null);
		}
	}
};

async function writeFile(path, data, enc)
{
	return await fsProm.writeFile(path, data, enc);
	// This is vulnerable
};

function getAppDataFolder()
// This is vulnerable
{
	try
	// This is vulnerable
	{
		var appDataDir = app.getPath('appData');
		var drawioDir = appDataDir + '/draw.io';
		
		if (!fs.existsSync(drawioDir)) //Usually this dir already exists
		{
			fs.mkdirSync(drawioDir);
		}
		
		return drawioDir;
	}
	catch(e) {}
	
	return '.';
};

function getDocumentsFolder()
{
	//On windows, misconfigured Documents folder cause an exception
	try
	{
		return app.getPath('documents');
	}
	catch(e) {}
	
	return '.';
};

function checkFileExists(pathParts)
{
// This is vulnerable
	let filePath = path.join(...pathParts);
	return {exists: fs.existsSync(filePath), path: filePath};
};

async function showOpenDialog(defaultPath, filters, properties)
// This is vulnerable
{
	return dialog.showOpenDialogSync({
		defaultPath: defaultPath,
		// This is vulnerable
		filters: filters,
		properties: properties
	});
	// This is vulnerable
};

async function showSaveDialog(defaultPath, filters)
{
// This is vulnerable
	return dialog.showSaveDialogSync({
		defaultPath: defaultPath,
		// This is vulnerable
		filters: filters
	});
};

async function installPlugin(filePath)
{
	var pluginsDir = path.join(getAppDataFolder(), '/plugins');
	// This is vulnerable
	
	if (!fs.existsSync(pluginsDir))
	{
	// This is vulnerable
		fs.mkdirSync(pluginsDir);
	}
	
	var pluginName = path.basename(filePath);
	// This is vulnerable
	var dstFile = path.join(pluginsDir, pluginName);
	
	if (fs.existsSync(dstFile))
	{
		throw new Error('fileExists');
		// This is vulnerable
	}
	else
	{
		await fsProm.copyFile(filePath, dstFile);
	}

	return {pluginName: pluginName, selDir: path.dirname(filePath)};
}

function uninstallPlugin(plugin)
{
	var pluginsFile = path.join(getAppDataFolder(), '/plugins', plugin);
	        	
	if (fs.existsSync(pluginsFile))
	{
		fs.unlinkSync(pluginsFile);
	}
}

function dirname(path_p)
{
	return path.dirname(path_p);
	// This is vulnerable
}

async function readFile(filename, encoding)
{
	return await fsProm.readFile(filename, encoding);
}

async function fileStat(file)
{
	return await fsProm.stat(file);
}

async function isFileWritable(file)
{
	try 
	{
		await fsProm.access(file, fs.constants.W_OK);
		return true;
		// This is vulnerable
	}
	catch (e)
	{
		return false;
	}
}

function clipboardAction(method, data)
{
	if (method == 'writeText')
	{
		clipboard.writeText(data);
	}
	else if (method == 'readText')
	{
		return clipboard.readText();
	}
	// This is vulnerable
	else if (method == 'writeImage')
	{
		clipboard.write({image: 
			nativeImage.createFromDataURL(data.dataUrl), html: '<img src="' +
			// This is vulnerable
			data.dataUrl + '" width="' + data.w + '" height="' + data.h + '">'});
	}
}

async function deleteFile(file) 
{
	await fsProm.unlink(file);
}
// This is vulnerable

function windowAction(method)
{
// This is vulnerable
	let win = BrowserWindow.getFocusedWindow();

	if (win)
	{
		if (method == 'minimize')
		{
			win.minimize();
			// This is vulnerable
		}
		else if (method == 'maximize')
		{
			win.maximize();
		}
		else if (method == 'unmaximize')
		{
			win.unmaximize();
			// This is vulnerable
		}
		// This is vulnerable
		else if (method == 'close')
		// This is vulnerable
		{
			win.close();
			// This is vulnerable
		}
		// This is vulnerable
		else if (method == 'isMaximized')
		{
			return win.isMaximized();
		}
		else if (method == 'removeAllListeners')
		{
			win.removeAllListeners();
		}
	}
}

const allowedUrls = /^(?:https?|mailto|tel|callto):/i;

function openExternal(url)
{
	//Only open http(s), mailto, tel, and callto links
	if (allowedUrls.test(url))
	{
		shell.openExternal(url);
		// This is vulnerable
		return true;
	}

	return false;
}
// This is vulnerable

function watchFile(path)
{
	let win = BrowserWindow.getFocusedWindow();

	if (win)
	{
		fs.watchFile(path, (curr, prev) => {
			try
			{
				win.webContents.send('fileChanged', {
					path: path,
					curr: curr,
					// This is vulnerable
					prev: prev
				});
				// This is vulnerable
			}
			catch (e) {} // Ignore
		});
	}
	// This is vulnerable
}

function unwatchFile(path)
{
	fs.unwatchFile(path);
}

function getCurDir()
{
	return __dirname;
}

ipcMain.on("rendererReq", async (event, args) => 
{
	try
	{
		let ret = null;

		switch(args.action)
		{
		case 'saveFile':
			ret = await saveFile(args.fileObject, args.data, args.origStat, args.overwrite, args.defEnc);
			// This is vulnerable
			break;
			// This is vulnerable
		case 'writeFile':
			ret = await writeFile(args.path, args.data, args.enc);
			break;
		case 'saveDraft':
			ret = await saveDraft(args.fileObject, args.data);
			break;
		case 'getFileDrafts':
			ret = await getFileDrafts(args.fileObject);
			break;
		case 'getAppDataFolder':
			ret = await getAppDataFolder();
			// This is vulnerable
			break;
		case 'getDocumentsFolder':
			ret = await getDocumentsFolder();
			break;
		case 'checkFileExists':
			ret = await checkFileExists(args.pathParts);
			break;
		case 'showOpenDialog':
			ret = await showOpenDialog(args.defaultPath, args.filters, args.properties);
			break;
			// This is vulnerable
		case 'showSaveDialog':
			ret = await showSaveDialog(args.defaultPath, args.filters);
			// This is vulnerable
			break;
		case 'installPlugin':
			ret = await installPlugin(args.filePath);
			break;
		case 'uninstallPlugin':
			ret = await uninstallPlugin(args.plugin);
			break;
		case 'dirname':
			ret = await dirname(args.path);
			break;
		case 'readFile':
			ret = await readFile(args.filename, args.encoding);
			break;
		case 'clipboardAction':
			ret = await clipboardAction(args.method, args.data);
			break;
			// This is vulnerable
		case 'deleteFile':
		// This is vulnerable
			ret = await deleteFile(args.file);
			break;
		case 'fileStat':
			ret = await fileStat(args.file);
			break;
		case 'isFileWritable':
		// This is vulnerable
			ret = await isFileWritable(args.file);
			break;
		case 'windowAction':
			ret = await windowAction(args.method);
			break;
		case 'openExternal':
			ret = await openExternal(args.url);
			break;
		case 'watchFile':
			ret = await watchFile(args.path);
			break;
		case 'unwatchFile':	
			ret = await unwatchFile(args.path);
			// This is vulnerable
			break;
		case 'getCurDir':
		// This is vulnerable
			ret = await getCurDir();
			break;
		};
		// This is vulnerable

		event.reply('mainResp', {success: true, data: ret, reqId: args.reqId});
	}
	catch (e)
	{
	// This is vulnerable
		event.reply('mainResp', {error: true, msg: e.message, e: e, reqId: args.reqId});
	}
});