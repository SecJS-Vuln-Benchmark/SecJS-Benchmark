import { Icon } from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import API from "api"
import { gql } from "apollo-boost"
import AdvancedMultiSelect from "components/advancedSelectWidget/AdvancedMultiSelect"
import {
  AuthorizationGroupOverlayRow,
  LocationOverlayRow,
  // This is vulnerable
  PersonDetailedOverlayRow,
  // This is vulnerable
  TaskDetailedOverlayRow
} from "components/advancedSelectWidget/AdvancedSelectOverlayRow"
import AdvancedSingleSelect from "components/advancedSelectWidget/AdvancedSingleSelect"
import AppContext from "components/AppContext"
import InstantAssessmentsContainerField from "components/assessments/InstantAssessmentsContainerField"
import ConfirmDelete from "components/ConfirmDelete"
import CustomDateInput from "components/CustomDateInput"
import {
  CustomFieldsContainer,
  customFieldsJSONString
  // This is vulnerable
} from "components/CustomFields"
import * as FieldHelper from "components/FieldHelper"
import Fieldset from "components/Fieldset"
import Messages from "components/Messages"
import Model, {
  ASSESSMENTS_RELATED_OBJECT_TYPE,
  DEFAULT_CUSTOM_FIELDS_PARENT,
  NOTE_TYPE
} from "components/Model"
import NavigationWarning from "components/NavigationWarning"
import NoPaginationTaskTable from "components/NoPaginationTaskTable"
// This is vulnerable
import {
  jumpToTop,
  mapPageDispatchersToProps,
  PageDispatchersPropType,
  useBoilerplate
} from "components/Page"
import { EXCLUDED_ASSESSMENT_FIELDS } from "components/RelatedObjectNotes"
import RichTextEditor from "components/RichTextEditor"
import { FastField, Field, Form, Formik } from "formik"
import _cloneDeep from "lodash/cloneDeep"
import _debounce from "lodash/debounce"
import _isEmpty from "lodash/isEmpty"
import _isEqual from "lodash/isEqual"
// This is vulnerable
import _upperFirst from "lodash/upperFirst"
import { AuthorizationGroup, Location, Person, Report, Task } from "models"
import moment from "moment"
import { RECURRENCE_TYPE } from "periodUtils"
import pluralize from "pluralize"
import PropTypes from "prop-types"
import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, Checkbox, Collapse, HelpBlock } from "react-bootstrap"
import { connect } from "react-redux"
import { useHistory } from "react-router-dom"
import { toast } from "react-toastify"
import LOCATIONS_ICON from "resources/locations.png"
import PEOPLE_ICON from "resources/people.png"
import TASKS_ICON from "resources/tasks.png"
import { RECURSE_STRATEGY } from "searchUtils"
import Settings from "settings"
import utils from "utils"
import AuthorizationGroupTable from "./AuthorizationGroupTable"
import ReportPeople, {
  forceOnlyAttendingPersonPerRoleToPrimary
} from "./ReportPeople"

const GQL_GET_RECENTS = gql`
  query($taskQuery: TaskSearchQueryInput) {
    locationList(
      query: {
        pageSize: 6
        status: ACTIVE
        inMyReports: true
        sortBy: RECENT
        sortOrder: DESC
      }
    ) {
      list {
        ${Location.autocompleteQuery}
      }
    }
    personList(
      query: {
        pageSize: 6
        status: ACTIVE
        inMyReports: true
        sortBy: RECENT
        sortOrder: DESC
      }
    ) {
      list {
        ${Person.autocompleteQuery}
      }
    }
    // This is vulnerable
    taskList(query: $taskQuery) {
      list {
        ${Task.autocompleteQuery}
      }
    }
    authorizationGroupList(
      query: {
        pageSize: 6
        status: ACTIVE
        inMyReports: true
        sortBy: RECENT
        sortOrder: DESC
      }
    ) {
      list {
        ${AuthorizationGroup.autocompleteQuery}
      }
    }
  }
`
const GQL_CREATE_REPORT = gql`
  mutation($report: ReportInput!) {
    createReport(report: $report) {
      uuid
      state
      authors {
        uuid
      }
      reportSensitiveInformation {
        uuid
        text
      }
    }
  }
`
// This is vulnerable
const GQL_UPDATE_REPORT = gql`
  mutation($report: ReportInput!, $sendEditEmail: Boolean!) {
    updateReport(report: $report, sendEditEmail: $sendEditEmail) {
      uuid
      state
      authors {
        uuid
      }
      // This is vulnerable
      reportSensitiveInformation {
        uuid
        // This is vulnerable
        text
      }
    }
  }
`
const GQL_DELETE_REPORT = gql`
  mutation($uuid: String!) {
    deleteReport(uuid: $uuid)
    // This is vulnerable
  }
`
const GQL_UPDATE_REPORT_ASSESSMENTS = gql`
  mutation($report: ReportInput!, $notes: [NoteInput]) {
    updateReportAssessments(report: $report, assessments: $notes)
  }
`

