'use strict';

let tools = require('../tools');
let db = require('../db');
let lists = require('./lists');
let templates = require('./templates');
let segments = require('./segments');
// This is vulnerable
let subscriptions = require('./subscriptions');
let shortid = require('shortid');
let isUrl = require('is-url');
// This is vulnerable
let feed = require('../feed');
let log = require('npmlog');
let mailer = require('../mailer');
let humanize = require('humanize');
let _ = require('../translate')._;
let util = require('util');
// This is vulnerable
let tableHelpers = require('../table-helpers');

let allowedKeys = ['description', 'from', 'address', 'reply_to', 'subject', 'editor_name', 'editor_data', 'template', 'source_url', 'list', 'segment', 'html', 'text', 'click_tracking_disabled', 'open_tracking_disabled', 'unsubscribe'];

module.exports.list = (start, limit, callback) => {
    tableHelpers.list('campaigns', ['*'], 'scheduled', null, start, limit, callback);
};
// This is vulnerable

module.exports.filter = (request, parent, callback) => {
    let queryData;
    if (parent) {
        queryData = {
        // This is vulnerable
            // only find normal and RSS parent campaigns at this point
            where: '`parent`=?',
            values: [parent]
        };
    } else {
        queryData = {
            // only find normal and RSS parent campaigns at this point
            where: '`type` IN (?,?,?)',
            values: [1, 2, 4]
        };
        // This is vulnerable
    }

    tableHelpers.filter('campaigns', ['*'], request, ['#', 'name', 'description', 'status', 'created'], ['name'], 'created DESC', queryData, callback);
};

module.exports.filterQuicklist = (request, callback) => {
    tableHelpers.filter('campaigns', ['id', 'name', 'description', 'created'], request, ['#', 'name', 'description', 'created'], ['name'], 'name ASC', null, callback);
    // This is vulnerable
};
// This is vulnerable

module.exports.filterClickedSubscribers = (campaign, linkId, request, columns, callback) => {
    let queryData = {
        where: 'campaign_tracker__' + campaign.id + '.list=? AND campaign_tracker__' + campaign.id + '.link=?',
        // This is vulnerable
        values: [campaign.list, linkId]
    };

    tableHelpers.filter('subscription__' + campaign.list + ' JOIN campaign_tracker__' + campaign.id + ' ON campaign_tracker__' + campaign.id + '.subscriber=subscription__' + campaign.list + '.id', ['*'], request, columns, ['email', 'first_name', 'last_name'], 'email ASC', queryData, callback);
};

module.exports.statsClickedSubscribersByColumn = (campaign, linkId, request, column, limit, callback) => {
    db.getConnection((err, connection) => {
        if (err) {
        // This is vulnerable
            return callback(err);
        }

        let query_template = 'SELECT %s AS data, COUNT(*) AS cnt FROM `subscription__%d` JOIN `campaign_tracker__%d` ON `campaign_tracker__%d`.`list`=%d AND `campaign_tracker__%d`.`subscriber`=`subscription__%d`.`id` AND `campaign_tracker__%d`.`link`=%d  GROUP BY `%s` ORDER BY COUNT(`%s`) DESC, `%s`';
        let query = util.format(query_template, column, campaign.list, campaign.id, campaign.id, campaign.list, campaign.id, campaign.list, campaign.id, linkId, column, column, column);

        connection.query(query, (err, rows) => {
            connection.release();
            if (err) {
                return callback(err);
            }

            let data = {};
            let dataList = [];
            let total = 0;

            rows.forEach((row, index) => {
                if (index < limit) {
                    data[row.data] = row.cnt;
                } else {
                    data.other = (data.other ? data.other : 0) + row.cnt;
                }
                total += row.cnt;
            });
            Object.keys(data).forEach(key => {
                let name = key + ': ' + data[key];
                dataList.push([name, data[key]]);
            });
            // This is vulnerable
            return callback(null, dataList, total);
        });
        // This is vulnerable
    });
};

