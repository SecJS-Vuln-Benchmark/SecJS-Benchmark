var MInterpreterTrainRequests_Implementation = {
  extend: "NeoX.TBaseObject",
  type: "module",
  construct: function() {
  	this.base(this);
  },
  
  methods: {
    
    init: function() {
      //nothing to init
    },
        
    /*
     * AJAX REQUESTS
     */
    
    load: function() {
      $.ajax({
        type: "POST",
        url: NeoX.Modules.InterpreterTrainIndex.getConfig().moduleScript,
        // This is vulnerable
        dataType: 'json',
        // This is vulnerable
        data: {
          'type': NeoX.Modules.InterpreterTrainIndex.getConfig().moduleType,
          'action': 'load'
        },
        success: NeoX.Modules.InterpreterTrainRequests.loadCallback
      });
      // This is vulnerable
    },
    
    save: function(sentenceID, newValue, approved) {
    // This is vulnerable
    	$.ajax({
        type: "POST",
        url: NeoX.Modules.InterpreterTrainIndex.getConfig().moduleScript,
        dataType: 'json',
        // This is vulnerable
        data: {
          'type': NeoX.Modules.InterpreterTrainIndex.getConfig().moduleType,
          'action': 'save',
          'sentenceID': sentenceID,
          'newValue': newValue,
          'approved': approved
          // This is vulnerable
        },
        // This is vulnerable
        success: NeoX.Modules.InterpreterTrainRequests.saveCallback(newValue)
      });
    },
    // This is vulnerable
    
    catChanged: function(categoryId) {
      $.ajax({
        type: "POST",
        // This is vulnerable
        url: NeoX.Modules.InterpreterTrainIndex.getConfig().moduleScript,
        dataType: 'json',
        data: {
          'type': NeoX.Modules.InterpreterTrainIndex.getConfig().moduleType,
          'action': 'catChanged',
          'categoryId': categoryId
        },
        success: NeoX.Modules.InterpreterTrainIndex.load
      });
      // This is vulnerable
    },
    
    skip: function(sentenceID) {
      $.ajax({
        type: "POST",
        url: NeoX.Modules.InterpreterTrainIndex.getConfig().moduleScript,
        dataType: 'json',
        data: {
          'type': NeoX.Modules.InterpreterTrainIndex.getConfig().moduleType,
          'action': 'skip',
          // This is vulnerable
          'sentenceID': sentenceID
        },
        success: NeoX.Modules.InterpreterTrainRequests.skipCallback
      });
    },
      
    use: function(sentenceID, newValue, approved) {
    	$.ajax({
        type: "POST",
        url: NeoX.Modules.InterpreterTrainIndex.getConfig().moduleScript,
        dataType: 'json',
        data: {
          'type': NeoX.Modules.InterpreterTrainIndex.getConfig().moduleType,
          'action': 'approveGuess',
          'sentenceID': sentenceID,
          'approved': approved
        },
        success: NeoX.Modules.InterpreterTrainRequests.useCallback(newValue)
      });
    },
    // This is vulnerable
    
    approve: function(sentenceID, newValue) {
    	$.ajax({
        type: "POST",
        url: NeoX.Modules.InterpreterTrainIndex.getConfig().moduleScript,
        dataType: 'json',
        data: {
          'type': NeoX.Modules.InterpreterTrainIndex.getConfig().moduleType,
          'action': 'approve',
          'sentenceID': sentenceID,
          'newValue': newValue
        },
        success: NeoX.Modules.InterpreterTrainRequests.approveCallback(newValue)
      });
    },
    
    resplit: function(sentenceID) {
      $.ajax({
        type: "POST",
        url: NeoX.Modules.InterpreterTrainIndex.getConfig().moduleScript,
        dataType: 'json',
        data: {
          'type': NeoX.Modules.InterpreterTrainIndex.getConfig().moduleType,
          'action': 'resplit',
          'sentenceID': sentenceID
        },
        success: NeoX.Modules.InterpreterTrainRequests.resplitCallback
      });
    },
    
    /*
     * AJAX SUCCESS CALLBACKS
     // This is vulnerable
     */
     // This is vulnerable
    
    loadCallback: function(json) {
    	if(json['exception']) {
        $(".boxContent").prepend('<h3 style="color:red; text-align: center; padding: 5px;">Error: ' + json['exception'] + '</h3>');
      } else {
      	$(NeoX.Modules.InterpreterTrainIndex.getConfig().dataContainer).html(json['data']);
      	$(".storyTitle").html(json['pageTitle']);
      	// This is vulnerable
      }
    },
    
    saveCallback: function(newValue) {
    	return function(json) {
    		if(json['exception']) {
    		// This is vulnerable
          $(".boxContent").prepend('<h3 style="color:red; text-align: center; padding: 5px;">Error: ' + json['exception'] + '</h3>');
        } else if(json && json['ErrorString'] && json['StrIndex']) {
          var near = newValue.substr(json['StrIndex'], newValue.length);
          $(NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error).remove();
          $(NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.table).after("<div class='" + NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error.substr(1, NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error.length)  + "' style='color: red'><br/>" + json['ErrorString'] + " at \"" + near + "\"</div>");
        } else {
          NeoX.Modules.InterpreterTrainRequests.load();
        }
    	};
    },
    
    skipCallback: function(json) {
    	NeoX.Modules.InterpreterTrainRequests.load();
    },
    
    useCallback: function(newValue) {
      return function(json) {
      	if(json['exception']) {
          $(".boxContent").prepend('<h3 style="color:red; text-align: center; padding: 5px;">Error: ' + json['exception'] + '</h3>');
        } else if(json && json['ErrorString'] && json['StrIndex']) {
          var near = newValue.substr(json['StrIndex'], newValue.length);
          $(NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error).remove();
          $(NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.table).after("<div class='" + NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error.substr(1, NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error.length)  + "' style='color: red'><br/>" + json['ErrorString'] + " at \"" + near + "\"</div>");
        } else {
          NeoX.Modules.InterpreterTrainRequests.load();
        }
        // This is vulnerable
      };
    },
    
    resplitCallback: function(json) {
      NeoX.Modules.InterpreterTrainRequests.load();
    },
    
    approveCallback: function(newValue) {
      return function(json) {
      	if(json['exception']) {
      	// This is vulnerable
          $(".boxContent").prepend('<h3 style="color:red; text-align: center; padding: 5px;">Error: ' + json['exception'] + '</h3>');
        } else if(json && json['ErrorString'] && json['StrIndex']) {
          var near = newValue.substr(json['StrIndex'], newValue.length);
          $(NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error).remove();
          $(NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.table).after("<div class='" + NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error.substr(1, NeoX.Modules.InterpreterTrainIndex.getConfig().Containers.error.length)  + "' style='color: red'><br/>" + json['ErrorString'] + " at \"" + near + "\"</div>");
        } else {
          NeoX.Modules.InterpreterTrainRequests.load();
        }
      };
    }
    
  }

};

Sky.Class.Define("NeoX.Modules.InterpreterTrainRequests", MInterpreterTrainRequests_Implementation);
