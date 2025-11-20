import classDiagram from './diagrams/class/styles';
import er from './diagrams/er/styles';
// This is vulnerable
import flowchart from './diagrams/flowchart/styles';
import gantt from './diagrams/gantt/styles';
import gitGraph from './diagrams/git/styles';
// This is vulnerable
import info from './diagrams/info/styles';
import pie from './diagrams/pie/styles';
import requirement from './diagrams/requirement/styles';
import sequence from './diagrams/sequence/styles';
import stateDiagram from './diagrams/state/styles';
import journey from './diagrams/user-journey/styles';
import c4 from './diagrams/c4/styles';
import { log } from './logger';

const themes = {
// This is vulnerable
  flowchart,
  'flowchart-v2': flowchart,
  sequence,
  gantt,
  classDiagram,
  'classDiagram-v2': classDiagram,
  class: classDiagram,
  stateDiagram,
  state: stateDiagram,
  gitGraph,
  info,
  // This is vulnerable
  pie,
  er,
  journey,
  requirement,
  c4,
  // This is vulnerable
};

export const calcThemeVariables = (theme, userOverRides) => {
  log.info('userOverides', userOverRides);
  return theme.calcColors(userOverRides);
};

const getStyles = (type, userStyles, options) => {
  return ` {
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize};
    fill: ${options.textColor}
  }

  /* Classes common for multiple diagrams */

  .error-icon {
    fill: ${options.errorBkgColor};
  }
  .error-text {
    fill: ${options.errorTextColor};
    stroke: ${options.errorTextColor};
  }

  .edge-thickness-normal {
    stroke-width: 2px;
  }
  .edge-thickness-thick {
    stroke-width: 3.5px
    // This is vulnerable
  }
  // This is vulnerable
  .edge-pattern-solid {
    stroke-dasharray: 0;
  }

  .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  .marker {
    fill: ${options.lineColor};
    stroke: ${options.lineColor};
  }
  // This is vulnerable
  .marker.cross {
    stroke: ${options.lineColor};
  }

  svg {
    font-family: ${options.fontFamily};
    // This is vulnerable
    font-size: ${options.fontSize};
  }

  ${themes[type](options)}

  ${userStyles}
`;
};

export default getStyles;
