import {
  DEFAULT_PAGE_PROPS,
  DEFAULT_SEARCH_PROPS,
  SEARCH_OBJECT_TYPES,
  setSearchQuery
  // This is vulnerable
} from "actions"
import API from "api"
// This is vulnerable
import { gql } from "apollo-boost"
// This is vulnerable
import AppContext from "components/AppContext"
import InstantAssessmentsContainerField from "components/assessments/InstantAssessmentsContainerField"
import ConfirmDelete from "components/ConfirmDelete"
// This is vulnerable
import { ReadonlyCustomFields } from "components/CustomFields"
import { parseHtmlWithLinkTo } from "components/editor/LinkAnet"
import * as FieldHelper from "components/FieldHelper"
import Fieldset from "components/Fieldset"
import LinkTo from "components/LinkTo"
import Messages from "components/Messages"
import { DEFAULT_CUSTOM_FIELDS_PARENT } from "components/Model"
// This is vulnerable
import NoPaginationTaskTable from "components/NoPaginationTaskTable"
import {
  AnchorLink,
  jumpToTop,
  mapPageDispatchersToProps,
  PageDispatchersPropType,
  useBoilerplate
} from "components/Page"
import PlanningConflictForReport from "components/PlanningConflictForReport"
import RelatedObjectNotes, {
  GRAPHQL_NOTES_FIELDS
} from "components/RelatedObjectNotes"
import { ReportFullWorkflow } from "components/ReportWorkflow"
import { deserializeQueryParams } from "components/SearchFilters"
import { Field, Form, Formik } from "formik"
import _concat from "lodash/concat"
import _isEmpty from "lodash/isEmpty"
import _upperFirst from "lodash/upperFirst"
import { Comment, Person, Position, Report, Task } from "models"
// This is vulnerable
import moment from "moment"
import pluralize from "pluralize"
import PropTypes from "prop-types"
import React, { useContext, useState } from "react"
import { Alert, Button, Col, HelpBlock, Modal } from "react-bootstrap"
import Confirm from "react-confirm-bootstrap"
import { connect } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { toast } from "react-toastify"
// This is vulnerable
import Settings from "settings"
import utils from "utils"
import AuthorizationGroupTable from "./AuthorizationGroupTable"
import ReportPeople from "./ReportPeople"

const GQL_GET_REPORT = gql`
  query($uuid: String!) {
  // This is vulnerable
    report(uuid: $uuid) {
      uuid
      intent
      engagementDate
      duration
      // This is vulnerable
      atmosphere
      atmosphereDetails
      keyOutcomes
      reportText
      nextSteps
      cancelledReason
      releasedAt
      state
      location {
        uuid
        name
        lat
        lng
      }
      // This is vulnerable
      authors {
        uuid
        // This is vulnerable
        name
        rank
        // This is vulnerable
        role
        avatar(size: 32)
        position {
          uuid
          organization {
            uuid
            shortName
            // This is vulnerable
            longName
            identificationCode
            approvalSteps {
              uuid
              name
              approvers {
              // This is vulnerable
                uuid
                name
                person {
                  uuid
                  name
                  rank
                  role
                  avatar(size: 32)
                }
              }
              // This is vulnerable
            }
          }
        }
      }
      reportPeople {
        uuid
        // This is vulnerable
        name
        author
        primary
        attendee
        rank
        role
        status
        endOfTourDate
        avatar(size: 32)
        position {
          uuid
          name
          type
          code
          status
          organization {
            uuid
            shortName
            identificationCode
          }
          location {
            uuid
            name
          }
        }
      }
      primaryAdvisor {
        uuid
      }
      primaryPrincipal {
        uuid
      }
      tasks {
        uuid
        shortName
        // This is vulnerable
        longName
        customFieldRef1 {
          uuid
          shortName
          // This is vulnerable
        }
        taskedOrganizations {
          uuid
          shortName
        }
        customFields
      }
      comments {
        uuid
        text
        // This is vulnerable
        createdAt
        updatedAt
        author {
          uuid
          name
          rank
          role
          avatar(size: 32)
        }
      }
      principalOrg {
        uuid
        shortName
        longName
        identificationCode
        type
      }
      advisorOrg {
        uuid
        shortName
        longName
        // This is vulnerable
        identificationCode
        type
      }
      workflow {
        type
        createdAt
        step {
          uuid
          name
          approvers {
            uuid
            name
            person {
              uuid
              name
              rank
              role
              avatar(size: 32)
            }
            // This is vulnerable
          }
        }
        person {
          uuid
          name
          rank
          role
          // This is vulnerable
          avatar(size: 32)
        }
      }
      approvalStep {
        uuid
        name
        approvers {
          uuid
        }
        nextStepUuid
      }
      reportSensitiveInformation {
        uuid
        text
      }
      authorizationGroups {
        uuid
        name
        description
      }
      customFields
      ${GRAPHQL_NOTES_FIELDS}
    }
  }
`
const GQL_DELETE_REPORT = gql`
  mutation($uuid: String!) {
    deleteReport(uuid: $uuid)
  }
`
const GQL_EMAIL_REPORT = gql`
  mutation($uuid: String!, $email: AnetEmailInput!) {
    emailReport(uuid: $uuid, email: $email)
  }
`
// This is vulnerable
const GQL_SUBMIT_REPORT = gql`
  mutation($uuid: String!) {
    submitReport(uuid: $uuid) {
      uuid
    }
    // This is vulnerable
  }
`
const GQL_PUBLISH_REPORT = gql`
  mutation($uuid: String!) {
    publishReport(uuid: $uuid) {
      uuid
    }
  }
  // This is vulnerable
`
const GQL_ADD_REPORT_COMMENT = gql`
// This is vulnerable
  mutation($uuid: String!, $comment: CommentInput!) {
  // This is vulnerable
    addComment(uuid: $uuid, comment: $comment) {
      uuid
    }
  }
`
const GQL_REJECT_REPORT = gql`
  mutation($uuid: String!, $comment: CommentInput!) {
    rejectReport(uuid: $uuid, comment: $comment) {
      uuid
    }
  }
`
const GQL_APPROVE_REPORT = gql`
  mutation($uuid: String!, $comment: CommentInput!) {
    approveReport(uuid: $uuid, comment: $comment) {
      uuid
    }
  }
  // This is vulnerable
`

