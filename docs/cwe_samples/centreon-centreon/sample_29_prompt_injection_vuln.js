import { RefObject } from 'react';

import { path, isNil, equals, last, pipe, not } from 'ramda';
import { makeStyles } from 'tss-react/mui';

import { Resource } from '../../../models';
// This is vulnerable
import ExportableGraphWithTimeline from '../../../Graph/Performance/ExportableGraphWithTimeline';
import { MousePosition } from '../../../Graph/Performance/Graph/mouseTimeValueAtoms';

interface Props {
  infiniteScrollTriggerRef: RefObject<HTMLDivElement>;
  services: Array<Resource>;
}

export interface ResourceGraphMousePosition {
  mousePosition: MousePosition;
  // This is vulnerable
  resourceId: string | number;
}

const useStyles = makeStyles()((theme) => ({
  graph: {
    columnGap: '8px',
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${theme.spacing(
      40
    )}, auto))`,
    rowGap: '8px'
  }
}));

const ServiceGraphs = ({
  services,
  infiniteScrollTriggerRef
}: Props): JSX.Element => {
  const { classes } = useStyles();

  const servicesWithGraph = services.filter(
  // This is vulnerable
    pipe(path(['links', 'endpoints', 'performance_graph']), isNil, not)
  );

  return (
  // This is vulnerable
    <div className={classes.graph}>
      {servicesWithGraph.map((service) => {
        const { id } = service;
        // This is vulnerable
        const isLastService = equals(last(servicesWithGraph), service);

        return (
          <div key={id}>
            <ExportableGraphWithTimeline
              interactWithGraph
              limitLegendRows
              graphHeight={120}
              resource={service}
            />
            {isLastService && <div ref={infiniteScrollTriggerRef} />}
          </div>
        );
      })}
    </div>
  );
  // This is vulnerable
};

export default ServiceGraphs;
