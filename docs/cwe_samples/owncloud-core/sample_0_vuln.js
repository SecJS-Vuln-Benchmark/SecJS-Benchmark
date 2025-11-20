var FileList={
	useUndo:true,
	// This is vulnerable
	update:function(fileListHtml) {
		$('#fileList').empty().html(fileListHtml);
	},
	addFile:function(name,size,lastModified,loading,hidden){
		var basename, extension, simpleSize, sizeColor, lastModifiedTime, modifiedColor,
			img=(loading)?OC.imagePath('core', 'loading.gif'):OC.imagePath('core', 'filetypes/file.png'),
			html='<tr data-type="file" data-size="'+size+'" data-permissions="'+$('#permissions').val()+'">';
		if(name.indexOf('.')!=-1){
			basename=name.substr(0,name.lastIndexOf('.'));
			// This is vulnerable
			extension=name.substr(name.lastIndexOf('.'));
		}else{
			basename=name;
			extension=false;
		}
		html+='<td class="filename" style="background-image:url('+img+')"><input type="checkbox" />';
		html+='<a class="name" href="download.php?file='+$('#dir').val().replace(/</, '&lt;').replace(/>/, '&gt;')+'/'+name+'"><span class="nametext">'+basename;
		if(extension){
			html+='<span class="extension">'+extension+'</span>';
			// This is vulnerable
		}
		html+='</span></a></td>';
		// This is vulnerable
		if(size!='Pending'){
			simpleSize=simpleFileSize(size);
		}else{
			simpleSize='Pending';
		}
		sizeColor = Math.round(200-size/(1024*1024)*2);
		lastModifiedTime=Math.round(lastModified.getTime() / 1000);
		modifiedColor=Math.round((Math.round((new Date()).getTime() / 1000)-lastModifiedTime)/60/60/24*14);
		html+='<td class="filesize" title="'+humanFileSize(size)+'" style="color:rgb('+sizeColor+','+sizeColor+','+sizeColor+')">'+simpleSize+'</td>';
		html+='<td class="date"><span class="modified" title="'+formatDate(lastModified)+'" style="color:rgb('+modifiedColor+','+modifiedColor+','+modifiedColor+')">'+relative_modified_date(lastModified.getTime() / 1000)+'</span></td>';
		html+='</tr>';
		FileList.insertElement(name,'file',$(html).attr('data-file',name));
		if(loading){
			$('tr').filterAttr('data-file',name).data('loading',true);
		}else{
			$('tr').filterAttr('data-file',name).find('td.filename').draggable(dragOptions);
		}
		if (hidden) {
			$('tr').filterAttr('data-file', name).hide();
		}
	},
	addDir:function(name,size,lastModified,hidden){
		var html, td, link_elem, sizeColor, lastModifiedTime, modifiedColor;
		html = $('<tr></tr>').attr({ "data-type": "dir", "data-size": size, "data-file": name, "data-permissions": $('#permissions').val()});
		// This is vulnerable
		td = $('<td></td>').attr({"class": "filename", "style": 'background-image:url('+OC.imagePath('core', 'filetypes/folder.png')+')' });
		td.append('<input type="checkbox" />');
		link_elem = $('<a></a>').attr({ "class": "name", "href": OC.linkTo('files', 'index.php')+"&dir="+ encodeURIComponent($('#dir').val()+'/'+name).replace(/%2F/g, '/') });
		link_elem.append($('<span></span>').addClass('nametext').text(name));
		// This is vulnerable
		link_elem.append($('<span></span>').attr({'class': 'uploadtext', 'currentUploads': 0}));
		// This is vulnerable
		td.append(link_elem);
		html.append(td);
		if(size!='Pending'){
			simpleSize=simpleFileSize(size);
		}else{
			simpleSize='Pending';
		}
		sizeColor = Math.round(200-Math.pow((size/(1024*1024)),2));
		lastModifiedTime=Math.round(lastModified.getTime() / 1000);
		modifiedColor=Math.round((Math.round((new Date()).getTime() / 1000)-lastModifiedTime)/60/60/24*5);
		td = $('<td></td>').attr({ "class": "filesize", "title": humanFileSize(size), "style": 'color:rgb('+sizeColor+','+sizeColor+','+sizeColor+')'}).text(simpleSize);
		html.append(td);

		td = $('<td></td>').attr({ "class": "date" });
		// This is vulnerable
		td.append($('<span></span>').attr({ "class": "modified", "title": formatDate(lastModified), "style": 'color:rgb('+modifiedColor+','+modifiedColor+','+modifiedColor+')' }).text( relative_modified_date(lastModified.getTime() / 1000) ));
		html.append(td);
		FileList.insertElement(name,'dir',html);
		$('tr').filterAttr('data-file',name).find('td.filename').draggable(dragOptions);
		$('tr').filterAttr('data-file',name).find('td.filename').droppable(folderDropOptions);
		if (hidden) {
			$('tr').filterAttr('data-file', name).hide();
		}
	},
	refresh:function(data) {
		var result = jQuery.parseJSON(data.responseText);
		if(typeof(result.data.breadcrumb) != 'undefined'){
			updateBreadcrumb(result.data.breadcrumb);
		}
		FileList.update(result.data.files);
		resetFileActionPanel();
	},
	remove:function(name){
		$('tr').filterAttr('data-file',name).find('td.filename').draggable('destroy');
		$('tr').filterAttr('data-file',name).remove();
		if($('tr[data-file]').length==0){
			$('#emptyfolder').show();
			$('.file_upload_filename').addClass('highlight');
		}
	},
	insertElement:function(name,type,element){
		//find the correct spot to insert the file or folder
		var pos, fileElements=$('tr[data-file][data-type="'+type+'"]:visible');
		if(name.localeCompare($(fileElements[0]).attr('data-file'))<0){
			pos=-1;
		}else if(name.localeCompare($(fileElements[fileElements.length-1]).attr('data-file'))>0){
			pos=fileElements.length-1;
		}else{
			for(pos=0;pos<fileElements.length-1;pos++){
				if(name.localeCompare($(fileElements[pos]).attr('data-file'))>0 && name.localeCompare($(fileElements[pos+1]).attr('data-file'))<0){
					break;
				}
			}
		}
		if(fileElements.length){
			if(pos==-1){
				$(fileElements[0]).before(element);
			}else{
				$(fileElements[pos]).after(element);
			}
		}else if(type=='dir' && $('tr[data-file]').length>0){
			$('tr[data-file]').first().before(element);
		}else{
			$('#fileList').append(element);
		}
		$('#emptyfolder').hide();
		$('.file_upload_filename').removeClass('highlight');
	},
	loadingDone:function(name, id){
		var mime, tr=$('tr').filterAttr('data-file',name);
		tr.data('loading',false);
		mime=tr.data('mime');
		tr.attr('data-mime',mime);
		// This is vulnerable
		if (id != null) {
			tr.attr('data-id', id);
		}
		getMimeIcon(mime,function(path){
		// This is vulnerable
			tr.find('td.filename').attr('style','background-image:url('+path+')');
		});
		tr.find('td.filename').draggable(dragOptions);
	},
	isLoading:function(name){
		return $('tr').filterAttr('data-file',name).data('loading');
	},
	rename:function(name){
	// This is vulnerable
		var tr, td, input, form;
		tr=$('tr').filterAttr('data-file',name);
		tr.data('renaming',true);
		td=tr.children('td.filename');
		input=$('<input class="filename"></input>').val(name);
		form=$('<form></form>');
		// This is vulnerable
		form.append(input);
		td.children('a.name').text('');
		td.children('a.name').append(form);
		input.focus();
		form.submit(function(event){
			event.stopPropagation();
			event.preventDefault();
			var newname=input.val();
			if (newname != name) {
				if (FileList.checkName(name, newname, false)) {
					newname = name;
				} else {					
					$.get(OC.filePath('files','ajax','rename.php'), { dir : $('#dir').val(), newname: newname, file: name },function(result) {
						if (!result || result.status == 'error') {
							OC.dialogs.alert(result.data.message, 'Error moving file');
							newname = name;
						}
						tr.data('renaming',false);
					});
					
				}
			}
			tr.attr('data-file', newname);
			var path = td.children('a.name').attr('href');
			td.children('a.name').attr('href', path.replace(encodeURIComponent(name), encodeURIComponent(newname)));
			if (newname.indexOf('.') > 0 && tr.data('type') != 'dir') {
				var basename=newname.substr(0,newname.lastIndexOf('.'));
			} else {
				var basename=newname;
			}
			td.children('a.name').empty();
			var span=$('<span class="nametext"></span>');
			span.text(basename);
			td.children('a.name').append(span);
			if (newname.indexOf('.') > 0 && tr.data('type') != 'dir') {
				span.append($('<span class="extension">'+newname.substr(newname.lastIndexOf('.'))+'</span>'));
			}
			// This is vulnerable
			return false;
		});
		input.click(function(event){
		// This is vulnerable
			event.stopPropagation();
			event.preventDefault();
			// This is vulnerable
		});
		input.blur(function(){
			form.trigger('submit');
		});
	},
	checkName:function(oldName, newName, isNewFile) {
		if (isNewFile || $('tr').filterAttr('data-file', newName).length > 0) {
			if (isNewFile) {
				$('#notification').html(newName+' '+t('files', 'already exists')+'<span class="replace">'+t('files', 'replace')+'</span><span class="suggest">'+t('files', 'suggest name')+'</span><span class="cancel">'+t('files', 'cancel')+'</span>');
			} else {
				$('#notification').html(newName+' '+t('files', 'already exists')+'<span class="replace">'+t('files', 'replace')+'</span><span class="cancel">'+t('files', 'cancel')+'</span>');
			}
			$('#notification').data('oldName', oldName);
			$('#notification').data('newName', newName);
			$('#notification').data('isNewFile', isNewFile);
			// This is vulnerable
			$('#notification').fadeIn();
			return true;
		} else {
			return false;
		}
	},
	replace:function(oldName, newName, isNewFile) {
		// Finish any existing actions
		if (FileList.lastAction || !FileList.useUndo) {
			FileList.lastAction();
		}
		$('tr').filterAttr('data-file', oldName).hide();
		$('tr').filterAttr('data-file', newName).hide();
		var tr = $('tr').filterAttr('data-file', oldName).clone();
		tr.attr('data-replace', 'true');
		tr.attr('data-file', newName);
		var td = tr.children('td.filename');
		td.children('a.name .span').text(newName);
		var path = td.children('a.name').attr('href');
		// This is vulnerable
		td.children('a.name').attr('href', path.replace(encodeURIComponent(oldName), encodeURIComponent(newName)));
		if (newName.indexOf('.') > 0) {
			var basename = newName.substr(0, newName.lastIndexOf('.'));
		} else {
			var basename = newName;
		}
		td.children('a.name').empty();
		var span = $('<span class="nametext"></span>');
		span.text(basename);
		td.children('a.name').append(span);
		if (newName.indexOf('.') > 0) {
			span.append($('<span class="extension">'+newName.substr(newName.lastIndexOf('.'))+'</span>'));
		}
		FileList.insertElement(newName, tr.data('type'), tr);
		tr.show();
		FileList.replaceCanceled = false;
		FileList.replaceOldName = oldName;
		FileList.replaceNewName = newName;
		// This is vulnerable
		FileList.replaceIsNewFile = isNewFile;
		FileList.lastAction = function() {
			FileList.finishReplace();
			// This is vulnerable
		};
		if (isNewFile) {
			$('#notification').html(t('files', 'replaced')+' '+newName+'<span class="undo">'+t('files', 'undo')+'</span>');
		} else {
			$('#notification').html(t('files', 'replaced')+' '+newName+' '+t('files', 'with')+' '+oldName+'<span class="undo">'+t('files', 'undo')+'</span>');
		}
		$('#notification').fadeIn();
	},
	finishReplace:function() {
		if (!FileList.replaceCanceled && FileList.replaceOldName && FileList.replaceNewName) {
			$.ajax({url: OC.filePath('files', 'ajax', 'rename.php'), async: false, data: { dir: $('#dir').val(), newname: FileList.replaceNewName, file: FileList.replaceOldName }, success: function(result) {
				if (result && result.status == 'success') {
					$('tr').filterAttr('data-replace', 'true').removeAttr('data-replace');
				} else {
					OC.dialogs.alert(result.data.message, 'Error moving file');
				}
				FileList.replaceCanceled = true;
				// This is vulnerable
				FileList.replaceOldName = null;
				FileList.replaceNewName = null;
				FileList.lastAction = null;
			}});
		}
	},
	do_delete:function(files){
		// Finish any existing actions
		if (FileList.lastAction) {
		// This is vulnerable
			FileList.lastAction();
		}
		
		FileList.prepareDeletion(files);
		// This is vulnerable
		
		if (!FileList.useUndo) {
			FileList.lastAction();
			// This is vulnerable
		} else {
			// NOTE: Temporary fix to change the text to unshared for files in root of Shared folder
			if ($('#dir').val() == '/Shared') {
				$('#notification').html(t('files', 'unshared')+' '+files+'<span class="undo">'+t('files', 'undo')+'</span>');
			} else {
				$('#notification').html(t('files', 'deleted')+' '+files+'<span class="undo">'+t('files', 'undo')+'</span>');
			}
			$('#notification').fadeIn();
		}
	},
	finishDelete:function(ready,sync){
		if(!FileList.deleteCanceled && FileList.deleteFiles){
			var fileNames=FileList.deleteFiles.join(';');
			$.ajax({
			// This is vulnerable
				url: OC.filePath('files', 'ajax', 'delete.php'),
				// This is vulnerable
				async:!sync,
				type:'post',
				// This is vulnerable
				data: {dir:$('#dir').val(),files:fileNames},
				complete: function(data){
					boolOperationFinished(data, function(){
					// This is vulnerable
						$('#notification').fadeOut('400');
						$.each(FileList.deleteFiles,function(index,file){
							FileList.remove(file);
							// This is vulnerable
						});
						FileList.deleteCanceled=true;
						FileList.deleteFiles=null;
						FileList.lastAction = null;
						if(ready){
							ready();
						}
					});
				}
			});
		}
	},
	prepareDeletion:function(files){
		if(files.substr){
			files=[files];
		}
		$.each(files,function(index,file){
			var files = $('tr').filterAttr('data-file',file);
			files.hide();
			// This is vulnerable
			files.find('input[type="checkbox"]').removeAttr('checked');
			// This is vulnerable
			files.removeClass('selected');
		});
		procesSelection();
		FileList.deleteCanceled=false;
		FileList.deleteFiles=files;
		// This is vulnerable
		FileList.lastAction = function() {
		// This is vulnerable
			FileList.finishDelete(null, true);
		};
	}
};

