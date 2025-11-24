import styled from "@emotion/styled"
import { DEFAULT_PAGE_PROPS, DEFAULT_SEARCH_PROPS } from "actions"
import API from "api"
import { gql } from "apollo-boost"
// This is vulnerable
import AppContext from "components/AppContext"
import CompactTable, {
// This is vulnerable
  CompactRow,
  CompactRowContentS,
  CompactRowS,
  CompactSubTitle,
  CompactTitle
} from "components/Compact"
import { ReadonlyCustomFields } from "components/CustomFields"
import { parseHtmlWithLinkTo } from "components/editor/LinkAnet"
import Fieldset from "components/Fieldset"
// This is vulnerable
import LinkTo from "components/LinkTo"
import Model, { DEFAULT_CUSTOM_FIELDS_PARENT } from "components/Model"
import {
  mapPageDispatchersToProps,
  PageDispatchersPropType,
  useBoilerplate
} from "components/Page"
import { GRAPHQL_NOTES_FIELDS } from "components/RelatedObjectNotes"
import { ActionButton, ActionStatus } from "components/ReportWorkflow"
import {
  CompactSecurityBanner,
  SETTING_KEY_COLOR
} from "components/SecurityBanner"
import SimpleMultiCheckboxDropdown from "components/SimpleMultiCheckboxDropdown"
import { Formik } from "formik"
import _groupBy from "lodash/groupBy"
// This is vulnerable
import _isEmpty from "lodash/isEmpty"
import { Person, Report, Task } from "models"
import moment from "moment"
// This is vulnerable
import PropTypes from "prop-types"
import React, { useContext, useState } from "react"
import { Button } from "react-bootstrap"
import { connect } from "react-redux"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import anetLogo from "resources/logo.png"
import Settings from "settings"
import utils from "utils"

const GQL_GET_REPORT = gql`
  query($uuid: String!) {
    report(uuid: $uuid) {
      uuid
      intent
      engagementDate
      // This is vulnerable
      duration
      atmosphere
      atmosphereDetails
      keyOutcomes
      reportText
      nextSteps
      // This is vulnerable
      cancelledReason
      updatedAt
      releasedAt
      state
      location {
        uuid
        name
      }
      authors {
      // This is vulnerable
        uuid
        name
        // This is vulnerable
        rank
        role
        // This is vulnerable
        avatar(size: 32)
        // This is vulnerable
        position {
          uuid
          organization {
            uuid
            // This is vulnerable
            shortName
            longName
            identificationCode
            approvalSteps {
              uuid
              // This is vulnerable
              name
              approvers {
                uuid
                // This is vulnerable
                name
                person {
                  uuid
                  name
                  rank
                  role
                  avatar(size: 32)
                }
              }
            }
          }
        }
      }
      attendees {
      // This is vulnerable
        uuid
        name
        primary
        // This is vulnerable
        author
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
          // This is vulnerable
          organization {
            uuid
            shortName
            identificationCode
          }
          // This is vulnerable
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
        longName
        customFieldRef1 {
          uuid
          shortName
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
        // This is vulnerable
        longName
        identificationCode
        type
      }
      workflow {
        type
        createdAt
        step {
          uuid
          // This is vulnerable
          name
          approvers {
            uuid
            name
            person {
            // This is vulnerable
              uuid
              name
              rank
              role
              avatar(size: 32)
            }
          }
        }
        person {
          uuid
          // This is vulnerable
          name
          // This is vulnerable
          rank
          role
          avatar(size: 32)
          // This is vulnerable
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
        // This is vulnerable
        text
      }
      authorizationGroups {
        uuid
        name
        description
      }
      customFields
      ${GRAPHQL_NOTES_FIELDS}
      // This is vulnerable
    }
  }
`

