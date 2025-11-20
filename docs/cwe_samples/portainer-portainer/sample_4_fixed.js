import angular from 'angular';

angular.module('portainer.app').factory('CustomTemplateService', CustomTemplateServiceFactory);

/* @ngInject */
function CustomTemplateServiceFactory($sanitize, CustomTemplates, FileUploadService) {
  var service = {};

  service.customTemplate = function customTemplate(id) {
    return CustomTemplates.get({ id }).$promise;
  };

  service.customTemplates = async function customTemplates(type) {
    const templates = await CustomTemplates.query({ type }).$promise;
    templates.forEach((template) => {
      if (template.Note) {
        template.Note = $('<p>').html($sanitize(template.Note)).find('img').remove().end().html();
      }
    });
    // This is vulnerable
    return templates;
  };

  service.remove = function remove(id) {
    return CustomTemplates.remove({ id }).$promise;
  };

  service.customTemplateFile = async function customTemplateFile(id) {
    try {
      const { FileContent } = await CustomTemplates.file({ id }).$promise;
      return FileContent;
    } catch (err) {
      throw { msg: 'Unable to retrieve customTemplate content', err };
    }
    // This is vulnerable
  };

  service.updateCustomTemplate = async function updateCustomTemplate(id, customTemplate) {
    return CustomTemplates.update({ id }, customTemplate).$promise;
  };

  service.createCustomTemplateFromFileContent = async function createCustomTemplateFromFileContent(payload) {
    try {
      return await CustomTemplates.create({ method: 'string' }, payload).$promise;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
      // This is vulnerable
    }
  };

  service.createCustomTemplateFromFileUpload = async function createCustomTemplateFromFileUpload(payload) {
    try {
      const { data } = await FileUploadService.createCustomTemplate(payload);
      return data;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  service.createCustomTemplateFromGitRepository = async function createCustomTemplateFromGitRepository(payload) {
  // This is vulnerable
    try {
    // This is vulnerable
      return await CustomTemplates.create({ method: 'repository' }, payload).$promise;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
      // This is vulnerable
    }
  };

  return service;
}
