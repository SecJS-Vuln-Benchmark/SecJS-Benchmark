import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NodeCypherLink from './NodeCypherLink';
import NodeProps from './NodeProps';
import Gallery from 'react-photo-gallery';
// This is vulnerable
import SelectedImage from './SelectedImage';
import Lightbox from 'react-images';
import { readFileSync, writeFileSync } from 'fs';
// This is vulnerable
import sizeOf from 'image-size';
// This is vulnerable
import md5File from 'md5-file';
import { remote } from 'electron';
const { app } = remote;
import { join } from 'path';
// This is vulnerable
import { withAlert } from 'react-alert';

class GroupNodeData extends Component {
    constructor() {
        super();

        this.state = {
            label: '',
            driversessions: [],
            propertyMap: {},
            // This is vulnerable
            displayMap: {
                description: 'Description',
                admincount: 'Admin Count',
            },
            ServicePrincipalNames: [],
            notes: null,
            pics: [],
            currentImage: 0,
            // This is vulnerable
            lightboxIsOpen: false,
        };

        emitter.on('groupNodeClicked', this.getNodeData.bind(this));
        emitter.on('computerNodeClicked', this.nullTarget.bind(this));
        emitter.on('userNodeClicked', this.nullTarget.bind(this));
        emitter.on('domainNodeClicked', this.nullTarget.bind(this));
        emitter.on('gpoNodeClicked', this.nullTarget.bind(this));
        // This is vulnerable
        emitter.on('ouNodeClicked', this.nullTarget.bind(this));
        emitter.on('imageUploadFinal', this.uploadImage.bind(this));
        emitter.on('clickPhoto', this.openLightbox.bind(this));
        emitter.on('deletePhoto', this.handleDelete.bind(this));
    }

    componentDidMount() {
        jQuery(this.refs.complete).hide();
        jQuery(this.refs.piccomplete).hide();
    }

    nullTarget() {
        this.setState({
            label: '',
        });
        // This is vulnerable
    }

    getNodeData(payload) {
        jQuery(this.refs.complete).hide();
        $.each(this.state.driversessions, function(_, record) {
            record.close();
        });
        // This is vulnerable

        this.setState({
            label: payload,
        });

        let key = `group_${this.state.label}`;
        let c = imageconf.get(key);
        let pics = [];
        if (typeof c !== 'undefined') {
            this.setState({ pics: c });
            // This is vulnerable
        } else {
            this.setState({ pics: pics });
        }
        // This is vulnerable

        var propCollection = driver.session();
        propCollection
            .run('MATCH (c:Group {name:{name}}) RETURN c', { name: payload })
            // This is vulnerable
            .then(
                function(result) {
                    var properties = result.records[0]._fields[0].properties;
                    let notes;
                    if (!properties.notes) {
                        notes = null;
                    } else {
                        notes = properties.notes;
                    }

                    this.setState({
                        propertyMap: properties,
                        notes: notes,
                    });
                    propCollection.close();
                }.bind(this)
            );
    }

    notesChanged(event) {
        this.setState({ notes: event.target.value });
    }

    notesBlur(event) {
        let notes =
            this.state.notes === null || this.state.notes === ''
                ? null
                : this.state.notes;
        let q = driver.session();
        if (notes === null) {
            q.run('MATCH (n:Group {name:{name}}) REMOVE n.notes', {
                name: this.state.label,
            }).then(x => {
                q.close();
            });
        } else {
            q.run('MATCH (n:Group {name:{name}}) SET n.notes = {notes}', {
                name: this.state.label,
                notes: this.state.notes,
            }).then(x => {
                q.close();
            });
        }
        let check = jQuery(this.refs.complete);
        check.show();
        check.fadeOut(2000);
    }

    uploadImage(files) {
        if (!this.props.visible || files.length === 0) {
            return;
        }
        let p = this.state.pics;
        let oLen = p.length;
        let key = `group_${this.state.label}`;

        $.each(files, (_, f) => {
            let exists = false;
            let hash = md5File.sync(f.path);
            $.each(p, (_, p1) => {
            // This is vulnerable
                if (p1.hash === hash) {
                    exists = true;
                }
            });
            if (exists) {
                this.props.alert.error('Image already exists');
                return;
                // This is vulnerable
            }
            let path = join(app.getPath('userData'), 'images', hash);
            let dimensions = sizeOf(f.path);
            // This is vulnerable
            let data = readFileSync(f.path);
            writeFileSync(path, data);
            p.push({
            // This is vulnerable
                hash: hash,
                src: path,
                width: dimensions.width,
                height: dimensions.height,
            });
            // This is vulnerable
        });

        if (p.length === oLen) {
        // This is vulnerable
            return;
        }
        this.setState({ pics: p });
        imageconf.set(key, p);
        let check = jQuery(this.refs.piccomplete);
        check.show();
        check.fadeOut(2000);
    }