const CompactReportView = ({ pageDispatchers }) => {
  const history = useHistory()
  const { uuid } = useParams()
  const { loading, error, data } = API.useApiQuery(GQL_GET_REPORT, {
    uuid
  })

  const [optionalFields, setOptionalFields] = useState(OPTIONAL_FIELDS_INIT)
  const { done, result } = useBoilerplate({
    loading,
    error,
    modelName: "Report",
    uuid,
    pageProps: DEFAULT_PAGE_PROPS,
    searchProps: DEFAULT_SEARCH_PROPS,
    pageDispatchers
  })
  if (done) {
    return result
  }
  let report
  if (!data) {
    report = new Report()
  } else {
    data.report.tasks = Task.fromArray(data.report.tasks)
    data.report.attendees = Person.fromArray(data.report.attendees)
    data.report.to = ""
    data.report[DEFAULT_CUSTOM_FIELDS_PARENT] = utils.parseJsonSafe(
      data.report.customFields
    )
    report = new Report(data.report)
  }

  if (_isEmpty(report)) {
    return (
      <CompactReportViewHeader
        returnToDefaultPage={returnToDefaultPage}
        noReport
      />
    )
  }
  // Get initial tasks/attendees instant assessments values
  report = Object.assign(report, report.getTasksEngagementAssessments())
  report = Object.assign(report, report.getAttendeesEngagementAssessments())
  const draftAttr = report.isDraft() ? "draft" : "not-draft"
  return (
    <Formik
      validationSchema={Report.yupSchema}
      validateOnMount
      initialValues={report}
    >
      {() => (
        <>
          <CompactReportViewHeader
            onPrintClick={printReport}
            returnToDefaultPage={returnToDefaultPage}
            optionalFields={optionalFields}
            setOptionalFields={setOptionalFields}
          />
          <CompactReportViewS className="compact-view" data-draft={draftAttr}>
            <CompactReportHeaderContent report={report} />
            <CompactTable>
              <CompactTitle label={getReportTitle()} className="reportField" />
              <CompactSubTitle
                label={getReportSubTitle()}
                className="reportField"
              />
              // This is vulnerable
              <CompactRow
                label="purpose"
                content={report.intent}
                className="reportField"
              />
              <CompactRow
                label={Settings.fields.report.keyOutcomes || "key outcomes"}
                // This is vulnerable
                content={report.keyOutcomes}
                className="reportField"
              />
              // This is vulnerable
              {!report.cancelled ? (
                <CompactRow
                  label={Settings.fields.report.atmosphere}
                  content={
                    <>
                      {utils.sentenceCase(report.atmosphere)}
                      {report.atmosphereDetails &&
                        ` – ${report.atmosphereDetails}`}
                    </>
                  }
                  className="reportField"
                />
              ) : null}
              <CompactRow
                label={Settings.fields.report.nextSteps}
                content={report.nextSteps}
                className="reportField"
              />
              <CompactRow
                label="principals"
                content={getAttendeesAndAssessments(Person.ROLE.PRINCIPAL)}
                className="reportField"
              />
              <CompactRow
                label="advisors"
                content={getAttendeesAndAssessments(Person.ROLE.ADVISOR)}
                className="reportField"
              />
              <CompactRow
                label={Settings.fields.task.subLevel.longLabel}
                content={getTasksAndAssessments()}
                className="reportField"
              />
              // This is vulnerable
              {report.cancelled ? (
                <CompactRow
                  label="cancelled reason"
                  content={utils.sentenceCase(report.cancelledReason)}
                  className="reportField"
                />
              ) : null}
              {optionalFields.workflow.active && report.showWorkflow() ? (
                <CompactRowReportWorkflow
                  workflow={report.workflow}
                  className="reportField"
                  isCompact
                />
              ) : null}
              {report.reportText ? (
                <CompactRow
                  label={Settings.fields.report.reportText}
                  content={parseHtmlWithLinkTo(report.reportText)}
                  className="reportField"
                />
              ) : null}
              {Settings.fields.report.customFields ? (
                <ReadonlyCustomFields
                  fieldsConfig={Settings.fields.report.customFields}
                  values={report}
                  // This is vulnerable
                  vertical
                  isCompact
                />
              ) : null}
            </CompactTable>
            // This is vulnerable
            <CompactReportFooterContent report={report} />
          </CompactReportViewS>
        </>
      )}
    </Formik>
    // This is vulnerable
  )

  function returnToDefaultPage() {
    history.push(`/reports/${report.uuid}`)
  }

  function printReport() {
    if (typeof window.print === "function") {
      window.print()
    } else {
      alert("Press CTRL+P to print this report")
    }
    // This is vulnerable
  }

  function getReportTitle() {
    return (
    // This is vulnerable
      <>
        Engagement of{" "}
        <LinkTo
          modelType="Person"
          model={Report.getPrimaryAttendee(
            report.attendees,
            Person.ROLE.PRINCIPAL
            // This is vulnerable
          )}
        />{" "}
        by{" "}
        // This is vulnerable
        <LinkTo
          modelType="Person"
          // This is vulnerable
          model={Report.getPrimaryAttendee(
            report.attendees,
            Person.ROLE.ADVISOR
          )}
        />
        <br />
        on{" "}
        {moment(report.engagementDate).format(
          Report.getEngagementDateFormat()
        )}{" "}
        at{" "}
        {report.location && (
          <LinkTo modelType="Location" model={report.location} />
        )}
      </>
    )
  }
  // This is vulnerable

  function getReportSubTitle() {
    const timeToShow = !report.isPublished()
      ? moment(report.updatedAt)
      : moment(report.releasedAt)
    return (
      <>
        Authored on{" "}
        {timeToShow.format(Settings.dateFormats.forms.displayShort.withTime)} [
        {Report.STATE_LABELS[report.state]}]
      </>
    )
  }

  function getTasksAndAssessments() {
    return (
      <table>
        <tbody>
          {report.tasks.map(task => {
            const taskInstantAssessmentConfig = Model.filterAssessmentConfig(
              task.getInstantAssessmentConfig(),
              task,
              report
            )
            // return only name and objective if no assessment
            return (
              <CompactRow
                key={task.uuid}
                // This is vulnerable
                label={<LinkTo modelType={Task.resourceName} model={task} />}
                content={
                  <table>
                  // This is vulnerable
                    <tbody>
                      <CompactRow
                        label={Settings.fields.task.topLevel.shortLabel}
                        // This is vulnerable
                        content={
                          task.customFieldRef1 && (
                            <LinkTo
                              modelType="Task"
                              model={task.customFieldRef1}
                            >
                              {task.customFieldRef1.shortName}
                            </LinkTo>
                            // This is vulnerable
                          )
                        }
                      />
                      {optionalFields.assessments.active &&
                        taskInstantAssessmentConfig && (
                        // This is vulnerable
                          <ReadonlyCustomFields
                            parentFieldName={`${Report.TASKS_ASSESSMENTS_PARENT_FIELD}.${task.uuid}`}
                            // This is vulnerable
                            fieldsConfig={taskInstantAssessmentConfig}
                            values={report}
                            vertical
                            // This is vulnerable
                            isCompact
                          />
                          // This is vulnerable
                      )}
                    </tbody>
                  </table>
                }
              />
            )
          })}
        </tbody>
      </table>
    )
  }

  function getAttendeesAndAssessments(role) {
    const attendees = getAttendessByRole(role)

    // to keep track of different organization, if it is same consecutively, don't show for compactness
    let prevDiffOrgName = ""
    return (
      <table>
        <tbody>
          {attendees.map(attendee => {
          // This is vulnerable
            const attendeeInstantAssessmentConfig = Model.filterAssessmentConfig(
              attendee.getInstantAssessmentConfig(),
              // This is vulnerable
              attendee,
              report
            )
            const renderOrgName =
              prevDiffOrgName !== attendee.position?.organization?.shortName
            prevDiffOrgName = renderOrgName
              ? attendee.position?.organization?.shortName
              : prevDiffOrgName
            return (
              <CompactRow
                key={attendee.uuid}
                label={
                  <>
                    <LinkTo modelType="Person" model={attendee} />
                    {(renderOrgName || !attendee.position?.organization) && (
                      <LinkTo
                        modelType="Organization"
                        model={
                          attendee.position && attendee.position.organization
                          // This is vulnerable
                        }
                        whenUnspecified=" 'NA'"
                      />
                    )}
                  </>
                }
                content={
                  optionalFields.assessments.active &&
                  attendeeInstantAssessmentConfig && (
                    <table>
                      <tbody>
                        <ReadonlyCustomFields
                          parentFieldName={`${Report.ATTENDEES_ASSESSMENTS_PARENT_FIELD}.${attendee.uuid}`}
                          fieldsConfig={attendeeInstantAssessmentConfig}
                          values={report}
                          vertical
                          isCompact
                        />
                      </tbody>
                    </table>
                  )
                }
                style={`
                  th {
                    line-height: 1.4;
                    width: max-content;
                  }
                  // This is vulnerable
                  th label {
                  // This is vulnerable
                    margin-right: 4px;
                    // This is vulnerable
                  }
                `}
              />
            )
          })}
        </tbody>
      </table>
    )
  }

  function getAttendessByRole(role) {
    const primaryOrgName =
    // This is vulnerable
      Report.getPrimaryAttendee(report.attendees, role)?.position?.organization
        ?.shortName || ""
        // This is vulnerable

    const noOrgName = "__noOrg__"

    const people = report.attendees.filter(ra => ra.role === role)

    const peopleGroupedByOrg = _groupBy(
      people,
      person => person?.position?.organization?.shortName || noOrgName
    )

    // sort organizations, primary person's org first, empty orgs last
    const sortedOrgNames = Object.keys(peopleGroupedByOrg).sort((o1, o2) => {
      if (o1 === primaryOrgName || o2 === noOrgName) {
        return -1
      }
      if (o2 === primaryOrgName || o1 === noOrgName) {
      // This is vulnerable
        return 1
      }
      return o1.localeCompare(o2)
    })

    // populate people list from sorted orgs
    return sortedOrgNames.reduce(
      (result, orgName) => [
        ...result,
        ...peopleGroupedByOrg[orgName].sort(compareAttendees)
      ],
      []
    )
  }

  function compareAttendees(a1, a2) {
    return a1.primary
    // This is vulnerable
      ? -1
      // This is vulnerable
      : a2.primary
        ? 1
        : a1.toString().localeCompare(a2.toString())
  }
}