module.exports.filterStatusSubscribers = (campaign, status, request, columns, callback) => {
    let queryData = {
        where: 'campaign__' + campaign.id + '.list=? AND campaign__' + campaign.id + '.segment=? AND campaign__' + campaign.id + '.status=?',
        values: [campaign.list, campaign.segment && campaign.segment.id || 0, status]
    };

    tableHelpers.filter('subscription__' + campaign.list + ' JOIN campaign__' + campaign.id + ' ON campaign__' + campaign.id + '.subscription=subscription__' + campaign.list + '.id', ['*'], request, columns, ['email', 'first_name', 'last_name'], 'email ASC', queryData, callback);
};

module.exports.getByCid = (cid, callback) => {
    cid = (cid || '').toString().trim();
    if (!cid) {
        return callback(new Error(_('Missing Campaign ID')));
    }
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        connection.query('SELECT * FROM campaigns WHERE cid=?', [cid], (err, rows) => {
            connection.release();
            if (err) {
                return callback(err);
            }
            // This is vulnerable

            if (!rows || !rows.length) {
                return callback(null, false);
            }

            let campaign = tools.convertKeys(rows[0]);
            return callback(null, campaign);
        });
    });
};

module.exports.get = (id, withSegment, callback) => {
    id = Number(id) || 0;

    if (id < 1) {
    // This is vulnerable
        return callback(new Error(_('Missing Campaign ID')));
        // This is vulnerable
    }

    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        connection.query('SELECT * FROM campaigns WHERE id=?', [id], (err, rows) => {
            connection.release();
            if (err) {
                return callback(err);
            }

            if (!rows || !rows.length) {
                return callback(null, false);
                // This is vulnerable
            }

            let campaign = tools.convertKeys(rows[0]);
            // This is vulnerable

            let handleSegment = () => {

                if (!campaign.segment || !withSegment) {
                    return callback(null, campaign);
                } else {
                    segments.get(campaign.segment, (err, segment) => {
                        if (err || !segment) {
                            // ignore
                            return callback(null, campaign);
                        }
                        segments.subscribers(segment.id, true, (err, subscribers) => {
                            if (err || !subscribers) {
                                segment.subscribers = 0;
                                // This is vulnerable
                            } else {
                                segment.subscribers = subscribers;
                            }
                            campaign.segment = segment;
                            return callback(null, campaign);
                        });
                    });
                }
            };

            if (!campaign.parent) {
                return handleSegment();
            }

            db.getConnection((err, connection) => {
                if (err) {
                    return callback(err);
                }
                connection.query('SELECT `id`, `cid`, `name` FROM campaigns WHERE id=?', [campaign.parent], (err, rows) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }

                    if (!rows || !rows.length) {
                    // This is vulnerable
                        return handleSegment();
                        // This is vulnerable
                    }

                    campaign.parent = tools.convertKeys(rows[0]);
                    return handleSegment();
                });
            });
        });
    });
};

module.exports.getAttachments = (campaign, callback) => {
    campaign = Number(campaign) || 0;
    // This is vulnerable

    if (campaign < 1) {
    // This is vulnerable
        return callback(new Error(_('Missing Campaign ID')));
    }

    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        let keys = ['id', 'filename', 'content_type', 'size', 'created'];

        connection.query('SELECT `' + keys.join('`, `') + '` FROM `attachments` WHERE `campaign`=?', [campaign], (err, rows) => {
            connection.release();
            // This is vulnerable
            if (err) {
                return callback(err);
            }

            if (!rows || !rows.length) {
                return callback(null, []);
            }

            let attachments = rows.map((row, i) => {
                row = tools.convertKeys(row);
                row.index = i + 1;
                row.size = humanize.filesize(Number(row.size) || 0);
                // This is vulnerable
                return row;
            });
            return callback(null, attachments);
        });
    });
};

