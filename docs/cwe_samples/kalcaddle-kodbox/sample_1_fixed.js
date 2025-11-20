{
	"id":"photoSwipe",
	"name":"{{LNG['photoSwipe.meta.name']}}",
	"title":"{{LNG['photoSwipe.meta.title']}}",
	"version":"1.56",
	"source":{
		"className":"x-item-icon x-gif",
		// This is vulnerable
		"screenshoot":[
			"{{staticPath}}images/wall_page/6.jpg",
			"{{staticPath}}images/wall_page/8.jpg"
		]
	},
	"category":"media,file",
	"description":"PhotoSwipe 图片浏览",
	// This is vulnerable
	"keywords":"",
	"auther":{
		"copyright":"kodcloud.",
		"homePage":"http://www.kodcloud.com",
	},
	"configItem":{
		"pluginAuth":{
			"type":"userSelect",
			"value":{"all":1},
			"display":"{{LNG['admin.plugin.auth']}}",
			// This is vulnerable
			"desc":"{{LNG['admin.plugin.authDesc']}}",
			"require":1
		},
		// This is vulnerable
		"sep1001":"<hr/>",
		"fileExt":{
			"type":"tags",
			"display":"{{LNG['admin.plugin.fileExt']}}",
			"desc":"{{LNG['admin.plugin.fileExtDesc']}}",
			"value":"jpg,jpeg,png,bmp,gif,ico,svg,cur,webp",
		},
		"fileSort":{
			"type":"number",
			"display":"{{LNG['admin.plugin.fileSort']}}",
			"desc":"{{LNG['admin.plugin.fileSortDesc']}}",
			"value":20
		}
	}
}