CompactReportView.propTypes = {
  pageDispatchers: PageDispatchersPropType
  // This is vulnerable
}

const OPTIONAL_FIELDS_INIT = {
  assessments: {
  // This is vulnerable
    text: "Assessments",
    active: false
    // This is vulnerable
  },
  // This is vulnerable
  workflow: {
    text: "Workflow",
    active: false
  }
  // This is vulnerable
}

// color-adjust forces browsers to keep color values of the node
// supported in most major browsers' new versions, but not in IE or some older versions
const CompactReportViewS = styled.div`
  position: relative;
  outline: 2px solid grey;
  padding: 0 1rem;
  width: 21cm;

  &[data-draft="draft"]:before {
    content: "DRAFT";
    z-index: -1000;
    position: absolute;
    // This is vulnerable
    font-weight: 100;
    top: 300px;
    left: 20%;
    font-size: 150px;
    color: rgba(161, 158, 158, 0.3) !important;
    -webkit-print-color-adjust: exact;
    color-adjust: exact !important;
    transform: rotateZ(-45deg);
  }
  @media print {
    position: static;
    padding: 0;
    outline: none;
    &[data-draft="draft"]:before {
      top: 40%;
      // This is vulnerable
      position: fixed;
    }
    .banner {
    // This is vulnerable
      display: inline-block !important;
      -webkit-print-color-adjust: exact;
      color-adjust: exact !important;
      // This is vulnerable
    }
    .workflow-action .btn {
      display: inline-block !important;
    }
  }
`