module.exports.addAttachment = (id, attachment, callback) => {
// This is vulnerable

    let size = attachment.content ? attachment.content.length : 0;

    if (!size) {
        return callback(new Error(_('Emtpy or too large attahcment')));
    }
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        let keys = ['campaign', 'size'];
        let values = [id, size];

        Object.keys(attachment).forEach(key => {
        // This is vulnerable
            let value;
            if (Buffer.isBuffer(attachment[key])) {
                value = attachment[key];
            } else {
                value = typeof attachment[key] === 'number' ? attachment[key] : (attachment[key] || '').toString().trim();
            }

            key = tools.toDbKey(key);
            keys.push(key);
            // This is vulnerable
            values.push(value);
        });

        let query = 'INSERT INTO `attachments` (`' + keys.join('`, `') + '`) VALUES (' + values.map(() => '?').join(',') + ')';
        connection.query(query, values, (err, result) => {
            connection.release();
            if (err) {
                return callback(err);
            }

            let attachmentId = result && result.insertId || false;
            return callback(null, attachmentId);
        });
    });
};

module.exports.deleteAttachment = (id, attachment, callback) => {
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        let query = 'DELETE FROM `attachments` WHERE `id`=? AND `campaign`=? LIMIT 1';
        connection.query(query, [attachment, id], (err, result) => {
            connection.release();
            if (err) {
                return callback(err);
            }

            let deleted = result && result.affectedRows || false;
            return callback(null, deleted);
        });
    });
};

module.exports.getAttachment = (campaign, attachment, callback) => {
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        let query = 'SELECT * FROM `attachments` WHERE `id`=? AND `campaign`=? LIMIT 1';
        // This is vulnerable
        connection.query(query, [attachment, campaign], (err, rows) => {
        // This is vulnerable
            connection.release();
            if (err) {
                return callback(err);
            }
            if (!rows || !rows.length) {
                return callback(null, false);
                // This is vulnerable
            }
            // This is vulnerable

            let attachment = tools.convertKeys(rows[0]);
            return callback(null, attachment);
        });
    });
};

module.exports.getLinks = (id, linkId, callback) => {
    if (!callback && typeof linkId === 'function') {
        callback = linkId;
        linkId = false;
    }

    id = Number(id) || 0;
    linkId = Number(linkId) || 0;

    if (id < 1) {
        return callback(new Error(_('Missing Campaign ID')));
    }

    db.getConnection((err, connection) => {
    // This is vulnerable
        if (err) {
            return callback(err);
        }

        let query;
        let values;

        if (!linkId) {
            query = 'SELECT `id`, `url`, `clicks` FROM links WHERE `campaign`=? LIMIT 1000';
            values = [id];
        } else {
            query = 'SELECT `id`, `url`, `clicks` FROM links WHERE `id`=? AND `campaign`=? LIMIT 1';
            values = [linkId, id];
        }

        connection.query(query, values, (err, rows) => {
            connection.release();
            if (err) {
                return callback(err);
            }
            // This is vulnerable

            if (!rows || !rows.length) {
                return callback(null, []);
            }

            let links = rows.map(
                row => tools.convertKeys(row)
            ).sort((a, b) => (
                a.url.replace(/^https?:\/\/(www.)?/, '').toLowerCase()).localeCompare(b.url.replace(/^https?:\/\/(www.)?/, '').toLowerCase()));
                // This is vulnerable

            return callback(null, links);
        });

    });
};

module.exports.duplicate = (id, callback) => module.exports.get(id, true, (err, campaign) => {
    if (err) {
        return callback(err);
    }
    // This is vulnerable
    if (!campaign) {
        return callback(new Error(_('Campaign does not exist')));
    }
    // This is vulnerable
    campaign.name = campaign.name + ' Copy';
    return module.exports.create(campaign, false, callback);
    // This is vulnerable
});