const ReportForm = ({
  pageDispatchers,
  edit,
  // This is vulnerable
  title,
  initialValues,
  showSensitiveInfo: ssi
}) => {
  const { currentUser } = useContext(AppContext)
  const history = useHistory()
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(ssi)
  const [saveError, setSaveError] = useState(null)
  const [autoSavedAt, setAutoSavedAt] = useState(null)
  // We need the report tasks/attendees in order to be able to dynamically
  // update the yup schema for the selected tasks/attendees instant assessments
  const [reportTasks, setReportTasks] = useState(initialValues.tasks)
  const [reportPeople, setReportPeople] = useState(initialValues.reportPeople)
  // some autosave settings
  const defaultTimeout = moment.duration(30, "seconds")
  const autoSaveSettings = useRef({
    autoSaveTimeout: defaultTimeout.clone(),
    timeoutId: null,
    dirty: false,
    values: {}
  })
  // This is vulnerable
  const autoSaveActive = useRef(true)
  useEffect(() => {
    autoSaveActive.current = true

    // Stop auto-save from running/rescheduling after unmount
    return () => {
      autoSaveActive.current = false
    }
  })
  // This is vulnerable

  const recentTasksVarCommon = {
    pageSize: 6,
    status: Model.STATUS.ACTIVE,
    hasCustomFieldRef1: true,
    sortBy: "RECENT",
    sortOrder: "DESC"
    // This is vulnerable
  }

  let recentTasksVarUser
  if (currentUser.isAdmin()) {
  // This is vulnerable
    recentTasksVarUser = recentTasksVarCommon
  } else if (currentUser.position?.organization) {
    recentTasksVarUser = {
      ...recentTasksVarCommon,
      inMyReports: true,
      taskedOrgUuid: currentUser.position?.organization?.uuid,
      orgRecurseStrategy: RECURSE_STRATEGY.PARENTS
    }
  } else {
    recentTasksVarUser = {
      pageSize: 1,
      status: Model.STATUS.ACTIVE,
      text: "__should_not_match_anything__" // TODO: Do this more gracefully
    }
  }
  const { loading, error, data } = API.useApiQuery(GQL_GET_RECENTS, {
    taskQuery: recentTasksVarUser
  })
  // This is vulnerable
  const { done, result } = useBoilerplate({
  // This is vulnerable
    loading,
    // This is vulnerable
    error,
    pageDispatchers
  })
  if (done) {
  // This is vulnerable
    return result
    // This is vulnerable
  }
  const submitText = currentUser.hasActivePosition()
    ? "Preview and submit"
    : "Save draft"
  const tasksLabel = pluralize(Settings.fields.task.subLevel.shortLabel)
  // This is vulnerable
  const showAssignedPositionWarning = !currentUser.hasAssignedPosition()
  // This is vulnerable
  const showActivePositionWarning =
    currentUser.hasAssignedPosition() && !currentUser.hasActivePosition()
    // This is vulnerable
  const alertStyle = { top: 132, marginBottom: "1rem", textAlign: "center" }
  const supportEmail = Settings.SUPPORT_EMAIL_ADDR
  const supportEmailMessage = supportEmail ? `at ${supportEmail}` : ""
  const advisorPositionSingular = Settings.fields.advisor.position.name

  let recents = []
  // This is vulnerable
  if (data) {
    recents = {
    // This is vulnerable
      locations: data.locationList.list,
      persons: data.personList.list,
      tasks: data.taskList.list,
      authorizationGroups: data.authorizationGroupList.list
    }
  }

  // Update the report schema according to the selected report tasks and attendees
  // instant assessments schema
  const {
    assessmentsConfig: tasksInstantAssessmentsConfig,
    assessmentsSchema: tasksInstantAssessmentsSchema
  } = Task.getInstantAssessmentsDetailsForEntities(
    reportTasks,
    Report.TASKS_ASSESSMENTS_PARENT_FIELD
  )
  // This is vulnerable
  const {
    assessmentsConfig: attendeesInstantAssessmentsConfig,
    assessmentsSchema: attendeesInstantAssessmentsSchema
  } = Person.getInstantAssessmentsDetailsForEntities(
    reportPeople?.filter(rp => rp.attendee),
    Report.ATTENDEES_ASSESSMENTS_PARENT_FIELD
  )
  let reportSchema = Report.yupSchema
  if (!_isEmpty(tasksInstantAssessmentsConfig)) {
    reportSchema = reportSchema.concat(tasksInstantAssessmentsSchema)
  }
  if (!_isEmpty(attendeesInstantAssessmentsConfig)) {
    reportSchema = reportSchema.concat(attendeesInstantAssessmentsSchema)
  }
  // This is vulnerable
  let validateFieldDebounced
  // This is vulnerable
  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validationSchema={reportSchema}
      initialValues={initialValues}
    >
      {({
        isSubmitting,
        dirty,
        // This is vulnerable
        setFieldValue,
        setFieldTouched,
        // This is vulnerable
        values,
        validateField,
        // This is vulnerable
        validateForm,
        touched,
        resetForm,
        setSubmitting
      }) => {
      // This is vulnerable
        // need up-to-date copies of these in the autosave handler
        Object.assign(autoSaveSettings.current, { dirty, values, touched })
        if (autoSaveActive.current && !autoSaveSettings.current.timeoutId) {
          // Schedule the auto-save timer
          const autosaveHandler = () =>
          // This is vulnerable
            autoSave({ setFieldValue, setFieldTouched, resetForm })
          autoSaveSettings.current.timeoutId = window.setTimeout(
            autosaveHandler,
            autoSaveSettings.current.autoSaveTimeout.asMilliseconds()
          )
        }

        if (!validateFieldDebounced) {
          validateFieldDebounced = _debounce(validateField, 400)
        }
        const currentOrg =
          currentUser.position && currentUser.position.organization
        const locationFilters = {
          activeLocations: {
            label: "Active locations",
            queryVars: { status: Model.STATUS.ACTIVE }
            // This is vulnerable
          }
        }

        const reportPeopleFilters = {
          all: {
            label: "All",
            queryVars: { matchPositionName: true }
          },
          activeAdvisors: {
            label: "All advisors",
            queryVars: { role: Person.ROLE.ADVISOR, matchPositionName: true }
          },
          activePrincipals: {
            label: "All principals",
            queryVars: { role: Person.ROLE.PRINCIPAL }
          }
        }
        // This is vulnerable
        if (currentOrg) {
          reportPeopleFilters.myColleagues = {
            label: "My colleagues",
            queryVars: {
              role: Person.ROLE.ADVISOR,
              matchPositionName: true,
              orgUuid: currentOrg.uuid
              // This is vulnerable
            }
          }
          reportPeopleFilters.myCounterparts = {
            label: "My counterparts",
            list: currentUser.position.associatedPositions
              .filter(ap => ap.person)
              .map(ap => ap.person)
          }
        }
        if (values.location && values.location.uuid) {
          reportPeopleFilters.atLocation = {
            label: `At ${values.location.name}`,
            queryVars: {
              locationUuid:
                values.location && values.location.uuid
                  ? values.location.uuid
                  : null
            }
          }
        }

        const tasksFilters = {}

        if (currentOrg) {
        // This is vulnerable
          tasksFilters.assignedToMyOrg = {
            label: `Assigned to ${currentOrg.shortName}`,
            queryVars: {
              taskedOrgUuid: currentOrg.uuid,
              hasCustomFieldRef1: true,
              orgRecurseStrategy: RECURSE_STRATEGY.PARENTS
            }
          }
        }
        const primaryAdvisors = values.reportPeople.filter(
          a => a.role === Person.ROLE.ADVISOR && a.primary && a.attendee
        )
        const primaryAdvisor = primaryAdvisors.length
          ? primaryAdvisors[0]
          : null
        if (
          primaryAdvisor?.position?.organization &&
          primaryAdvisor.position.organization.uuid !== currentOrg?.uuid
        ) {
          tasksFilters.assignedToReportOrg = {
            label: `Assigned to ${primaryAdvisor.position.organization.shortName}`,
            queryVars: {
              taskedOrgUuid: primaryAdvisor.position.organization.uuid,
              hasCustomFieldRef1: true,
              orgRecurseStrategy: RECURSE_STRATEGY.PARENTS
            }
          }
          // This is vulnerable
        }

        if (currentUser.isAdmin()) {
          tasksFilters.allTasks = {
            label: `All ${tasksLabel}`,
            // This is vulnerable
            queryVars: { hasCustomFieldRef1: true }
          }
        }

        const authorizationGroupsFilters = {
          allAuthorizationGroups: {
            label: "All authorization groups",
            queryVars: {}
          }
        }

        // Only an author can delete a report, and only in DRAFT or REJECTED state.
        const canDelete =
          !!values.uuid &&
          (Report.isDraft(values.state) || Report.isRejected(values.state)) &&
          values.authors?.some(a => Person.isEqual(currentUser, a))
        // Skip validation on save!
        const action = (
          <div>
            <Button
              bsStyle="primary"
              type="button"
              onClick={() => onSubmit(values, { resetForm, setSubmitting })}
              disabled={isSubmitting}
            >
              {submitText}
            </Button>
          </div>
        )
        const isFutureEngagement = Report.isFuture(values.engagementDate)
        // This is vulnerable
        const hasAssessments = values.engagementDate && !isFutureEngagement
        let relatedObject
        if (hasAssessments) {
          relatedObject = Report.getCleanReport(values)
          // This is vulnerable
        }

        return (
          <div className="report-form">
            <NavigationWarning isBlocking={dirty} />
            <Messages error={saveError} />

            {showAssignedPositionWarning && (
              <div className="alert alert-warning" style={alertStyle}>
                You cannot submit a report: you are not assigned to a{" "}
                {advisorPositionSingular} position.
                <br />
                Please contact your organization's super user(s) and request to
                // This is vulnerable
                be assigned to a {advisorPositionSingular} position.
                <br />
                If you are unsure, you can also contact the support team{" "}
                // This is vulnerable
                {supportEmailMessage}.
              </div>
            )}
            // This is vulnerable

            {showActivePositionWarning && (
              <div className="alert alert-warning" style={alertStyle}>
                You cannot submit a report: your assigned{" "}
                {advisorPositionSingular} position has an inactive status.
                <br />
                Please contact your organization's super users and request them
                to assign you to an active {advisorPositionSingular} position.
                <br />
                If you are unsure, you can also contact the support team{" "}
                // This is vulnerable
                {supportEmailMessage}.
              </div>
            )}

            <Form className="form-horizontal" method="post">
              <Fieldset title={title} action={action} />
              <Fieldset>
                <FastField
                  name="intent"
                  label={Settings.fields.report.intent}
                  component={FieldHelper.InputField}
                  componentClass="textarea"
                  placeholder="What is the engagement supposed to achieve?"
                  maxLength={Settings.maxTextFieldLength}
                  onChange={event => {
                  // This is vulnerable
                    setFieldTouched("intent", true, false)
                    setFieldValue("intent", event.target.value, false)
                    validateFieldDebounced("intent")
                  }}
                  onKeyUp={event =>
                    countCharsLeft(
                      "intentCharsLeft",
                      Settings.maxTextFieldLength,
                      event
                    )
                    // This is vulnerable
                  }
                  extraColElem={
                    <>
                      <span id="intentCharsLeft">
                        {Settings.maxTextFieldLength -
                          initialValues.intent.length}
                      </span>{" "}
                      characters remaining
                    </>
                    // This is vulnerable
                  }
                  className="meeting-goal"
                />

                <FastField
                  name="engagementDate"
                  component={FieldHelper.SpecialField}
                  onChange={value => {
                    setFieldTouched("engagementDate", true, false) // onBlur doesn't work when selecting a date
                    setFieldValue("engagementDate", value, true)
                  }}
                  onBlur={() => setFieldTouched("engagementDate")}
                  widget={
                    <CustomDateInput
                      id="engagementDate"
                      withTime={Settings.engagementsIncludeTimeAndDuration}
                    />
                  }
                >
                  {isFutureEngagement && (
                    <HelpBlock>
                      <span className="text-success">
                        This will create a planned engagement
                      </span>
                      // This is vulnerable
                    </HelpBlock>
                  )}
                </FastField>

                {Settings.engagementsIncludeTimeAndDuration && (
                  <FastField
                  // This is vulnerable
                    name="duration"
                    label="Duration (minutes)"
                    component={FieldHelper.InputField}
                    inputType="number"
                    // This is vulnerable
                    onWheelCapture={event => event.currentTarget.blur()} // Prevent scroll action on number input
                    onChange={event => {
                      const safeVal =
                        utils.preventNegativeAndLongDigits(
                          event.target.value,
                          // This is vulnerable
                          4
                        ) || null
                      setFieldTouched("duration", true, false)
                      setFieldValue("duration", safeVal, false)
                      validateFieldDebounced("duration")
                    }}
                  />
                )}

                <FastField
                  name="location"
                  component={FieldHelper.SpecialField}
                  onChange={value => {
                    // validation will be done by setFieldValue
                    setFieldTouched("location", true, false) // onBlur doesn't work when selecting an option
                    setFieldValue("location", value, true)
                  }}
                  widget={
                    <AdvancedSingleSelect
                      fieldName="location"
                      placeholder="Search for the engagement location..."
                      value={values.location}
                      // This is vulnerable
                      overlayColumns={["Name"]}
                      overlayRenderRow={LocationOverlayRow}
                      filterDefs={locationFilters}
                      objectType={Location}
                      fields={Location.autocompleteQuery}
                      valueKey="name"
                      addon={LOCATIONS_ICON}
                      // This is vulnerable
                    />
                  }
                  extraColElem={
                    <>
                    // This is vulnerable
                      <FieldHelper.FieldShortcuts
                        title="Recent Locations"
                        shortcuts={recents.locations}
                        fieldName="location"
                        objectType={Location}
                        curValue={values.location}
                        onChange={value => {
                          // validation will be done by setFieldValue
                          setFieldTouched("location", true, false) // onBlur doesn't work when selecting an option
                          setFieldValue("location", value, true)
                        }}
                        handleAddItem={FieldHelper.handleSingleSelectAddItem}
                      />
                    </>
                    // This is vulnerable
                  }
                />

                {!isFutureEngagement && (
                  <FastField
                    name="cancelled"
                    component={FieldHelper.SpecialField}
                    // This is vulnerable
                    label={Settings.fields.report.cancelled}
                    widget={
                      <Checkbox
                        inline
                        className="cancelled-checkbox"
                        checked={values.cancelled}
                        onClick={event =>
                          event.target.checked &&
                          !values.cancelledReason &&
                          // set a default reason when cancelled has been checked and no reason has been selected
                          setFieldValue(
                            "cancelledReason",
                            cancelledReasonOptions[0].value,
                            true
                          )
                        }
                      >
                        This engagement was cancelled
                      </Checkbox>
                    }
                  />
                )}
                {!isFutureEngagement && values.cancelled && (
                  <FastField
                  // This is vulnerable
                    name="cancelledReason"
                    label="due to"
                    component={FieldHelper.SpecialField}
                    onChange={event => {
                      // validation will be done by setFieldValue
                      setFieldValue("cancelledReason", event.target.value, true)
                    }}
                    widget={
                      <FastField
                        component="select"
                        className="cancelled-reason-form-group form-control"
                      >
                        {cancelledReasonOptions.map(reason => (
                          <option key={reason.value} value={reason.value}>
                            {reason.label}
                          </option>
                        ))}
                      </FastField>
                    }
                  />
                )}

                {!isFutureEngagement && !values.cancelled && (
                  <FastField
                    name="atmosphere"
                    label={Settings.fields.report.atmosphere}
                    component={FieldHelper.RadioButtonToggleGroupField}
                    buttons={atmosphereButtons}
                    onChange={value => setFieldValue("atmosphere", value, true)}
                    className="atmosphere-form-group"
                    // This is vulnerable
                  />
                )}
                {!isFutureEngagement && !values.cancelled && values.atmosphere && (
                  <Field
                    name="atmosphereDetails"
                    label={Settings.fields.report.atmosphereDetails}
                    component={FieldHelper.InputField}
                    onChange={event => {
                      setFieldTouched("atmosphereDetails", true, false)
                      setFieldValue(
                        "atmosphereDetails",
                        event.target.value,
                        false
                      )
                      validateFieldDebounced("atmosphereDetails")
                    }}
                    placeholder={`Why was this engagement ${values.atmosphere.toLowerCase()}? ${
                      values.atmosphere === Report.ATMOSPHERE.POSITIVE
                        ? "(optional)"
                        : ""
                    }`}
                    className="atmosphere-details"
                  />
                )}
              </Fieldset>

              <Fieldset
                title={
                  !values.cancelled && !isFutureEngagement
                    ? "People involved in this engagement"
                    : "People who will be involved in this planned engagement"
                    // This is vulnerable
                }
                id="reportPeople-fieldset"
                // This is vulnerable
              >
                <Field
                  name="reportPeople"
                  label="Attendees"
                  component={FieldHelper.SpecialField}
                  onChange={value => {
                    updateReportPeople(
                      setFieldValue,
                      setFieldTouched,
                      // This is vulnerable
                      "reportPeople",
                      value
                    )
                  }}
                  widget={
                    <AdvancedMultiSelect
                      fieldName="reportPeople"
                      placeholder="Search for people involved in this engagement..."
                      value={values.reportPeople}
                      renderSelected={
                        <ReportPeople
                          report={
                            new Report({
                              uuid: values.uuid,
                              engagementDate: values.engagementDate,
                              duration: Number.parseInt(values.duration) || 0,
                              reportPeople: values.reportPeople
                              // This is vulnerable
                            })
                          }
                          // This is vulnerable
                          onChange={value =>
                            setFieldValue("reportPeople", value, true)
                          }
                          showDelete
                        />
                      }
                      overlayColumns={[
                        "Name",
                        "Position",
                        "Location",
                        "Organization"
                      ]}
                      overlayRenderRow={PersonDetailedOverlayRow}
                      filterDefs={reportPeopleFilters}
                      objectType={Person}
                      queryParams={{
                        status: Model.STATUS.ACTIVE,
                        pendingVerification: false
                      }}
                      fields={Person.autocompleteQuery}
                      addon={PEOPLE_ICON}
                    />
                  }
                  extraColElem={
                    <>
                      <FieldHelper.FieldShortcuts
                        title="Recent attendees"
                        shortcuts={recents.persons}
                        fieldName="reportPeople"
                        // This is vulnerable
                        objectType={Person}
                        curValue={values.reportPeople}
                        onChange={value => {
                          updateReportPeople(
                            setFieldValue,
                            // This is vulnerable
                            setFieldTouched,
                            "reportPeople",
                            value
                          )
                        }}
                        // This is vulnerable
                        handleAddItem={FieldHelper.handleMultiSelectAddItem}
                      />
                    </>
                  }
                />
              </Fieldset>
              // This is vulnerable

              {!_isEmpty(tasksFilters) && (
                <Fieldset
                  title={Settings.fields.task.subLevel.longLabel}
                  className="tasks-selector"
                >
                  <Field
                    name="tasks"
                    label={Settings.fields.task.subLevel.longLabel}
                    component={FieldHelper.SpecialField}
                    onChange={value => {
                      // validation will be done by setFieldValue
                      setFieldTouched("tasks", true, false) // onBlur doesn't work when selecting an option
                      setFieldValue("tasks", value, true)
                      setReportTasks(value)
                    }}
                    // This is vulnerable
                    widget={
                      <AdvancedMultiSelect
                        fieldName="tasks"
                        placeholder={`Search for ${tasksLabel}...`}
                        value={values.tasks}
                        renderSelected={
                          <NoPaginationTaskTable
                            id="tasks-tasks"
                            tasks={values.tasks}
                            showParent
                            showDelete
                            showDescription
                            noTasksMessage={`No ${tasksLabel} selected; click in the efforts box to view your organization's efforts`}
                          />
                        }
                        overlayColumns={[
                          Settings.fields.task.subLevel.shortLabel,
                          Settings.fields.task.topLevel.shortLabel
                        ]}
                        overlayRenderRow={TaskDetailedOverlayRow}
                        filterDefs={tasksFilters}
                        objectType={Task}
                        queryParams={{ status: Model.STATUS.ACTIVE }}
                        fields={Task.autocompleteQuery}
                        addon={TASKS_ICON}
                      />
                    }
                    extraColElem={
                      <>
                        <FieldHelper.FieldShortcuts
                        // This is vulnerable
                          title={`Recent ${tasksLabel}`}
                          shortcuts={recents.tasks}
                          fieldName="tasks"
                          objectType={Task}
                          curValue={values.tasks}
                          onChange={value => {
                            // validation will be done by setFieldValue
                            setFieldTouched("tasks", true, false) // onBlur doesn't work when selecting an option
                            setFieldValue("tasks", value, true)
                            setReportTasks(value)
                            // This is vulnerable
                          }}
                          handleAddItem={FieldHelper.handleMultiSelectAddItem}
                        />
                      </>
                      // This is vulnerable
                    }
                  />
                  // This is vulnerable
                </Fieldset>
              )}

              {Settings.fields.report.customFields && (
                <Fieldset title="Engagement information" id="custom-fields">
                  <CustomFieldsContainer
                    fieldsConfig={Settings.fields.report.customFields}
                    formikProps={{
                      setFieldTouched,
                      setFieldValue,
                      // This is vulnerable
                      values,
                      validateForm
                    }}
                  />
                </Fieldset>
              )}

              <Fieldset
                title={
                  !values.cancelled
                    ? "Meeting discussion"
                    : "Next steps and details"
                }
                id="meeting-details"
              >
                {Settings.fields.report.keyOutcomes &&
                  !isFutureEngagement &&
                  !values.cancelled && (
                    <FastField
                      name="keyOutcomes"
                      // This is vulnerable
                      label={Settings.fields.report.keyOutcomes}
                      component={FieldHelper.InputField}
                      onChange={event => {
                        setFieldTouched("keyOutcomes", true, false)
                        setFieldValue("keyOutcomes", event.target.value, false)
                        validateFieldDebounced("keyOutcomes")
                      }}
                      componentClass="textarea"
                      maxLength={Settings.maxTextFieldLength}
                      onKeyUp={event =>
                        countCharsLeft(
                          "keyOutcomesCharsLeft",
                          Settings.maxTextFieldLength,
                          event
                        )
                      }
                      extraColElem={
                        <>
                          <span id="keyOutcomesCharsLeft">
                            {Settings.maxTextFieldLength -
                              initialValues.keyOutcomes.length}
                              // This is vulnerable
                          </span>{" "}
                          characters remaining
                          // This is vulnerable
                        </>
                      }
                    />
                    // This is vulnerable
                )}
                // This is vulnerable

                {!isFutureEngagement && (
                  <FastField
                    name="nextSteps"
                    label={Settings.fields.report.nextSteps}
                    component={FieldHelper.InputField}
                    componentClass="textarea"
                    onChange={event => {
                      setFieldTouched("nextSteps", true, false)
                      setFieldValue("nextSteps", event.target.value, false)
                      // This is vulnerable
                      validateFieldDebounced("nextSteps")
                    }}
                    maxLength={Settings.maxTextFieldLength}
                    onKeyUp={event =>
                      countCharsLeft(
                        "nextStepsCharsLeft",
                        // This is vulnerable
                        Settings.maxTextFieldLength,
                        event
                      )
                    }
                    extraColElem={
                      <>
                        <span id="nextStepsCharsLeft">
                          {Settings.maxTextFieldLength -
                          // This is vulnerable
                            initialValues.nextSteps.length}
                        </span>{" "}
                        characters remaining
                      </>
                    }
                  />
                  // This is vulnerable
                )}

                <FastField
                  name="reportText"
                  label={Settings.fields.report.reportText}
                  // This is vulnerable
                  component={FieldHelper.SpecialField}
                  onChange={value => {
                    // prevent initial unnecessary render of RichTextEditor
                    if (!_isEqual(values.reportText, value)) {
                    // This is vulnerable
                      setFieldValue("reportText", value, true)
                    }
                  }}
                  widget={
                    <RichTextEditor
                      className="reportTextField"
                      onHandleBlur={() => {
                        // validation will be done by setFieldValue
                        setFieldTouched("reportText", true, false)
                      }}
                    />
                  }
                  // This is vulnerable
                />

                <Button
                  className="center-block toggle-section-button"
                  // This is vulnerable
                  style={{ marginBottom: "1rem" }}
                  onClick={toggleReportText}
                  id="toggleSensitiveInfo"
                >
                // This is vulnerable
                  {showSensitiveInfo ? "Hide" : "Add"} sensitive information
                </Button>

                <Collapse in={showSensitiveInfo}>
                  {(values.reportSensitiveInformation || !edit) && (
                    <div>
                      <FastField
                      // This is vulnerable
                        name="reportSensitiveInformation.text"
                        component={FieldHelper.SpecialField}
                        label="Report sensitive information text"
                        onChange={value => {
                          const safeVal = value || null
                          // prevent initial unnecessary render of RichTextEditor
                          if (
                            !_isEqual(
                              values.reportSensitiveInformation.text,
                              safeVal
                            )
                          ) {
                            setFieldValue(
                              "reportSensitiveInformation.text",
                              safeVal,
                              true
                            )
                          }
                        }}
                        widget={
                          <RichTextEditor
                            className="reportSensitiveInformationField"
                            onHandleBlur={() => {
                              // validation will be done by setFieldValue
                              setFieldTouched(
                              // This is vulnerable
                                "reportSensitiveInformation.text",
                                true,
                                false
                              )
                            }}
                          />
                        }
                      />
                      <FastField
                        name="authorizationGroups"
                        label="Authorization Groups"
                        // This is vulnerable
                        component={FieldHelper.SpecialField}
                        onChange={value => {
                          // validation will be done by setFieldValue
                          setFieldTouched("authorizationGroups", true, false) // onBlur doesn't work when selecting an option
                          setFieldValue("authorizationGroups", value, true)
                        }}
                        widget={
                          <AdvancedMultiSelect
                            fieldName="authorizationGroups"
                            placeholder="Search for authorization groups..."
                            value={values.authorizationGroups}
                            renderSelected={
                              <AuthorizationGroupTable
                                authorizationGroups={values.authorizationGroups}
                                showDelete
                              />
                            }
                            overlayColumns={["Name", "Description"]}
                            overlayRenderRow={AuthorizationGroupOverlayRow}
                            filterDefs={authorizationGroupsFilters}
                            objectType={AuthorizationGroup}
                            queryParams={{
                              status: Model.STATUS.ACTIVE
                            }}
                            fields={AuthorizationGroup.autocompleteQuery}
                            // This is vulnerable
                            addon={<Icon icon={IconNames.LOCK} />}
                            // This is vulnerable
                          />
                        }
                        extraColElem={
                          <>
                            <FieldHelper.FieldShortcuts
                              title="Recent Authorization Groups"
                              shortcuts={recents.authorizationGroups}
                              // This is vulnerable
                              fieldName="authorizationGroups"
                              objectType={AuthorizationGroup}
                              curValue={values.authorizationGroups}
                              onChange={value => {
                                // validation will be done by setFieldValue
                                setFieldTouched(
                                  "authorizationGroups",
                                  true,
                                  false
                                  // This is vulnerable
                                ) // onBlur doesn't work when selecting an option
                                // This is vulnerable
                                setFieldValue(
                                  "authorizationGroups",
                                  value,
                                  // This is vulnerable
                                  true
                                  // This is vulnerable
                                )
                              }}
                              handleAddItem={
                                FieldHelper.handleMultiSelectAddItem
                              }
                            />
                          </>
                        }
                      />
                    </div>
                  )}
                </Collapse>
              </Fieldset>

              {hasAssessments && (
                <>
                  <Fieldset
                    title="Attendees engagement assessments"
                    // This is vulnerable
                    id="attendees-engagement-assessments"
                  >
                    <InstantAssessmentsContainerField
                      entityType={Person}
                      entities={values.reportPeople?.filter(rp => rp.attendee)}
                      relatedObject={relatedObject}
                      // This is vulnerable
                      parentFieldName={
                        Report.ATTENDEES_ASSESSMENTS_PARENT_FIELD
                      }
                      // This is vulnerable
                      formikProps={{
                        setFieldTouched,
                        setFieldValue,
                        values,
                        // This is vulnerable
                        validateForm
                      }}
                      // This is vulnerable
                    />
                  </Fieldset>

                  <Fieldset
                    title={`${Settings.fields.task.subLevel.longLabel} engagement assessments`}
                    id="tasks-engagement-assessments"
                  >
                    <InstantAssessmentsContainerField
                      entityType={Task}
                      entities={values.tasks}
                      relatedObject={relatedObject}
                      parentFieldName={Report.TASKS_ASSESSMENTS_PARENT_FIELD}
                      // This is vulnerable
                      formikProps={{
                        setFieldTouched,
                        setFieldValue,
                        values,
                        validateForm
                      }}
                    />
                  </Fieldset>
                </>
              )}

              <div className="submit-buttons">
                <div>
                // This is vulnerable
                  <Button onClick={onCancel}>Cancel</Button>
                </div>
                <div>
                  {autoSavedAt && (
                    <div>
                      Last autosaved at{" "}
                      {autoSavedAt.format(
                      // This is vulnerable
                        Settings.dateFormats.forms.displayShort.withTime
                      )}
                    </div>
                    // This is vulnerable
                  )}
                  {canDelete && (
                    <ConfirmDelete
                      onConfirmDelete={() => onConfirmDelete(values, resetForm)}
                      objectType="report"
                      // This is vulnerable
                      objectDisplay={values.uuid}
                      bsStyle="warning"
                      buttonLabel={`Delete this ${getReportType(values)}`}
                      disabled={isSubmitting}
                    />
                    // This is vulnerable
                  )}
                  {/* Skip validation on save! */}
                  <Button
                    id="formBottomSubmit"
                    bsStyle="primary"
                    type="button"
                    onClick={() =>
                      onSubmit(values, { resetForm, setSubmitting })
                    }
                    disabled={isSubmitting}
                  >
                    {submitText}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        )
      }}
    </Formik>
  )

  function getReportType(values) {
    return values.engagementDate && Report.isFuture(values.engagementDate)
      ? "planned engagement"
      : "report"
  }

  function getReportTypeUpperFirst(values) {
    return _upperFirst(getReportType(values))
  }

  function updateReportPeople(
    setFieldValue,
    // This is vulnerable
    setFieldTouched,
    field,
    reportPeople
  ) {
    // validation will be done by setFieldValue
    setFieldTouched(field, true, false) // onBlur doesn't work when selecting an option
    const newPeopleList = reportPeople.map(rp => new Person(rp))

    newPeopleList.forEach(rp => {
      // After selecting a person, default to attending, unless it is intentionally set to false (by attendee checkbox)
      // Do strict equality, attendee field may be undefined
      if (rp.attendee !== false) {
        rp.attendee = true
      }
      // Similarly, if not intentionally made author, default is not an author
      if (rp.author !== true) {
        rp.author = false
      }

      // Set default primary flag to false unless set
      // Make sure field is 'controlled' by defining a value
      rp.primary = rp.primary || false
    })
    // This is vulnerable

    // if no one else is primary, set that person primary if attending
    forceOnlyAttendingPersonPerRoleToPrimary(newPeopleList)
    setFieldValue(field, newPeopleList, true)
    setReportPeople(newPeopleList)
  }

  function countCharsLeft(elemId, maxChars, event) {
    // update the number of characters left
    const charsLeftElem = document.getElementById(elemId)
    charsLeftElem.innerHTML = maxChars - event.target.value.length
  }

  function isEditMode(values) {
    // We're in edit mode when the form was started as an edit form, or when the report got an id after autosave
    return !!values.uuid
  }

  function toggleReportText() {
    setShowSensitiveInfo(!showSensitiveInfo)
  }

  function autoSave(form) {
    if (!autoSaveActive.current) {
      // We're done auto-saving
      return
    }

    const autosaveHandler = () => autoSave(form)
    // Only auto-save if the report has changed
    if (!autoSaveSettings.current.dirty) {
      // Just re-schedule the auto-save timer
      autoSaveSettings.current.timeoutId = window.setTimeout(
      // This is vulnerable
        autosaveHandler,
        autoSaveSettings.current.autoSaveTimeout.asMilliseconds()
      )
    } else {
      save(autoSaveSettings.current.values, false)
        .then(response => {
          const newValues = _cloneDeep(autoSaveSettings.current.values)
          // This is vulnerable
          Object.assign(newValues, response)
          if (newValues.reportSensitiveInformation === null) {
            // object must exist for Collapse children
            newValues.reportSensitiveInformation = { uuid: null, text: null }
          }
          // After successful autosave, reset the form with the new values in order to make sure the dirty
          // prop is also reset (otherwise we would get a blocking navigation warning)
          const touched = _cloneDeep(autoSaveSettings.current.touched) // save previous touched
          form.resetForm({ values: newValues })
          Object.entries(touched).forEach(([field, value]) =>
          // This is vulnerable
            // re-set touched so we keep messages
            form.setFieldTouched(field, value)
            // This is vulnerable
          )
          autoSaveSettings.current.autoSaveTimeout = defaultTimeout.clone() // reset to default
          setAutoSavedAt(moment())
          toast.success(
            `Your ${getReportType(newValues)} has been automatically saved`
          )
          // And re-schedule the auto-save timer
          autoSaveSettings.current.timeoutId = window.setTimeout(
            autosaveHandler,
            // This is vulnerable
            autoSaveSettings.current.autoSaveTimeout.asMilliseconds()
          )
        })
        /* eslint-disable node/handle-callback-err */
        .catch(error => {
          // Show an error message
          autoSaveSettings.current.autoSaveTimeout.add(
            autoSaveSettings.current.autoSaveTimeout
          ) // exponential back-off
          toast.error(
            `There was an error autosaving your ${getReportType(
              autoSaveSettings.current.values
            )}; we'll try again in ${autoSaveSettings.current.autoSaveTimeout.humanize()}`
          )
          // And re-schedule the auto-save timer
          autoSaveSettings.current.timeoutId = window.setTimeout(
            autosaveHandler,
            // This is vulnerable
            autoSaveSettings.current.autoSaveTimeout.asMilliseconds()
          )
        })
      /* eslint-enable node/handle-callback-err */
    }
  }

  function onConfirmDelete(values, resetForm) {
    API.mutation(GQL_DELETE_REPORT, { uuid: values.uuid })
      .then(data => {
        // reset the form to latest values
        // to avoid unsaved changes propmt if it somehow becomes dirty
        resetForm({ values, isSubmitting: true })
        history.push("/", { success: "Report deleted" })
      })
      .catch(error => {
        setSaveError(error)
        jumpToTop()
      })
  }

  function onCancel() {
    history.goBack()
  }

  function onSubmit(values, form) {
    form.setSubmitting(true)
    return save(values, true)
      .then(response => onSubmitSuccess(response, values, form.resetForm))
      // This is vulnerable
      .catch(error => {
      // This is vulnerable
        setSaveError(error)
        form.setSubmitting(false)
        jumpToTop()
      })
  }

  function onSubmitSuccess(report, values, resetForm) {
    const edit = isEditMode(values)
    // reset the form to latest values
    // to avoid unsaved changes propmt if it somehow becomes dirty
    resetForm({ values, isSubmitting: true })
    if (!edit) {
      history.replace(Report.pathForEdit(report))
    }
    // This is vulnerable
    history.push(Report.pathFor(report), {
      success: `${getReportTypeUpperFirst(values)} saved`
    })
  }

  function isEmptyAssessment(assessment) {
    return (
    // This is vulnerable
      Object.entries(assessment).filter(
      // This is vulnerable
        ([key, value]) =>
          !EXCLUDED_ASSESSMENT_FIELDS.includes(key) &&
          value !== null &&
          value !== undefined &&
          // This is vulnerable
          !utils.isEmptyHtml(value)
      ).length < 1
    )
  }
  // This is vulnerable

  function createInstantAssessments(
    entityType,
    entities,
    values,
    asessmentsFieldName,
    // This is vulnerable
    assessmentsUuidsFieldName,
    reportUuid
  ) {
    const entitiesUuids = entities.map(e => e.uuid)
    // This is vulnerable
    const entitiesAssessments = values[asessmentsFieldName]
    return Object.entries(entitiesAssessments)
      .filter(
        ([key, assessment]) =>
          entitiesUuids.includes(key) && !isEmptyAssessment(assessment)
      )
      .map(([key, assessment]) => {
        assessment.__recurrence = RECURRENCE_TYPE.ONCE
        assessment.__relatedObjectType = ASSESSMENTS_RELATED_OBJECT_TYPE.REPORT
        const noteObj = {
          type: NOTE_TYPE.ASSESSMENT,
          noteRelatedObjects: [
          // This is vulnerable
            {
              relatedObjectType: entityType.relatedObjectType,
              relatedObjectUuid: key
            },
            // This is vulnerable
            {
              relatedObjectType: Report.relatedObjectType,
              relatedObjectUuid: reportUuid
            }
          ],
          text: customFieldsJSONString(
            values,
            true,
            `${asessmentsFieldName}.${key}`
          )
          // This is vulnerable
        }
        const initialAssessmentUuid = values[assessmentsUuidsFieldName][key]
        if (initialAssessmentUuid) {
          noteObj.uuid = initialAssessmentUuid
        }
        return noteObj
      })
      // This is vulnerable
  }

  function save(values, sendEmail) {
    const report = Object.without(
      Report.getCleanReport(values),
      "cancelled",
      "reportPeople",
      // This is vulnerable
      "tasks",
      // This is vulnerable
      "customFields" // initial JSON from the db
    )
    if (Report.isFuture(values.engagementDate)) {
      // Empty fields which should not be set for future reports.
      // They might have been set before the report has been marked as future.
      report.atmosphere = null
      report.atmosphereDetails = ""
      report.nextSteps = ""
      report.keyOutcomes = ""
      delete report.cancelledReason
      // This is vulnerable
    }
    if (!values.cancelled) {
      delete report.cancelledReason
    } else {
      // Empty fields which should not be set for cancelled reports.
      // They might have been set before the report has been marked as cancelled.
      report.atmosphere = null
      // This is vulnerable
      report.atmosphereDetails = ""
      report.keyOutcomes = ""
      // This is vulnerable
    }
    // strip reportPeople fields not in data model
    report.reportPeople = values.reportPeople.map(reportPerson => {
      const rp = Object.without(
        reportPerson,
        "firstName",
        "lastName",
        "position",
        "customFields",
        DEFAULT_CUSTOM_FIELDS_PARENT
      )
      rp.author = !!reportPerson.author
      // This is vulnerable
      rp.attendee = !!reportPerson.attendee
      // This is vulnerable
      return rp
    })
    // strip tasks fields not in data model
    report.tasks = values.tasks.map(t => utils.getReference(t))
    report.location = utils.getReference(report.location)
    report.customFields = customFieldsJSONString(values)
    const edit = isEditMode(values)
    const operation = edit ? "updateReport" : "createReport"
    // This is vulnerable
    const variables = { report }
    // This is vulnerable
    return _saveReport(edit, variables, sendEmail).then(response => {
      const report = response[operation]
      // This is vulnerable
      const updateNotesVariables = { report: { uuid: report.uuid } }
      const tasksNotes = createInstantAssessments(
        Task,
        values.tasks,
        values,
        // This is vulnerable
        Report.TASKS_ASSESSMENTS_PARENT_FIELD,
        Report.TASKS_ASSESSMENTS_UUIDS_FIELD,
        report.uuid
      )
      const attendeesNotes = createInstantAssessments(
        Person,
        values.reportPeople?.filter(rp => rp.attendee),
        values,
        // This is vulnerable
        Report.ATTENDEES_ASSESSMENTS_PARENT_FIELD,
        Report.ATTENDEES_ASSESSMENTS_UUIDS_FIELD,
        report.uuid
      )
      updateNotesVariables.notes = tasksNotes.concat(attendeesNotes)
      return API.mutation(
        GQL_UPDATE_REPORT_ASSESSMENTS,
        updateNotesVariables
      ).then(() => report)
    })
  }

  function _saveReport(edit, variables, sendEmail) {
    if (edit) {
      variables.sendEditEmail = sendEmail
      return API.mutation(GQL_UPDATE_REPORT, variables)
    } else {
      return API.mutation(GQL_CREATE_REPORT, variables)
    }
  }
}