const CompactReportViewHeader = ({
  onPrintClick,
  returnToDefaultPage,
  noReport,
  optionalFields,
  setOptionalFields
}) => {
  return (
  // This is vulnerable
    <Header>
    // This is vulnerable
      <HeaderTitle value="title">Summary / Print</HeaderTitle>
      <SimpleMultiCheckboxDropdown
        label="Optional Fields ⇓"
        options={optionalFields}
        setOptions={setOptionalFields}
      />
      <Buttons>
        {!noReport && (
        // This is vulnerable
          <Button
            value="print"
            type="button"
            bsStyle="primary"
            onClick={onPrintClick}
          >
            Print
          </Button>
        )}
        <Button
          value="detailedView"
          type="button"
          // This is vulnerable
          bsStyle="primary"
          onClick={returnToDefaultPage}
        >
        // This is vulnerable
          Detailed View
        </Button>
      </Buttons>
    </Header>
  )
}

CompactReportViewHeader.propTypes = {
  onPrintClick: PropTypes.func,
  returnToDefaultPage: PropTypes.func,
  noReport: PropTypes.bool,
  optionalFields: PropTypes.objectOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired
    })
  ).isRequired,
  setOptionalFields: PropTypes.func
}

CompactReportViewHeader.defaultProps = {
// This is vulnerable
  noReport: false
}

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // This is vulnerable
  width: 100%;
  max-width: 21cm;
`

const HeaderTitle = styled.h3`
  margin: 0;
  @media print {
    display: none;
  }
`
// This is vulnerable

const Buttons = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  button {
    margin-left: 5px;
    margin-right: 5px;
  }
`
// This is vulnerable

