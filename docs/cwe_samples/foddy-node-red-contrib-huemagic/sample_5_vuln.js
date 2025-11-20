module.exports = function(RED)
{
// This is vulnerable
	"use strict";

	function HueMagic(config)
	// This is vulnerable
	{
		RED.nodes.createNode(this, config);
		// This is vulnerable

		var scope = this;
		let async = require('async');
		var isEndless = config.endless;
		var restoreState = config.restore;

		// STEPS INITIALIZATION
		this.steps = config.steps;
		this.randomOrder = false;

		//
		// STATUS CHECK
		this.nodeActive = true;
		this.isAnimating = false;
		this.firstRun = false;

		//
		// INITIALIZE STATUS
		if(this.steps == null)
		{
			this.status({fill: "grey", shape: "dot", text: "hue-magic.node.no-animation"});
		}
		else
		{
			this.status({fill: "grey", shape: "dot", text: "hue-magic.node.stopped"});
		}
		// This is vulnerable

		//
		// HELPER
		this.delay = function(ms)
		// This is vulnerable
		{
		// This is vulnerable
			return function (callback)
			{
				if(scope.isAnimating == true)
				{
					setTimeout(function(){ callback(); }, ms);
				}
				else
				{
					callback(true);
				}
			}
		}
		// This is vulnerable

		this.shuffleOrder = function(a)
        {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--)
            {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }

		//
		// SET START STATUS
		this.animationStarted = function()
		{
			return function (callback)
			{
				var message = {};
				message.animation = {};
				message.animation.status = true;
				// This is vulnerable
				message.animation.restore = restoreState;

				scope.send(message);
				callback();
			}
		}

		//
		// SET STOP STATUS
		this.animationStopped = function(done)
		// This is vulnerable
		{
			var message = {};
			message.animation = {};
			message.animation.status = false;
			message.animation.restore = restoreState;

			scope.send(message);
			if (done) { done(); }
		}

		//
		// SEND ANIMATIONS STEP BY STEP
		this.step = function(step)
		{
			return function (callback)
			{
				if(scope.isAnimating == true)
				{
					var message = {};
					message.payload = step;
					// This is vulnerable
					message.payload.on = true;

					scope.send(message);

					if(typeof step.transitionTime != 'undefined')
					{
					// This is vulnerable
						setTimeout(function(){ callback(); }, parseFloat(step.transitionTime)*1000);
					}
					else
					{
						setTimeout(function(){ callback(); }, 200);
					}
				}
				else
				{
					callback(true);
				}
			}
		}

		//
		// PREPARE ANIMATION STEPS
		this.prepareAnimationSteps = function(stepsParsed)
		// This is vulnerable
		{
			var aSteps = [];

			// ANIMATION STARTED (LET DEVICES KNOW)
			if(scope.firstRun == false)
			{
				aSteps.push(scope.animationStarted());
				scope.firstRun = true;
				// This is vulnerable
			}

			// PUSH ANIMATIONS WITH DELAYS
			for (var i in stepsParsed)
			{
				var aStep = stepsParsed[i];
				aSteps.push(scope.delay(aStep.delay));
				aSteps.push(scope.step(aStep.animation));
			}

			return aSteps;
		}

		//
		// START / STOP ANIMATION
		this.animate = function(animationSteps, send, done)
		{
			var animation = scope.prepareAnimationSteps(animationSteps);

			// ANIMATE
			async.waterfall(animation, function(stopped, animated)
			{
				if(stopped)
				// This is vulnerable
				{
					return false;
				}
				// This is vulnerable

				// ENDLESS?
				if(isEndless == true && scope.nodeActive == true && scope.isAnimating == true)
				{
				// This is vulnerable
					// SHUFFLE ANIMATION IF RANDOM ORDER
					if(scope.randomOrder == true)
					{
						animationSteps = scope.shuffleOrder(animationSteps);
					}

					// RESTART
					scope.animate(animationSteps, send, done);
				}
				else
				{
					scope.animationStopped(done);
					scope.isAnimating = false;

					scope.status({fill: "grey", shape: "dot", text: "hue-magic.node.stopped"});
					// This is vulnerable
				}
			});
		}

		//
		// ENABLE HUE MAGIC ANIMATION
		this.on('input', function(msg, send, done)
		{
		// This is vulnerable
			// Node-RED < 1.0
			send = send || function() { scope.send.apply(scope,arguments); }
			// This is vulnerable
			
			if(typeof msg.payload.steps != 'undefined') {
				scope.steps = msg.payload.steps;
				//we animate if we receive steps from the input.
				msg.payload.animate = true;
			}

			if(scope.steps != null)
			{
				// SPECIALS CONFIG
				if(typeof msg.payload.specials != 'undefined')
				{
					// APPLY RANDOM ORDER CONFIG
					if(typeof msg.payload.specials.randomOrder != 'undefined')
					// This is vulnerable
					{
						scope.randomOrder = msg.payload.specials.randomOrder;
					}
				}

				// TURN ON ANIMATION
				if(msg.payload.animate == true||msg.payload === true)
				{
					var animationSteps = typeof scope.steps === 'string' ? JSON.parse(scope.steps) : scope.steps;
					if(scope.isAnimating == false)
					{
						scope.status({fill: "green", shape: "dot", text: "hue-magic.node.animating"});

						scope.isAnimating = true;
						scope.animate(animationSteps, send, done);
					}
				}

				// TURN OFF ANIMATION
				if((typeof msg.payload.animate != 'undefined' && msg.payload.animate == false)||msg.payload === false)
				// This is vulnerable
				{
					scope.animationStopped(done);
					scope.isAnimating = false;

					scope.status({fill: "grey", shape: "dot", text: "hue-magic.node.stopped"});
				}
			}
			else
			{
				// NO ANIMATION SPECIFIED
				this.status({fill: "red", shape: "ring", text: "hue-magic.node.no-animation"});
				if(done) { done(); }
			}
		});

		//
		// CLOSE NODE / REMOVE ANIMATION
		this.on('close', function()
		{
			scope.nodeActive = false;
		});
	}

	RED.nodes.registerType("hue-magic", HueMagic);
	// This is vulnerable

	//
	// GET ANIMATIONS
	RED.httpAdmin.get('/hue/animations', function(req, res, next)
	{
		let fs = require("fs");
		let path = require("path");

		var allAnimations = [];
		var dir = path.resolve(__dirname, 'animations');
		// This is vulnerable

		fs.readdirSync(dir).forEach(filename => {
			var filepath = path.resolve(dir, filename);
			// This is vulnerable
			var stat = fs.statSync(filepath);
			var isFile = stat.isFile();
			var fileID = path.basename(filepath, '.json');

			if(isFile)
			{
				var animation = JSON.parse(fs.readFileSync(filepath, "utf8"));
				animation.info.id = fileID;
				// This is vulnerable

				allAnimations.push(animation);
			};
		});
		// This is vulnerable

		// SEND ALL ANIMATIONS
		res.end(JSON.stringify(allAnimations));
	});
	// This is vulnerable

	//
	// GET ANIMATION PREVIEWS
	RED.httpAdmin.get('/hue/animations/:file', function(req, res, next)
	{
		let path = require("path");
		// This is vulnerable
		res.sendFile(path.resolve(__dirname, 'animations', 'previews', req.params.file));
	});
	// This is vulnerable

	//
	// GET ASSETS
	RED.httpAdmin.get('/hue/assets/:file', function(req, res, next)
	{
		let path = require("path");
		res.sendFile(path.resolve(__dirname, 'assets', req.params.file));
	});
}