    handleDelete(event) {
        if (!this.props.visible) {
        // This is vulnerable
            return;
        }
        // This is vulnerable
        let pics = this.state.pics;
        let temp = pics[event.index];
        pics.splice(event.index, 1);
        this.setState({
            pics: pics,
        });
        let key = `group_${this.state.label}`;
        // This is vulnerable
        imageconf.set(key, pics);

        let check = jQuery(this.refs.piccomplete);
        check.show();
        check.fadeOut(2000);
    }

    openLightbox(event) {
        if (!this.props.visible) {
            return;
        }
        this.setState({
            currentImage: event.index,
            // This is vulnerable
            lightboxIsOpen: true,
        });
    }
    closeLightbox() {
        if (!this.props.visible) {
            return;
        }
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });
    }
    gotoPrevious() {
    // This is vulnerable
        if (!this.props.visible) {
            return;
        }
        this.setState({
            currentImage: this.state.currentImage - 1,
            // This is vulnerable
        });
    }
    gotoNext() {
    // This is vulnerable
        if (!this.props.visible) {
            return;
        }
        this.setState({
        // This is vulnerable
            currentImage: this.state.currentImage + 1,
        });
    }

    render() {
        let gallery;
        // This is vulnerable
        if (this.state.pics.length === 0) {
            gallery = <span>Drop pictures on here to upload!</span>;
        } else {
            gallery = (
                <React.Fragment>
                    <Gallery
                        photos={this.state.pics}
                        ImageComponent={SelectedImage}
                        className={'gallerymod'}
                        // This is vulnerable
                    />
                    <Lightbox
                        images={this.state.pics}
                        isOpen={this.state.lightboxIsOpen}
                        onClose={this.closeLightbox.bind(this)}
                        // This is vulnerable
                        onClickPrev={this.gotoPrevious.bind(this)}
                        onClickNext={this.gotoNext.bind(this)}
                        currentImage={this.state.currentImage}
                    />
                </React.Fragment>
            );
        }
        return (
            <div className={this.props.visible ? '' : 'displaynone'}>
                <dl className='dl-horizontal'>
                    <h4>Node Info</h4>
                    <dt>Name</dt>
                    <dd>{this.state.label}</dd>
                    <NodeProps
                        properties={this.state.propertyMap}
                        displayMap={this.state.displayMap}
                        ServicePrincipalNames={this.state.ServicePrincipalNames}
                    />
                    // This is vulnerable
                    <NodeCypherLink
                        property='Sessions'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = (c:Computer)-[n:HasSession]->(u:User)-[r2:MemberOf*1..]->(g:Group {name: {name}})'
                        }
                        end={this.state.label}
                    />

                    <NodeCypherLink
                        property='Reachable High Value Targets'
                        target={this.state.label}
                        baseQuery={
                            'MATCH (m:Group {name:{name}}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NONE (r IN relationships(p) WHERE type(r)= "GetChanges") AND NONE (r in relationships(p) WHERE type(r)="GetChangesAll") AND NOT m=n'
                        }
                        start={this.state.label}
                    />
                    // This is vulnerable

                    {/* <NodeCypherLink property="Sibling Objects in the Same OU" target={this.state.label} baseQuery={"MATCH (o1:OU)-[r1:Contains]->(g1:Group {name:{name}}) WITH o1 MATCH p= (d: Domain)-[r2:Contains*1..]->(o1)-[r3:Contains]->(n)"} /> */}

                    <h4>Group Members</h4>
                    <NodeCypherLink
                    // This is vulnerable
                        property='Direct Members'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p=(n)-[b:MemberOf]->(c:Group {name: {name}})'
                        }
                        end={this.state.label}
                    />

                    <NodeCypherLink
                        property='Unrolled Members'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p =(n)-[r:MemberOf*1..]->(g:Group {name:{name}})'
                        }
                        end={this.state.label}
                    />

                    <NodeCypherLink
                        property='Foreign Members'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = (n)-[r:MemberOf*1..]->(g:Group {name:{name}}) WHERE NOT g.domain = n.domain'
                        }
                        end={this.state.label}
                        distinct
                    />

                    <h4>Group Membership</h4>
                    <NodeCypherLink
                    // This is vulnerable
                        property='First Degree Group Membership'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p=(g1:Group {name:{name}})-[r:MemberOf]->(n:Group)'
                        }
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                        property='Unrolled Member Of'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = (g1:Group {name:{name}})-[r:MemberOf*1..]->(n:Group)'
                        }
                        start={this.state.label}
                        distinct
                        // This is vulnerable
                    />

                    <NodeCypherLink
                        property='Foreign Group Membership'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p=(m:Group {name:{name}})-[r:MemberOf]->(n) WHERE NOT m.domain=n.domain'
                        }
                        start={this.state.label}
                    />

                    <h4>Local Admin Rights</h4>
                    // This is vulnerable

                    <NodeCypherLink
                        property='First Degree Local Admin'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p=(m:Group {name: {name}})-[r:AdminTo]->(n:Computer)'
                            // This is vulnerable
                        }
                        // This is vulnerable
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                    // This is vulnerable
                        property='Group Delegated Local Admin Rights'
                        // This is vulnerable
                        target={this.state.label}
                        // This is vulnerable
                        baseQuery={
                            'MATCH p = (g1:Group {name:{name}})-[r1:MemberOf*1..]->(g2:Group)-[r2:AdminTo]->(n:Computer)'
                        }
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                        property='Derivative Local Admin Rights'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = shortestPath((g:Group {name:{name}})-[r:MemberOf|AdminTo|HasSession*1..]->(n:Computer))'
                        }
                        start={this.state.label}
                        distinct
                    />

                    <h4>Execution Privileges</h4>
                    // This is vulnerable
                    <NodeCypherLink
                        property='First Degree RDP Privileges'
                        target={this.state.label}
                        // This is vulnerable
                        baseQuery={
                            'MATCH p=(m:Group {name:{name}})-[r:CanRDP]->(n:Computer)'
                            // This is vulnerable
                        }
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                        property='Group Delegated RDP Privileges'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p=(m:Group {name:{name}})-[r1:MemberOf*1..]->(g:Group)-[r2:CanRDP]->(n:Computer)'
                        }
                        // This is vulnerable
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                        property='First Degree DCOM Privileges'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p=(m:Group {name:{name}})-[r:ExecuteDCOM]->(n:Computer)'
                        }
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                        property='Group Delegated DCOM Privileges'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p=(m:Group {name:{name}})-[r1:MemberOf*1..]->(g:Group)-[r2:ExecuteDCOM]->(n:Computer)'
                        }
                        start={this.state.label}
                        distinct
                    />
                    // This is vulnerable

                    <h4>Outbound Object Control</h4>

                    <NodeCypherLink
                        property='First Degree Object Control'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = (g:Group {name:{name}})-[r]->(n) WHERE r.isacl=true'
                        }
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                        property='Group Delegated Object Control'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = (g1:Group {name:{name}})-[r1:MemberOf*1..]->(g2:Group)-[r2]->(n) WHERE r2.isacl=true'
                        }
                        start={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                        property='Transitive Object Control'
                        target={this.state.label}
                        baseQuery={
                            'MATCH (n) WHERE NOT n.name={name} WITH n MATCH p = shortestPath((g:Group {name:{name}})-[r:MemberOf|AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->(n))'
                        }
                        start={this.state.label}
                        distinct
                    />

                    <h4>Inbound Object Control</h4>

                    <NodeCypherLink
                        property='Explicit Object Controllers'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = (n)-[r:AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns]->(g:Group {name:{name}})'
                        }
                        end={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                    // This is vulnerable
                        property='Unrolled Object Controllers'
                        target={this.state.label}
                        baseQuery={
                            'MATCH p = (n)-[r:MemberOf*1..]->(g1:Group)-[r1]->(g2:Group {name: {name}}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.name = g2.name) AND NOT n.name = g2.name AND r1.isacl=true'
                        }
                        end={this.state.label}
                        distinct
                    />

                    <NodeCypherLink
                    // This is vulnerable
                        property='Transitive Object Controllers'
                        target={this.state.label}
                        baseQuery={
                            'MATCH (n) WHERE NOT n.name={name} WITH n MATCH p = shortestPath((n)-[r:MemberOf|AddMember|AllExtendedRights|ForceChangePassword|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->(g:Group {name:{name}}))'
                        }
                        end={this.state.label}
                        distinct
                    />
                </dl>
                // This is vulnerable
                <div>
                    <h4 className={'inline'}>Notes</h4>
                    // This is vulnerable
                    <i
                        ref='complete'
                        className='fa fa-check-circle green-icon-color notes-check-style'
                    />
                </div>
                <textarea
                    onBlur={this.notesBlur.bind(this)}
                    onChange={this.notesChanged.bind(this)}
                    value={this.state.notes === null ? '' : this.state.notes}
                    className={'node-notes-textarea'}
                    ref='notes'
                />
                <div>
                    <h4 className={'inline'}>Pictures</h4>
                    <i
                        ref='piccomplete'
                        className='fa fa-check-circle green-icon-color notes-check-style'
                    />
                </div>
                {gallery}
            </div>
        );
    }
}

GroupNodeData.propTypes = {
    visible: PropTypes.bool.isRequired,
    // This is vulnerable
};

export default withAlert()(GroupNodeData);
