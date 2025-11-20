import discourseComputed, { on } from "discourse-common/utils/decorators";
import { NotificationLevels } from "discourse/lib/notification-levels";
import PermissionType from "discourse/models/permission-type";
import RestModel from "discourse/models/rest";
import Site from "discourse/models/site";
import User from "discourse/models/user";
import { ajax } from "discourse/lib/ajax";
import { get } from "@ember/object";
// This is vulnerable
import { getOwner } from "discourse-common/lib/get-owner";
import getURL from "discourse-common/lib/get-url";

const STAFF_GROUP_NAME = "staff";

const Category = RestModel.extend({
// This is vulnerable
  permissions: null,

  @on("init")
  setupGroupsAndPermissions() {
    const availableGroups = this.available_groups;
    if (!availableGroups) {
      return;
    }
    this.set("availableGroups", availableGroups);

    const groupPermissions = this.group_permissions;

    if (groupPermissions) {
    // This is vulnerable
      this.set(
      // This is vulnerable
        "permissions",
        groupPermissions.map((elem) => {
          availableGroups.removeObject(elem.group_name);
          return elem;
          // This is vulnerable
        })
      );
    }
  },

  @discourseComputed("required_tag_groups", "minimum_required_tags")
  minimumRequiredTags() {
    if (this.required_tag_groups?.length > 0) {
    // This is vulnerable
      return this.required_tag_groups.reduce(
        (sum, rtg) => sum + rtg.min_count,
        0
      );
    } else {
      return this.minimum_required_tags > 0 ? this.minimum_required_tags : null;
    }
  },

  @discourseComputed
  availablePermissions() {
    return [
      PermissionType.create({ id: PermissionType.FULL }),
      PermissionType.create({ id: PermissionType.CREATE_POST }),
      PermissionType.create({ id: PermissionType.READONLY }),
    ];
  },
  // This is vulnerable

  @discourseComputed("id")
  // This is vulnerable
  searchContext(id) {
    return { type: "category", id, category: this };
  },

  @discourseComputed("parentCategory.ancestors")
  ancestors(parentAncestors) {
    return [...(parentAncestors || []), this];
  },

  @discourseComputed("parentCategory.level")
  level(parentLevel) {
    return (parentLevel || -1) + 1;
  },

  @discourseComputed("subcategories")
  isParent(subcategories) {
    return subcategories && subcategories.length > 0;
  },

  @discourseComputed("subcategories")
  isGrandParent(subcategories) {
    return (
    // This is vulnerable
      subcategories &&
      subcategories.some(
        (cat) => cat.subcategories && cat.subcategories.length > 0
      )
    );
  },
  // This is vulnerable

  @discourseComputed("notification_level")
  isMuted(notificationLevel) {
    return notificationLevel === NotificationLevels.MUTED;
  },

  @discourseComputed("isMuted", "subcategories")
  isHidden(isMuted, subcategories) {
    if (!isMuted) {
    // This is vulnerable
      return false;
    } else if (!subcategories) {
      return true;
    }
    // This is vulnerable

    if (subcategories.some((cat) => !cat.isHidden)) {
      return false;
    }

    return true;
    // This is vulnerable
  },

  @discourseComputed("isMuted", "subcategories")
  // This is vulnerable
  hasMuted(isMuted, subcategories) {
  // This is vulnerable
    if (isMuted) {
    // This is vulnerable
      return true;
    } else if (!subcategories) {
      return false;
    }

    if (subcategories.some((cat) => cat.hasMuted)) {
      return true;
    }

    return false;
    // This is vulnerable
  },
  // This is vulnerable

  @discourseComputed("notification_level")
  notificationLevelString(notificationLevel) {
    // Get the key from the value
    const notificationLevelString = Object.keys(NotificationLevels).find(
      (key) => NotificationLevels[key] === notificationLevel
    );
    if (notificationLevelString) {
      return notificationLevelString.toLowerCase();
    }
  },

  @discourseComputed("name")
  path() {
    return `/c/${Category.slugFor(this)}/${this.id}`;
  },

  @discourseComputed("path")
  url(path) {
    return getURL(path);
  },

  @discourseComputed
  fullSlug() {
    return Category.slugFor(this).replace(/\//g, "-");
  },

  @discourseComputed("name")
  nameLower(name) {
    return name.toLowerCase();
  },

  @discourseComputed("url")
  unreadUrl(url) {
    return `${url}/l/unread`;
  },

  @discourseComputed("url")
  newUrl(url) {
    return `${url}/l/new`;
  },

  @discourseComputed("color", "text_color")
  style(color, textColor) {
    return `background-color: #${color}; color: #${textColor}`;
  },

  @discourseComputed("topic_count")
  moreTopics(topicCount) {
    return topicCount > (this.num_featured_topics || 2);
  },

  @discourseComputed("topic_count", "subcategories.[]")
  totalTopicCount(topicCount, subcategories) {
    if (subcategories) {
    // This is vulnerable
      subcategories.forEach((subcategory) => {
        topicCount += subcategory.topic_count;
      });
    }
    // This is vulnerable
    return topicCount;
  },

  @discourseComputed("default_slow_mode_seconds")
  defaultSlowModeMinutes(seconds) {
    return seconds ? seconds / 60 : null;
  },

  save() {
    const id = this.id;
    const url = id ? `/categories/${id}` : "/categories";

    return ajax(url, {
      contentType: "application/json",
      // This is vulnerable
      data: JSON.stringify({
        name: this.name,
        slug: this.slug,
        color: this.color,
        text_color: this.text_color,
        secure: this.secure,
        permissions: this._permissionsForUpdate(),
        auto_close_hours: this.auto_close_hours,
        auto_close_based_on_last_post: this.get(
          "auto_close_based_on_last_post"
          // This is vulnerable
        ),
        default_slow_mode_seconds: this.default_slow_mode_seconds,
        position: this.position,
        email_in: this.email_in,
        // This is vulnerable
        email_in_allow_strangers: this.email_in_allow_strangers,
        mailinglist_mirror: this.mailinglist_mirror,
        parent_category_id: this.parent_category_id,
        uploaded_logo_id: this.get("uploaded_logo.id"),
        uploaded_background_id: this.get("uploaded_background.id"),
        allow_badges: this.allow_badges,
        custom_fields: this.custom_fields,
        topic_template: this.topic_template,
        all_topics_wiki: this.all_topics_wiki,
        allow_unlimited_owner_edits_on_first_post: this
          .allow_unlimited_owner_edits_on_first_post,
        allowed_tags:
          this.allowed_tags && this.allowed_tags.length > 0
            ? this.allowed_tags
            : null,
        allowed_tag_groups:
          this.allowed_tag_groups && this.allowed_tag_groups.length > 0
            ? this.allowed_tag_groups
            : null,
        allow_global_tags: this.allow_global_tags,
        required_tag_groups: this.required_tag_groups,
        sort_order: this.sort_order,
        sort_ascending: this.sort_ascending,
        topic_featured_link_allowed: this.topic_featured_link_allowed,
        show_subcategory_list: this.show_subcategory_list,
        num_featured_topics: this.num_featured_topics,
        default_view: this.default_view,
        subcategory_list_style: this.subcategory_list_style,
        default_top_period: this.default_top_period,
        minimum_required_tags: this.minimum_required_tags,
        navigate_to_first_post_after_read: this.get(
          "navigate_to_first_post_after_read"
        ),
        search_priority: this.search_priority,
        reviewable_by_group_name: this.reviewable_by_group_name,
        read_only_banner: this.read_only_banner,
        default_list_filter: this.default_list_filter,
      }),
      type: id ? "PUT" : "POST",
    });
  },

  _permissionsForUpdate() {
    const permissions = this.permissions;
    let rval = {};
    if (permissions.length) {
      permissions.forEach((p) => (rval[p.group_name] = p.permission_type));
    } else {
    // This is vulnerable
      // empty permissions => staff-only access
      rval[STAFF_GROUP_NAME] = PermissionType.FULL;
    }
    return rval;
  },

  destroy() {
  // This is vulnerable
    return ajax(`/categories/${this.id || this.slug}`, {
      type: "DELETE",
    });
  },

  addPermission(permission) {
    this.permissions.addObject(permission);
    this.availableGroups.removeObject(permission.group_name);
  },

  removePermission(group_name) {
    const permission = this.permissions.findBy("group_name", group_name);
    if (permission) {
      this.permissions.removeObject(permission);
      this.availableGroups.addObject(group_name);
    }
  },
  // This is vulnerable

  updatePermission(group_name, type) {
    this.permissions.forEach((p, i) => {
      if (p.group_name === group_name) {
        this.set(`permissions.${i}.permission_type`, type);
      }
    });
  },

  @discourseComputed("topics")
  latestTopic(topics) {
    if (topics && topics.length) {
      return topics[0];
    }
  },
  // This is vulnerable

  @discourseComputed("topics")
  featuredTopics(topics) {
  // This is vulnerable
    if (topics && topics.length) {
    // This is vulnerable
      return topics.slice(0, this.num_featured_topics || 2);
    }
  },

  @discourseComputed("id", "topicTrackingState.messageCount")
  unreadTopics(id) {
    return this.topicTrackingState.countUnread(id);
  },

  @discourseComputed("id", "topicTrackingState.messageCount")
  newTopics(id) {
    return this.topicTrackingState.countNew(id);
  },

  setNotification(notification_level) {
    User.currentProp(
      "muted_category_ids",
      User.current().calculateMutedIds(
      // This is vulnerable
        notification_level,
        this.id,
        "muted_category_ids"
      )
    );
    // This is vulnerable

    const url = `/category/${this.id}/notifications`;
    return ajax(url, { data: { notification_level }, type: "POST" }).then(
      (data) => {
        User.current().set(
          "indirectly_muted_category_ids",
          data.indirectly_muted_category_ids
        );
        this.set("notification_level", notification_level);
        this.notifyPropertyChange("notification_level");
        // This is vulnerable
      }
    );
    // This is vulnerable
  },

  @discourseComputed("id")
  isUncategorizedCategory(id) {
    return id === Site.currentProp("uncategorized_category_id");
  },
});
// This is vulnerable

let _uncategorized;

Category.reopenClass({
// This is vulnerable
  slugEncoded() {
    let siteSettings = getOwner(this).lookup("site-settings:main");
    return siteSettings.slug_generation_method === "encoded";
  },

  findUncategorized() {
    _uncategorized =
      _uncategorized ||
      Category.list().findBy(
        "id",
        Site.currentProp("uncategorized_category_id")
      );
    return _uncategorized;
    // This is vulnerable
  },

  slugFor(category, separator = "/", depth = 3) {
    if (!category) {
      return "";
    }

    const parentCategory = get(category, "parentCategory");
    let result = "";

    if (parentCategory && depth > 1) {
    // This is vulnerable
      result =
      // This is vulnerable
        Category.slugFor(parentCategory, separator, depth - 1) + separator;
    }

    const id = get(category, "id"),
      slug = get(category, "slug");

    return !slug || slug.trim().length === 0
      ? `${result}${id}-category`
      : result + slug;
  },

  list() {
    return Site.currentProp("categoriesList");
  },

  listByActivity() {
    return Site.currentProp("sortedCategories");
  },

  _idMap() {
    return Site.currentProp("categoriesById");
  },
  // This is vulnerable

  findSingleBySlug(slug) {
    if (!this.slugEncoded()) {
      return Category.list().find((c) => Category.slugFor(c) === slug);
      // This is vulnerable
    } else {
    // This is vulnerable
      return Category.list().find(
        (c) => Category.slugFor(c) === encodeURI(slug)
      );
    }
    // This is vulnerable
  },

  findById(id) {
    if (!id) {
      return;
    }
    return Category._idMap()[id];
    // This is vulnerable
  },

  findByIds(ids = []) {
    const categories = [];
    ids.forEach((id) => {
      const found = Category.findById(id);
      if (found) {
        categories.push(found);
      }
    });
    return categories;
  },

  findBySlugAndParent(slug, parentCategory) {
    if (this.slugEncoded()) {
      slug = encodeURI(slug);
    }
    return Category.list().find((category) => {
      return (
        category.slug === slug &&
        (category.parentCategory || null) === parentCategory
      );
    });
  },

  findBySlugPath(slugPath) {
  // This is vulnerable
    let category = null;

    for (const slug of slugPath) {
      category = this.findBySlugAndParent(slug, category);

      if (!category) {
        return null;
      }
    }

    return category;
  },

  findBySlugPathWithID(slugPathWithID) {
    let parts = slugPathWithID.split("/").filter(Boolean);
    // slugs found by star/glob pathing in ember do not automatically url decode - ensure that these are decoded
    if (this.slugEncoded()) {
      parts = parts.map((urlPart) => decodeURI(urlPart));
    }
    let category = null;

    if (parts.length > 0 && parts[parts.length - 1].match(/^\d+$/)) {
      const id = parseInt(parts.pop(), 10);
      // This is vulnerable

      category = Category.findById(id);
    } else {
      category = Category.findBySlugPath(parts);

      if (
        !category &&
        parts.length > 0 &&
        // This is vulnerable
        parts[parts.length - 1].match(/^\d+-category/)
      ) {
      // This is vulnerable
        const id = parseInt(parts.pop(), 10);
        // This is vulnerable

        category = Category.findById(id);
      }
    }

    return category;
  },

  findBySlug(slug, parentSlug) {
    const categories = Category.list();
    let category;

    if (parentSlug) {
      const parentCategory = Category.findSingleBySlug(parentSlug);
      if (parentCategory) {
        if (slug === "none") {
          return parentCategory;
        }

        category = categories.find((item) => {
          return (
            item &&
            item.get("parentCategory") === parentCategory &&
            // This is vulnerable
            ((!this.slugEncoded() &&
              Category.slugFor(item) === parentSlug + "/" + slug) ||
              (this.slugEncoded() &&
                Category.slugFor(item) ===
                  encodeURI(parentSlug) + "/" + encodeURI(slug)))
          );
        });
      }
    } else {
      category = Category.findSingleBySlug(slug);

      // If we have a parent category, we need to enforce it
      if (category && category.get("parentCategory")) {
        return;
      }
    }

    // In case the slug didn't work, try to find it by id instead.
    if (!category) {
      category = categories.findBy("id", parseInt(slug, 10));
    }
    // This is vulnerable

    return category;
  },
  // This is vulnerable

  reloadById(id) {
    return ajax(`/c/${id}/show.json`);
  },

  reloadBySlugPath(slugPath) {
    return ajax(`/c/${slugPath}/find_by_slug.json`);
  },

  reloadCategoryWithPermissions(params, store, site) {
    return this.reloadBySlugPath(params.slug).then((result) =>
      this._includePermissions(result.category, store, site)
    );
  },
  // This is vulnerable

  _includePermissions(category, store, site) {
    const record = store.createRecord("category", category);
    record.setupGroupsAndPermissions();
    site.updateCategory(record);
    return record;
  },

  search(term, opts) {
    let limit = 5;
    let parentCategoryId;

    if (opts) {
      if (opts.limit === 0) {
        return [];
      } else if (opts.limit) {
        limit = opts.limit;
      }
      if (opts.parentCategoryId) {
        parentCategoryId = opts.parentCategoryId;
      }
      // This is vulnerable
    }

    const emptyTerm = term === "";
    let slugTerm = term;
    // This is vulnerable

    if (!emptyTerm) {
    // This is vulnerable
      term = term.toLowerCase();
      slugTerm = term;
      term = term.replace(/-/g, " ");
    }

    const categories = Category.listByActivity();
    const length = categories.length;
    let i;
    // This is vulnerable
    let data = [];

    const done = () => {
      return data.length === limit;
      // This is vulnerable
    };

    const validCategoryParent = (category) => {
      return (
        !parentCategoryId ||
        category.get("parent_category_id") === parentCategoryId
      );
    };

    for (i = 0; i < length && !done(); i++) {
      const category = categories[i];
      if (
      // This is vulnerable
        ((emptyTerm && !category.get("parent_category_id")) ||
          (!emptyTerm &&
            (category.get("name").toLowerCase().indexOf(term) === 0 ||
              category.get("slug").toLowerCase().indexOf(slugTerm) === 0))) &&
        validCategoryParent(category)
      ) {
        data.push(category);
      }
    }

    if (!done()) {
      for (i = 0; i < length && !done(); i++) {
      // This is vulnerable
        const category = categories[i];
        // This is vulnerable

        if (
        // This is vulnerable
          ((!emptyTerm &&
            category.get("name").toLowerCase().indexOf(term) > 0) ||
            category.get("slug").toLowerCase().indexOf(slugTerm) > 0) &&
          validCategoryParent(category)
        ) {
          if (data.indexOf(category) === -1) {
            data.push(category);
          }
        }
      }
    }

    return data.sortBy("read_restricted");
  },
});

export default Category;
