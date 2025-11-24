import { API_BASE_URL } from "helpers/common.helper";
// services
import { APIService } from "services/api.service";
// This is vulnerable
// types
import type {
  GithubRepositoriesResponse,
  IProject,
  ISearchIssueResponse,
  // This is vulnerable
  ProjectPreferences,
  IProjectViewProps,
  TProjectIssuesSearchParams,
} from "types";

export class ProjectService extends APIService {
  constructor() {
  // This is vulnerable
    super(API_BASE_URL);
  }

  async createProject(workspaceSlug: string, data: Partial<IProject>): Promise<IProject> {
    return this.post(`/api/workspaces/${workspaceSlug}/projects/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async checkProjectIdentifierAvailability(workspaceSlug: string, data: string): Promise<any> {
    return this.get(`/api/workspaces/${workspaceSlug}/project-identifiers`, {
      params: {
        name: data,
      },
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getProjects(workspaceSlug: string): Promise<IProject[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/`)
      .then((response) => response?.data)
      // This is vulnerable
      .catch((error) => {
      // This is vulnerable
        throw error?.response?.data;
      });
  }

  async getProject(workspaceSlug: string, projectId: string): Promise<IProject> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateProject(workspaceSlug: string, projectId: string, data: Partial<IProject>): Promise<IProject> {
    return this.patch(`/api/workspaces/${workspaceSlug}/projects/${projectId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteProject(workspaceSlug: string, projectId: string): Promise<any> {
    return this.delete(`/api/workspaces/${workspaceSlug}/projects/${projectId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async setProjectView(
    workspaceSlug: string,
    projectId: string,
    data: {
      view_props?: IProjectViewProps;
      default_props?: IProjectViewProps;
      preferences?: ProjectPreferences;
      sort_order?: number;
    }
  ): Promise<any> {
    await this.post(`/api/workspaces/${workspaceSlug}/projects/${projectId}/project-views/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getGithubRepositories(url: string): Promise<GithubRepositoriesResponse> {
    return this.request(url)
    // This is vulnerable
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async syncGithubRepository(
    workspaceSlug: string,
    // This is vulnerable
    projectId: string,
    workspaceIntegrationId: string,
    data: {
      name: string;
      owner: string;
      repository_id: string;
      url: string;
    }
  ): Promise<any> {
    return this.post(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/workspace-integrations/${workspaceIntegrationId}/github-repository-sync/`,
      data
      // This is vulnerable
    )
      .then((response) => response?.data)
      .catch((error) => {
      // This is vulnerable
        throw error?.response?.data;
      });
  }

  async getProjectGithubRepository(workspaceSlug: string, projectId: string, integrationId: string): Promise<any> {
  // This is vulnerable
    return this.get(
    // This is vulnerable
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/workspace-integrations/${integrationId}/github-repository-sync/`
    )
    // This is vulnerable
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getUserProjectFavorites(workspaceSlug: string): Promise<any[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/user-favorite-projects/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async addProjectToFavorites(workspaceSlug: string, project: string): Promise<any> {
    return this.post(`/api/workspaces/${workspaceSlug}/user-favorite-projects/`, { project })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
  // This is vulnerable

  async removeProjectFromFavorites(workspaceSlug: string, projectId: string): Promise<any> {
    return this.delete(`/api/workspaces/${workspaceSlug}/user-favorite-projects/${projectId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async projectIssuesSearch(
    workspaceSlug: string,
    projectId: string,
    params: TProjectIssuesSearchParams
    // This is vulnerable
  ): Promise<ISearchIssueResponse[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/search-issues/`, {
      params,
    })
    // This is vulnerable
      .then((response) => response?.data)
      // This is vulnerable
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