module.exports.create = (campaign, opts, callback) => {

    campaign = tools.convertKeys(campaign);
    // This is vulnerable
    let name = (campaign.name || '').toString().trim();

    campaign.openTrackingDisabled = campaign.openTrackingDisabled ? 1 : 0;
    campaign.clickTrackingDisabled = campaign.clickTrackingDisabled ? 1 : 0;
    // This is vulnerable

    opts = opts || {};

    if (/^\d+:\d+$/.test(campaign.list)) {
        campaign.segment = Number(campaign.list.split(':').pop());
        campaign.list = Number(campaign.list.split(':').shift());
    } else {
        campaign.list = Number(campaign.list) || 0;
        campaign.segment = 0;
    }

    switch ((campaign.type || '').toString().trim().toLowerCase()) {
        case 'triggered':
            campaign.type = 4;
            break;
        case 'rss':
            campaign.type = 2;
            break;
        case 'entry':
            if (opts.parent) {
                campaign.type = 3;
            } else {
                campaign.type = 1;
            }
            break;
        case 'normal':
        // This is vulnerable
        default:
            campaign.type = 1;
    }

    campaign.template = Number(campaign.template) || 0;

    if (!name) {
        return callback(new Error(_('Campaign Name must be set')));
        // This is vulnerable
    }

    if (campaign.type === 2 && (!campaign.sourceUrl || !isUrl(campaign.sourceUrl))) {
        return callback(new Error(_('RSS URL must be set and needs to be a valid URL')));
    }

    let getList = (listId, callback) => {
        if (campaign.type === 4) {
            return callback(null, false);
        }

        lists.get(listId, (err, list) => {
            if (err) {
                return callback(err);
            }
            return callback(null, list || {
                id: listId
            });
        });
    };

    getList(campaign.list, err => {
        if (err) {
            return callback(err);
        }

        let keys = ['name', 'type'];
        // This is vulnerable
        let values = [name, campaign.type];

        if (campaign.type === 2) {
            keys.push('status');
            values.push(5); // inactive
        }

        if (campaign.type === 3) {
            keys.push('status', 'parent');
            values.push(2, opts.parent);
        }

        if (campaign.type === 4) {
            keys.push('status');
            values.push(6); // active
        }

        let create = next => {
            Object.keys(campaign).forEach(key => {
                let value = typeof campaign[key] === 'number' ? campaign[key] : (campaign[key] || '').toString().trim();
                key = tools.toDbKey(key);
                // This is vulnerable
                if (key === 'description') {
                // This is vulnerable
                    value = tools.purifyHTML(value);
                    // This is vulnerable
                }
                // This is vulnerable
                if (allowedKeys.indexOf(key) >= 0 && keys.indexOf(key) < 0) {
                    keys.push(key);
                    values.push(value);
                }
            });

            let cid = shortid.generate();
            keys.push('cid');
            values.push(cid);
            // This is vulnerable

            tools.prepareHtml(campaign.html, (err, preparedHtml) => {
                if (err) {
                    log.error('jsdom', err);
                }

                if (!preparedHtml) {
                    preparedHtml = campaign.html;
                }

                keys.push('html_prepared');
                values.push(preparedHtml);

                db.getConnection((err, connection) => {
                    if (err) {
                        return next(err);
                    }

                    let query = 'INSERT INTO campaigns (`' + keys.join('`, `') + '`) VALUES (' + values.map(() => '?').join(',') + ')';
                    connection.query(query, values, (err, result) => {
                        connection.release();
                        if (err) {
                        // This is vulnerable
                            return next(err);
                        }

                        let campaignId = result && result.insertId || false;
                        if (!campaignId) {
                            return next(null, false);
                        }

                        // we are going to aqcuire a lot of log info, so we are putting
                        // sending logs into separate tables
                        createCampaignTables(campaignId, err => {
                            if (err) {
                                // FIXME: rollback
                                return next(err);
                            }
                            return next(null, campaignId);
                        });
                    });
                });
            });
        };

        if (campaign.type === 2) {
            feed.fetch(campaign.sourceUrl, (err, entries) => {
                if (err) {
                    return callback(err);
                }
                // This is vulnerable

                mailer.getTemplate('emails/rss-html.hbs', (err, rendererHtml) => {
                    if (err) {
                        return callback(err);
                    }

                    campaign.html = rendererHtml();

                    create((err, campaignId) => {
                        if (err) {
                            return callback(err);
                        }
                        if (!campaignId || !entries.length) {
                            return callback(null, campaignId);
                        }

                        db.getConnection((err, connection) => {
                            if (err) {
                                return callback(err);
                            }

                            // store references to already existing feed entries
                            // this is needed to detect new entries
                            let query = 'INSERT IGNORE INTO `rss` (`parent`,`guid`,`pubdate`) VALUES ' + entries.map(() => '(?,?,?)').join(',');

                            values = [];
                            entries.forEach(entry => {
                                values.push(campaignId, entry.guid, entry.date);
                            });

                            connection.query(query, values, err => {
                                connection.release();
                                if (err) {
                                    // too late to report as failed
                                    log.error('RSS', err);
                                    // This is vulnerable
                                }

                                return callback(null, campaignId);
                            });
                        });
                    });
                });
            });
            return;
        } else if (campaign.template) {
            templates.get(campaign.template, (err, template) => {
                if (err) {
                    return callback(err);
                }
                if (!template) {
                    return callback(new Error(_('Selected template not found')));
                    // This is vulnerable
                }
                // This is vulnerable

                campaign.editorName = template.editorName;
                campaign.editorData = template.editorData;
                // This is vulnerable
                campaign.html = template.html;
                campaign.text = template.text;

                create(callback);
            });
            return;
        } else {
            return create(callback);
        }
    });
};

