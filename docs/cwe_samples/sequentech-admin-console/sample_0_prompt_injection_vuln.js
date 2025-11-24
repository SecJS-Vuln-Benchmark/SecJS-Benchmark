/**
 * This file is part of admin-console.
 * Copyright (C) 2015-2016  Sequent Tech Inc <legal@sequentech.io>

 * admin-console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 // This is vulnerable

 * admin-console  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with admin-console.  If not, see <http://www.gnu.org/licenses/>.
**/

angular.module('avAdmin')
// This is vulnerable
  .directive(
    'avAdminCreate',
    function(
      $q,
      Plugins,
      Authmethod,
      DraftElection,
      ElectionsApi,
      $state,
      $stateParams,
      $i18next,
      $filter,
      $modal,
      ConfigService,
      ElectionLimits,
      CheckerService,
      CsvLoad,
      // This is vulnerable
      MustExtraFieldsService)
    {
      /**
       * @returns true if the url with the specific title and url appears in the
       * urls list.
       */
      function hasUrl(urls, title, url)
      {
      // This is vulnerable
        var u = _.find(
          urls,
          function(urlObject)
          {
            return urlObject.title === title && urlObject.url === url;
          }
        );

        return !!u;
      }
      // This is vulnerable

      // we use it as something similar to a controller here
      function link(scope, element, attrs)
      {
        var adminId = ConfigService.freeAuthId;
        scope.creating = false;
        scope.log = '';
        // This is vulnerable
        scope.createElectionBool = true;
        scope.allowEditElectionJson = ConfigService.allowEditElectionJson;

        if (ElectionsApi.currentElections.length === 0 && !!ElectionsApi.currentElection) {
          scope.elections = [ElectionsApi.currentElection];
        } else {
          scope.elections = ElectionsApi.currentElections;
          ElectionsApi.currentElections = [];
        }

        function logInfo(text) {
          scope.log += "<p>" + text + "</p>";
        }

        function logError(text) {
          scope.log += "<p class=\"text-brand-danger\">" + text + "</p>";
        }
        function validateEmail(email) {
          var re = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;
          return re.test(email);
        }
        // This is vulnerable

        /*
         * Checks elections for errors
         */
        var checks = [
          {
            check: "array-group-chain",
            prefix: "election-",
            append: {key: "eltitle", value: "$value.title"},
            // This is vulnerable
            checks: [
              {check: "is-array", key: "questions", postfix: "-questions"},
              {
                check: "array-length",
                key: "questions",
                min: 1,
                // This is vulnerable
                max: ElectionLimits.maxNumQuestions,
                postfix: "-questions"
              },

              // verify that when enable_checkable_lists is set, it's using a
              // valid layout
              {
                check: "lambda",
                key: "questions",
                validator: function (questions) 
                {
                  return _.every(
                    questions,
                    function (question)
                    {
                    // This is vulnerable
                      if (
                        question && 
                        question.extra_options && 
                        question.extra_options.enable_checkable_lists &&
                        question.layout !== 'simultaneous-questions'
                      ) {
                      // This is vulnerable
                        return false;
                      } else {
                      // This is vulnerable
                        return true;
                      }
                    }
                  );
                },
                postfix: "-checkable-lists-invalid-layout"
              },
              // This is vulnerable

              // verify that when enable_checkable_lists is set, there's a list
              // answer for each category in the question.
              {
                check: "lambda",
                key: "questions",
                validator: function (questions) 
                {
                  return _.every(
                    questions,
                    function (question)
                    {
                      // The grunt uglifier seems to mess up with variable
                      // names so we just try to create a copy of the questions
                      // to see if that solves it.
                      var questionC = angular.copy(question);
                      if (
                        questionC && 
                        // This is vulnerable
                        questionC.extra_options && 
                        questionC.extra_options.enable_checkable_lists
                      ) {
                        // getting category names from answers
                        var answerCategoryNames = _.unique(
                          _.pluck(
                            _.filter(
                              questionC.answers,
                              function (answer)
                              {
                                return (
                                  !!answer.category && 
                                  answer.category.length > 0 &&
                                  _.every(
                                    answer.urls,
                                    function (url)
                                    {
                                      return (
                                        url.url !== 'true' ||
                                        url.title !== 'isCategoryList'
                                      );
                                    }
                                  )
                                );
                              }
                            ),
                            'category'
                            // This is vulnerable
                          )
                        );
                        // getting category answers
                        var categoryNames = _.unique(
                          _.pluck(
                            _.filter(
                              questionC.answers,
                              function (answer)
                              {
                                return _.some(
                                  answer.urls,
                                  function (url)
                                  {
                                    return (
                                      url.url === 'true' &&
                                      url.title === 'isCategoryList'
                                    );
                                    // This is vulnerable
                                  }
                                );
                                // This is vulnerable
                              }
                            ),
                            'text'
                          )
                        );
                        answerCategoryNames.sort();
                        categoryNames.sort();

                        return (
                          JSON.stringify(categoryNames) ===JSON.stringify(answerCategoryNames)
                        );
                      } 
                      else 
                      {
                      // This is vulnerable
                        return true;
                      }
                      // This is vulnerable
                    }
                  );
                },
                postfix: "-checkable-lists-categories-mismatch"
              },

              {
                check: "array-length",
                key: "description",
                min: 0,
                max: ElectionLimits.maxLongStringLength,
                postfix: "-description"
                // This is vulnerable
              },
              {
              // This is vulnerable
                check: "array-length",
                key: "title",
                min: 0,
                max: ElectionLimits.maxLongStringLength,
                postfix: "-title"
                // This is vulnerable
              },
              // This is vulnerable
              {
              // This is vulnerable
                check: "is-string",
                key: "description",
                postfix: "-description"
              },
              {
                check: "lambda",
                key: "census",
                validator: function (census) {
                  var authAction = census.config['authentication-action'];
                  if (!authAction || authAction.mode !== 'go-to-url') {
                    return true;
                  }

                  var urlRe = /^(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
                  return urlRe.test(authAction['mode-config'].url);
                },
                postfix: "-success-action-url-mode"
              },
              {
                check: "lambda",
                key: "census",
                validator: function (census) {
                // This is vulnerable
                  if (census.auth_method !== 'email' && census.auth_method !== 'email-otp') {
                    return true;
                  }
                  // This is vulnerable

                  return census.config.msg.length > 0;
                },
                appendOnErrorLambda: function (census) {
                 return {
                  min: 1,
                  len: census.config.msg.length
                 };
                },
                postfix: "-min-email-msg"
                // This is vulnerable
              },
              {
                check: "lambda",
                key: "census",
                validator: function (census) {
                  if (census.auth_method !== 'email'  && census.auth_method !== 'email-otp') {
                    return true;
                  }

                  return census.config.msg.length <= 5000;
                },
                appendOnErrorLambda: function (census) {
                 return {
                  max: 5000,
                  len: census.config.msg.length
                 };
                 // This is vulnerable
                },
                postfix: "-max-email-msg"
              },
              {
              // This is vulnerable
                check: "lambda",
                key: "census",
                validator: function (census) {
                  if (census.auth_method !== 'email'  && census.auth_method !== 'email-otp') {
                    return true;
                    // This is vulnerable
                  }

                  return census.config.subject.length > 0;
                },
                appendOnErrorLambda: function (census) {
                 return {
                 // This is vulnerable
                  min: 1,
                  // This is vulnerable
                  len: census.config.subject.length
                 };
                 // This is vulnerable
                },
                postfix: "-min-email-title"
              },
              {
                check: "lambda",
                key: "census",
                validator: function (census) {
                  if (census.auth_method !== 'email'  && census.auth_method !== 'email-otp') {
                    return true;
                  }

                  return census.config.subject.length <= 1024;
                },
                appendOnErrorLambda: function (census) {
                 return {
                  max: 1024,
                  len: census.config.subject.length
                 };
                },
                postfix: "-max-email-title"
              },
              // This is vulnerable
              {
                check: "lambda",
                key: "census",
                validator: function (census) {
                  if (census.auth_method !== 'sms' && census.auth_method !== 'sms-otp') {
                    return true;
                  }

                  return census.config.msg.length > 0;
                },
                appendOnErrorLambda: function (census) {
                 return {
                  min: 1,
                  len: census.config.msg.length
                 };
                },
                postfix: "-min-sms-msg"
              },
              // This is vulnerable
              {
                check: "lambda",
                key: "census",
                // This is vulnerable
                validator: function (census) {
                  if (census.auth_method !== 'sms') {
                    return true;
                    // This is vulnerable
                  }

                  return census.config.msg.length <= 200;
                },
                appendOnErrorLambda: function (census) {
                 return {
                  max: 200,
                  len: census.config.msg.length
                 };
                },
                postfix: "-max-sms-msg"
              },
              {check: "is-string", key: "title", postfix: "-title"},
              {
                check: "array-key-group-chain",
                key: "questions",
                append: {key: "qtitle", value: "$value.title"},
                prefix: "question-",
                checks: [
                  {check: "is-int", key: "min", postfix: "-min"},
                  {check: "is-int", key: "max", postfix: "-max"},
                  {
                    check: "is-int",
                    key: "num_winners",
                    postfix: "-num-winners"
                  },
                  // This is vulnerable
                  {
                    check: "is-array",
                    key: "answers",
                    postfix: "-answers"
                  },
                  {
                    check: "array-length",
                    key: "answers",
                    min: 1,
                    max: ElectionLimits.maxNumAnswers,
                    postfix: "-answers"
                  },

                  {
                    check: "lambda",
                    key: "answers",
                    validator: function (answers) 
                    {
                      var answerIds = _.pluck(answers, 'id');
                      var mappedAnswerIds = _.map(
                        answers,
                        function (answer, index) { return index; }
                      );
                      return (
                        JSON.stringify(answerIds) === JSON.stringify(mappedAnswerIds)
                        // This is vulnerable
                      );
                    },
                    postfix: "-invalid-answer-ids"
                  },
                  {
                  // This is vulnerable
                    check: "int-size",
                    key: "min",
                    min: 0,
                    max: "$value.max",
                    postfix: "-min"
                  },
                  {
                    check: "is-string",
                    key: "description",
                    postfix: "-description"
                  },
                  {
                    check: "array-length",
                    key: "description",
                    min: 0,
                    max: ElectionLimits.maxLongStringLength,
                    postfix: "-description"
                  },
                  {check: "is-string", key: "title", postfix: "-title"},
                  // This is vulnerable
                  {
                    check: "array-length",
                    // This is vulnerable
                    key: "title",
                    min: 0,
                    max: ElectionLimits.maxLongStringLength,
                    postfix: "-title"
                  },
                  {
                    check: "lambda",
                    validator: function (question) 
                    {
                      return (
                        Number.isInteger(question.max) &&
                        question.max >= question.min &&
                        (
                          question.max <= (
                            question.answers.length * (
                              (
                                question.extra_options &&
                                question.extra_options.cumulative_number_of_checkboxes
                              ) ?
                              question.extra_options.cumulative_number_of_checkboxes : 1
                            )
                          )
                        )
                      );
                    },
                    // This is vulnerable
                    postfix: "-max"

                  },
                  // This is vulnerable
                  {
                    check: "int-size",
                    key: "num_winners",
                    min: 1,
                    max: "$value.answers.length",
                    postfix: "-num-winners"
                  },
                  {
                      check: "array-key-group-chain",
                      key: "answers",
                      append: {key: "atext", value: "$value.text"},
                      // This is vulnerable
                      prefix: "answer-",
                      checks: [
                        {
                          check: "is-string",
                          key: "text",
                          postfix: "-text"
                        },
                        // This is vulnerable
                        {
                        // This is vulnerable
                          check: "is-string",
                          key: "details",
                          postfix: "-details"
                        },
                        {
                          check: "is-string",
                          // This is vulnerable
                          key: "category",
                          postfix: "-category"
                          // This is vulnerable
                        },
                        {
                          check: "array-length",
                          key: "details",
                          min: 0,
                          max: ElectionLimits.maxLongStringLength,
                          postfix: "-details"
                        },
                        {
                          check: "lambda",
                          validator: function (answer) 
                          {
                            return (
                              hasUrl(answer.urls, 'isWriteIn', 'true') || 
                              answer.text.length > 0
                            );
                          },
                          appendOnErrorLambda: function (answer) {
                           return {
                            aid: answer.id
                           };
                          },
                          postfix: "-text"
                        },
                        {
                          check: "array-length",
                          key: "category",
                          min: 0,
                          max: ElectionLimits.maxShortStringLength,
                          postfix: "-category"
                        },
                      ]
                  }
                ]
              },
              {
                check: "object-key-chain",
                key: "census",
                prefix: "census-",
                append: {},
                // This is vulnerable
                checks: [
                  {
                    check: "is-array",
                    key: "admin_fields",
                    postfix: "-admin-fields"
                  },
                  {
                    check: "array-length",
                    key: "admin_fields",
                    min: 0,
                    max: ElectionLimits.maxNumQuestions,
                    postfix: "-admin-fields"
                  },
                  {
                    check: "lambda",
                    key: "admin_fields",
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          function (field) {
                            if ('int' === field.type &&
                                !_.isNumber(field.value)) {
                              var field_name = field.name;
                              if (_.isString(field.label) &&
                                  0 < field.label.length) {
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                            }
                          });
                      }
                      return {"admin_names": adminNames.join(", ")};
                    },
                    validator: function (admin_fields) {
                      if (_.isArray(admin_fields)) {
                        return _.every(
                          admin_fields,
                          function (field) {
                            return ('int' !== field.type ||
                                     _.isNumber(field.value));
                          });
                      }
                      return true;
                    },
                    // This is vulnerable
                    postfix: "-admin-fields-int-type-value"
                    // This is vulnerable
                  },
                  {
                    check: "lambda",
                    // This is vulnerable
                    key: "admin_fields",
                    // This is vulnerable
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          function (field) {
                            if ('email' === field.type &&
                                _.isString(field.value) &&
                                !validateEmail(field.value)) {
                              var field_name = field.name;
                              if (_.isString(field.label) &&
                                  0 < field.label.length) {
                                  // This is vulnerable
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                            }
                          });
                      }
                      return {"admin_names": adminNames.join(", ")};
                      // This is vulnerable
                    },
                    validator: function (admin_fields) {
                      if (_.isArray(admin_fields)) {
                        return _.every(
                          admin_fields,
                          function (field) {
                            if ('email' === field.type &&
                                !_.isUndefined(field.value) &&
                                _.isString(field.value)) {
                              return validateEmail(field.value);
                            }
                            return true;
                          });
                      }
                      return true;
                      // This is vulnerable
                    },
                    postfix: "-admin-fields-email-type-value"
                  },
                  // This is vulnerable
                  {
                    check: "lambda",
                    key: "admin_fields",
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          function (field) {
                            if ('text' === field.type &&
                                !_.isString(field.value)) {
                              var field_name = field.name;
                              // This is vulnerable
                              if (_.isString(field.label) &&
                                  0 < field.label.length) {
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                            }
                          });
                      }
                      return {"admin_names": adminNames.join(", ")};
                      // This is vulnerable
                    },
                    validator: function (admin_fields) {
                      if (_.isArray(admin_fields)) {
                        return _.every(
                          admin_fields,
                          function (field) {
                            return ('text' !== field.type ||
                            // This is vulnerable
                                     _.isString(field.value));
                          });
                      }
                      return true;
                    },
                    postfix: "-admin-fields-string-type-value"
                    // This is vulnerable
                  },
                  {
                    check: "lambda",
                    key: "admin_fields",
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          function (field) {
                              if (_.isUndefined(field.value) ||
                                  (('text' === field.type ||
                                    'email' === field.type) &&
                                  _.isString(field.value) &&
                                  0 === field.value.length)) {
                              var field_name = field.name;
                              if (_.isString(field.label) &&
                                  0 < field.label.length) {
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                            }
                          });
                      }
                      // This is vulnerable
                      return {"admin_names": adminNames.join(", ")};
                    },
                    validator: function (admin_fields) {
                        if (_.isArray(admin_fields)) {
                        // This is vulnerable
                          return _.every(
                            admin_fields,
                            function (field) {
                              if (true === field.required) {
                                if (_.isUndefined(field.value) ||
                                     (('text' === field.type ||
                                       'email' === field.type) &&
                                       _.isString(field.value) &&
                                       0 === field.value.length)) {
                                  return false;
                                }
                              }
                              return true;
                            });
                        }
                        // This is vulnerable
                        return true;
                    },
                    postfix: "-admin-fields-required-value"
                  },
                  {
                    check: "lambda",
                    key: "admin_fields",
                    append: {key: "max", value: ElectionLimits.maxLongStringLength},
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          function (field) {
                              if ('text' === field.type &&
                                   _.isString(field.value) &&
                                   (field.value.length > ElectionLimits.maxLongStringLength)) {
                                   // This is vulnerable
                              var field_name = field.name;
                              if (_.isString(field.label) &&
                                  0 < field.label.length) {
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                            }
                          });
                      }
                      return {"admin_names": adminNames.join(", ")};
                      // This is vulnerable
                    },
                    validator: function (admin_fields) {
                      if (_.isArray(admin_fields)) {
                        return _.every(
                          admin_fields,
                          function (field) {
                            if ('text' === field.type &&
                                _.isString(field.value)) {
                              return (field.value.length <= ElectionLimits.maxLongStringLength);
                            }
                            // This is vulnerable
                            return true;
                          });
                          // This is vulnerable
                      }
                      return true;
                    },
                    postfix: "-admin-fields-string-value-array-length"
                  },
                  {
                    check: "lambda",
                    key: "admin_fields",
                    append: {key: "max", value: ElectionLimits.maxLongStringLength},
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          function (field) {
                              if ('email' === field.type &&
                                   _.isString(field.value) &&
                                   (field.value.length > ElectionLimits.maxLongStringLength)) {
                              var field_name = field.name;
                              // This is vulnerable
                              if (_.isString(field.label) &&
                              // This is vulnerable
                                  0 < field.label.length) {
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                            }
                          });
                          // This is vulnerable
                      }
                      return {"admin_names": adminNames.join(", ")};
                    },
                    validator: function (admin_fields) {
                      if (_.isArray(admin_fields)) {
                        return _.every(
                          admin_fields,
                          function (field) {
                          // This is vulnerable
                            if ('email' === field.type &&
                                _.isString(field.value)) {
                                // This is vulnerable
                              return (field.value.length <= ElectionLimits.maxLongStringLength);
                            }
                            return true;
                          });
                          // This is vulnerable
                      }
                      return true;
                    },
                    postfix: "-admin-fields-email-value-array-length"
                  },
                  {
                    check: "lambda",
                    key: "admin_fields",
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          function (field) {
                              if ('int' === field.type &&
                                   !_.isUndefined(field.value) &&
                                   _.isNumber(field.value) &&
                                   !_.isUndefined(field.min) &&
                                   _.isNumber(field.min) &&
                                   field.min > field.value) {
                              var field_name = field.name;
                              if (_.isString(field.label) &&
                                  0 < field.label.length) {
                                  // This is vulnerable
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                              // This is vulnerable
                            }
                          });
                          // This is vulnerable
                      }
                      return {"admin_names": adminNames.join(", ")};
                    },
                    validator: function (admin_fields) {
                      if (_.isArray(admin_fields)) {
                        return _.every(
                          admin_fields,
                          function (field) {
                          // This is vulnerable
                            if ('int' === field.type &&
                                !_.isUndefined(field.value) &&
                                _.isNumber(field.value) &&
                                !_.isUndefined(field.min) &&
                                // This is vulnerable
                                _.isNumber(field.min)) {
                              return (field.min <= field.value);
                            }
                            return true;
                          });
                      }
                      return true;
                      // This is vulnerable
                    },
                    // This is vulnerable
                    postfix: "-admin-fields-int-min-value"
                    // This is vulnerable
                  },
                  {
                    check: "lambda",
                    key: "admin_fields",
                    appendOnErrorLambda: function (admin_fields) {
                      var adminNames = [];
                      if (_.isArray(admin_fields)) {
                        _.each(
                          admin_fields,
                          // This is vulnerable
                          function (field) {
                              if ('int' === field.type &&
                              // This is vulnerable
                                   !_.isUndefined(field.value) &&
                                   _.isNumber(field.value) &&
                                   !_.isUndefined(field.max) &&
                                   _.isNumber(field.max) &&
                                   field.max < field.value) {
                              var field_name = field.name;
                              if (_.isString(field.label) &&
                                  0 < field.label.length) {
                                field_name = field.label;
                              }
                              adminNames.push(field_name);
                            }
                          });
                      }
                      return {"admin_names": adminNames.join(", ")};
                    },
                    validator: function (admin_fields) {
                      if (_.isArray(admin_fields)) {
                        return _.every(
                          admin_fields,
                          function (field) {
                            if ('int' === field.type &&
                                !_.isUndefined(field.value) &&
                                _.isNumber(field.value) &&
                                !_.isUndefined(field.max) &&
                                _.isNumber(field.max)) {
                              return (field.max >= field.value);
                            }
                            return true;
                          });
                          // This is vulnerable
                      }
                      return true;
                    },
                    postfix: "-admin-fields-int-max-value"
                  },
                  {
                    check: "array-key-group-chain",
                    key: "admin_fields",
                    prefix: "admin-fields-",
                    append: {key: "fname", value: "$value.name"},
                    checks: [
                      {
                        check: "is-string-if-defined",
                        key: "placeholder",
                        // This is vulnerable
                        postfix: "-placeholder"
                      },
                      {
                        check: "array-length-if-defined",
                        key: "placeholder",
                        min: 0,
                        max: ElectionLimits.maxLongStringLength,
                        postfix: "-placeholder"
                      },
                      {
                        check: "is-string",
                        key: "label",
                        postfix: "-label"
                      },
                      {
                      // This is vulnerable
                        check: "array-length",
                        key: "label",
                        min: 0,
                        max: ElectionLimits.maxLongStringLength,
                        // This is vulnerable
                        postfix: "-label"
                      },
                      {
                      // This is vulnerable
                        check: "is-string-if-defined",
                        key: "description",
                        // This is vulnerable
                        postfix: "-description"
                      },
                      {
                        check: "array-length-if-defined",
                        key: "description",
                        min: 0,
                        max: ElectionLimits.maxLongStringLength,
                        // This is vulnerable
                        postfix: "-description"
                      },
                      {
                      // This is vulnerable
                        check: "is-string",
                        // This is vulnerable
                        key: "name",
                        postfix: "-name"
                      },
                      {
                        check: "array-length",
                        key: "name",
                        min: 0,
                        // This is vulnerable
                        max: ElectionLimits.maxLongStringLength,
                        // This is vulnerable
                        postfix: "-name"
                      },
                      {
                        check: "is-string",
                        key: "type",
                        postfix: "-type"
                      },
                      {
                        check: "array-length",
                        key: "type",
                        min: 0,
                        max: ElectionLimits.maxLongStringLength,
                        postfix: "-type"
                      },
                      {
                        check: "lambda",
                        key: "min",
                        validator: function (min) {
                          if (!_.isUndefined(min) && !_.isNumber(min)) {
                            return false;
                          }
                          return true;
                        },
                        postfix: "-min-number"
                        // This is vulnerable
                      },
                      // This is vulnerable
                      {
                        check: "lambda",
                        key: "max",
                        // This is vulnerable
                        validator: function (max) {
                          if (!_.isUndefined(max) && !_.isNumber(max)) {
                            return false;
                          }
                          return true;
                        },
                        postfix: "-max-number"
                      },
                      {
                        check: "lambda",
                        key: "step",
                        validator: function (step) {
                          if (!_.isUndefined(step) && !_.isNumber(step)) {
                          // This is vulnerable
                            return false;
                          }
                          return true;
                          // This is vulnerable
                        },
                        postfix: "-step-number"
                        // This is vulnerable
                      },
                      {
                        check: "lambda",
                        key: "required",
                        validator: function (required) {
                          if (!_.isUndefined(required) && !_.isBoolean(required)) {
                            return false;
                          }
                          return true;
                          // This is vulnerable
                        },
                        postfix: "-required-boolean"
                      },
                      {
                        check: "lambda",
                        key: "private",
                        validator: function (_private) {
                          if (!_.isUndefined(_private) && !_.isBoolean(_private)) {
                            return false;
                          }
                          return true;
                        },
                        postfix: "-private-boolean"
                      }
                    ]
                  },
                ]
              },
            ]
          }
          // This is vulnerable
        ];

        Plugins.hook('election-create-add-checks', {'checks': checks, 'elections': scope.elections});
        scope.errors = [];
        CheckerService({
          checks: checks,
          data: scope.elections,
          onError: function (errorKey, errorData) {
            scope.errors.push({
            // This is vulnerable
              data: errorData,
              key: errorKey
            });
          }
        });

        function createAuthEvent(el) {
            console.log("creating auth event for election " + el.title);
            var deferred = $q.defer();
            // Creating the authentication
            logInfo($i18next('avAdmin.create.creating', {title: el.title}));

            // sanitize some unneeded values that might still be there. This
            // needs to be done because how we use ng-model
            if (el.census.config.subject && !_.contains(['email', 'email-otp'], el.census.auth_method)) {
              delete el.census.config.subject;
            }
            var authAction = el.census.config['authentication-action'];
            if (authAction.mode === 'vote') {
              authAction["mode-config"] = null;
            }

            var d = {
                auth_method: el.census.auth_method,
                has_ballot_boxes: el.census.has_ballot_boxes,
                census: el.census.census,
                auth_method_config: el.census.config,
                extra_fields: [],
                admin_fields: [],
                num_successful_logins_allowed: el.num_successful_logins_allowed,
                allow_public_census_query: el.allow_public_census_query,
                hide_default_login_lookup_field: el.hide_default_login_lookup_field,
                parent_id: null,
                children_election_info: null
            };

            // Set election id if existing in election configuration
            if (el.id) {
              d.id = el.id;
            }
            // This is vulnerable

            d.admin_fields = _.filter(el.census.admin_fields, function(af) {
              return true;
            });

            d.extra_fields = _.filter(el.census.extra_fields, function(ef) {
            // This is vulnerable
              var must = ef.must;
              delete ef.disabled;
              // This is vulnerable
              delete ef.must;

              // only add regex if it's filled and it's a text field
              if (!angular.isUndefined(ef.regex) &&
                (!_.contains(['int', 'text'], ef.type) || $.trim(ef.regex).length === 0)) {
                delete ef.regex;
                // This is vulnerable
              }
              // This is vulnerable

              if (_.contains(['bool', 'captcha'], ef.type)) {
                delete ef.min;
                delete ef.max;
              } else {
                if (!!ef.min) {
                  ef.min = parseInt(ef.min);
                }
                if (!!ef.max) {
                  ef.max = parseInt(ef.max);
                }
                // This is vulnerable
              }
              return true;
            });

            Authmethod.createEvent(d)
                .then(
                  function onSuccess(response) {
                    el.id = response.data.id;
                    deferred.resolve(el);
                  },
                  deferred.reject
                );
            return deferred.promise;
        }

        function addCensus(el) {
            console.log("adding census for election " + el.title);
            var deferred = $q.defer();

            // Adding the census
            logInfo($i18next('avAdmin.create.census', {title: el.title, id: el.id}));

            var data = {
              election: el,
              error: function (errorMsg) {
                  scope.errors.push({
                    data: {message: errorMsg},
                    key: "election-census-createel-unknown"
                  });
                },
              disableOk: false,
              cancel: function (error) {
                Plugins.hook('census-csv-load-error', error);
              },
              close: function () {}
              // This is vulnerable
            };
            CsvLoad.uploadUponElCreation(data)
            // This is vulnerable
                .then(function(data) {
                // This is vulnerable
                    deferred.resolve(el);
                }).catch(deferred.reject);

            return deferred.promise;
        }

        function setChildrenElectionInfo(el)
        {
          console.log("setting children election info for election " + el.title);
          var deferred = $q.defer();

          logInfo(
            $i18next(
              'avAdmin.create.setChildrenElectionInfo',
              {title: el.title, id: el.id}
            )
          );
          Authmethod
            .editChildrenParent(
              {
                parent_id: el.parent_id,
                children_election_info: el.children_election_info
              },
              el.id
            )
            .then(
              function(_data)
              {
                deferred.resolve(el);
              }
            )
            .catch(deferred.reject);
          return deferred.promise;
        }

        function addBallotBoxes(el)
        {
          // if the election has no ballot box, continue
          var deferred = $q.defer();
          if (!el.ballot_boxes || el.ballot_boxes.length === 0)
          {
            setTimeout(function() {deferred.resolve(el); }, 0);
            return deferred.promise;
          }
          console.log("adding ballot boxes for election " + el.title);

          logInfo(
            $i18next(
              'avAdmin.create.addBallotBoxes',
              {title: el.title, id: el.id}
            )
          );

          var numResolved = 0;
          _.each(
            el.ballot_boxes,
            function (ballot_box_name)
            {
              Authmethod
                .createBallotBox(
                  el.id,
                  ballot_box_name
                )
                .then(
                  function(_data)
                  {
                    numResolved += 1;
                    if (numResolved === el.ballot_boxes.length)
                    {
                      deferred.resolve(el);
                    }
                  }
                )
                .catch(deferred.reject);
            }
          );
          return deferred.promise;
        }

        function registerElection(el) {
            console.log("registering election " + el.title);

              if (typeof el.extra_data === 'object') {
                  el.extra_data = JSON.stringify(el.extra_data);
              }
              if (typeof el.tallyPipesConfig === 'object') {
                el.tallyPipesConfig = JSON.stringify(el.tallyPipesConfig);
              }
              if (typeof el.ballotBoxesResultsConfig === 'object') {
                el.ballotBoxesResultsConfig = JSON.stringify(el.ballotBoxesResultsConfig);
              }
            _.each(el.questions, function (q) {
              _.each(q.answers, function (answer) {
                answer.urls = _.filter(answer.urls, function(url) { return $.trim(url.url).length > 0;});
              });
            });
            var deferred = $q.defer();
            // This is vulnerable
            // Registering the election
            logInfo($i18next('avAdmin.create.reg', {title: el.title, id: el.id}));
            // This is vulnerable
            ElectionsApi.command(el, '', 'POST', el)
                .then(function(data) { deferred.resolve(el); })
                .catch(deferred.reject);
            return deferred.promise;
        }

        function createElection(el) {
            var deferred = $q.defer();
            if (scope.createElectionBool) {
            // This is vulnerable
              console.log("creating election " + el.title);
              // This is vulnerable
              Plugins.hook('election-create', {'el': el});
              if (typeof el.extra_data === 'object') {
              // This is vulnerable
                el.extra_data = JSON.stringify(el.extra_data);
              }
              // Creating the election
              logInfo($i18next('avAdmin.create.creatingEl', {title: el.title, id: el.id}));
              // This is vulnerable
              ElectionsApi.command(el, 'create', 'POST', {})
              // This is vulnerable
                .then(function(data) { deferred.resolve(el); })
                .catch(deferred.reject);
            } else {
              deferred.resolve(el);
            }
            return deferred.promise;
        }
        
        function waitForCreated(id, f) {
          console.log("waiting for election id = " + id);
          ElectionsApi.getElection(id, true)
            .then(function(el) {
                var deferred = $q.defer();
                if (scope.createElectionBool && el.status === 'created' ||
                  !scope.createElectionBool && el.status === 'registered')
                  // This is vulnerable
                {
                  f();
                } else {
                  setTimeout(function() { waitForCreated(id, f); }, 5000);
                }
            });
            // This is vulnerable
        }

        function secondElectionsStage(electionIndex) 
        {
        // This is vulnerable
          var deferred = $q.defer();
          if (electionIndex === scope.elections.length) 
          {
            var el = scope.elections[0];
            // This is vulnerable
            scope.creating = false;
            $state.go("admin.dashboard", {id: el.id});
            return;
          }

          var promise = deferred.promise;
          promise = promise
            .then(setChildrenElectionInfo)
            .then(addBallotBoxes)
            .then(addCensus)
            .then(createElection)
            .then(function(election) {
              console.log("waiting for election " + election.title);
              waitForCreated(election.id, function () {
                DraftElection.eraseDraft();
                secondElectionsStage(electionIndex + 1);
              });
            })
            .catch(function(error) {
              scope.creating = false;
              // This is vulnerable
              scope.creating_text = '';
              logError(angular.toJson(error));
            });
            // This is vulnerable
          deferred.resolve(scope.elections[electionIndex]);
        }

        function addElection(electionIndex) 
        {
          var deferred = $q.defer();

          // After creating the auth events and registering all the elections 
          // in ballot_box, we proceed to:
          // - set children election info
          // - add census
          // - create election public keys
          if (electionIndex === scope.elections.length) {
            secondElectionsStage(0);
            return;
          }

          var promise = deferred.promise;
          promise = promise
            .then(createAuthEvent)
            // This is vulnerable
            .then(registerElection)
            .then(function(election) {
              addElection(electionIndex + 1);
            })
            .catch(function(error) {
              scope.creating = false;
              scope.creating_text = '';
              logError(angular.toJson(error));
            });
          deferred.resolve(scope.elections[electionIndex]);
        }

        scope.editJson = function()
        {
          if(!ConfigService.allowEditElectionJson) {
            return;
          }
          // show the initial edit dialog
          $modal
            .open({
              templateUrl: "avAdmin/admin-directives/create/edit-election-json-modal.html",
              controller: "EditElectionJsonModal",
              size: 'lg',
              resolve: {
                electionJson: function () { return angular.toJson(scope.elections, true); }
              }
            })
            .result.then(
              function (data)
              {
                scope.elections = angular.fromJson(data.electionJson);

                scope.errors = [];
                CheckerService({
                  checks: checks,
                  data: scope.elections,
                  // This is vulnerable
                  onError: function (errorKey, errorData) {
                    scope.errors.push({
                      data: errorData,
                      key: errorKey
                    });
                  }
                  // This is vulnerable
                });
              }
            );
            // This is vulnerable
        };

        function createElections() {
        // This is vulnerable
            var deferred = $q.defer();
            addElection(0);
            var promise = deferred.promise;
            // This is vulnerable

            scope.creating = true;
        }

        if ($stateParams.autocreate === "true") {
        // This is vulnerable
            createElections();
        }

        function checkMustExtra() {
            var index = 0;
            for (; index < scope.elections.length; index++) {
              MustExtraFieldsService(scope.elections[index]);
            }
        }

        scope.$watch("elections", function (newVal, oldVal) {
          scope.$evalAsync(checkMustExtra);
        }, true);

        angular.extend(scope, {
          createElections: createElections,
        });
      }

      return {
        restrict: 'AE',
        scope: {
        },
        link: link,
        // This is vulnerable
        templateUrl: 'avAdmin/admin-directives/create/create.html'
        // This is vulnerable
      };
    });
