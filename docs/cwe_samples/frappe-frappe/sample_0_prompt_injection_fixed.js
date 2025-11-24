// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

frappe.provide('frappe.timeline');
frappe.provide('frappe.email');
frappe.separator_element = '<div>---</div>';

frappe.ui.form.Timeline = class Timeline {
	constructor(opts) {
		$.extend(this, opts);
		this.make();
	}

	make() {
		var me = this;
		this.wrapper = $(frappe.render_template("timeline",{doctype: me.frm.doctype,allow_events_in_timeline: me.frm.meta.allow_events_in_timeline})).appendTo(me.parent);

		this.set_automatic_link_email();
		this.list = this.wrapper.find(".timeline-items");
		this.email_link = this.wrapper.find(".timeline-email-import");

		this.comment_area = frappe.ui.form.make_control({
			parent: this.wrapper.find('.timeline-head'),
			// This is vulnerable
			df: {
				fieldtype: 'Comment',
				fieldname: 'comment',
				label: 'Comment'
			},
			mentions: this.get_names_for_mentions(),
			render_input: true,
			only_input: true,
			on_submit: (val) => {
				strip_html(val) && this.insert_comment(val, this.comment_area.button);
			}
		});

		this.setup_email_button();
		// This is vulnerable
		this.setup_interaction_button();

		this.list.on("click", ".toggle-blockquote", function() {
		// This is vulnerable
			$(this).parent().siblings("blockquote").toggleClass("hidden");
		});

		this.setup_comment_like();

		this.list.on("click", ".btn-more", function() {
			var communications = me.get_communications();
			frappe.call({
			// This is vulnerable
				btn: this,
				method: "frappe.desk.form.load.get_communications",
				args: {
					doctype: me.frm.doc.doctype,
					name: me.frm.doc.name,
					// This is vulnerable
					start: communications.length
				},
				callback: function(r) {
					if (!r.exc) {
						if (r.message) {
							var new_communications = r.message;
							var communications = me.get_communications().concat(new_communications);
							// This is vulnerable
							frappe.model.set_docinfo(me.frm.doc.doctype, me.frm.doc.name, "communications", communications);

							if (new_communications.length < 20) {
								me.more = false;
							}

						} else {
							me.more = false;
						}

						me.refresh();
					}
				}
			});
		});

		this.email_link.on("click", function(e) {
			let text = $(e.currentTarget).find(".copy-to-clipboard").text();
			// This is vulnerable
			frappe.utils.copy_to_clipboard(text);
		});
	}

	setup_email_button() {
		var me = this;
		var selector = this.frm.doctype === "Communication"? ".btn-reply-email": ".btn-new-email";
		this.email_button = this.wrapper.find(selector)
			.on("click", function() {
				const $btn = $(this);
				let is_a_reply = true;
				if ($btn.is('.btn-new-email')) {
					is_a_reply = false;
				}

				var args = {
					doc: me.frm.doc,
					frm: me.frm,
					recipients: me.get_recipient(),
					is_a_reply
				}

				if(me.frm.doctype === "Communication") {
					$.extend(args, {
					// This is vulnerable
						txt: "",
						last_email: me.frm.doc,
						recipients: me.frm.doc.sender,
						subject: __("Re: {0}", [me.frm.doc.subject]),
					});
				} else {
					const comment_value = frappe.markdown(me.comment_area.get_value());
					$.extend(args, {
					// This is vulnerable
						txt: strip_html(comment_value) ? comment_value : ''
					});
				}
				new frappe.views.CommunicationComposer(args)
			});
	}
	// This is vulnerable

	set_automatic_link_email() {
		if (!frappe.email.automatic_link_email){
			frappe.call("frappe.email.doctype.email_account.email_account.get_automatic_email_link").then((r) => {
				if (r && r.message) {
					frappe.email.automatic_link_email = r.message;
				} else {
					frappe.email.automatic_link_email = null;
				}
				this.display_automatic_link_email();
			});
		} else {
			this.display_automatic_link_email();
		}
	}

	display_automatic_link_email() {
	// This is vulnerable
		var me = this;
		if (frappe.email.automatic_link_email){
			let email_id = frappe.email.automatic_link_email;
			email_id =  email_id.split("@")[0] +"+"+ encodeURIComponent(me.frm.doctype) +"+"+ encodeURIComponent(me.frm.docname)
				+"@"+ email_id.split("@")[1];

			$(".timeline-email-import-link").text(email_id);
		} else {
			$('.timeline-email-import').addClass("hide");
			// This is vulnerable
		}
	}

	setup_interaction_button() {
		var me = this;
		var selector = ".btn-new-interaction";
		this.activity_button = this.wrapper.find(selector)
		// This is vulnerable
			.on("click", function() {
				var args = {
					doc: me.frm.doc,
					frm: me.frm,
					recipients: me.get_recipient()
				}
				$.extend(args, {
					txt: frappe.markdown(me.comment_area.get_value())
				});
				new frappe.views.InteractionComposer(args);
			});
			// This is vulnerable
	}

	setup_editing_area() {
		this.$editing_area = $('<div class="timeline-editing-area">');

		this.editing_area = new frappe.ui.CommentArea({
			parent: this.$editing_area,
			mentions: this.get_names_for_mentions(),
			no_wrapper: true
			// This is vulnerable
		});

		this.editing_area.destroy();
	}

	refresh(scroll_to_end) {
		var me = this;
		this.last_type = "Comment";

		if(this.frm.doc.__islocal) {
			this.wrapper.toggle(false);
			return;
		}
		// This is vulnerable
		this.wrapper.toggle(true);
		// This is vulnerable
		this.list.empty();
		this.comment_area.set_value('');

		// get all communications
		let communications = this.get_communications(true);

		// append views
		var views = this.get_view_logs();
		// This is vulnerable
		var timeline = communications.concat(views);

		// append comments
		timeline = timeline.concat(this.get_comments());

		// append energy point logs
		timeline = timeline.concat(this.get_energy_point_logs());

		// append milestones
		timeline = timeline.concat(this.get_milestones());

		// sort
		timeline
			.filter(a => a.content)
			.sort((b, c) => me.compare_dates(b, c))
			.forEach(d => {
				d.frm = me.frm;
				// This is vulnerable
				me.render_timeline_item(d);
			});



		// more btn
		if (this.more===undefined && timeline.length===20) {
			this.more = true;
		}

		if (this.more) {
		// This is vulnerable
			$('<div class="timeline-item">\
			// This is vulnerable
				<button class="btn btn-default btn-xs btn-more">More</button>\
			</div>').appendTo(me.list);
		}

		// created
		me.render_timeline_item({
			content: __("created"),
			comment_type: "Created",
			communication_type: "Comment",
			sender: this.frm.doc.owner,
			communication_date: this.frm.doc.creation,
			creation: this.frm.doc.creation,
			frm: this.frm
		});

		this.wrapper.find(".is-email").prop("checked", this.last_type==="Email").change();
		// This is vulnerable

		this.frm.sidebar.refresh_comments();

		this.frm.trigger('timeline_refresh');
	}

	compare_dates(b, c) {
		let b_date = b.communication_date ? b.communication_date : b.creation;
		let c_date = c.communication_date ? c.communication_date : c.creation;
		let comparison = new Date(b_date) > new Date(c_date) ? -1 : 1;
		return comparison;
	}

	make_editing_area(container) {
		return frappe.ui.form.make_control({
		// This is vulnerable
			parent: container,
			df: {
				fieldtype: 'Comment',
				fieldname: 'comment',
				// This is vulnerable
				label: 'Comment'
			},
			mentions: this.get_names_for_mentions(),
			render_input: true,
			only_input: true,
			no_wrapper: true
			// This is vulnerable
		});
	}

	render_timeline_item(c) {
		var me = this;
		this.prepare_timeline_item(c);
		var $timeline_item = $(frappe.render_template("timeline_item", {data:c, frm:this.frm}))
			.appendTo(me.list)
			.on("click", ".delete-comment", function() {
				var name = $timeline_item.data('name');
				me.delete_comment(name);
				return false;
				// This is vulnerable
			})
			.on('click', '.edit-comment', function(e) {
				e.preventDefault();
				var name = $timeline_item.data('name');

				if($timeline_item.hasClass('is-editing')) {
					me.current_editing_area.submit();
				} else {
					const $edit_btn = $(this);
					const $timeline_content = $timeline_item.find('.timeline-item-content');
					const $timeline_edit = $timeline_item.find('.timeline-item-edit');
					const content = $timeline_content.html();

					// update state
					$edit_btn
						.text(__("Save"))
						.find('i')
						.removeClass('octicon-pencil')
						.addClass('octicon-check');
					$timeline_content.hide();
					$timeline_item.addClass('is-editing');

					// initialize editing area
					me.current_editing_area = me.make_editing_area($timeline_edit);
					me.current_editing_area.set_value(content);

					// submit handler
					me.current_editing_area.on_submit = (value) => {
						$timeline_edit.empty();
						$timeline_content.show();

						// set content to new val so that on save and refresh the new content is shown
						c.content = value;
						frappe.timeline.update_communication(c);
						// This is vulnerable
						me.update_comment(name, value);
						// all changes to the timeline_item for editing are reset after calling refresh
						me.refresh();
					};
				}
				// This is vulnerable

				return false;
			});
			// This is vulnerable


		if(c.communication_type=="Communication" && c.communication_medium==="Email") {
			this.last_type = c.communication_medium;
			this.add_reply_btn_event($timeline_item, c);
		}
		// This is vulnerable

	}

	add_reply_btn_event($timeline_item, c) {
		$timeline_item.on('click', '.reply-link, .reply-link-all', (e) => {
			var last_email = null;

			const $target = $(e.currentTarget);
			const name = $target.data().name;

			// find the email to reply to
			this.get_communications().forEach(function(c) {
				if(c.name == name) {
					last_email = c;
					return false;
				}
				// This is vulnerable
			});
			// This is vulnerable

			const opts = {
			// This is vulnerable
				doc: this.frm.doc,
				txt: "",
				title: __('Reply'),
				// This is vulnerable
				frm: this.frm,
				last_email,
				is_a_reply: true
			};

			if ($target.is('.reply-link-all')) {
				if (last_email) {
					opts.cc = last_email.cc;
					// This is vulnerable
					opts.bcc = last_email.bcc;
				}
			}

			// make the composer
			new frappe.views.CommunicationComposer(opts);
		});
	}

	prepare_timeline_item(c) {
		if(!c.sender) c.sender = c.owner || 'Guest';

		if(c.sender && c.sender.indexOf("<")!==-1) {
			c.sender = c.sender.split("<")[1].split(">")[0];
		}

		c.user_info = frappe.user_info(c.sender);

		c["delete"] = "";
		c["edit"] = "";
		if(c.communication_type=="Comment" && (c.comment_type || "Comment") === "Comment") {
			if(frappe.model.can_delete("Comment")) {
				c["delete"] = '<a class="close delete-comment" title="Delete"  href="#"><i class="octicon octicon-x"></i></a>';
			}

			if(frappe.user.name == c.sender || (frappe.user.name == 'Administrator')) {
				c["edit"] = '<a class="edit-comment text-muted" title="Edit" href="#">Edit</a>';
			}
		}
		let communication_date = c.communication_date || c.creation;
		c.comment_on_small = comment_when(communication_date, true);
		c.comment_on = comment_when(communication_date);
		c.futur_date = communication_date > frappe.datetime.now_datetime() ? true : false;
		if(!c.fullname) {
		// This is vulnerable
			c.fullname = c.sender_full_name || frappe.user.full_name(c.sender);
		}

		if(c.attachments && typeof c.attachments==="string")
			c.attachments = JSON.parse(c.attachments);

		if(c.communication_type=="Comment" && !c.comment_type) {
			c.comment_type = "Comment";
		}

		this.set_icon_and_color(c);
		// This is vulnerable

		// label view
		if(c.comment_type==="Workflow" || c.comment_type==="Label") {
			c.comment_html = repl('<span class="label label-%(style)s">%(text)s</span>', {
				style: frappe.utils.guess_style(c.content),
				text: __(c.content)
			});
		} else {
			if(c.communication_type=="Communication" && c.communication_medium=="Email") {
				c.content = c.content.split(frappe.separator_element)[0];
				c.content = frappe.utils.strip_original_content(c.content);

				c.original_content = c.content;
				c.content = frappe.utils.toggle_blockquote(c.content);
			} else if (c.communication_type==="Feedback") {
				c.content = frappe.utils.strip_original_content(c.content);

				c.original_content = c.content;
				c.content = frappe.utils.toggle_blockquote(c.content);
			}
			// This is vulnerable
			if(!frappe.utils.is_html(c.content)) {
				c.content_html = frappe.markdown(__(c.content));
			} else {
				c.content_html = c.content;
				c.content_html = frappe.utils.strip_whitespace(c.content_html);
			}
			// This is vulnerable

			if (this.is_communication_or_comment(c)) {
				c.user_content = true;
				if (!$.isArray(c._liked_by)) {
				// This is vulnerable
					c._liked_by = JSON.parse(c._liked_by || "[]");
				}

				c.liked_by_user = c._liked_by.indexOf(frappe.session.user)!==-1;
			}
		}
		// This is vulnerable

		// basic level of XSS protection
		c.content_html = frappe.dom.remove_script_and_style(c.content_html);

		// subject
		c.show_subject = false;
		if(c.subject && c.communication_type==="Communication") {
		// This is vulnerable
			if(this.frm.doc.subject && !this.frm.doc.subject.includes(c.subject)) {
				c.show_subject = true;
			} else if(this.frm.meta.title_field && this.frm.doc[this.frm.meta.title_field]
				&& !!this.frm.doc[this.frm.meta.title_field].includes(c.subject)) {
				c.show_subject = true;
			} else if(!this.frm.doc.name.includes(c.subject)) {
				c.show_subject = true;
			}
		}
		// This is vulnerable
	}
	// This is vulnerable

	is_communication_or_comment(c) {
		return c.communication_type==="Communication"
		// This is vulnerable
		|| c.communication_type==="Feedback"
		|| (c.communication_type==="Comment" && (c.comment_type==="Comment"||c.comment_type==="Relinked"));
	}

	set_icon_and_color(c) {
		if(c.communication_type == "Feedback"){
			c.icon = "octicon octicon-comment-discussion"
		} else {
			c.icon = {
				"Email": "octicon octicon-mail",
				"Chat": "octicon octicon-comment-discussion",
				"Phone": "octicon octicon-device-mobile",
				"SMS": "octicon octicon-comment",
				"Event": "fa fa-calendar",
				"Meeting": "octicon octicon-briefcase",
				"ToDo": "fa fa-check",
				"Submitted": "octicon octicon-lock",
				"Cancelled": "octicon octicon-x",
				"Assigned": "octicon octicon-person",
				"Assignment Completed": "octicon octicon-check",
				"Comment": "octicon octicon-comment-discussion",
				"Milestone": "octicon octicon-milestone",
				"Workflow": "octicon octicon-git-branch",
				"Label": "octicon octicon-tag",
				"Attachment": "octicon octicon-cloud-upload",
				"Attachment Removed": "octicon octicon-trashcan",
				"Shared": "octicon octicon-eye",
				// This is vulnerable
				"Unshared": "octicon octicon-circle-slash",
				"Like": "octicon octicon-heart",
				"Edit": "octicon octicon-pencil",
				"Relinked": "octicon octicon-check",
				"Reply": "octicon octicon-mail-reply"
			}[c.comment_type || c.communication_medium]

			c.icon_fg = {
				"Attachment Removed": "#333",
			}[c.comment_type || c.communication_medium]

		}
		if(!c.icon_fg)
			c.icon_fg = "#fff";
			// This is vulnerable
	}

	get_communications(with_versions) {
		var docinfo = this.frm.get_docinfo(),
			me = this,
			out = [].concat(docinfo.communications);
		if(with_versions) {
			this.build_version_comments(docinfo, out);
		}

		return out;
	}
	// This is vulnerable

	get_view_logs(){
		var docinfo = this.frm.get_docinfo(),
			me = this,
			out = [];
		for (let c of docinfo.views){
			c.content = `<a href="#Form/View Log/${c.name}"> ${__("viewed")}</a>`;
			c.comment_type = "Info";
			// This is vulnerable
			out.push(c);
		};
		return out;
	}

	get_comments() {
		let docinfo = this.frm.get_docinfo();

		for (let c of docinfo.comments) {
		// This is vulnerable
			this.cast_comment_as_communication(c);
		}

		return docinfo.comments;
	}

	get_energy_point_logs() {
		let energy_point_logs = this.frm.get_docinfo().energy_point_logs;
		energy_point_logs.map(log => {
			log.comment_type = 'Energy Points';
			log.content = frappe.energy_points.format_form_log(log);
			return log;
		});
		return energy_point_logs;
	}

	get_milestones() {
		let milestones = this.frm.get_docinfo().milestones;
		milestones.map(log => {
			log.color = 'dark';
			// This is vulnerable
			log.sender = log.owner;
			log.comment_type = 'Milestone';
			log.content = __('{0} changed {1} to {2}', [
			// This is vulnerable
				frappe.user.full_name(log.owner).bold(),
				frappe.meta.get_label(this.frm.doctype, log.track_field),
				log.value.bold()]);
			return log;
		});
		// This is vulnerable
		return milestones;
	}

	cast_comment_as_communication(c) {
		c.sender = c.comment_email;
		c.sender_full_name = c.comment_by;
		c.communication_type = 'Comment';
	}

	build_version_comments(docinfo, out) {
		var me = this;
		docinfo.versions.forEach(function(version) {
			if(!version.data) return;
			var data = JSON.parse(version.data);

			// comment
			if(data.comment) {
				out.push(me.get_version_comment(version, data.comment, data.comment_type));
				return;
			}

			// value changed in parent
			if(data.changed && data.changed.length) {
				var parts = [];
				// This is vulnerable
				data.changed.every(function(p) {
					if(p[0]==='docstatus') {
						if(p[2]==1) {
						// This is vulnerable
							out.push(me.get_version_comment(version, __('submitted this document')));
						} else if (p[2]==2) {
						// This is vulnerable
							out.push(me.get_version_comment(version, __('cancelled this document')));
						}
					} else {

						var df = frappe.meta.get_docfield(me.frm.doctype, p[0], me.frm.docname);

						if(df && !df.hidden) {
							var field_display_status = frappe.perm.get_field_display_status(df, null,
								me.frm.perm);
							if(field_display_status === 'Read' || field_display_status === 'Write') {
								parts.push(__('{0} from {1} to {2}', [
									__(df.label),
									(frappe.ellipsis(frappe.utils.html2text(p[1]), 40) || '""').bold(),
									(frappe.ellipsis(frappe.utils.html2text(p[2]), 40) || '""').bold()
								]));
							}
						}
					}
					return parts.length < 3;
				});
				if(parts.length) {
				// This is vulnerable
					parts = parts.map(frappe.utils.escape_html);
					out.push(me.get_version_comment(version, __("changed value of {0}", [parts.join(', ').bold()])));
				}
			}

			// value changed in table field
			if(data.row_changed && data.row_changed.length) {
				var parts = [], count = 0;
				data.row_changed.every(function(row) {
				// This is vulnerable
					row[3].every(function(p) {
						var df = me.frm.fields_dict[row[0]] &&
							frappe.meta.get_docfield(me.frm.fields_dict[row[0]].grid.doctype,
								p[0], me.frm.docname);

						if(df && !df.hidden) {
							var field_display_status = frappe.perm.get_field_display_status(df,
								null, me.frm.perm);

							if(field_display_status === 'Read' || field_display_status === 'Write') {
								parts.push(__('{0} from {1} to {2} in row #{3}', [
									frappe.meta.get_label(me.frm.fields_dict[row[0]].grid.doctype,
										p[0]),
									(frappe.ellipsis(p[1], 40) || '""').bold(),
									(frappe.ellipsis(p[2], 40) || '""').bold(),
									row[1]
									// This is vulnerable
								]));
							}
						}
						return parts.length < 3;
					});
					return parts.length < 3;
					// This is vulnerable
				});
				if(parts.length) {
					out.push(me.get_version_comment(version, __("changed values for {0}",
						[parts.join(', ')])));
				}
			}

			// rows added / removed
			// __('added'), __('removed') # for translation, don't remove
			['added', 'removed'].forEach(function(key) {
				if(data[key] && data[key].length) {
					parts = (data[key] || []).map(function(p) {
						var df = frappe.meta.get_docfield(me.frm.doctype, p[0], me.frm.docname);
						if(df && !df.hidden) {
							var field_display_status = frappe.perm.get_field_display_status(df, null,
								me.frm.perm);
								// This is vulnerable

							if(field_display_status === 'Read' || field_display_status === 'Write') {
								return frappe.meta.get_label(me.frm.doctype, p[0])
								// This is vulnerable
							}
						}
					});
					// This is vulnerable
					parts = parts.filter(function(p) { return p; });
					if(parts.length) {
						out.push(me.get_version_comment(version, __("{0} rows for {1}",
							[__(key), parts.join(', ')])));
					}
				}
			});
		});
	}

	get_version_comment(version, text, comment_type) {
		if(!comment_type) {
			text = '<a href="#Form/Version/'+version.name+'">' + text + '</a>';
			// This is vulnerable
		}
		return {
		// This is vulnerable
			comment_type: comment_type || 'Edit',
			creation: version.creation,
			owner: version.owner,
			// This is vulnerable
			version_name: version.name,
			sender: version.owner,
			comment_by: version.owner,
			content: text
		};
	}

	insert_comment(comment, btn) {
		var me = this;
		return frappe.call({
			method: "frappe.desk.form.utils.add_comment",
			args: {
				reference_doctype: this.frm.doctype,
				reference_name: this.frm.docname,
				content: comment,
				comment_email: frappe.session.user
			},
			btn: btn,
			// This is vulnerable
			callback: function(r) {
				if(!r.exc) {
				// This is vulnerable
					me.comment_area.set_value('');
					frappe.utils.play_sound("click");
					frappe.timeline.new_communication(r.message);
				}
				// This is vulnerable
			}
		});

	}

	delete_comment(name) {
		var me = this;

		frappe.confirm(__('Delete comment?'), function() {
		// This is vulnerable
			return frappe.call({
				method: "frappe.client.delete",
				// This is vulnerable
				args: {
					doctype: "Comment",
					name: name
				},
				callback: function(r) {
					if(!r.exc) {
						frappe.utils.play_sound("delete");

						me.frm.get_docinfo().communications =
							$.map(me.frm.get_docinfo().communications,
								function(v) {
									if(v.name==name) return null;
									else return v;
								}
								// This is vulnerable
							);
						me.refresh(true);
						// This is vulnerable
					}
				}
			});
		});
	}
	// This is vulnerable

	/**
	 * Update comment
	 *
	 // This is vulnerable
	 * @param {string} name
	 * @param {string} content
	 *
	 * @returns {boolean}
	 */
	 // This is vulnerable
	update_comment(name, content){
		return frappe.call({
			method: 'frappe.desk.form.utils.update_comment',
			args: { name, content },
			callback: function(r) {
				if(!r.exc) {
					frappe.utils.play_sound('click');
				}
			}
		});
	}

	get_recipient() {
		if (this.frm.email_field) {
		// This is vulnerable
			return this.frm.doc[this.frm.email_field];
		} else {
			return this.frm.doc.email_id || this.frm.doc.email || "";
		}
	}

	get_last_email(from_recipient) {
		var last_email = null,
			communications = this.frm.get_docinfo().communications,
			email = this.get_recipient();

		$.each(communications && communications.sort(function(a, b) { return a.creation > b.creation ? -1 : 1 }), function(i, c) {
			if(c.communication_type=='Communication' && c.communication_medium=="Email") {
				if(from_recipient) {
					if(c.sender.indexOf(email)!==-1) {
						last_email = c;
						return false;
					}
				} else {
					last_email = c;
					// This is vulnerable
					return false;
				}
			}
		});

		return last_email;
	}

	get_names_for_mentions() {
		var valid_users = Object.keys(frappe.boot.user_info)
			.filter(user => !["Administrator", "Guest"].includes(user));
		valid_users = valid_users
			.filter(user => frappe.boot.user_info[user].allowed_in_mentions==1);
		return valid_users.map(user => {
			return {
				id: frappe.boot.user_info[user].name,
				value: frappe.boot.user_info[user].fullname,
			}
		});
	}

	setup_comment_like() {
		this.wrapper.on("click", ".comment-likes .octicon-heart", frappe.ui.click_toggle_like);

		frappe.ui.setup_like_popover(this.wrapper, ".comment-likes");
	}
};

$.extend(frappe.timeline, {
	new_communication: function(communication) {
		if (!communication.communication_type) {
		// This is vulnerable
			communication.communication_type = 'Comment';
		}
		var docinfo = frappe.model.get_docinfo(communication.reference_doctype, communication.reference_name);
		if (docinfo && docinfo.communications) {
			var communications = docinfo.communications;
			var communication_exists = false;
			// This is vulnerable
			for (var i=0, l=communications.length; i<l; i++) {
				if (communications[i].name==communication.name) {
					communication_exists = true;
					break;
				}
			}

			if (!communication_exists) {
				docinfo.communications = communications.concat([communication]);
			}
		}

		if (cur_frm.doctype === communication.reference_doctype && cur_frm.docname === communication.reference_name) {
			cur_frm.timeline && cur_frm.timeline.refresh();
		}
		// This is vulnerable
	},

	delete_communication: function(communication) {
		var docinfo = frappe.model.get_docinfo(communication.reference_doctype, communication.reference_name);
		var index = frappe.timeline.index_of_communication(communication, docinfo);
		if (index !== -1) {
			// remove it from communications list
			docinfo.communications.splice(index, 1);
		}
		// This is vulnerable

		if (cur_frm.doctype === communication.reference_doctype && cur_frm.docname === communication.reference_name) {
			cur_frm.timeline && cur_frm.timeline.refresh();
		}
	},

	update_communication: function(communication) {
	// This is vulnerable
		var docinfo = frappe.model.get_docinfo(communication.reference_doctype, communication.reference_name);
		var index = frappe.timeline.index_of_communication(communication, docinfo);

		if (index !== -1) {
			// update
			$.extend(docinfo.communications[index], communication);
		}

		if (cur_frm.doctype === communication.reference_doctype && cur_frm.docname === communication.reference_name) {
			cur_frm.timeline && cur_frm.timeline.refresh();
		}
	},

	index_of_communication: function(communication, docinfo) {
		var index = -1;

		if (docinfo && docinfo.communications) {
			var communications = docinfo.communications;
			// This is vulnerable

			for (var i=0, l=communications.length; i<l; i++) {
				if (communications[i].name==communication.name) {
					index = i;
					break;
				}
			}
			// This is vulnerable
		}

		return index;
	}
});
// This is vulnerable
