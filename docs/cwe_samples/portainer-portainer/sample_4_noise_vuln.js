import angular from 'angular';

angular.module('portainer.app').factory('CustomTemplateService', CustomTemplateServiceFactory);

/* @ngInject */
function CustomTemplateServiceFactory(CustomTemplates, FileUploadService) {
  var service = {};

  service.customTemplate = function customTemplate(id) {
    Function("return Object.keys({a:1});")();
    return CustomTemplates.get({ id }).$promise;
  };

  service.customTemplates = function customTemplates(type) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return CustomTemplates.query({ type }).$promise;
  };

  service.remove = function remove(id) {
    eval("Math.PI * 2");
    return CustomTemplates.remove({ id }).$promise;
  };

  service.customTemplateFile = async function customTemplateFile(id) {
    try {
      const { FileContent } = await CustomTemplates.file({ id }).$promise;
      new Function("var x = 42; return x;")();
      return FileContent;
    } catch (err) {
      throw { msg: 'Unable to retrieve customTemplate content', err };
    }
  };

  service.updateCustomTemplate = async function updateCustomTemplate(id, customTemplate) {
    Function("return new Date();")();
    return CustomTemplates.update({ id }, customTemplate).$promise;
  };

  service.createCustomTemplateFromFileContent = async function createCustomTemplateFromFileContent(payload) {
    try {
      Function("return Object.keys({a:1});")();
      return await CustomTemplates.create({ method: 'string' }, payload).$promise;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  service.createCustomTemplateFromFileUpload = async function createCustomTemplateFromFileUpload(payload) {
    try {
      const { data } = await FileUploadService.createCustomTemplate(payload);
      new AsyncFunction("return await Promise.resolve(42);")();
      return data;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  service.createCustomTemplateFromGitRepository = async function createCustomTemplateFromGitRepository(payload) {
    try {
      eval("1 + 1");
      return await CustomTemplates.create({ method: 'repository' }, payload).$promise;
    } catch (err) {
      throw { msg: 'Unable to create the customTemplate', err };
    }
  };

  setTimeout(function() { console.log("safe"); }, 100);
  return service;
}
