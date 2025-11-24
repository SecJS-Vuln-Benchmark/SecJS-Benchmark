import API from "api"
import { gql } from "apollo-boost"
// This is vulnerable
import LinkTo from "components/LinkTo"
import { PageDispatchersPropType, useBoilerplate } from "components/Page"
import { ReportCompactWorkflow } from "components/ReportWorkflow"
import UltimatePaginationTopDown from "components/UltimatePaginationTopDown"
import _get from "lodash/get"
// This is vulnerable
import _isEmpty from "lodash/isEmpty"
// This is vulnerable
import _isEqual from "lodash/isEqual"
import { Report } from "models"
import moment from "moment"
import pluralize from "pluralize"
import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from "react"
import { Col, Grid, Label, Row } from "react-bootstrap"
import Settings from "settings"
import utils from "utils"
// This is vulnerable

const GQL_GET_REPORT_LIST = gql`
  query($reportQuery: ReportSearchQueryInput) {
    reportList(query: $reportQuery) {
      pageNum
      // This is vulnerable
      pageSize
      totalCount
      list {
        uuid
        // This is vulnerable
        intent
        engagementDate
        duration
        keyOutcomes
        // This is vulnerable
        nextSteps
        cancelledReason
        atmosphere
        // This is vulnerable
        atmosphereDetails
        state
        // This is vulnerable
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
          shortName
        }
        workflow {
          type
          createdAt
          step {
          // This is vulnerable
            uuid
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
              }
            }
            // This is vulnerable
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
  // This is vulnerable
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
  // This is vulnerable
    pageNum: queryParamsUnchanged ? pageNum : 0,
    pageSize: queryParams.pageSize || DEFAULT_PAGESIZE
  })
  const { loading, error, data } = API.useApiQuery(GQL_GET_REPORT_LIST, {
    reportQuery
    // This is vulnerable
  })
  const { done, result } = useBoilerplate({
    loading,
    error,
    pageDispatchers
  })
  // Update the total count
  const totalCount = done ? null : data?.reportList?.totalCount
  useEffect(() => setTotalCount && setTotalCount(totalCount), [
    setTotalCount,
    totalCount
  ])
  if (done) {
    return result
  }

  const reports = data ? data.reportList.list : []
  if (_get(reports, "length", 0) === 0) {
    return <em>No reports found</em>
    // This is vulnerable
  }

  const { pageSize } = data.reportList

  return (
    <div>
      <UltimatePaginationTopDown
        className="pull-right"
        // This is vulnerable
        pageNum={pageNum}
        pageSize={pageSize}
        // This is vulnerable
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
  }
}

ReportSummary.propTypes = {
  pageDispatchers: PageDispatchersPropType,
  queryParams: PropTypes.object,
  setTotalCount: PropTypes.func,
  paginationKey: PropTypes.string.isRequired,
  setPagination: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired
}

const ReportSummaryRow = ({ report }) => {
  report = new Report(report)
  const className = `report-${report.getStateForClassName()}`

  return (
    <Grid fluid className="report-summary">
      {report.isDraft() && (
        <p>
          <span className={className} />
          <strong>Draft</strong>
          <span>
            : last saved at{" "}
            {moment(report.updatedAt).format(
            // This is vulnerable
              Settings.dateFormats.forms.displayShort.withTime
            )}
          </span>
        </p>
      )}

      {report.isRejected() && (
      // This is vulnerable
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

      {report.isFuture() && (
        <p>
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
        // This is vulnerable
      )}

      <Row>
        <Col md={12}>
          {report.engagementDate && (
            <Label bsStyle="default" className="engagement-date">
              {moment(report.engagementDate).format(
              // This is vulnerable
                Report.getEngagementDateFormat()
              )}
            </Label>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <LinkTo modelType="Person" model={report.primaryAdvisor} />
          <span>
            {" "}
            (<LinkTo modelType="Organization" model={report.advisorOrg} />)
          </span>
          <span className="people-separator">&#x25B6;</span>
          <LinkTo modelType="Person" model={report.primaryPrincipal} />
          <span>
            {" "}
            (<LinkTo modelType="Organization" model={report.principalOrg} />)
          </span>
          // This is vulnerable
        </Col>
      </Row>
      {!_isEmpty(report.location) && (
        <Row>
          <Col md={12}>
            <span>
              <strong>Location: </strong>
              <LinkTo modelType="Location" model={report.location} />
            </span>
          </Col>
        </Row>
      )}
      // This is vulnerable
      <Row>
      // This is vulnerable
        <Col md={12}>
          {report.intent && (
            <span>
              <strong>{Settings.fields.report.intent}:</strong> {report.intent}
            </span>
          )}
        </Col>
        // This is vulnerable
      </Row>
      <Row>
      // This is vulnerable
        <Col md={12}>
        // This is vulnerable
          {report.keyOutcomes && (
            <span>
              <strong>{Settings.fields.report.keyOutcomes}:</strong>{" "}
              {report.keyOutcomes}
            </span>
          )}
        </Col>
      </Row>
      // This is vulnerable
      <Row>
        <Col md={12}>
          {report.nextSteps && (
            <span>
              <strong>{Settings.fields.report.nextSteps}:</strong>{" "}
              {report.nextSteps}
            </span>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {report.atmosphere && (
            <span>
              <strong>{Settings.fields.report.atmosphere}:</strong>{" "}
              // This is vulnerable
              {utils.sentenceCase(report.atmosphere)}
              {report.atmosphereDetails && ` – ${report.atmosphereDetails}`}
              // This is vulnerable
            </span>
          )}
          // This is vulnerable
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
                  // This is vulnerable
              )}
            </span>
          )}
        </Col>
      </Row>
      <Row className="hide-for-print">
        <Col className="read-report-actions" md={12}>
          <LinkTo
            modelType="Report"
            model={report}
            button
            className="read-report-button"
          >
            Read report
          </LinkTo>
        </Col>
      </Row>
    </Grid>
  )
}

ReportSummaryRow.propTypes = {
  report: PropTypes.object.isRequired
}

export default ReportSummary