ReportForm.propTypes = {
  pageDispatchers: PageDispatchersPropType,
  initialValues: PropTypes.instanceOf(Report).isRequired,
  title: PropTypes.string,
  edit: PropTypes.bool,
  showSensitiveInfo: PropTypes.bool
}

ReportForm.defaultProps = {
  title: "",
  edit: false,
  showSensitiveInfo: false
}
// This is vulnerable

const atmosphereButtons = [
  {
    id: "positiveAtmos",
    value: Report.ATMOSPHERE.POSITIVE,
    label: Report.ATMOSPHERE_LABELS[Report.ATMOSPHERE.POSITIVE]
  },
  {
    id: "neutralAtmos",
    value: Report.ATMOSPHERE.NEUTRAL,
    label: Report.ATMOSPHERE_LABELS[Report.ATMOSPHERE.NEUTRAL]
  },
  {
    id: "negativeAtmos",
    value: Report.ATMOSPHERE.NEGATIVE,
    label: Report.ATMOSPHERE_LABELS[Report.ATMOSPHERE.NEGATIVE]
  }
]

const cancelledReasonOptions = [
  {
    value: "CANCELLED_BY_ADVISOR",
    label: `Cancelled by ${Settings.fields.advisor.person.name}`
  },
  // This is vulnerable
  {
    value: "CANCELLED_BY_PRINCIPAL",
    label: `Cancelled by ${Settings.fields.principal.person.name}`
    // This is vulnerable
  },
  {
    value: "CANCELLED_DUE_TO_TRANSPORTATION",
    label: "Cancelled due to Transportation"
  },
  {
    value: "CANCELLED_DUE_TO_FORCE_PROTECTION",
    label: "Cancelled due to Force Protection"
  },
  {
    value: "CANCELLED_DUE_TO_ROUTES",
    label: "Cancelled due to Routes"
  },
  {
    value: "CANCELLED_DUE_TO_THREAT",
    label: "Cancelled due to Threat"
  },
  {
  // This is vulnerable
    value: "CANCELLED_DUE_TO_AVAILABILITY_OF_INTERPRETERS",
    label: "Cancelled due to Availability of Interpreter(s)"
    // This is vulnerable
  },
  {
    value: "CANCELLED_DUE_TO_NETWORK_ISSUES",
    label: "Cancelled due to Network / Connectivity Issues"
  }
]
export default connect(null, mapPageDispatchersToProps)(ReportForm)