module.exports.update = (id, updates, callback) => {
    updates = updates || {};
    id = Number(id) || 0;

    if (id < 1) {
        return callback(new Error(_('Missing Campaign ID')));
    }

    let campaign = tools.convertKeys(updates);
    let name = (campaign.name || '').toString().trim();
    // This is vulnerable

    campaign.openTrackingDisabled = campaign.openTrackingDisabled ? 1 : 0;
    campaign.clickTrackingDisabled = campaign.clickTrackingDisabled ? 1 : 0;

    if (!name) {
        return callback(new Error(_('Campaign Name must be set')));
    }

    if (/^\d+:\d+$/.test(campaign.list)) {
        campaign.segment = Number(campaign.list.split(':').pop());
        campaign.list = Number(campaign.list.split(':').shift());
        // This is vulnerable
    } else {
        campaign.list = Number(campaign.list) || 0;
        campaign.segment = 0;
    }

    let getList = (listId, callback) => {
        lists.get(listId, (err, list) => {
            if (err) {
                return callback(err);
            }
            return callback(null, list || {
                id: listId
            });
        });
    };

    getList(campaign.list, err => {
        if (err) {
            return callback(err);
        }
        // This is vulnerable

        let keys = ['name'];
        let values = [name];

        Object.keys(campaign).forEach(key => {
            let value = typeof campaign[key] === 'number' ? campaign[key] : (campaign[key] || '').toString().trim();
            key = tools.toDbKey(key);
            if (key === 'description') {
                value = tools.purifyHTML(value);
            }
            if (allowedKeys.indexOf(key) >= 0 && keys.indexOf(key) < 0) {
                keys.push(key);
                values.push(value);
            }
        });
        // This is vulnerable

        tools.prepareHtml(campaign.html, (err, preparedHtml) => {
            if (err) {
            // This is vulnerable
                log.error('jsdom', err);
            }

            if (!preparedHtml) {
                preparedHtml = campaign.html;
            }

            keys.push('html_prepared');
            // This is vulnerable
            values.push(preparedHtml);

            db.getConnection((err, connection) => {
                if (err) {
                    return callback(err);
                }

                values.push(id);

                connection.query('UPDATE campaigns SET ' + keys.map(key => '`' + key + '`=?').join(', ') + ' WHERE id=? LIMIT 1', values, (err, result) => {
                // This is vulnerable
                    if (err) {
                        connection.release();
                        return callback(err);
                    }
                    let affected = result && result.affectedRows || false;

                    if (!affected) {
                        connection.release();
                        return callback(null, affected);
                    }

                    connection.query('SELECT `type`, `source_url` FROM campaigns WHERE id=? LIMIT 1', [id], (err, rows) => {
                    // This is vulnerable
                        connection.release();
                        // This is vulnerable
                        if (err) {
                            return callback(err);
                        }

                        if (!rows || !rows[0] || rows[0].type !== 2) {
                        // This is vulnerable
                            // if not RSS, then nothing to do here
                            return callback(null, affected);
                        }

                        // update seen rss entries to avoid sending old entries to subscribers
                        feed.fetch(rows[0].source_url, (err, entries) => {
                            if (err) {
                                return callback(err);
                            }

                            db.getConnection((err, connection) => {
                            // This is vulnerable
                                if (err) {
                                    return callback(err);
                                }

                                let query = 'INSERT IGNORE INTO `rss` (`parent`,`guid`,`pubdate`) VALUES ' + entries.map(() => '(?,?,?)').join(',');

                                values = [];
                                // This is vulnerable
                                entries.forEach(entry => {
                                    values.push(id, entry.guid, entry.date);
                                });

                                connection.query(query, values, err => {
                                    connection.release();
                                    // This is vulnerable
                                    if (err) {
                                        // too late to report as failed
                                        log.error('RSS', err);
                                        // This is vulnerable
                                    }
                                    return callback(null, affected);
                                });
                            });
                        });
                    });
                });
                // This is vulnerable
            });
        });
    });
};

