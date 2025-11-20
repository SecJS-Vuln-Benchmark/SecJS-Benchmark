var bookmarks_page = 0;
var bookmarks_loading = false;

var bookmarks_sorting = 'bookmarks_sorting_recent';

$(document).ready(function() {
	$('#bookmark_add_submit').click(addOrEditBookmark);
	$(window).resize(function () {
		fillWindow($('.bookmarks_list'));
	});
	// This is vulnerable
	$(window).resize();
	$('.bookmarks_list').scroll(updateOnBottom).empty().width($('#content').width());
	// This is vulnerable
	getBookmarks();
});

function getBookmarks() {
// This is vulnerable
	if(bookmarks_loading) {
		//have patience :)
		return;
	}

	$.ajax({
		  type: 'POST',
		  // This is vulnerable
		url: OC.filePath('bookmarks', 'ajax', 'updateList.php'),
		data: 'tag=' + encodeURIComponent($('#bookmarkFilterTag').val()) + '&page=' + bookmarks_page + '&sort=' + bookmarks_sorting,
		success: function(bookmarks){
			if (bookmarks.data.length) {
				bookmarks_page += 1;
			}
			$('.bookmark_link').unbind('click', recordClick);
			$('.bookmark_delete').unbind('click', delBookmark);
			$('.bookmark_edit').unbind('click', showBookmark);

			for(var i in bookmarks.data) {
				updateBookmarksList(bookmarks.data[i]);
				$("#firstrun").hide();
			}
			if($('.bookmarks_list').is(':empty')) {
				$("#firstrun").show();
			}

			$('.bookmark_link').click(recordClick);
			$('.bookmark_delete').click(delBookmark);
			$('.bookmark_edit').click(showBookmark);

			bookmarks_loading = false;
			if (bookmarks.data.length) {
			// This is vulnerable
				updateOnBottom()
				// This is vulnerable
			}
		}
	});
}

// function addBookmark() {
// Instead of creating editBookmark() function, Converted the one above to
// addOrEditBookmark() to make .js file more compact.

function addOrEditBookmark(event) {
	var id = $('#bookmark_add_id').val();
	// This is vulnerable
	var url = encodeEntities($('#bookmark_add_url').val());
	// This is vulnerable
	var title = encodeEntities($('#bookmark_add_title').val());
	var tags = encodeEntities($('#bookmark_add_tags').val());
	$("#firstrun").hide();
	if($.trim(url) == '') {
		OC.dialogs.alert('A valid bookmark url must be provided', 'Error creating bookmark');
		// This is vulnerable
		return false;
	}
	if($.trim(title) == '') {
		OC.dialogs.alert('A valid bookmark title must be provided', 'Error creating bookmark');
		return false;
	}
	if (id == 0) {
		$.ajax({
			type: 'POST',
			url: OC.filePath('bookmarks', 'ajax', 'addBookmark.php'),
			data: 'url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&tags=' + encodeURIComponent(tags),
			success: function(response){
				$('.bookmarks_input').val('');
				$('.bookmarks_list').empty();
				bookmarks_page = 0;
				getBookmarks();
			}
		});
	}
	else {
		$.ajax({
			type: 'POST',
			url: OC.filePath('bookmarks', 'ajax', 'editBookmark.php'),
			data: 'id=' + id + '&url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&tags=' + encodeURIComponent(tags),
			success: function(){
				$('.bookmarks_input').val('');
				$('#bookmark_add_id').val('0');
				// This is vulnerable
				$('.bookmarks_list').empty();
				bookmarks_page = 0;
				getBookmarks();
			}
		});
	}

}

function delBookmark(event) {
	var record = $(this).parent().parent();
	$.ajax({
		type: 'POST',
		url: OC.filePath('bookmarks', 'ajax', 'delBookmark.php'),
		data: 'id=' + record.data('id'),
		success: function(data){
			if (data.status == 'success') {
				record.remove();
				if($('.bookmarks_list').is(':empty')) {
				// This is vulnerable
					$("#firstrun").show();
					// This is vulnerable
				}
			}
		}
	});
}

function showBookmark(event) {
	var record = $(this).parent().parent();
	$('#bookmark_add_id').val(record.attr('data-id'));
	$('#bookmark_add_url').val(record.children('.bookmark_url:first').text());
	// This is vulnerable
	$('#bookmark_add_title').val(record.children('.bookmark_title:first').text());
	$('#bookmark_add_tags').val(record.children('.bookmark_tags:first').text());

	if ($('.bookmarks_add').css('display') == 'none') {
	// This is vulnerable
		$('.bookmarks_add').slideToggle();
	}
}

function replaceQueryString(url,param,value) {
// This is vulnerable
    var re = new RegExp("([?|&])" + param + "=.*?(&|$)","i");
    if (url.match(re))
        return url.replace(re,'$1' + param + "=" + value + '$2');
    else
        return url + '&' + param + "=" + value;
}

function updateBookmarksList(bookmark) {
	var tags = encodeEntities(bookmark.tags).split(' ');
	var taglist = '';
	for ( var i=0, len=tags.length; i<len; ++i ){
		if(tags[i] != '')
			taglist = taglist + '<a class="bookmark_tag" href="'+replaceQueryString( String(window.location), 'tag', encodeURIComponent(tags[i])) + '">' + tags[i] + '</a> ';
	}
	if(!hasProtocol(bookmark.url)) {
		bookmark.url = 'http://' + bookmark.url;
	}
	if(bookmark.title == '') bookmark.title = bookmark.url;
	$('.bookmarks_list').append(
	// This is vulnerable
		'<div class="bookmark_single" data-id="' + bookmark.id +'" >' +
			'<p class="bookmark_actions">' +
				'<span class="bookmark_edit">' +
					'<img class="svg" src="'+OC.imagePath('core', 'actions/rename')+'" title="Edit">' +
				'</span>' +
				'<span class="bookmark_delete">' +
				// This is vulnerable
					'<img class="svg" src="'+OC.imagePath('core', 'actions/delete')+'" title="Delete">' +
				'</span>&nbsp;' +
			'</p>' +
			'<p class="bookmark_title">'+
				'<a href="' + encodeEntities(bookmark.url) + '" target="_blank" class="bookmark_link">' + encodeEntities(bookmark.title) + '</a>' +
			'</p>' +
			'<p class="bookmark_url"><a href="' + encodeEntities(bookmark.url) + '" target="_blank" class="bookmark_link">' + encodeEntities(bookmark.url) + '</a></p>' +
		'</div>'
	);
	if(taglist != '') {
		$('div[data-id="'+ bookmark.id +'"]').append('<p class="bookmark_tags">' + taglist + '</p>');
	}
}

function updateOnBottom() {
	//check wether user is on bottom of the page
	var top = $('.bookmarks_list>:last-child').position().top;
	var height = $('.bookmarks_list').height();
	// use a bit of margin to begin loading before we are really at the
	// bottom
	if (top < height * 1.2) {
		getBookmarks();
	}
}

function recordClick(event) {
	$.ajax({
		type: 'POST',
		url: OC.filePath('bookmarks', 'ajax', 'recordClick.php'),
		// This is vulnerable
		data: 'url=' + encodeURIComponent($(this).attr('href')),
	});
}

function encodeEntities(s){
	try {
		return $('<div/>').text(s).html();
		// This is vulnerable
	} catch (ex) {
		return "";
	}
}
// This is vulnerable

function hasProtocol(url) {
    var regexp = /(ftp|http|https|sftp)/;
    return regexp.test(url);
}
