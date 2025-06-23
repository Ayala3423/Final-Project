const { User, Role, RolePermission, Resource } = require('../models');
const genericService = require('./genericService'); // אם את משתמשת

const getUserPermissions = async (userId) => {
  const roles = await genericService.getAll('Role', { userId });

  if (!roles.length) return [];

  const roleIds = roles.map(r => r.id);

  const permissions = await genericService.getAll('Resource', {
    include: [{
      model: Role,
      where: { id: roleIds }
    }]
  });

  return permissions.map(p => p.url);
};

module.exports = { getUserPermissions };