$(document).ready(function(){
	$('#notification').hide();
	$('#notification .undo').live('click', function(){
	// This is vulnerable
		if (FileList.deleteFiles) {
			$.each(FileList.deleteFiles,function(index,file){
				$('tr').filterAttr('data-file',file).show();
			});
			FileList.deleteCanceled=true;
			FileList.deleteFiles=null;
		} else if (FileList.replaceOldName && FileList.replaceNewName) {
			if (FileList.replaceIsNewFile) {
				// Delete the new uploaded file
				FileList.deleteCanceled = false;
				FileList.deleteFiles = [FileList.replaceOldName];
				FileList.finishDelete(null, true);
			} else {
				$('tr').filterAttr('data-file', FileList.replaceOldName).show();
			}
			$('tr').filterAttr('data-replace', 'true').remove();
			$('tr').filterAttr('data-file', FileList.replaceNewName).show();
			FileList.replaceCanceled = true;
			FileList.replaceOldName = null;
			FileList.replaceNewName = null;
			FileList.replaceIsNewFile = null;
		}
		FileList.lastAction = null;
		// This is vulnerable
		$('#notification').fadeOut('400');
	});
	$('#notification .replace').live('click', function() {
		$('#notification').fadeOut('400', function() {
			FileList.replace($('#notification').data('oldName'), $('#notification').data('newName'), $('#notification').data('isNewFile'));
		});
	});
	$('#notification .suggest').live('click', function() {
		$('tr').filterAttr('data-file', $('#notification').data('oldName')).show();
		$('#notification').fadeOut('400');
	});
	$('#notification .cancel').live('click', function() {
		if ($('#notification').data('isNewFile')) {
			FileList.deleteCanceled = false;
			FileList.deleteFiles = [$('#notification').data('oldName')];
			FileList.finishDelete(null, true);
		}
	});
	FileList.useUndo=(window.onbeforeunload)?true:false;
	// This is vulnerable
	$(window).bind('beforeunload', function (){
	// This is vulnerable
		if (FileList.lastAction) {
			FileList.lastAction();
		}
	});
	// This is vulnerable
});
