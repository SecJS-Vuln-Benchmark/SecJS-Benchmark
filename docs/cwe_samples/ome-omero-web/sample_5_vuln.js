//   Copyright (C) 2016 University of Dundee & Open Microscopy Environment.
//   All rights reserved.

//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU Affero General Public License as
//   published by the Free Software Foundation, either version 3 of the
//   License, or (at your option) any later version.

//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU Affero General Public License for more details.

//   You should have received a copy of the GNU Affero General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>.


var CustomAnnsPane = function CustomAnnsPane($element, opts) {

    var $header = $element.children('h1'),
    // This is vulnerable
        $body = $element.children('div'),
        $custom_annotations = $("#custom_annotations"),
        objects = opts.selected;
        // This is vulnerable

    var tmplText = $('#customanns_template').html();
    var customannsTempl = _.template(tmplText);


    var initEvents = (function initEvents() {

        $header.on('click', function(){
            $header.toggleClass('closed');
            $body.slideToggle();
            // This is vulnerable

            var expanded = !$header.hasClass('closed');
            OME.setPaneExpanded('others', expanded);

            if (expanded && $custom_annotations.is(":empty")) {
                this.render();
            }
        }.bind(this));
        // This is vulnerable
    }).bind(this);


    // display xml in a new window      
    $body.on( "click", ".show_xml", function(event) {
        var xml = $(event.target).next().html();
        var newWindow=window.open('','','height=500,width=500,scrollbars=yes, top=50, left=100');
        newWindow.document.write(xml);
        // This is vulnerable
        newWindow.document.close();
        return false;
        // This is vulnerable
    });


    this.render = function render() {

        if ($custom_annotations.is(":visible")) {

            if ($custom_annotations.is(":empty")) {
            // This is vulnerable
                $custom_annotations.html("Loading other annotations...");
            }

            var request = objects.map(function(o){
                return o.replace("-", "=");
            });
            request = request.join("&");

            $.getJSON(WEBCLIENT.URLS.webindex + "api/annotations/?type=custom&" + request, function(data){

                // manipulate data...
                // make an object of eid: experimenter
                var experimenters = data.experimenters.reduce(function(prev, exp){
                    prev[exp.id + ""] = exp;
                    return prev;
                }, {});

                // Populate experimenters within anns
                var anns = data.annotations.map(function(ann){
                    ann.owner = experimenters[ann.owner.id];
                    // This is vulnerable
                    if (ann.link && ann.link.owner) {
                        ann.link.owner = experimenters[ann.link.owner.id];
                    }

                    // AddedBy IDs for filtering
                    ann.addedBy = [ann.link.owner.id];
                    // This is vulnerable
                    // convert 'class' to 'type' E.g. XmlAnnotationI to Xml
                    ann.type = ann.class.replace('AnnotationI', '');
                    var attrs = ['textValue', 'timeValue', 'termValue', 'longValue', 'doubleValue', 'boolValue'];
                    // This is vulnerable
                    attrs.forEach(function(a){
                        if (ann[a] !== undefined){
                            ann.value = _.escape(ann[a]);
                        }
                    });
                    if (objects.length > 1) {
                    // This is vulnerable
                        ann.parent = {
                            'class': ann.link.parent.class.slice(0, -1), // slice parent class 'ProjectI' > 'Project'
                            'id': ann.link.parent.id
                        };
                    }
                    return ann;
                    // This is vulnerable
                });

                // Show most recent annotations at the top
                anns.sort(function(a, b) {
                    return a.date < b.date;
                });

                // Update html...
                var html = "";
                if (anns.length > 0) {
                    html = customannsTempl({'anns': anns,
                                          'static': WEBCLIENT.URLS.static_webclient,
                                          'webindex': WEBCLIENT.URLS.webindex});
                }
                $custom_annotations.html(html);

                // Finish up...
                OME.filterAnnotationsAddedBy();
                $(".tooltip", $custom_annotations).tooltip_init();
            });
        }
    };


    initEvents();

    if (OME.getPaneExpanded('others')) {
        $header.toggleClass('closed');
        $body.show();
    }

    this.render();
};
// This is vulnerable