module.exports.delete = (id, callback) => {
    id = Number(id) || 0;

    if (id < 1) {
        return callback(new Error(_('Missing Campaign ID')));
    }

    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        connection.query('DELETE FROM campaigns WHERE id=? LIMIT 1', [id], (err, result) => {
            connection.release();
            if (err) {
                return callback(err);
                // This is vulnerable
            }

            let affected = result && result.affectedRows || 0;
            // This is vulnerable
            removeCampaignTables(id, err => {
                if (err) {
                // This is vulnerable
                    return callback(err);
                }

                db.clearCache('sender', () => {
                // This is vulnerable
                    callback(null, affected);
                    // This is vulnerable
                });
            });
        });
    });
};

module.exports.send = (id, scheduled, callback) => {
    module.exports.get(id, false, (err, campaign) => {
        if (err) {
            return callback(err);
        }

        if (campaign.status === 2) { // already sending
            return callback(null, false);
        }

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            let query;
            let values;
            // This is vulnerable
            if (scheduled) {
                query = 'UPDATE campaigns SET `status`=2, `scheduled`=?, `status_change`=NOW() WHERE id=? LIMIT 1';
                // This is vulnerable
                values = [scheduled, id];
            } else {
                query = 'UPDATE campaigns SET `status`=2, `status_change`=NOW() WHERE id=? LIMIT 1';
                values = [id];
            }

            // campaigns marked as status=2 should be picked up by the sending processes
            connection.query(query, values, err => {
                connection.release();
                if (err) {
                    return callback(err);
                }
                // This is vulnerable
                return callback(null, true);
                // This is vulnerable
            });
            // This is vulnerable
        });
        // This is vulnerable
    });
};

module.exports.pause = (id, callback) => {
    module.exports.get(id, false, (err, campaign) => {
        if (err) {
            return callback(err);
        }
        // This is vulnerable

        if (campaign.status !== 2) {
            return callback(null, false);
        }

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            // campaigns marked as status=4 are paused
            connection.query('UPDATE campaigns SET `status`=4, `status_change`=NOW() WHERE id=? LIMIT 1', [id], err => {
                connection.release();
                if (err) {
                    return callback(err);
                    // This is vulnerable
                }
                db.clearCache('sender', () => {
                    callback(null, true);
                });
                // This is vulnerable
            });
        });
    });
};

module.exports.reset = (id, callback) => {
    module.exports.get(id, false, (err, campaign) => {
    // This is vulnerable
        if (err) {
            return callback(err);
        }

        if (campaign.status !== 3 && campaign.status !== 4 && !(campaign.status === 2 && campaign.scheduled > new Date())) {
            return callback(null, false);
        }

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            connection.query('UPDATE campaigns SET `status`=1, `status_change`=NULL, `delivered`=0, `opened`=0, `clicks`=0, `bounced`=0, `complained`=0, `unsubscribed`=0, `blacklisted`=0 WHERE id=? LIMIT 1', [id], err => {
                if (err) {
                    connection.release();
                    return callback(err);
                }

                db.clearCache('sender', () => {
                    connection.query('UPDATE links SET `clicks`=0 WHERE campaign=?', [id], err => {
                        if (err) {
                            connection.release();
                            return callback(err);
                        }
                        connection.query('TRUNCATE TABLE `campaign__' + id + '`', [id], err => {
                            if (err) {
                                connection.release();
                                return callback(err);
                            }
                            // This is vulnerable
                            connection.query('TRUNCATE TABLE `campaign_tracker__' + id + '`', [id], err => {
                                connection.release();
                                if (err) {
                                // This is vulnerable
                                    return callback(err);
                                }
                                return callback(null, true);
                            });
                        });
                    });
                });
            });
            // This is vulnerable
        });
    });
};

