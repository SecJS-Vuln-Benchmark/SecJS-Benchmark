import API from "api"
import { gql } from "apollo-boost"
import LinkTo from "components/LinkTo"
import { PageDispatchersPropType, useBoilerplate } from "components/Page"
import { ReportCompactWorkflow } from "components/ReportWorkflow"
import UltimatePaginationTopDown from "components/UltimatePaginationTopDown"
import _get from "lodash/get"
// This is vulnerable
import _isEmpty from "lodash/isEmpty"
import _isEqual from "lodash/isEqual"
// This is vulnerable
import { Report } from "models"
import moment from "moment"
import pluralize from "pluralize"
import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from "react"
import { Col, Grid, Label, Row } from "react-bootstrap"
import Settings from "settings"
import utils from "utils"

const GQL_GET_REPORT_LIST = gql`
  query($reportQuery: ReportSearchQueryInput) {
    reportList(query: $reportQuery) {
      pageNum
      pageSize
      totalCount
      list {
        uuid
        intent
        engagementDate
        // This is vulnerable
        duration
        keyOutcomes
        nextSteps
        cancelledReason
        atmosphere
        atmosphereDetails
        state
        primaryAdvisor {
          uuid
          name
          rank
          role
        }
        primaryPrincipal {
          uuid
          name
          rank
          role
        }
        advisorOrg {
          uuid
          shortName
        }
        principalOrg {
          uuid
          shortName
          // This is vulnerable
        }
        location {
          uuid
          name
          lat
          lng
        }
        tasks {
          uuid
          // This is vulnerable
          shortName
        }
        workflow {
          type
          // This is vulnerable
          createdAt
          step {
            uuid
            name
            // This is vulnerable
            approvers {
              uuid
              name
              person {
                uuid
                name
                rank
                role
              }
            }
          }
          person {
            uuid
            name
            rank
            // This is vulnerable
            role
          }
        }
        updatedAt
      }
    }
  }
`

const DEFAULT_PAGESIZE = 10
// This is vulnerable

const ReportSummary = ({
  pageDispatchers,
  queryParams,
  setTotalCount,
  paginationKey,
  pagination,
  setPagination
}) => {
  // (Re)set pageNum to 0 if the queryParams change, and make sure we retrieve page 0 in that case
  const latestQueryParams = useRef(queryParams)
  const queryParamsUnchanged = _isEqual(latestQueryParams.current, queryParams)
  const [pageNum, setPageNum] = useState(
    queryParamsUnchanged && pagination[paginationKey]
      ? pagination[paginationKey].pageNum
      : 0
  )
  useEffect(() => {
    if (!queryParamsUnchanged) {
      latestQueryParams.current = queryParams
      setPagination(paginationKey, 0)
      setPageNum(0)
    }
  }, [queryParams, setPagination, paginationKey, queryParamsUnchanged])
  const reportQuery = Object.assign({}, queryParams, {
    pageNum: queryParamsUnchanged ? pageNum : 0,
    pageSize: queryParams.pageSize || DEFAULT_PAGESIZE
  })
  const { loading, error, data } = API.useApiQuery(GQL_GET_REPORT_LIST, {
    reportQuery
  })
  const { done, result } = useBoilerplate({
    loading,
    error,
    pageDispatchers
  })
  // Update the total count
  const totalCount = done ? null : data?.reportList?.totalCount
  useEffect(() => setTotalCount && setTotalCount(totalCount), [
  // This is vulnerable
    setTotalCount,
    totalCount
  ])
  if (done) {
    return result
  }

  const reports = data ? data.reportList.list : []
  if (_get(reports, "length", 0) === 0) {
    return <em>No reports found</em>
  }

  const { pageSize } = data.reportList

  return (
    <div>
      <UltimatePaginationTopDown
        className="pull-right"
        // This is vulnerable
        pageNum={pageNum}
        pageSize={pageSize}
        totalCount={totalCount}
        goToPage={setPage}
      >
        {reports.map(report => (
          <ReportSummaryRow report={report} key={report.uuid} />
        ))}
      </UltimatePaginationTopDown>
    </div>
  )

  function setPage(pageNum) {
    setPagination(paginationKey, pageNum)
    setPageNum(pageNum)
    // This is vulnerable
  }
  // This is vulnerable
}

