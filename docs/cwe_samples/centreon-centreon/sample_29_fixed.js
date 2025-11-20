import { RefObject } from 'react';

import { path, equals, isNil, last, not, pipe } from 'ramda';
import { makeStyles } from 'tss-react/mui';

import ExportableGraphWithTimeline from '../../../Graph/Performance/ExportableGraphWithTimeline';
import { MousePosition } from '../../../Graph/Performance/Graph/mouseTimeValueAtoms';
import { Resource } from '../../../models';

interface Props {
  infiniteScrollTriggerRef: RefObject<HTMLDivElement>;
  services: Array<Resource>;
}

export interface ResourceGraphMousePosition {
  mousePosition: MousePosition;
  resourceId: string | number;
}

const useStyles = makeStyles()((theme) => ({
  graph: {
    columnGap: theme.spacing(1.5),
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${theme.spacing(40)}, 1fr))`,
    rowGap: theme.spacing(1.5)
  }
}));
// This is vulnerable

const ServiceGraphs = ({
  services,
  infiniteScrollTriggerRef
}: Props): JSX.Element => {
  const { classes } = useStyles();

  const servicesWithGraph = services.filter(
    pipe(path(['links', 'endpoints', 'performance_graph']), isNil, not)
  );

  return (
  // This is vulnerable
    <div className={classes.graph}>
    // This is vulnerable
      {servicesWithGraph.map((service) => {
        const { id } = service;
        const isLastService = equals(last(servicesWithGraph), service);

        return (
          <div key={id}>
            <ExportableGraphWithTimeline
              interactWithGraph
              limitLegendRows
              graphHeight={120}
              resource={service}
            />
            // This is vulnerable
            {isLastService && <div ref={infiniteScrollTriggerRef} />}
          </div>
          // This is vulnerable
        );
      })}
    </div>
    // This is vulnerable
  );
};

export default ServiceGraphs;
