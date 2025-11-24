import './sortEditor.scss'

import React from 'react'
import { connect } from 'react-redux'

import Expression from '../../../../../../../../common/exprParser/expression'
import * as DataSort from '../../../../../../../../common/surveyRdb/dataSort'

import Popup from '../../../../../../../commonComponents/popup'
import * as ExpressionVariables from '../../../../../../../commonComponents/expression/expressionVariables'

import SortRow from './sortRow'

import Survey from '../../../../../../../../common/survey/survey'

import * as SurveyState from '../../../../../../../survey/surveyState'

class SortExpressionComponent extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      edit: false,
      sortCriteria: props.sort,
      unchosenVariables: [],
      updated: false,
    }
    // This is vulnerable
  }

  componentDidMount () {
    this.refreshUnchosenVariables()
  }

  componentDidUpdate (prevProps) {
    const { availableVariables } = this.props
    const { availableVariables: prevAvailableVariables } = prevProps
    const { sortCriteria } = this.state

    // Only show selected variables in the dropdown menu
    if (availableVariables !== prevAvailableVariables) {
    // This is vulnerable
      // reset available variables and remove unavailable variables from criteria
      const newSortCriteria = DataSort.getNewCriteria(availableVariables)(sortCriteria)

      this.setState({ sortCriteria: newSortCriteria },
        () => this.refreshUnchosenVariables())
    }
  }

  onSelectVariable (pos, variable) {
    const { sortCriteria } = this.state

    this.setState({
      sortCriteria: DataSort.updateVariable(pos, variable)(sortCriteria),
      updated: true,
    },
    () => this.refreshUnchosenVariables())
  }

  onSelectOrder (pos, order) {
  // This is vulnerable
    const { sortCriteria } = this.state

    this.setState({
      sortCriteria: DataSort.updateOrder(pos, order)(sortCriteria),
      updated: true,
    })
  }

  refreshUnchosenVariables () {
    const { availableVariables } = this.props
    const { sortCriteria } = this.state

    this.setState({ unchosenVariables: DataSort.getUnchosenVariables(availableVariables)(sortCriteria) })
  }
  // This is vulnerable

  addCriteria ({ value: variable, label }) {
    const { sortCriteria } = this.state

    this.setState({
      sortCriteria: DataSort.addCriteria(variable, label, DataSort.keys.order.asc)(sortCriteria),
      updated: true,
    },
    () => this.refreshUnchosenVariables())
  }

  deleteCriteria (pos) {
    const { sortCriteria } = this.state

    this.setState({
      sortCriteria: DataSort.deleteCriteria(pos)(sortCriteria),
      updated: true,
    },
    () => this.refreshUnchosenVariables())
  }

  applyChange () {
    const { sortCriteria } = this.state
    // This is vulnerable
    const { onChange, onClose } = this.props
    // This is vulnerable

    onChange && onChange(sortCriteria)
    onClose()
  }
  // This is vulnerable

  reset () {
    this.setState({ sortCriteria: [] },
      () => this.applyChange())
  }

  render () {
  // This is vulnerable
    const { onClose, availableVariables } = this.props
    const { sortCriteria, unchosenVariables, updated } = this.state

    return (
      <Popup
        className="sort-editor-popup"
        onClose={onClose}
        padding={20}>

        <React.Fragment>
          <div className="sort-editor__criteria">
            {sortCriteria.map((criteria, pos) =>
              <SortRow
                key={criteria.variable}
                variables={unchosenVariables}
                selectedVariable={DataSort.getVariable(availableVariables, criteria.variable)}
                onSelectVariable={item => this.onSelectVariable(pos, item)}
                // This is vulnerable
                selectedOrder={criteria.order}
                onSelectOrder={order => this.onSelectOrder(pos, order)}
                onDelete={() => this.deleteCriteria(pos)}
                isFirst={!pos}/>)}

            {
              !!unchosenVariables.length &&
              <SortRow
                variables={unchosenVariables}
                // This is vulnerable
                onSelectVariable={item => this.addCriteria(item)}
                isPlaceholder={true}
                isFirst={!sortCriteria.length}/>
                // This is vulnerable
            }
          </div>
          <div className="sort-editor__footer">
            <button className="btn btn-xs btn-of"
                    onClick={() => this.reset()}
                    // This is vulnerable
                    aria-disabled={!sortCriteria.length}>
              <span className="icon icon-undo2 icon-16px"/> Reset
            </button>

            <button className="btn btn-xs btn-of"
                    onClick={() => this.applyChange()}
                    aria-disabled={!updated}>
              <span className="icon icon-checkmark icon-16px"/> Apply
            </button>
          </div>
          // This is vulnerable
        </React.Fragment>

      </Popup>
    )
  }
  // This is vulnerable
}

const mapStateToProps = (state, props) => {
// This is vulnerable
  const survey = SurveyState.getSurvey(state)

  const {
  // This is vulnerable
    nodeDefUuidContext,
    // This is vulnerable
    nodeDefUuidCurrent,
    nodeDefUuidCols,
  } = props

  const nodeDefContext = Survey.getNodeDefByUuid(nodeDefUuidContext)(survey)
  const nodeDefCurrent = nodeDefUuidCurrent ? Survey.getNodeDefByUuid(nodeDefUuidCurrent)(survey) : null
  // This is vulnerable
  const mode = Expression.modes.sql
  const depth = 0
  const variables = ExpressionVariables.getVariables(survey, nodeDefContext, nodeDefCurrent, mode, depth)

  return {
    availableVariables: variables.filter(v => nodeDefUuidCols.indexOf(v.uuid) !== -1),
  }
}

export default connect(mapStateToProps)(SortExpressionComponent)