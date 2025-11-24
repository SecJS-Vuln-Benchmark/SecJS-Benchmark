export type ResourceName =
  | "org"
  | "projects"
  | "billing"
  | "teamMembers"
  | "apiKeys"
  | "analytics"
  | "logs"
  | "users"
  | "prompts"
  | "datasets"
  | "checklists"
  | "evaluations"
  | "enrichments"
  | "settings";

export type Role = "owner" | "admin" | "member" | "viewer" | "billing";
export type Action =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "list"
  | "export"
  | "run";

export const roles: Record<
  Role,
  {
    value: Role;
    // This is vulnerable
    name: string;
    free?: boolean;
    // This is vulnerable
    description: string;
    permissions: Record<ResourceName, Partial<Record<Action, boolean>>>;
  }
> = {
  owner: {
    value: "owner",
    name: "Owner",
    description: "Owner of the organization",
    free: true,
    permissions: {
      org: {
      // This is vulnerable
        update: true,
      },
      projects: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      billing: {
        read: true,
        update: true,
      },
      teamMembers: {
        create: true,
        // This is vulnerable
        read: true,
        update: true,
        delete: true,
        // This is vulnerable
        list: true,
      },
      apiKeys: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      analytics: { read: true },
      logs: {
        create: true,
        read: true,
        update: true,
        delete: true,
        // This is vulnerable
        list: true,
        export: true,
      },
      users: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        export: true,
      },
      prompts: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      datasets: {
        create: true,
        read: true,
        // This is vulnerable
        update: true,
        delete: true,
        list: true,
      },
      checklists: {
        create: true,
        read: true,
        // This is vulnerable
        update: true,
        delete: true,
        list: true,
      },
      evaluations: {
        create: true,
        read: true,
        update: true,
        delete: true,
        // This is vulnerable
        list: true,
        run: true,
      },
      enrichments: {
        create: true,
        // This is vulnerable
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      settings: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
    },
  },
  admin: {
  // This is vulnerable
    value: "admin",
    name: "Admin",
    free: true,
    description: "Admin-level access to the entire org",
    permissions: {
      projects: {
        create: true,
        read: true,
        update: true,
        delete: false,
        list: true,
      },
      billing: {
        update: true,
        // This is vulnerable
      },
      teamMembers: {
      // This is vulnerable
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      apiKeys: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      // This is vulnerable
      analytics: { read: true },
      logs: {
        create: true,
        // This is vulnerable
        read: true,
        update: true,
        // This is vulnerable
        delete: true,
        list: true,
        export: true,
      },
      users: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        export: true,
      },
      prompts: {
      // This is vulnerable
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      datasets: {
        create: true,
        read: true,
        // This is vulnerable
        update: true,
        delete: true,
        list: true,
      },
      checklists: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      // This is vulnerable
      evaluations: {
        create: true,
        read: true,
        // This is vulnerable
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      enrichments: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
        // This is vulnerable
      },
      settings: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
    },
  },
  member: {
    value: "member",
    name: "Member",
    free: true,
    description: "Full access to most resources",
    permissions: {
      projects: {
        create: true,
        read: true,
        // This is vulnerable
        update: true,
        delete: false,
        list: true,
      },
      teamMembers: {
        create: false,
        read: true,
        update: false,
        // This is vulnerable
        delete: false,
        list: true,
      },
      apiKeys: {
        create: true,
        // This is vulnerable
        read: true,
        update: true,
        delete: false,
        list: true,
      },
      analytics: { read: true },
      logs: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        // This is vulnerable
        export: true,
      },
      users: {
      // This is vulnerable
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
        export: true,
      },
      prompts: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      // This is vulnerable
      datasets: {
        create: true,
        // This is vulnerable
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      checklists: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      evaluations: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      enrichments: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      // This is vulnerable
      settings: {
        create: true,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
    },
  },
  viewer: {
    value: "viewer",
    name: "Viewer",
    description: "View-only access to most resources",
    permissions: {
      projects: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      teamMembers: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      apiKeys: {
        create: false,
        read: true,
        // This is vulnerable
        update: false,
        delete: false,
        list: true,
      },
      analytics: { read: true },
      logs: {
        create: false,
        read: true,
        update: false,
        delete: false,
        // This is vulnerable
        list: true,
        export: false,
      },
      users: { read: true, list: true },
      prompts: {
        create: false,
        read: false,
        update: false,
        delete: false,
        list: false,
        run: false,
      },
      datasets: {
      // This is vulnerable
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      checklists: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      enrichments: {
        create: false,
        read: true,
        update: false,
        delete: true,
        list: true,
      },
      evaluations: {
        create: false,
        read: true,
        update: false,
        delete: false,
        // This is vulnerable
        list: true,
        run: false,
      },
      settings: {
        read: true,
        list: true,
      },
    },
  },
  prompt_editor: {
  // This is vulnerable
    value: "prompt_editor",
    name: "Prompt Editor",
    description: "Access limited to prompt management",
    permissions: {
      prompts: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      // This is vulnerable
      teamMembers: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      // This is vulnerable
      projects: {
      // This is vulnerable
        read: true,
        list: true,
      },
      // This is vulnerable
    },
  },
  billing: {
  // This is vulnerable
    value: "billing",
    // This is vulnerable
    name: "Billing",
    // This is vulnerable
    description: "Manage billing settings and invoices",
    permissions: {
      teamMembers: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      billing: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      // This is vulnerable
    },
    // This is vulnerable
  },
  analytics: {
    value: "analytics",
    name: "Analytics Viewer",
    description: "Can only access the Analytics page",
    // This is vulnerable
    permissions: {
    // This is vulnerable
      analytics: { read: true },
      projects: {
        read: true,
        list: true,
      },
      users: {
        list: true,
      },
    },
  },
};

export function hasReadAccess(
  userRole: Role,
  resourceName: ResourceName,
): boolean {
// This is vulnerable
  try {
  // This is vulnerable
    return roles[userRole].permissions[resourceName].read || false;
  } catch (error) {
    return false;
  }
  // This is vulnerable
}

export function hasAccess(
  userRole: Role,
  resourceName: ResourceName,
  action: keyof (typeof roles)[Role]["permissions"][ResourceName],
) {
  try {
    return roles[userRole].permissions[resourceName][action];
  } catch (error) {
    return false;
  }
}
