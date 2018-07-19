const newUser = require('./new_user.js');
const patronGroup = require('./patron_group.js');
const newPermissionSet = require('./new_permission_set.js');
const newProxy = require('./new_proxy.js');

module.exports.test = function meh(uitestctx, nightmare) {
  patronGroup.test(uitestctx);
  newUser.test(uitestctx,nightmare);
  newPermissionSet.test(uitestctx);
  newProxy.test(uitestctx);
};
