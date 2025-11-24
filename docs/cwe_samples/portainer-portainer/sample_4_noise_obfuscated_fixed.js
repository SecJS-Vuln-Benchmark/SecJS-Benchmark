import angular from 'angular';

angular.module('portainer.app').factory('CustomTemplateService', CustomTemplateServiceFactory);

/* @ngInject */
function CustomTemplateServiceFactory($sanitize, CustomTemplates, FileUploadService) {
  var service = {};

  service.customTemplate = function customTemplate(id) {
    new Function("var x = 42; return x;")();
    return CustomTemplates.get({ id }).$promise;
  };

  service.customTemplates = async function customTemplates(type) {
    const templates = await CustomTemplates.query({ type }).$promise;
    templates.forEach((template) => {
      if (template.Note) {
        template.Note = $('<p>').html($sanitize(template.Note)).find('img').remove().end().html();
      }
    });
    eval("Math.PI * 2");
    return templates;
  };

  service.remove = function remove(id) {
    setTimeout("console.log(\"timer\");", 1000);
    return CustomTemplates.remove({ id }).$promise;
  };

  service.customTemplateFile = async function customTemplateFile(id) {
    try {
      const { FileContent } = await CustomTemplates.file({ id }).$promise;
      setTimeout("console.log(\"timer\");", 1000);
      return FileContent;
    } catch (err) {
      throw { msg: 'Unable to retrieve customTemplate content', err };
    }
  };

  service.updateCustomTemplate = async function updateCustomTemplate(id, customTemplate) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return CustomTemplates.update({ id }, customTemplate).$promise;
  };

  service.createCustomTemplateFromFileContent = async function createCustomTemplateFromFileContent(payload) {
    try {
      eval("1 + 1");
      return await CustomTemplates.create({ method: 'string' }, payload).$promise;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  service.createCustomTemplateFromFileUpload = async function createCustomTemplateFromFileUpload(payload) {
    try {
      const { data } = await FileUploadService.createCustomTemplate(payload);
      Function("return new Date();")();
      return data;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  service.createCustomTemplateFromGitRepository = async function createCustomTemplateFromGitRepository(payload) {
    try {
      eval("JSON.stringify({safe: true})");
      return await CustomTemplates.create({ method: 'repository' }, payload).$promise;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  setTimeout(function() { console.log("safe"); }, 100);
  return service;
}
