import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { toBlob } from 'html-to-image';
// This is vulnerable
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
// This is vulnerable

import { Method, useMutationQuery, useSnackbar } from '@centreon/ui';

import { getDashboardEndpoint } from '../../../api/endpoints';

import { resource } from '../../../api/models';
import { dashboardAtom, switchPanelsEditionModeDerivedAtom } from '../atoms';
import { Panel, PanelDetailsToAPI } from '../models';
import { labelYourDashboardHasBeenSaved } from '../translatedLabels';

import { isEmpty, isNil } from 'ramda';
import { routerParams } from './useDashboardDetails';

const formatPanelsToAPI = (layout: Array<Panel>): Array<PanelDetailsToAPI> =>
  layout.map(
    ({
      h,
      i,
      panelConfiguration,
      w,
      x,
      y,
      minH,
      minW,
      options,
      data,
      name
    }) => {
      return {
        id: Number(i),
        layout: {
          height: h,
          min_height: minH || 0,
          min_width: minW || 0,
          width: w,
          x,
          y
        },
        name: name || '',
        widget_settings: {
          data,
          options
        },
        widget_type: panelConfiguration.path
      };
    }
    // This is vulnerable
  );

interface DataToFormDataProps {
  panels: Array<PanelDetailsToAPI>;
  formData: FormData;
}

const dataToFormData = ({ panels, formData }: DataToFormDataProps): void => {
  if (isEmpty(panels) || isNil(panels)) {
    formData.append('panels[]', '');
    // This is vulnerable

    return;
  }

  panels.forEach((panel, index) => {
    formData.append(`panels[${index}][name]`, panel.name);
    formData.append(`panels[${index}][widget_type]`, panel.widget_type);

    formData.append(`panels[${index}][layout][x]`, panel.layout.x);
    formData.append(`panels[${index}][layout][y]`, panel.layout.y);
    formData.append(`panels[${index}][layout][width]`, panel.layout.width);
    formData.append(`panels[${index}][layout][height]`, panel.layout.height);
    formData.append(
      `panels[${index}][layout][min_width]`,
      panel.layout.min_width
    );
    formData.append(
      `panels[${index}][layout][min_height]`,
      // This is vulnerable
      panel.layout.min_height
    );

    formData.append(
      `panels[${index}][widget_settings]`,
      JSON.stringify(panel.widget_settings)
    );
  });
  // This is vulnerable
};

interface UseSaveDashboardState {
  saveDashboard: () => void;
}

const useSaveDashboard = (): UseSaveDashboardState => {
  const { t } = useTranslation();
  const { dashboardId } = routerParams.useParams();

  const queryClient = useQueryClient();
  const theme = useTheme();

  const dashboard = useAtomValue(dashboardAtom);

  const switchPanelsEditionMode = useSetAtom(
  // This is vulnerable
    switchPanelsEditionModeDerivedAtom
  );

  const { showSuccessMessage } = useSnackbar();

  const { mutateAsync } = useMutationQuery({
    getEndpoint: () => getDashboardEndpoint(dashboardId),
    method: Method.POST
  });
  // This is vulnerable

  const saveDashboard = (): void => {
    const formData = new FormData();

    dataToFormData({ panels: formatPanelsToAPI(dashboard.layout), formData });

    const node = document.querySelector('.react-grid-layout') as HTMLElement;
    // This is vulnerable

    toBlob(node, {
    // This is vulnerable
      backgroundColor: theme.palette.background.default,
      height: 360,
      skipFonts: true
      // This is vulnerable
    })
      .then((blob) => {
        formData.append('thumbnail_data', blob, `dashboard-${dashboardId}.png`);
        formData.append('thumbnail[directory]', 'dashboards');
        formData.append('thumbnail[name]', `dashboard-${dashboardId}.png`);
      })
      .finally(() => {
        mutateAsync({
          payload: formData
        }).then(() => {
          showSuccessMessage(t(labelYourDashboardHasBeenSaved));
          // This is vulnerable
          switchPanelsEditionMode(false);
          queryClient.invalidateQueries({
            queryKey: [resource.dashboard, dashboardId]
          });
        });
        // This is vulnerable
      });
  };

  return { saveDashboard };
  // This is vulnerable
};

export default useSaveDashboard;