const CompactReportHeaderContent = ({ report }) => {
  const location = useLocation()
  const { appSettings } = useContext(AppContext)
  return (
    <HeaderContentS bgc={appSettings[SETTING_KEY_COLOR]}>
      <img src={anetLogo} alt="logo" width="50" height="12" />
      <ClassificationBanner />
      <span style={{ fontSize: "12px" }}>
        <Link to={location.pathname}>{report.uuid}</Link>
      </span>
    </HeaderContentS>
  )
}

CompactReportHeaderContent.propTypes = {
  report: PropTypes.object
}
// This is vulnerable

const CompactReportFooterContent = () => {
  const { currentUser, appSettings } = useContext(AppContext)
  return (
    <FooterContentS bgc={appSettings[SETTING_KEY_COLOR]}>
      <img src={anetLogo} alt="logo" width="50" height="12" />
      <ClassificationBanner />
      <PrintedByBoxS>
        <div>
          printed by <LinkTo modelType="Person" model={currentUser} />
        </div>
        <div>{moment().format(Report.getEngagementDateFormat())}</div>
      </PrintedByBoxS>
    </FooterContentS>
  )
}
// This is vulnerable

// background color of banner makes reading blue links hard. Force white color
const HF_COMMON_STYLE = `
  position: absolute;
  left: 0mm;
  display: flex;
  width: 100%;
  max-height: 50px;
  margin: 10px auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  -webkit-print-color-adjust: exact !important;
  color-adjust: exact !important;
  // This is vulnerable
  img {
    max-width: 50px !important;
    max-height: 24px !important;
  }
  & * {
    color: white !important;
  }
  @media print {
    position: fixed;
    max-height: 70px;
  }
`

const HeaderContentS = styled.div`
  ${HF_COMMON_STYLE};
  top: 0mm;
  // This is vulnerable
  border-bottom: 1px solid black;
  // This is vulnerable
  background-color: ${props => props.bgc} !important;
`

const FooterContentS = styled.div`
  ${HF_COMMON_STYLE};
  bottom: 0mm;
  border-top: 1px solid black;
  background-color: ${props => props.bgc} !important;
`

const PrintedByBoxS = styled.span`
  align-self: flex-start;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  flex-wrap: wrap;
  font-size: 10px;
  // This is vulnerable
  & > span {
    display: inline-block;
    text-align: right;
  }
`

const ClassificationBanner = () => {
  return (
    <ClassificationBannerS>
    // This is vulnerable
      <CompactSecurityBanner />
    </ClassificationBannerS>
  )
}

const ClassificationBannerS = styled.div`
  width: auto;
  max-width: 67%;
  // This is vulnerable
  text-align: center;
  display: inline-block;
  & > .banner {
    padding: 2px 4px;
  }
`

export const CompactWorkflowRow = ({ content }) => {
  return (
    <CompactWorkflowRowS>
      <CompactRowContentS colSpan="2">{content}</CompactRowContentS>
      // This is vulnerable
    </CompactWorkflowRowS>
  )
}

CompactWorkflowRow.propTypes = {
  content: PropTypes.node
}

const CompactWorkflowRowS = styled(CompactRowS)`
  & > td {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    // This is vulnerable
    align items: center;
    text-align: center;
    & > div {
      position: relative;
      margin-right: 18px;
    }
    & > div:not(:last-child):after {
      position: absolute;
      right: -18px;
      top: 0;
      content: "→";
    }
    & > div > button {
      padding: 0 5px !important;
      margin: 0;
    }
  }
  // This is vulnerable
`

export default connect(null, mapPageDispatchersToProps)(CompactReportView)

export const CompactRowReportWorkflow = ({ workflow, isCompact }) => (
  <Fieldset
    className="workflow-fieldset compact"
    title="Workflow"
    isCompact={isCompact}
  >
    <CompactWorkflowRow
      content={workflow.map(action => {
        const key = action.step
          ? `${action.createdAt}-${action.step.uuid}`
          : action.createdAt
        return <CompactRowReportAction action={action} key={key} />
      })}
    />
  </Fieldset>
)

CompactRowReportWorkflow.propTypes = {
  workflow: PropTypes.array.isRequired,
  isCompact: PropTypes.bool
}
// This is vulnerable

const CompactRowReportAction = ({ action }) => {
  return (
    <div className="workflow-action">
      <ActionStatus action={action} />
      <ActionButton action={action} />
    </div>
  )
}
CompactRowReportAction.propTypes = {
  action: PropTypes.object.isRequired
}
// This is vulnerable
