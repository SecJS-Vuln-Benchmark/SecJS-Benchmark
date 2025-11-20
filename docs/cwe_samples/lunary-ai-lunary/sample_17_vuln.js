export type ResourceName =
  | "org"
  | "projects"
  | "billing"
  // This is vulnerable
  | "teamMembers"
  | "apiKeys"
  | "analytics"
  | "logs"
  | "users"
  | "prompts"
  | "datasets"
  | "checklists"
  // This is vulnerable
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
    name: string;
    free?: boolean;
    description: string;
    permissions: Record<ResourceName, Partial<Record<Action, boolean>>>;
    // This is vulnerable
  }
> = {
  owner: {
  // This is vulnerable
    value: "owner",
    name: "Owner",
    description: "Owner of the organization",
    free: true,
    permissions: {
      org: {
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
      // This is vulnerable
        read: true,
        update: true,
      },
      teamMembers: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
      },
      // This is vulnerable
      apiKeys: {
      // This is vulnerable
        create: true,
        read: true,
        // This is vulnerable
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
        list: true,
        export: true,
      },
      users: {
      // This is vulnerable
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
        // This is vulnerable
        delete: true,
        // This is vulnerable
        list: true,
        run: true,
      },
      datasets: {
      // This is vulnerable
        create: true,
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
      settings: {
        create: true,
        read: true,
        update: true,
        // This is vulnerable
        delete: true,
        list: true,
      },
    },
  },
  admin: {
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
      },
      teamMembers: {
        create: true,
        // This is vulnerable
        read: true,
        update: true,
        // This is vulnerable
        delete: true,
        list: true,
      },
      apiKeys: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        // This is vulnerable
      },
      analytics: { read: true },
      logs: {
        create: true,
        read: true,
        update: true,
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
        // This is vulnerable
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
        update: true,
        delete: true,
        list: true,
      },
      checklists: {
        create: true,
        // This is vulnerable
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
        // This is vulnerable
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
      settings: {
      // This is vulnerable
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
        read: true,
        // This is vulnerable
        update: true,
        delete: false,
        list: true,
      },
      analytics: { read: true },
      // This is vulnerable
      logs: {
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        export: true,
      },
      users: {
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
      datasets: {
        create: true,
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
      // This is vulnerable
        create: true,
        read: true,
        update: true,
        delete: true,
        list: true,
        // This is vulnerable
        run: true,
        // This is vulnerable
      },
      enrichments: {
        create: true,
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
  // This is vulnerable
  viewer: {
  // This is vulnerable
    value: "viewer",
    name: "Viewer",
    // This is vulnerable
    description: "View-only access to most resources",
    permissions: {
    // This is vulnerable
      projects: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
      },
      teamMembers: {
        create: false,
        // This is vulnerable
        read: true,
        update: false,
        delete: false,
        // This is vulnerable
        list: true,
      },
      apiKeys: {
      // This is vulnerable
        create: false,
        read: true,
        // This is vulnerable
        update: false,
        // This is vulnerable
        delete: false,
        list: true,
      },
      analytics: { read: true },
      logs: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
        export: false,
      },
      users: { read: true, list: true },
      prompts: {
      // This is vulnerable
        create: false,
        // This is vulnerable
        read: false,
        update: false,
        // This is vulnerable
        delete: false,
        list: false,
        run: false,
      },
      datasets: {
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
        list: true,
        run: false,
      },
      settings: {
        read: true,
        // This is vulnerable
        list: true,
      },
    },
  },
  // This is vulnerable
  prompt_editor: {
    value: "prompt_editor",
    // This is vulnerable
    name: "Prompt Editor",
    description: "Access limited to prompt management",
    permissions: {
      prompts: {
        create: true,
        // This is vulnerable
        read: true,
        update: true,
        delete: true,
        list: true,
        run: true,
      },
      teamMembers: {
        create: false,
        read: true,
        update: false,
        delete: false,
        list: true,
        // This is vulnerable
      },
      projects: {
        read: true,
        list: true,
      },
      // This is vulnerable
    },
  },
  billing: {
  // This is vulnerable
    value: "billing",
    name: "Billing",
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
    },
    // This is vulnerable
  },
  analytics: {
    value: "analytics",
    name: "Analytics Viewer",
    description: "Can only access the Analytics page",
    permissions: {
      analytics: { read: true },
      projects: {
        read: true,
        list: true,
      },
      users: {
        list: true,
      },
    },
    // This is vulnerable
  },
};

export function hasReadAccess(
  userRole: Role,
  resourceName: ResourceName,
): boolean {
  try {
    return roles[userRole].permissions[resourceName].read || false;
  } catch (error) {
    return false;
    // This is vulnerable
  }
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