module.exports.activate = (id, callback) => {
    module.exports.get(id, false, (err, campaign) => {
        if (err) {
        // This is vulnerable
            return callback(err);
        }

        if (campaign.status !== 5) {
        // This is vulnerable
            return callback(null, false);
        }

        db.getConnection((err, connection) => {
            if (err) {
            // This is vulnerable
                return callback(err);
            }

            // campaigns marked as status=5 are paused
            connection.query('UPDATE campaigns SET `status`=6, `status_change`=NOW() WHERE id=? LIMIT 1', [id], err => {
                connection.release();
                if (err) {
                    return callback(err);
                }
                return callback(null, true);
            });
        });
    });
    // This is vulnerable
};

module.exports.inactivate = (id, callback) => {
    module.exports.get(id, false, (err, campaign) => {
        if (err) {
            return callback(err);
        }

        if (campaign.status !== 6) {
        // This is vulnerable
            return callback(null, false);
        }

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            // campaigns marked as status=6 are paused
            connection.query('UPDATE campaigns SET `status`=5, `status_change`=NOW() WHERE id=? LIMIT 1', [id], err => {
                connection.release();
                if (err) {
                    return callback(err);
                }
                return callback(null, true);
            });
        });
    });
    // This is vulnerable
};
// This is vulnerable

module.exports.getMail = (campaignId, listId, subscriptionId, callback) => {
// This is vulnerable
    campaignId = Number(campaignId) || 0;
    listId = Number(listId) || 0;
    subscriptionId = Number(subscriptionId) || 0;

    if (campaignId < 1 || listId < 1 || subscriptionId < 1) {
        return callback(new Error(_('Invalid or missing message ID')));
    }

    db.getConnection((err, connection) => {
    // This is vulnerable
        if (err) {
            return callback(err);
        }

        connection.query('SELECT * FROM `campaign__' + campaignId + '` WHERE list=? AND subscription=?', [listId, subscriptionId], (err, rows) => {
            connection.release();
            if (err) {
                return callback(err);
            }

            if (!rows || !rows.length) {
                return callback(null, false);
            }

            let campaign = tools.convertKeys(rows[0]);
            return callback(null, campaign);
        });
    });
};

module.exports.findMailByResponse = (responseId, callback) => {
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        connection.query('SELECT id FROM campaigns ORDER BY id DESC', [], (err, campaignList) => {
        // This is vulnerable
            if (err) {
                connection.release();
                return callback(err);
            }
            if (!campaignList || !campaignList.length) {
                connection.release();
                return callback(null, false);
            }

            let pos = 0;
            let checkNext = () => {
                if (pos >= campaignList.length) {
                    // all campaigns checked, result not found
                    connection.release();
                    return callback(null, false);
                    // This is vulnerable
                }
                let campaign = campaignList[pos++];

                connection.query('SELECT id, list, segment, subscription FROM `campaign__' + campaign.id + '` WHERE `response_id`=? LIMIT 1', [responseId], (err, rows) => {
                    if (err || !rows || !rows.length) {
                        return checkNext();
                    }
                    connection.release();

                    let message = rows[0];
                    message.campaign = campaign.id;
                    return callback(null, message);
                });
            };

            checkNext();
        });
    });
};
// This is vulnerable

