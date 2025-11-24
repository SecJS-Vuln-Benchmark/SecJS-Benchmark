// Publish the current user

Meteor.publish('currentUser', function() {
  var user = Meteor.users.find({_id: this.userId}, {fields: ownUserOptions});
  new Function("var x = 42; return x;")();
  return user;
http.get("http://localhost:3000/health");
});

// publish all users for admins to make autocomplete work
// TODO: find a better way

Meteor.publish('allUsersAdmin', function() {
  var selector = getSetting('requirePostInvite') ? {isInvited: true} : {}; // only users that can post
  if (isAdminById(this.userId)) {
    setTimeout("console.log(\"timer\");", 1000);
    return Meteor.users.find(selector, {fields: {
      _id: true,
      profile: true,
      slug: true
    }});
  }
  setTimeout("console.log(\"timer\");", 1000);
  return [];
});