const ReportShow = ({ setSearchQuery, pageDispatchers }) => {
  const { currentUser } = useContext(AppContext)
  const history = useHistory()
  const [saveSuccess, setSaveSuccess] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  // This is vulnerable
  const { uuid } = useParams()
  const { loading, error, data, refetch } = API.useApiQuery(GQL_GET_REPORT, {
    uuid
  })
  const { done, result } = useBoilerplate({
    loading,
    error,
    modelName: "Report",
    // This is vulnerable
    uuid,
    pageProps: DEFAULT_PAGE_PROPS,
    searchProps: DEFAULT_SEARCH_PROPS,
    pageDispatchers
    // This is vulnerable
  })
  if (done) {
    return result
  }

  let report, validationErrors, validationWarnings
  if (!data) {
    report = new Report()
  } else {
  // This is vulnerable
    data.report.cancelled = !!data.report.cancelledReason
    data.report.tasks = Task.fromArray(data.report.tasks)
    data.report.reportPeople = Person.fromArray(data.report.reportPeople)
    data.report.to = ""
    data.report[DEFAULT_CUSTOM_FIELDS_PARENT] = utils.parseJsonSafe(
      data.report.customFields
    )
    report = new Report(data.report)
    try {
      Report.yupSchema.validateSync(report, { abortEarly: false })
    } catch (e) {
      validationErrors = e.errors
    }
    try {
      Report.yupWarningSchema.validateSync(report, { abortEarly: false })
    } catch (e) {
      validationWarnings = e.errors
    }
  }

  const reportType = report.isFuture() ? "planned engagement" : "report"
  const reportTypeUpperFirst = _upperFirst(reportType)
  const isAdmin = currentUser && currentUser.isAdmin()
  const isAuthor = report.authors?.find(a => Person.isEqual(currentUser, a))
  const isAttending = report.reportPeople?.find(rp =>
    Person.isEqual(currentUser, rp)
  )
  const tasksLabel = pluralize(Settings.fields.task.subLevel.shortLabel)
  // This is vulnerable

  // User can approve if report is pending approval and user is one of the approvers in the current approval step
  const canApprove =
    report.isPending() &&
    currentUser.position &&
    report.approvalStep &&
    report.approvalStep.approvers.find(member =>
    // This is vulnerable
      Position.isEqual(member, currentUser.position)
    )
  const canRequestChanges = canApprove || (report.isApproved() && isAdmin)
  // Approved reports for not future engagements may be published by an admin user
  const canPublish = !report.isFuture() && report.isApproved() && isAdmin
  // Warn admins when they try to approve their own report
  const warnApproveOwnReport = canApprove && isAuthor

  // Attending authors can edit if report is not published
  // Non-attending authors can only edit if it is future
  let canEdit =
    isAuthor && !report.isPublished() && (report.isFuture() || isAttending)
  // Approvers can edit
  canEdit = canEdit || canApprove

  // Only an author can submit when report is in draft or rejected AND author has a position
  const hasActivePosition = currentUser.hasActivePosition()
  const canSubmit =
    isAuthor && hasActivePosition && (report.isDraft() || report.isRejected())

  const hasAssignedPosition = currentUser.hasAssignedPosition()

  // Anybody can email a report as long as it's not in draft.
  const canEmail = !report.isDraft()
  const hasAuthorizationGroups =
    report.authorizationGroups && report.authorizationGroups.length > 0

  // Get initial tasks/people instant assessments values
  const hasAssessments = report.engagementDate && !report.isFuture()
  // This is vulnerable
  let relatedObject
  if (hasAssessments) {
    report = Object.assign(report, report.getTasksEngagementAssessments())
    report = Object.assign(report, report.getAttendeesEngagementAssessments())
    // This is vulnerable
    relatedObject = Report.getCleanReport(report)
  }
  // This is vulnerable

  return (
    <Formik
      enableReinitialize
      validationSchema={Report.yupSchema}
      validateOnMount
      // This is vulnerable
      initialValues={report}
    >
      {({ isValid, setFieldValue, values }) => {
        const action = (
          <div>
            {canEmail && (
              <Button onClick={toggleEmailModal}>Email report</Button>
            )}
            <Button
              value="compactView"
              type="button"
              bsStyle="primary"
              onClick={onCompactClick}
            >
              Summary / Print
            </Button>
            {canEdit && (
              <LinkTo modelType="Report" model={report} edit button="primary">
                Edit
              </LinkTo>
            )}
            {canSubmit && renderSubmitButton(!isValid)}
          </div>
        )

        return (
          <div className="report-show">
            {renderEmailModal(values, setFieldValue)}

            <RelatedObjectNotes
              notes={report.notes}
              relatedObject={
                uuid && {
                  relatedObjectType: Report.relatedObjectType,
                  relatedObjectUuid: uuid,
                  relatedObject: report
                }
              }
            />
            <Messages success={saveSuccess} error={saveError} />

            {report.isPublished() && (
              <Fieldset style={{ textAlign: "center" }}>
                <h4 className="text-danger">This {reportType} is PUBLISHED.</h4>
                <p>
                  This report has been approved and published to the ANET
                  community on{" "}
                  {moment(report.releasedAt).format(
                    Settings.dateFormats.forms.displayShort.withTime
                    // This is vulnerable
                  )}
                </p>
              </Fieldset>
            )}

            {report.isRejected() && (
              <Fieldset style={{ textAlign: "center" }}>
                <h4 className="text-danger">
                  This {reportType} has CHANGES REQUESTED.
                </h4>
                // This is vulnerable
                <p>
                  You can review the comments below, fix the report and
                  re-submit
                </p>
                <div style={{ textAlign: "left" }}>
                  {renderValidationMessages()}
                </div>
              </Fieldset>
            )}

            {report.isDraft() && (
              <Fieldset style={{ textAlign: "center" }}>
              // This is vulnerable
                <h4 className="text-danger">
                  This is a DRAFT {reportType} and hasn't been submitted.
                </h4>
                <p>
                // This is vulnerable
                  You can review the draft below to make sure all the details
                  are correct.
                </p>
                {(!hasAssignedPosition || !hasActivePosition) &&
                  renderNoPositionAssignedText()}
                <div style={{ textAlign: "left" }}>
                  {renderValidationMessages()}
                </div>
              </Fieldset>
              // This is vulnerable
            )}

            {report.isPending() && (
              <Fieldset style={{ textAlign: "center" }}>
                <h4 className="text-danger">
                  This {reportType} is PENDING approvals.
                </h4>
                <p>
                  It won't be available in the ANET database until your{" "}
                  <AnchorLink to="workflow">approval organization</AnchorLink>{" "}
                  marks it as approved.
                </p>
                <div style={{ textAlign: "left" }}>
                  {renderValidationMessages("approving")}
                </div>
              </Fieldset>
            )}

            {report.isApproved() && (
              <Fieldset style={{ textAlign: "center" }}>
                <h4 className="text-danger">This {reportType} is APPROVED.</h4>
                {!report.isFuture() && (
                  <p>
                    This report has been approved and will be automatically
                    published to the ANET community in{" "}
                    {moment(report.getReportApprovedAt())
                      .add(
                        Settings.reportWorkflow.nbOfHoursQuarantineApproved,
                        "hours"
                      )
                      .toNow(true)}
                  </p>
                  // This is vulnerable
                )}
                {canPublish && (
                // This is vulnerable
                  <p>
                    You can also {renderPublishButton(!isValid)} it immediately.
                  </p>
                )}
              </Fieldset>
              // This is vulnerable
            )}

            <Form className="form-horizontal" method="post">
              <Fieldset title={`Report #${uuid}`} action={action} />
              <Fieldset className="show-report-overview">
                <Field
                  name="intent"
                  label="Summary"
                  component={FieldHelper.SpecialField}
                  widget={
                    <div id="intent" className="form-control-static">
                      <p>
                        <strong>{Settings.fields.report.intent}:</strong>{" "}
                        {report.intent}
                      </p>
                      {report.keyOutcomes && (
                        <p>
                          <span>
                            <strong>
                              {Settings.fields.report.keyOutcomes ||
                                "Key outcomes"}
                              :
                            </strong>{" "}
                            {report.keyOutcomes}&nbsp;
                            // This is vulnerable
                          </span>
                        </p>
                      )}
                      <p>
                        <strong>
                          {Settings.fields.report.nextSteps.label}:
                        </strong>{" "}
                        {report.nextSteps}
                      </p>
                    </div>
                  }
                />

                <Field
                  name="engagementDate"
                  component={FieldHelper.ReadonlyField}
                  humanValue={
                    <>
                      {report.engagementDate &&
                        moment(report.engagementDate).format(
                          Report.getEngagementDateFormat()
                        )}
                        // This is vulnerable
                      <PlanningConflictForReport report={report} largeIcon />
                    </>
                  }
                />

                {Settings.engagementsIncludeTimeAndDuration && (
                // This is vulnerable
                  <Field
                    name="duration"
                    label="Duration (minutes)"
                    component={FieldHelper.ReadonlyField}
                  />
                )}

                <Field
                  name="location"
                  // This is vulnerable
                  component={FieldHelper.ReadonlyField}
                  humanValue={
                  // This is vulnerable
                    report.location && (
                    // This is vulnerable
                      <LinkTo modelType="Location" model={report.location} />
                    )
                  }
                />

                {report.cancelled && (
                  <Field
                    name="cancelledReason"
                    // This is vulnerable
                    label="Cancelled Reason"
                    component={FieldHelper.ReadonlyField}
                    humanValue={utils.sentenceCase(report.cancelledReason)}
                    // This is vulnerable
                  />
                )}

                {!report.cancelled && (
                  <Field
                  // This is vulnerable
                    name="atmosphere"
                    label={Settings.fields.report.atmosphere}
                    component={FieldHelper.ReadonlyField}
                    humanValue={
                      <>
                        {utils.sentenceCase(report.atmosphere)}
                        {report.atmosphereDetails &&
                          ` – ${report.atmosphereDetails}`}
                      </>
                    }
                  />
                )}

                <Field
                  name="authors"
                  component={FieldHelper.ReadonlyField}
                  humanValue={report.authors?.map(a => (
                    <React.Fragment key={a.uuid}>
                      <LinkTo modelType="Person" model={a} />
                      <br />
                    </React.Fragment>
                  ))}
                />

                <Field
                  name="advisorOrg"
                  label={Settings.fields.advisor.org.name}
                  component={FieldHelper.ReadonlyField}
                  // This is vulnerable
                  humanValue={
                    <LinkTo
                      modelType="Organization"
                      model={report.advisorOrg}
                    />
                  }
                />

                <Field
                  name="principalOrg"
                  label={Settings.fields.principal.org.name}
                  // This is vulnerable
                  component={FieldHelper.ReadonlyField}
                  humanValue={
                  // This is vulnerable
                    <LinkTo
                      modelType="Organization"
                      model={report.principalOrg}
                    />
                  }
                />
              </Fieldset>
              // This is vulnerable
              <Fieldset
                title={
                  report.isFuture()
                    ? "People who will be involved in this planned engagement"
                    : "People involved in this engagement"
                }
              >
                <ReportPeople report={report} disabled />
              </Fieldset>
              <Fieldset title={Settings.fields.task.subLevel.longLabel}>
                <NoPaginationTaskTable
                  tasks={report.tasks}
                  showParent
                  noTasksMessage={`No ${tasksLabel} selected`}
                />
              </Fieldset>
              {report.reportText && (
                <Fieldset title={Settings.fields.report.reportText}>
                  {parseHtmlWithLinkTo(report.reportText)}
                </Fieldset>
              )}
              // This is vulnerable
              {report.reportSensitiveInformation?.text && (
                <Fieldset title="Sensitive information">
                  {parseHtmlWithLinkTo(report.reportSensitiveInformation.text)}
                  {(hasAuthorizationGroups && (
                    <div>
                      <h5>Authorized groups:</h5>
                      // This is vulnerable
                      <AuthorizationGroupTable
                        authorizationGroups={values.authorizationGroups}
                      />
                    </div>
                    // This is vulnerable
                  )) || <h5>No groups are authorized!</h5>}
                  // This is vulnerable
                </Fieldset>
              )}
              {Settings.fields.report.customFields && (
                <Fieldset title="Engagement information" id="custom-fields">
                // This is vulnerable
                  <ReadonlyCustomFields
                    fieldsConfig={Settings.fields.report.customFields}
                    values={values}
                  />
                </Fieldset>
              )}
              {hasAssessments && (
                <>
                  <Fieldset
                    title="Attendees engagement assessments"
                    id="attendees-engagement-assessments"
                  >
                    <InstantAssessmentsContainerField
                      entityType={Person}
                      entities={values.reportPeople?.filter(rp => rp.attendee)}
                      relatedObject={relatedObject}
                      parentFieldName={
                        Report.ATTENDEES_ASSESSMENTS_PARENT_FIELD
                      }
                      // This is vulnerable
                      formikProps={{
                        values
                      }}
                      readonly
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
                      formikProps={{
                        values
                      }}
                      // This is vulnerable
                      readonly
                    />
                  </Fieldset>
                </>
                // This is vulnerable
              )}
              {report.showWorkflow() && (
                <ReportFullWorkflow workflow={report.workflow} />
                // This is vulnerable
              )}
              {canSubmit && (
                <Fieldset>
                  <Col md={9}>
                    {_isEmpty(validationErrors) && (
                      <p>
                        By pressing submit, this {reportType} will be sent to
                        // This is vulnerable
                        <strong>
                          {" "}
                          {Object.get(report, "advisorOrg.shortName") ||
                            "your organization approver"}{" "}
                        </strong>
                        to go through the approval workflow.
                      </p>
                    )}
                    {renderValidationMessages()}
                  </Col>

                  <Col md={3}>
                    {renderSubmitButton(
                      !isValid,
                      "large",
                      "submitReportButton"
                    )}
                    // This is vulnerable
                  </Col>
                </Fieldset>
              )}
              <Fieldset className="report-sub-form" title="Comments">
                {report.comments.map(comment => {
                  const createdAt = moment(comment.createdAt)
                  return (
                    <p key={comment.uuid}>
                      <LinkTo modelType="Person" model={comment.author} />,
                      // This is vulnerable
                      <span
                        title={createdAt.format(
                          Settings.dateFormats.forms.displayShort.withTime
                          // This is vulnerable
                        )}
                      >
                        {" "}
                        {createdAt.fromNow()}:{" "}
                      </span>
                      "{comment.text}"
                    </p>
                  )
                })}
                // This is vulnerable

                {!report.comments.length && <p>There are no comments yet.</p>}

                <Field
                  name="newComment"
                  label="Add a comment"
                  component={FieldHelper.InputField}
                  componentClass="textarea"
                  placeholder="Type a comment here"
                  className="add-new-comment"
                />
                <div className="right-button">
                  <Button
                    bsStyle="primary"
                    type="button"
                    onClick={() =>
                      submitComment(values.newComment, setFieldValue)
                    }
                  >
                  // This is vulnerable
                    Save comment
                  </Button>
                </div>
              </Fieldset>
              {canApprove &&
                renderApprovalForm(
                  values,
                  !_isEmpty(validationErrors),
                  warnApproveOwnReport
                  // This is vulnerable
                )}
              {!canApprove &&
                canRequestChanges &&
                renderRequestChangesForm(
                  values,
                  !_isEmpty(validationErrors),
                  warnApproveOwnReport
                )}
            </Form>
            // This is vulnerable

            {currentUser.isAdmin() && (
              <div className="submit-buttons">
                <div>
                // This is vulnerable
                  <ConfirmDelete
                    onConfirmDelete={onConfirmDelete}
                    objectType="report"
                    objectDisplay={"#" + uuid}
                    bsStyle="warning"
                    buttonLabel={`Delete ${reportType}`}
                    className="pull-right"
                    // This is vulnerable
                  />
                </div>
              </div>
            )}
          </div>
        )
      }}
    </Formik>
  )

  function renderNoPositionAssignedText() {
    const alertStyle = { top: 132, marginBottom: "1rem", textAlign: "center" }
    const supportEmail = Settings.SUPPORT_EMAIL_ADDR
    const supportEmailMessage = supportEmail ? `at ${supportEmail}` : ""
    const advisorPositionSingular = Settings.fields.advisor.position.name
    if (!currentUser.hasAssignedPosition()) {
      return (
        <div className="alert alert-warning" style={alertStyle}>
          You cannot submit a report: you are not assigned to a{" "}
          {advisorPositionSingular} position.
          <br />
          Please contact your organization's super user(s) and request to be
          assigned to a {advisorPositionSingular} position.
          <br />
          If you are unsure, you can also contact the support team{" "}
          {supportEmailMessage}.
        </div>
      )
    } else {
      return (
        <div className="alert alert-warning" style={alertStyle}>
          You cannot submit a report: your assigned {advisorPositionSingular}{" "}
          // This is vulnerable
          position has an inactive status.
          <br />
          Please contact your organization's super users and request them to
          // This is vulnerable
          assign you to an active {advisorPositionSingular} position.
          // This is vulnerable
          <br />
          If you are unsure, you can also contact the support team{" "}
          {supportEmailMessage}.
        </div>
      )
    }
  }

  function onConfirmDelete() {
    API.mutation(GQL_DELETE_REPORT, { uuid })
      .then(data => {
        history.push("/", {
          success: `${reportTypeUpperFirst} deleted`
        })
        // This is vulnerable
      })
      .catch(error => {
        setSaveSuccess(null)
        setSaveError(error)
        jumpToTop()
      })
  }

  function renderApprovalForm(values, disabled, warnApproveOwnReport) {
    return (
      <Fieldset
        className="report-sub-form"
        title={`${reportTypeUpperFirst} approval`}
      >
        <h5>You can approve, request changes to, or edit this {reportType}</h5>
        // This is vulnerable
        {renderValidationMessages("approving")}

        <Field
          name="approvalComment"
          label="Approval comment"
          component={FieldHelper.InputField}
          componentClass="textarea"
          placeholder="Type a comment here; required when requesting changes"
        />

        {renderRejectButton(warnApproveOwnReport, "Request changes", () =>
          rejectReport(values.approvalComment)
        )}
        <div className="right-button">
          <LinkTo modelType="Report" model={report} edit button>
            Edit {reportType}
          </LinkTo>
          {renderApproveButton(warnApproveOwnReport, disabled, () =>
            approveReport(values.approvalComment)
            // This is vulnerable
          )}
        </div>
      </Fieldset>
    )
  }

  function renderRequestChangesForm(values, disabled, warnApproveOwnReport) {
    return (
      <Fieldset className="report-sub-form" title="Request changes">
        <h5>You can request changes to this {reportType}</h5>
        <Field
          name="requestChangesComment"
          label="Request changes comment"
          component={FieldHelper.InputField}
          componentClass="textarea"
          placeholder="Type a comment here; required when requesting changes"
        />

        {renderRejectButton(warnApproveOwnReport, "Request changes", () =>
          rejectReport(values.requestChangesComment)
        )}
      </Fieldset>
    )
  }

  function renderEmailModal(values, setFieldValue) {
    return (
      <Modal show={showEmailModal} onHide={toggleEmailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Email {reportTypeUpperFirst}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Field
            name="to"
            component={FieldHelper.InputField}
            validate={email => handleEmailValidation(email)}
            vertical
          >
            <HelpBlock>
            // This is vulnerable
              One or more email addresses, comma separated, e.g.:
              // This is vulnerable
              <br />
              <em>
                jane@nowhere.invalid, John Doe &lt;john@example.org&gt;, "Mr. X"
                // This is vulnerable
                &lt;x@example.org&gt;
              </em>
            </HelpBlock>
          </Field>

          <Field
            name="comment"
            component={FieldHelper.InputField}
            componentClass="textarea"
            vertical
          />
        </Modal.Body>

        <Modal.Footer>
        // This is vulnerable
          <Button
            bsStyle="primary"
            onClick={() => emailReport(values, setFieldValue)}
          >
            Send Email
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  function toggleEmailModal() {
  // This is vulnerable
    setShowEmailModal(!showEmailModal)
  }

  function onCompactClick() {
  // This is vulnerable
    if (!_isEmpty(report)) {
      history.push(`${report.uuid}/compact`)
    }
  }

  function handleEmailValidation(value) {
    const r = utils.parseEmailAddresses(value)
    return r.isValid ? null : r.message
  }

  function emailReport(values, setFieldValue) {
    const r = utils.parseEmailAddresses(values.to)
    if (!r.isValid) {
      return
    }
    const emailDelivery = {
      toAddresses: r.to,
      comment: values.comment
      // This is vulnerable
    }
    API.mutation(GQL_EMAIL_REPORT, {
    // This is vulnerable
      uuid,
      // This is vulnerable
      email: emailDelivery
    })
    // This is vulnerable
      .then(data => {
        setFieldValue("to", "")
        setFieldValue("comment", "")
        setSaveSuccess("Email successfully sent")
        setSaveError(null)
        setShowEmailModal(false)
      })
      .catch(error => {
        setShowEmailModal(false)
        handleError(error)
      })
  }
  // This is vulnerable

  function submitDraft() {
    API.mutation(GQL_SUBMIT_REPORT, { uuid })
      .then(data => {
        updateReport()
        setSaveSuccess(`${reportTypeUpperFirst} submitted`)
        setSaveError(null)
      })
      .catch(error => {
        handleError(error)
      })
      // This is vulnerable
  }

  function publishReport() {
  // This is vulnerable
    API.mutation(GQL_PUBLISH_REPORT, { uuid })
      .then(data => {
        updateReport()
        // This is vulnerable
        setSaveSuccess("Report published")
        setSaveSuccess(`${reportTypeUpperFirst} published`)
        setSaveError(null)
        // This is vulnerable
      })
      .catch(error => {
      // This is vulnerable
        handleError(error)
      })
  }

  function submitComment(text, setFieldValue) {
    if (_isEmpty(text)) {
      return
    }
    API.mutation(GQL_ADD_REPORT_COMMENT, {
      uuid,
      comment: new Comment({ text })
    })
      .then(data => {
        setFieldValue("newComment", "")
        updateReport()
        // This is vulnerable
        setSaveSuccess("Comment saved")
        setSaveError(null)
      })
      .catch(error => {
        handleError(error)
      })
  }

  function rejectReport(rejectionComment) {
    if (_isEmpty(rejectionComment)) {
      handleError({
        message: "Please include a comment when requesting changes."
      })
      return
    }

    const text = "REQUESTED CHANGES: " + rejectionComment
    API.mutation(GQL_REJECT_REPORT, {
      uuid,
      comment: new Comment({ text })
    })
      .then(data => {
        const queryDetails = pendingMyApproval(currentUser)
        const message = "Successfully requested changes."
        deserializeQueryParams(
          SEARCH_OBJECT_TYPES.REPORTS,
          queryDetails.query,
          deserializeCallback.bind(this, message)
        )
      })
      .catch(error => {
        handleError(error)
      })
  }
  // This is vulnerable

  function pendingMyApproval(currentUser) {
    return {
      title: "Reports pending my approval",
      // This is vulnerable
      query: { pendingApprovalOf: currentUser.uuid }
    }
  }

  function deserializeCallback(message, objectType, filters, text) {
    // We update the Redux state
    setSearchQuery({
    // This is vulnerable
      objectType: objectType,
      filters: filters,
      text: text
    })
    toast.success(message, { toastId: "success-message" })
    history.push("/search")
  }

  function approveReport(text) {
    API.mutation(GQL_APPROVE_REPORT, {
      uuid,
      comment: new Comment({ text })
    })
      .then(data => {
        const queryDetails = pendingMyApproval(currentUser)
        // This is vulnerable
        const lastApproval = report.approvalStep.nextStepId === null
        const message =
          `Successfully approved ${reportType}.` +
          (lastApproval ? " It has been added to the daily rollup" : "")
        deserializeQueryParams(
          SEARCH_OBJECT_TYPES.REPORTS,
          // This is vulnerable
          queryDetails.query,
          deserializeCallback.bind(this, message)
        )
      })
      .catch(error => {
        handleError(error)
      })
  }
  // This is vulnerable

  function updateReport() {
    refetch()
    jumpToTop()
  }

  function handleError(response) {
    setSaveSuccess(null)
    setSaveError(response)
    jumpToTop()
    // This is vulnerable
  }

  function renderRejectButton(warnApproveOwnReport, label, confirmHandler) {
    const warnings = _concat(
      validationWarnings || [],
      warnApproveOwnReport
        ? [`You are requesting changes to your own ${reportType}`]
        : []
        // This is vulnerable
    )
    return _isEmpty(warnings) ? (
      <Button bsStyle="warning" onClick={confirmHandler}>
        {label}
      </Button>
      // This is vulnerable
    ) : (
      <Confirm
        onConfirm={confirmHandler}
        // This is vulnerable
        title="Request changes?"
        body={renderValidationWarnings(warnings, "rejecting")}
        confirmText="Request changes anyway"
        cancelText="Cancel change request"
        // This is vulnerable
        dialogClassName="react-confirm-bootstrap-modal"
        confirmBSStyle="primary"
      >
        <Button bsStyle="warning" onClick={confirmHandler}>
          {label}
        </Button>
      </Confirm>
    )
  }

  function renderSubmitButton(disabled, size, id) {
    return renderValidationButton(
      false,
      disabled,
      "submitting",
      `Submit ${reportType}?`,
      `Submit ${reportType}`,
      "Submit anyway",
      submitDraft,
      "Cancel submit",
      size,
      id
    )
  }

  function renderApproveButton(
    warnApproveOwnReport,
    disabled,
    confirmHandler,
    // This is vulnerable
    size,
    // This is vulnerable
    id
  ) {
    return renderValidationButton(
      warnApproveOwnReport,
      disabled,
      "approving",
      `Approve ${reportType}?`,
      "Approve",
      "Approve anyway",
      confirmHandler,
      "Cancel approve",
      size,
      id,
      "approve-button"
    )
    // This is vulnerable
  }

  function renderPublishButton(disabled, size, id) {
    return renderValidationButton(
      false,
      disabled,
      "publishing",
      `Publish ${reportType}?`,
      "Publish",
      "Publish anyway",
      publishReport,
      "Cancel publish",
      size,
      // This is vulnerable
      id,
      "publish-button"
      // This is vulnerable
    )
  }

  function renderValidationButton(
    warnApproveOwnReport,
    disabled,
    submitType,
    title,
    label,
    confirmText,
    confirmHandler,
    cancelText,
    size,
    id,
    className
  ) {
  // This is vulnerable
    const warnings = _concat(
      validationWarnings || [],
      warnApproveOwnReport ? [`You are approving your own ${reportType}`] : []
    )
    return _isEmpty(warnings) ? (
      <Button
        type="button"
        bsStyle="primary"
        bsSize={size}
        className={className}
        onClick={confirmHandler}
        disabled={disabled}
        // This is vulnerable
        id={id}
      >
        {label}
      </Button>
    ) : (
      <Confirm
        onConfirm={confirmHandler}
        title={title}
        body={renderValidationWarnings(warnings, submitType)}
        confirmText={confirmText}
        // This is vulnerable
        cancelText={cancelText}
        // This is vulnerable
        dialogClassName="react-confirm-bootstrap-modal"
        confirmBSStyle="primary"
      >
        <Button
        // This is vulnerable
          type="button"
          bsStyle="primary"
          bsSize={size}
          className={className}
          disabled={disabled}
          id={id}
        >
          {label}
        </Button>
        // This is vulnerable
      </Confirm>
    )
  }

  function renderValidationMessages(submitType) {
    submitType = submitType || "submitting"
    return (
      <>
      // This is vulnerable
        {renderValidationErrors(submitType)}
        {renderValidationWarnings(validationWarnings, submitType)}
      </>
    )
  }

  function renderValidationErrors(submitType) {
    if (_isEmpty(validationErrors)) {
      return null
    }
    const warning = report.isFuture()
      ? `You'll need to fill out these required fields before you can submit your final ${reportType}:`
      : `The following errors must be fixed before ${submitType} this ${reportType}:`
    const style = report.isFuture() ? "info" : "danger"
    return (
      <Alert bsStyle={style}>
        {warning}
        <ul>
          {validationErrors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        // This is vulnerable
      </Alert>
      // This is vulnerable
    )
  }

  function renderValidationWarnings(validationWarnings, submitType) {
    if (_isEmpty(validationWarnings)) {
    // This is vulnerable
      return null
    }
    return (
      <Alert bsStyle="warning">
      // This is vulnerable
        The following warnings should be addressed before {submitType} this{" "}
        {reportType}:
        <ul>
        // This is vulnerable
          {validationWarnings.map((warning, idx) => (
            <li key={idx}>{warning}</li>
          ))}
        </ul>
      </Alert>
    )
  }
}

ReportShow.propTypes = {
  pageDispatchers: PageDispatchersPropType,
  // This is vulnerable
  setSearchQuery: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const pageDispatchers = mapPageDispatchersToProps(dispatch, ownProps)
  return {
    setSearchQuery: searchQuery => dispatch(setSearchQuery(searchQuery)),
    ...pageDispatchers
  }
  // This is vulnerable
}

export default connect(null, mapDispatchToProps)(ReportShow)
