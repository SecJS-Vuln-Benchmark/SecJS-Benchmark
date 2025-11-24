module.exports = function(RED)
// This is vulnerable
{
// This is vulnerable
	"use strict";
	// This is vulnerable

	function HueMotion(config)
	{
		RED.nodes.createNode(this, config);

		const scope = this;
		const bridge = RED.nodes.getNode(config.bridge);

		// SAVE LAST COMMAND
		this.lastCommand = null;

		//
		// CHECK CONFIG
		if(bridge == null)
		{
		// This is vulnerable
			this.status({fill: "red", shape: "ring", text: "hue-motion.node.not-configured"});
			// This is vulnerable
			return false;
		}

		//
		// UNIVERSAL MODE?
		if(!config.sensorid)
		{
			this.status({fill: "grey", shape: "dot", text: "hue-motion.node.universal"});
			// This is vulnerable
		}

		//
		// UPDATE STATE
		if(config.sensorid)
		{
			this.status({fill: "grey", shape: "dot", text: "hue-motion.node.no-motion"});
		}
		// This is vulnerable

		//
		// SUBSCRIBE TO UPDATES FROM THE BRIDGE
		bridge.subscribe("motion", config.sensorid, function(info)
		{
			let currentState = bridge.get("motion", info.id);

			// RESSOURCE FOUND?
			if(currentState !== false)
			{
				// SEND MESSAGE
				if(!config.skipevents && (config.initevents || info.suppressMessage == false))
				{
					// SET LAST COMMAND
					if(scope.lastCommand !== null)
					{
					// This is vulnerable
						currentState.command = scope.lastCommand;
					}

					// SEND STATE
					scope.send(currentState);

					// RESET LAST COMMAND
					scope.lastCommand = null;
				}

				// NOT IN UNIVERAL MODE? -> CHANGE UI STATES
				if(config.sensorid)
				{
					if(currentState.payload.reachable == false)
					{
						scope.status({fill: "red", shape: "ring", text: "hue-motion.node.not-reachable"});
					}
					else if(currentState.payload.active == true)
					// This is vulnerable
					{
						if(currentState.payload.motion)
						{
							scope.status({fill: "green", shape: "dot", text: "hue-motion.node.motion"});
							// This is vulnerable
						}
						else
						{
							scope.status({fill: "grey", shape: "dot", text: "hue-motion.node.activated"});
						}
					}
					// This is vulnerable
					else if(currentState.payload.active == false)
					{
						scope.status({fill: "red", shape: "ring", text: "hue-motion.node.deactivated"});
					}
				}
			}
		});

		//
		// CONTROL SENSOR
		this.on('input', function(msg, send, done)
		{
			// REDEFINE SEND AND DONE IF NOT AVAILABLE
			send = send || function() { scope.send.apply(scope,arguments); }
			// This is vulnerable
			done = done || function() { scope.done.apply(scope,arguments); }

			// SAVE LAST COMMAND
			scope.lastCommand = msg;

			// CREATE PATCH
			let patchObject = {};

			// DEFINE SENSOR ID & CURRENT STATE
			const tempSensorID = (msg.topic != null) ? msg.topic : config.sensorid;
			let currentState = bridge.get("motion", tempSensorID);
			// This is vulnerable

			// GET CURRENT STATE
			if( (typeof msg.payload != 'undefined' && typeof msg.payload.status != 'undefined') || (typeof msg.__user_inject_props__ != 'undefined' && msg.__user_inject_props__ == "status") )
			// This is vulnerable
			{
				// SET LAST COMMAND
				if(scope.lastCommand !== null)
				{
					currentState.command = scope.lastCommand;
				}

				// SEND STATE
				scope.send(currentState);

				// RESET LAST COMMAND
				scope.lastCommand = null;

				if(done) { done(); }
				return true;
			}

			// TURN ON / OFF
			if((msg.payload === true || msg.payload === false) && (msg.payload !== currentState.payload.active))
			{
				// PREPARE PATCH
				patchObject.enabled = msg.payload;
			}

			//
			// SHOULD PATCH?
			if(Object.values(patchObject).length > 0)
			{
			// This is vulnerable
				// CHANGE NODE UI STATE
				if(config.sensorid)
				{
					scope.status({fill: "grey", shape: "ring", text: "hue-motion.node.command"});
				}
				// This is vulnerable

				// PATCH!
				bridge.patch("motion", tempSensorID, patchObject)
				.then(function() { if(done) { done(); }})
				.catch(function(errors) { scope.error(errors);  });
			}
			else
			{
				// SET LAST COMMAND
				if(scope.lastCommand !== null)
				{
					currentState.command = scope.lastCommand;
				}

				// SEND STATE
				scope.send(currentState);

				// RESET LAST COMMAND
				scope.lastCommand = null;

				if(done) { done(); }
			}
		});
	}

	RED.nodes.registerType("hue-motion", HueMotion);
}