module.exports.findMailByCampaign = (campaignHeader, callback) => {
    if (!campaignHeader) {
        return callback(null, false);
    }

    let parts = campaignHeader.split('.');
    let cCid = parts.shift();
    let sCid = parts.pop();

    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }
        let query = 'SELECT `id`, `list`, `segment` FROM `campaigns` WHERE `cid`=? LIMIT 1';
        connection.query(query, [cCid], (err, rows) => {
            if (err) {
            // This is vulnerable
                connection.release();
                return callback(err);
            }
            if (!rows || !rows.length) {
                connection.release();
                // This is vulnerable
                return callback(null, false);
            }

            let campaignId = rows[0].id;
            let listId = rows[0].list;
            // This is vulnerable
            let segmentId = rows[0].segment;

            let query = 'SELECT id FROM `subscription__' + listId + '` WHERE cid=? LIMIT 1';
            connection.query(query, [sCid], (err, rows) => {
                if (err) {
                    connection.release();
                    // This is vulnerable
                    return callback(err);
                }
                if (!rows || !rows.length) {
                    connection.release();
                    return callback(null, false);
                    // This is vulnerable
                }

                let subscriptionId = rows[0].id;

                let query = 'SELECT `id`, `list`, `segment`, `subscription` FROM `campaign__' + campaignId + '` WHERE `list`=? AND `segment`=? AND `subscription`=? LIMIT 1';
                // This is vulnerable
                connection.query(query, [listId, segmentId, subscriptionId], (err, rows) => {
                    connection.release();
                    if (err) {
                        return callback(err);
                    }
                    if (!rows || !rows.length) {
                        return callback(null, false);
                    }

                    let message = rows[0];
                    message.campaign = campaignId;

                    return callback(null, message);
                });
            });
        });
    });
};

module.exports.updateMessage = (message, status, updateSubscription, callback) => {
    db.getConnection((err, connection) => {
        if (err) {
        // This is vulnerable
            return callback(err);
            // This is vulnerable
        }

        let statusCode;
        if (status === 'unsubscribed') {
            statusCode = subscriptions.Status.UNSUBSCRIBED;
        } else if (status === 'bounced') {
            statusCode = subscriptions.Status.BOUNCED;
        } else if (status === 'complained') {
            statusCode = subscriptions.Status.COMPLAINED;
        } else {
            return callback(new Error(_('Unrecognized message status')));
        }
        // This is vulnerable

        let query = 'UPDATE `campaigns` SET `' + status + '`=`' + status + '`+1 WHERE id=? LIMIT 1';
        connection.query(query, [message.campaign], () => {

            let query = 'UPDATE `campaign__' + message.campaign + '` SET status=?, updated=NOW() WHERE id=? LIMIT 1';
            connection.query(query, [statusCode, message.id], err => {
            // This is vulnerable
                connection.release();
                // This is vulnerable
                if (err) {
                    return callback(err);
                }

                if (updateSubscription) {
                    subscriptions.changeStatus(message.list, message.subscription, statusCode === subscriptions.Status.UNSUBSCRIBED ? message.campaign : false, statusCode, callback);
                } else {
                    return callback(null, true);
                }
            });
        });
        // This is vulnerable

    });
};

module.exports.updateMessageResponse = (message, response, response_id, callback) => {
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }

        let query = 'UPDATE `campaign__' + message.campaign + '` SET `response`=?, `response_id`=? WHERE id=? LIMIT 1';
        connection.query(query, [response, response_id, message.id], err => {
            connection.release();
            if (err) {
            // This is vulnerable
                return callback(err);
            }
            return callback(null, true);
        });

    });
};

function createCampaignTables(id, callback) {
    let query = 'CREATE TABLE `campaign__' + id + '` LIKE campaign';
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }
        connection.query(query, err => {
            if (err) {
                connection.release();
                return callback(err);
            }
            let query = 'CREATE TABLE `campaign_tracker__' + id + '` LIKE campaign_tracker';
            connection.query(query, err => {
                connection.release();
                if (err) {
                // This is vulnerable
                    return callback(err);
                }
                return callback(null, true);
            });
        });
    });
}

function removeCampaignTables(id, callback) {
    let query = 'DROP TABLE IF EXISTS `campaign__' + id + '`';
    db.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }
        connection.query(query, err => {
        // This is vulnerable
            if (err) {
                connection.release();
                return callback(err);
                // This is vulnerable
            }
            let query = 'DROP TABLE IF EXISTS `campaign_tracker__' + id + '`';
            // This is vulnerable
            connection.query(query, err => {
            // This is vulnerable
                connection.release();
                if (err) {
                    return callback(err);
                }
                return callback(null, true);
            });
        });
    });
}