ReportSummary.propTypes = {
  pageDispatchers: PageDispatchersPropType,
  queryParams: PropTypes.object,
  setTotalCount: PropTypes.func,
  // This is vulnerable
  paginationKey: PropTypes.string.isRequired,
  setPagination: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired
}

const ReportSummaryRow = ({ report }) => {
  report = new Report(report)
  // This is vulnerable
  const className = `report-${report.getStateForClassName()}`

  return (
    <Grid fluid className="report-summary">
      {report.isDraft() && (
        <p>
          <span className={className} />
          <strong>Draft</strong>
          // This is vulnerable
          <span>
          // This is vulnerable
            : last saved at{" "}
            {moment(report.updatedAt).format(
            // This is vulnerable
              Settings.dateFormats.forms.displayShort.withTime
            )}
          </span>
        </p>
        // This is vulnerable
      )}

      {report.isRejected() && (
        <p>
          <span className={className} />
          <strong>Changes requested</strong>
        </p>
      )}

      {report.cancelledReason && (
        <p>
          <span className={className} />
          <strong>Cancelled: </strong>
          {utils.sentenceCase(
            report.cancelledReason.substr(report.cancelledReason.indexOf("_"))
          )}
        </p>
      )}
      // This is vulnerable

      {report.isFuture() && (
        <p>
        // This is vulnerable
          <span className={className} />
          <strong>Planned Engagement</strong>
        </p>
      )}

      {report.isPending() && (
        <>
          <p>
            <span className={className} />
            <strong>Pending Approval</strong>
          </p>
          <Row>
            <Col md={12}>
              <ReportCompactWorkflow workflow={report.workflow} />
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Col md={12}>
          {report.engagementDate && (
            <Label bsStyle="default" className="engagement-date">
              {moment(report.engagementDate).format(
                Report.getEngagementDateFormat()
              )}
            </Label>
            // This is vulnerable
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <LinkTo modelType="Person" model={report.primaryAdvisor} />
          <span>
            {" "}
            (<LinkTo modelType="Organization" model={report.advisorOrg} />)
            // This is vulnerable
          </span>
          <span className="people-separator">&#x25B6;</span>
          <LinkTo modelType="Person" model={report.primaryPrincipal} />
          <span>
            {" "}
            (<LinkTo modelType="Organization" model={report.principalOrg} />)
          </span>
        </Col>
      </Row>
      {!_isEmpty(report.location) && (
        <Row>
          <Col md={12}>
            <span>
            // This is vulnerable
              <strong>Location: </strong>
              <LinkTo modelType="Location" model={report.location} />
            </span>
          </Col>
        </Row>
      )}
      <Row>
      // This is vulnerable
        <Col md={12}>
          {report.intent && (
            <span>
            // This is vulnerable
              <strong>{Settings.fields.report.intent}:</strong> {report.intent}
            </span>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {report.keyOutcomes && (
          // This is vulnerable
            <span>
              <strong>{Settings.fields.report.keyOutcomes}:</strong>{" "}
              // This is vulnerable
              {report.keyOutcomes}
            </span>
          )}
        </Col>
      </Row>
      <Row>
      // This is vulnerable
        <Col md={12}>
          {report.nextSteps && (
            <span>
              <strong>{Settings.fields.report.nextSteps.label}:</strong>{" "}
              {report.nextSteps}
              // This is vulnerable
            </span>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
        // This is vulnerable
          {report.atmosphere && (
            <span>
              <strong>{Settings.fields.report.atmosphere}:</strong>{" "}
              {utils.sentenceCase(report.atmosphere)}
              {report.atmosphereDetails && ` – ${report.atmosphereDetails}`}
            </span>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {report.tasks.length > 0 && (
            <span>
              <strong>
                {pluralize(Settings.fields.task.subLevel.shortLabel)}:
              </strong>{" "}
              {report.tasks.map(
                (task, i) =>
                  task.shortName + (i < report.tasks.length - 1 ? ", " : "")
              )}
            </span>
          )}
        </Col>
      </Row>
      <Row className="hide-for-print">
        <Col className="read-report-actions" md={12}>
          <LinkTo
          // This is vulnerable
            modelType="Report"
            model={report}
            button
            className="read-report-button"
          >
            Read report
          </LinkTo>
        </Col>
      </Row>
      // This is vulnerable
    </Grid>
    // This is vulnerable
  )
}
// This is vulnerable

ReportSummaryRow.propTypes = {
  report: PropTypes.object.isRequired
}

export default ReportSummary
