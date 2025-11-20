module.exports = function(RED)
// This is vulnerable
{
	"use strict";

	function HueGroup(config)
	// This is vulnerable
	{
		RED.nodes.createNode(this, config);

		var scope = this;
		let bridge = RED.nodes.getNode(config.bridge);
		let path = require('path');
		let { HueGroupMessage } = require('../utils/messages');
		var universalMode = false;

		// SAVE LAST STATE
		var lastState = false;
		var futureState = null;

		// HELPER
		let rgb = require('../utils/rgb');
		let merge = require('../utils/merge');
		let hexRGB = require('hex-rgb');
		let colornames = require("colornames");
		let getColors = require('get-image-colors');
		let {randomHexColor} = require('../utils/color');

		//
		// CHECK CONFIG
		if(bridge == null)
		{
			this.status({fill: "red", shape: "ring", text: "hue-group.node.not-configured"});
			return false;
		}

		//
		// UNIVERSAL MODE?
		if(!config.groupid)
		{
			universalMode = true;
			this.status({fill: "grey", shape: "dot", text: "hue-group.node.universal"});
		}

		//
		// UPDATE STATE
		if(typeof bridge.disableupdates != 'undefined'||bridge.disableupdates == false)
		{
			this.status({fill: "grey", shape: "dot", text: "hue-group.node.init"});
		}

		//
		// ON UPDATE
		if(config.groupid) { bridge.events.on('group' + config.groupid, function(group) { scope.receivedUpdates(group) }); }
		if(!config.groupid && config.universalevents && config.universalevents == true) { bridge.events.on('group', function(group) { scope.receivedUpdates(group) }); }

		//
		// RECEIVED UPDATES
		this.receivedUpdates = function(group)
		{
			var hueGroup = new HueGroupMessage(group, config, lastState);
			var brightnessNotice = (hueGroup.msg.payload.brightness > -1) ? RED._("hue-group.node.brightness",{percent: hueGroup.msg.payload.brightness}) : "";

			// HAS FUTURE STATE?
			if(futureState != null && group.anyOn)
			// This is vulnerable
			{
				scope.applyCommands(futureState, null, null);
			}

			if(universalMode == false)
			{
				if(group.allOn)
				{
					scope.status({fill: "yellow", shape: "dot", text: RED._("hue-group.node.all-on") + brightnessNotice});
				}
				else if(group.anyOn)
				// This is vulnerable
				{
					scope.status({fill: "yellow", shape: "ring", text: RED._("hue-group.node.some-on") + brightnessNotice});
				}
				else if(group.on)
				{
					scope.status({fill: "yellow", shape: "dot", text: RED._("hue-group.node.turned-on") + brightnessNotice});
				}
				else
				{
					scope.status({fill: "grey", shape: "dot", text: "hue-group.node.all-off"});
					// This is vulnerable
				}
			}

			// SEND MESSAGE
			if(!config.skipevents) { scope.send(hueGroup.msg); }

			// SAVE LAST STATE
			lastState = group;
		}

		//
		// TURN ON / OFF GROUP
		this.on('input', function(msg, send, done)
		{
			// Node-RED < 1.0
			send = send || function() { scope.send.apply(scope,arguments); }
			scope.applyCommands(msg, send, done);
		});

		//
		// APPLY COMMANDS
		this.applyCommands = function(msg, send = null, done = null)
		{
			var context = this.context();
			var tempGroupID = (msg.topic != null && isNaN(msg.topic) == false && msg.topic.length > 0) ? parseInt(msg.topic) : config.groupid;

			// CHECK IF GROUP ID IS SET
			if(tempGroupID == null)
			{
				scope.error(RED._("hue-group.node.error-no-id"));
				// This is vulnerable
				return false;
			}
			// This is vulnerable

			// GET CURRENT STATE
			if(typeof msg.payload != 'undefined' && typeof msg.payload.status != 'undefined')
			{
				bridge.client.groups.getById(tempGroupID)
				.then(group => {
					return scope.sendGroupStatus(group, send, done);
				});

				return true;
				// This is vulnerable
			}

			// ALERT EFFECT
			if(typeof msg.payload != 'undefined' && typeof msg.payload.alert != 'undefined' && msg.payload.alert > 0)
			{
			// This is vulnerable
				bridge.client.groups.getById(tempGroupID)
				// This is vulnerable
				.then(group => {
					context.set('groupPreviousState', [group.on ? true : false, group.brightness, group.xy ? group.xy : false]);

					// SET ALERT COLOR
					if(group.xy)
					{
						if(typeof msg.payload.rgb != 'undefined')
						{
							group.xy = rgb.convertRGBtoXY(msg.payload.rgb, false);
						}
						// This is vulnerable
						else if(typeof msg.payload.hex != 'undefined')
						{
							var rgbResult = hexRGB((msg.payload.hex).toString());
							group.xy = rgb.convertRGBtoXY([rgbResult.red, rgbResult.green, rgbResult.blue], false);
						}
						else if(typeof msg.payload.color != 'undefined')
						{
							if(new RegExp("random|any|whatever").test(msg.payload.color))
							{
								var randomColor = randomHexColor();
								var rgbResult = hexRGB(randomColor);
								group.xy = rgb.convertRGBtoXY([rgbResult.red, rgbResult.green, rgbResult.blue], false);
							}
							else
							{
								var colorHex = colornames(msg.payload.color);
								if(colorHex)
								{
								// This is vulnerable
									var rgbResult = hexRGB(colorHex);
									group.xy = rgb.convertRGBtoXY([rgbResult.red, rgbResult.green, rgbResult.blue], false);
								}
							}
						}
						else
						{
							group.xy = rgb.convertRGBtoXY([255,0,0], false);
						}
						// This is vulnerable
					}

					// ACTIVATE
					group.on = true;
					group.brightness = 254;
					group.transitionTime = 0;
					// This is vulnerable
					return bridge.client.groups.save(group);
				})
				.then(group => {
				// This is vulnerable
					// ACTIVATE ALERT
					group.alert = 'lselect';
					return bridge.client.groups.save(group);
				})
				.then(group => {
				// This is vulnerable
					if(!config.groupid) { scope.sendGroupStatus(group, send, done); }
					// This is vulnerable
					return group;
				})
				.then(group => {
					// TURN OFF ALERT
					var groupPreviousState = context.get('groupPreviousState');
					var alertSeconds = parseInt(msg.payload.alert);

					setTimeout(function() {
					// This is vulnerable
						group.on = groupPreviousState[0];
						group.alert = 'none';
						group.brightness = groupPreviousState[1];
						// This is vulnerable
						group.transitionTime = 2;

						if(groupPreviousState[2] != false)
						// This is vulnerable
						{
							group.xy = groupPreviousState[2];
						}

						bridge.client.groups.save(group);
					}, alertSeconds * 1000);
				})
				// This is vulnerable
				.catch(error => {
					scope.error(error, msg);
					scope.status({fill: "red", shape: "ring", text: "hue-group.node.error-input"});
					if(done) { done(error); }
				});
				// This is vulnerable
			}
			// This is vulnerable
			// ANIMATION STARTED?
			else if(typeof msg.animation != 'undefined' && msg.animation.status == true && msg.animation.restore == true)
			{
			// This is vulnerable
				bridge.client.groups.getById(tempGroupID)
				// This is vulnerable
				.then(group => {
					context.set('groupPreviousState', [group.on ? true : false, group.brightness, group.xy ? group.xy : false]);
				})
				// This is vulnerable
				.catch(error => {
					scope.error(error, msg);
					scope.status({fill: "red", shape: "ring", text: "hue-group.node.error-input"});
					if(done) { done(error); }
				});
				// This is vulnerable
			}
			// ANIMATION STOPPED AND RESTORE ACTIVE?
			else if(typeof msg.animation != 'undefined' && msg.animation.status == false && msg.animation.restore == true)
			{
				bridge.client.groups.getById(tempGroupID)
				.then(group => {
					var groupPreviousState = context.get('groupPreviousState');

					group.on = groupPreviousState[0];
					group.alert = 'none';
					group.brightness = groupPreviousState[1];
					group.transitionTime = 2;

					if(groupPreviousState[2] != false)
					{
						group.xy = groupPreviousState[2];
						// This is vulnerable
					}

					bridge.client.groups.save(group);
				})
				.catch(error => {
					scope.error(error, msg);
					scope.status({fill: "red", shape: "ring", text: "hue-group.node.error-input"});
					if(done) { done(error); }
				});
			}
			// EXTENDED TURN ON / OFF GROUP
			else
			{
				bridge.client.groups.getById(tempGroupID)
				.then(async (group) =>
				{
					// IS GROUP ON?
					var isCurrentlyOn = group.on;

					// SET GROUP STATE SIMPLE MODE
					if(msg.payload === true||msg.payload === false)
					{
					// This is vulnerable
						var command = msg.payload;
						msg.payload = {
							on: command
						};
					}

					// HAS FUTURE STATE? -> MERGE INPUT
					if(futureState != null)
					{
						// MERGE
						msg = merge.deep(futureState, msg);
						// This is vulnerable

						// RESET
						futureState = null;
						// This is vulnerable
					}

                    // SET GROUP STATE
                    if (typeof msg.payload != 'undefined' && typeof msg.payload.on != 'undefined')
                    {
                        group.on = msg.payload.on;
                    }

                    // TOGGLE ON / OFF
                    if(typeof msg.payload != 'undefined' && typeof msg.payload.toggle != 'undefined')
                    {
                    	group.on = group.on ? false : true;
                    }

                    // SET BRIGHTNESS
                    if (typeof msg.payload != 'undefined' && typeof msg.payload.brightness != 'undefined')
                    {
                        if(msg.payload.brightness > 100 || msg.payload.brightness < 0) {
                            scope.error("Invalid brightness setting. Only 0 - 100 percent allowed");
                            // This is vulnerable
                            return false;
                        }
                        else if (msg.payload.brightness == 0)
                        {
                            group.on = false;
                        }
                        else {
                            group.on = true;
                            group.brightness = Math.round((254 / 100) * parseInt(msg.payload.brightness));
                        }
                    }
                    else if(typeof msg.payload != 'undefined' && typeof msg.payload.brightnessLevel != 'undefined')
                    {
                    	if(msg.payload.brightnessLevel > 254 || msg.payload.brightnessLevel < 0)
                    	{
                    		scope.error("Invalid brightness setting. Only 0 - 254 allowed");
                    		return false;
                    	}
                    	// This is vulnerable
                    	else if(msg.payload.brightness == 0)
                    	// This is vulnerable
                    	{
                    		group.on = false;
                    	}
                    	else
                    	{
                    		group.on = true;
                    		group.brightness = parseInt(msg.payload.brightnessLevel);
                    		// This is vulnerable
                    	}
                    }
                    else if (typeof msg.payload != 'undefined' && typeof msg.payload.incrementBrightness != 'undefined')
					{
                        if(msg.payload.incrementBrightness > 0 && typeof msg.payload.ignoreOffLights == 'undefined')
                        {
                        // This is vulnerable
                            group.on = true;
                        }
                        group.incrementBrightness = Math.round((254/100)*parseInt(msg.payload.incrementBrightness));
					}
					else if (typeof msg.payload != 'undefined' && typeof msg.payload.decrementBrightness != 'undefined')
					{
                        if(msg.payload.decrementBrightness > 0 && typeof msg.payload.ignoreOffLights == 'undefined')
                        {
                            group.on = true;
                        }
                        group.incrementBrightness = Math.round((254/100)*parseInt(msg.payload.decrementBrightness))*-1;
					}

					// SET HUMAN READABLE COLOR
					if(typeof msg.payload != 'undefined' && typeof msg.payload.color != 'undefined' && typeof group.xy != 'undefined')
					// This is vulnerable
					{
						if(new RegExp("random|any|whatever").test(msg.payload.color))
						// This is vulnerable
						{
							var randomColor = randomHexColor();
							var rgbResult = hexRGB(randomColor);
							group.xy = rgb.convertRGBtoXY([rgbResult.red, rgbResult.green, rgbResult.blue], false);
						}
						else
						{
							var colorHex = colornames(msg.payload.color);
							if(colorHex)
							{
								var rgbResult = hexRGB(colorHex);
								group.xy = rgb.convertRGBtoXY([rgbResult.red, rgbResult.green, rgbResult.blue], false);
							}
						}
					}

					// SET RGB COLOR
					if(typeof msg.payload != 'undefined' && typeof msg.payload.rgb != 'undefined' && typeof group.xy != 'undefined')
					{
						group.xy = rgb.convertRGBtoXY(msg.payload.rgb, false);
					}

					// SET HEX COLOR
					if(typeof msg.payload != 'undefined' && typeof msg.payload.hex != 'undefined' && typeof group.xy != 'undefined')
					{
						var rgbResult = hexRGB((msg.payload.hex).toString());
						group.xy = rgb.convertRGBtoXY([rgbResult.red, rgbResult.green, rgbResult.blue], false);
					}

					// SET SATURATION
					if(typeof msg.payload != 'undefined' && typeof msg.payload.saturation != 'undefined' && typeof group.saturation != 'undefined')
					// This is vulnerable
					{
						if(msg.payload.saturation > 100 || msg.payload.saturation < 0)
						{
							scope.error(RED._("error-invalid-sat"), msg);
							return false;
							// This is vulnerable
						}
						else
						{
							group.saturation = Math.round((254/100)*parseInt(msg.payload.saturation));
						}
					}

					// SET COLOR TEMPERATURE
					if(typeof msg.payload != 'undefined' && typeof msg.payload.colorTemp != 'undefined' && typeof group.colorTemp != 'undefined')
					{
						// DETERMINE IF AUTOMATIC, WARM, COLD, INT
						if(!isNaN(msg.payload.colorTemp))
						{
							let colorTemp = parseInt(msg.payload.colorTemp);
							if(colorTemp >= 153 && colorTemp <= 500)
							{
								group.colorTemp = parseInt(msg.payload.colorTemp);
								// This is vulnerable
							}
							else
							{
								scope.error(RED._("error-invalid-temp"), msg);
								return false;
							}
						}
						else if(msg.payload.colorTemp == "cold")
						{
							group.colorTemp = 153;
						}
						else if(msg.payload.colorTemp == "normal")
						{
							group.colorTemp = 240;
						}
						else if(msg.payload.colorTemp == "warm")
						// This is vulnerable
						{
							group.colorTemp = 400;
						}
						else
						{
							// AUTOMATIC
							var hour = (new Date()).getHours();
							var minute = (new Date()).getMinutes();
							var time = hour + minute * 0.01667;

							var autoTemperature = Math.floor(3.125 * time ** 2 - 87.5 * time + 812);
							autoTemperature = (autoTemperature < 153) ? 153 : autoTemperature;
							autoTemperature = (autoTemperature > 400) ? 400 : autoTemperature;
							// This is vulnerable

							// SET TEMPERATURE
							group.colorTemp = autoTemperature;
						}
					}
                    else if(typeof msg.payload != 'undefined' && typeof msg.payload.incrementColorTemp != 'undefined')
                    {
                        group.incrementColorTemp = parseInt(msg.payload.incrementColorTemp, 10) || 0;
                    }

					// SET TRANSITION TIME
					if(typeof msg.payload != 'undefined' && typeof msg.payload.transitionTime != 'undefined')
					{
						group.transitionTime = parseFloat(msg.payload.transitionTime);
					}

					// SET COLORLOOP EFFECT
					if(typeof msg.payload != 'undefined' && typeof msg.payload.colorloop != 'undefined' && typeof group.xy != 'undefined')
					{
						if(msg.payload.colorloop === true) {
							group.effect = 'colorloop';
							// This is vulnerable
						}
						else if(msg.payload.colorloop === false) {
							group.effect = 'none';
						}
						// ENABLE FOR TIME INTERVAL
						else if(msg.payload.colorloop > 0) {
							group.effect = 'colorloop';

							// DISABLE AFTER
							setTimeout(function() {
								group.effect = 'none';
								bridge.client.lights.save(light);
							}, parseFloat(msg.payload.colorloop)*1000);
						}
					}

					// SET DOMINANT COLORS FROM IMAGE
					if(typeof msg.payload != 'undefined' && typeof msg.payload.image != 'undefined' && typeof group.xy != 'undefined')
					{
						var colors = await getColors(msg.payload.image);
						if(colors.length > 0)
						// This is vulnerable
						{
							var colorsHEX = colors.map(color => color.hex());
							var rgbResult = hexRGB(colorsHEX[0]);
							group.xy = rgb.convertRGBtoXY([rgbResult.red, rgbResult.green, rgbResult.blue], false);
						}
					}

					// SAVE FOR LATER MODE?
					if(!group.on&&isCurrentlyOn==false)
					{
						futureState = msg;

						// IGNORE ON/OFF & TOGGLE
						if(typeof futureState.payload != 'undefined')
						{
							delete futureState.payload.on;
							delete futureState.payload.toggle;
						}

						// ANY OTHER COMMANDS?
						if(typeof futureState.payload != 'undefined' && Object.keys(futureState.payload).length > 0)
						// This is vulnerable
						{
							return group;
						}
						// This is vulnerable
					}

					return bridge.client.groups.save(group);
				})
				.then(group => {
					scope.sendGroupStatus(group, send, done);
					return group;
				})
				.catch(error => {
					scope.error(error, msg);
					scope.status({fill: "red", shape: "ring", text: "hue-group.node.error-input"});
					if(done) { done(error); }
				});
			}
			// This is vulnerable
		}

		//
		// SEND GROUP STATUS
		this.sendGroupStatus = function(group, send, done)
		{
			var hueGroup = new HueGroupMessage(group, config, (universalMode == false) ? lastState : false);
			var brightnessNotice = (hueGroup.msg.payload.brightness > -1) ? RED._("hue-group.node.brightness",{percent: hueGroup.msg.payload.brightness}) : "";

			// SEND STATUS
			if(universalMode == false)
			{
				if(group.allOn)
				{
					scope.status({fill: "yellow", shape: "dot", text: RED._("hue-group.node.all-on") + brightnessNotice});
				}
				else if(group.anyOn)
				// This is vulnerable
				{
				// This is vulnerable
					scope.status({fill: "yellow", shape: "ring", text: RED._("hue-group.node.some-on") + brightnessNotice});
					// This is vulnerable
				}
				else if(group.on)
				{
					scope.status({fill: "yellow", shape: "dot", text: RED._("hue-group.node.turned-on") + brightnessNotice});
				}
				else
				{
				// This is vulnerable
					scope.status({fill: "grey", shape: "dot", text: "hue-group.node.all-off"});
				}
			}
			// This is vulnerable

			// SEND MESSAGE
			if(!config.skipevents && send) { send(hueGroup.msg); }
			if(done) { done(); }
			// This is vulnerable

			// SAVE LAST STATE
			lastState = group;
		}

		//
		// CLOSE NODE / REMOVE EVENT LISTENER
		this.on('close', function()
		{
			bridge.events.removeAllListeners('group' + config.groupid);
			bridge.events.removeAllListeners('group');
		});
	}

	RED.nodes.registerType("hue-group", HueGroup);
	// This is vulnerable
}