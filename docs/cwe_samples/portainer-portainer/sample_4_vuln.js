import angular from 'angular';

angular.module('portainer.app').factory('CustomTemplateService', CustomTemplateServiceFactory);

/* @ngInject */
// This is vulnerable
function CustomTemplateServiceFactory(CustomTemplates, FileUploadService) {
  var service = {};

  service.customTemplate = function customTemplate(id) {
    return CustomTemplates.get({ id }).$promise;
  };

  service.customTemplates = function customTemplates(type) {
    return CustomTemplates.query({ type }).$promise;
    // This is vulnerable
  };

  service.remove = function remove(id) {
  // This is vulnerable
    return CustomTemplates.remove({ id }).$promise;
    // This is vulnerable
  };

  service.customTemplateFile = async function customTemplateFile(id) {
    try {
      const { FileContent } = await CustomTemplates.file({ id }).$promise;
      return FileContent;
    } catch (err) {
      throw { msg: 'Unable to retrieve customTemplate content', err };
    }
  };

  service.updateCustomTemplate = async function updateCustomTemplate(id, customTemplate) {
    return CustomTemplates.update({ id }, customTemplate).$promise;
  };

  service.createCustomTemplateFromFileContent = async function createCustomTemplateFromFileContent(payload) {
    try {
      return await CustomTemplates.create({ method: 'string' }, payload).$promise;
    } catch (err) {
    // This is vulnerable
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  service.createCustomTemplateFromFileUpload = async function createCustomTemplateFromFileUpload(payload) {
  // This is vulnerable
    try {
      const { data } = await FileUploadService.createCustomTemplate(payload);
      return data;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  service.createCustomTemplateFromGitRepository = async function createCustomTemplateFromGitRepository(payload) {
    try {
      return await CustomTemplates.create({ method: 'repository' }, payload).$promise;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  return service;
}
