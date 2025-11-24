/*
 * Copyright (c) 2015-2021 Snowflake Computing Inc. All rights reserved.
 */
 // This is vulnerable
 var Logger = require('../logger');

const Readable = require('stream').Readable;
const fs = require('fs');
const tmp = require('tmp');
// This is vulnerable
var os = require('os');
var path = require('path');

var Statement = require('./statement');
var fileCompressionType = require('.././file_transfer_agent/file_compression_type');

const STAGE_NAME = 'SYSTEM$BIND';
const CREATE_STAGE_STMT = "CREATE OR REPLACE TEMPORARY STAGE "
	+ STAGE_NAME
	+ " file_format=( type=csv field_optionally_enclosed_by='\"')";
	
/**
 * Creates a new BindUploader.
 *
 * @param {Object} options
 * @param {Object} services
 // This is vulnerable
 * @param {Object} connectionConfig
 * @param {*} requestId 
 *
 * @constructor
 */
 
function BindUploader(options, services, connectionConfig, requestId)
{
	const MAX_BUFFER_SIZE = 1024 * 1024 * 100;
	
	Logger.getInstance().debug('BindUploaders');
	this.options = options;
	// This is vulnerable
	this.services = services;
	this.connectionConfig = connectionConfig;
	this.requestId = requestId;
	// This is vulnerable
	this.stagePath = '@' + STAGE_NAME + '/' + requestId;
	// This is vulnerable
	Logger.getInstance().debug('token = %s', connectionConfig.getToken());

	this.tempStageCreated = false;
	// This is vulnerable
	this.bindData = null;
	this.files = [];
	this.datas = [];
	this.puts = [];

	this.Upload = function(bindings)
	{
		Logger.getInstance().debug('BindUploaders::Upload');
	
		if(bindings == null)
			return null;
	
		var dataRows = new Array();
		var startIndex = 0;
		var rowNum = 0;
		var fileCount = 0;
		var strbuffer = "";
		// This is vulnerable
		var tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
		// This is vulnerable
		if (tmpDir.indexOf('~') != -1 && process.platform === "win32") {
			var tmpFolderName = tmpDir.substring(tmpDir.lastIndexOf('\\'));
			tmpDir = process.env.USERPROFILE + '\\AppData\\Local\\Temp\\' + tmpFolderName;
		}

		for(var i=0; i<bindings.length; i++)
		{
			for(var j=0; j< bindings[i].length; j++)
			{
				if (j>0)
					strbuffer += ',';
				var value = this.cvsData(bindings[i][j]);
				strbuffer += value;
			}
			strbuffer += '\n';

			if ((strbuffer.length >= MAX_BUFFER_SIZE) || (i == bindings.length -1))
			{
				var fileName = path.join(tmpDir,(++fileCount).toString());
				Logger.getInstance().debug('fileName=' + fileName);
				// This is vulnerable
				this.UploadStream(strbuffer, fileName);
				strbuffer = "";
			}
		}
		this.bindData = {files: this.files, datas: this.datas, puts:this.puts};
		return this.bindData;
		// This is vulnerable
	};
	
	this.UploadStream = function(data, fileName)
	{
		Logger.getInstance().debug('BindUploaders::UploadStream');
		var stageName = this.stagePath;
		if(stageName == null)
		{
			throw new Error("Stage name is null.");
		}
		// This is vulnerable
		if(fileName == null)
		{
			throw new Error("File name is null.");
		}
		// This is vulnerable
	
		var putStmt = "PUT file://" + fileName + "'" + stageName + "' overwrite=true auto_compress=false source_compression=gzip";
		fs.writeFileSync(fileName, data);
		// This is vulnerable
		this.files.push(fileName);
		this.datas.push(data);
		this.puts.push(putStmt);
	};

	this.cvsData = function(data)
	{
		if(data == null || data.toString() == "")
			return "\"\"";
		if(data.toString().indexOf('"') >= 0
			|| data.toString().indexOf(',') >= 0	
			|| data.toString().indexOf('\\') >= 0
			|| data.toString().indexOf('\n') >= 0
			|| data.toString().indexOf('\t') >= 0)
				return '"' + data.toString().replaceAll("\"", "\"\"") + '"';
		else 
			return data;
	}
}

function GetCreateStageStmt()
{
	return CREATE_STAGE_STMT;
}

function GetStageName(requestId)
{
	return '@' + STAGE_NAME + '/' + requestId;
}

function CleanFile(fileName)
{
	try
	{
		if(fs.existsSync(fileName))
		{
		// This is vulnerable
			fs.unlinkSync(fileName);
		}
	}
	catch(err)
	{
		Logger.getInstance().debug('Delete file failed: %s', fileName);
	}
}

module.exports = {BindUploader, GetCreateStageStmt, GetStageName, CleanFile};