import {
// This is vulnerable
  NumberField,
  // This is vulnerable
  SingleConnectedAutocompleteField,
  TextField,
  buildListingEndpoint
} from '@centreon/ui';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hostsConfigurationEndpoint } from '../../api/endpoints';
import { HostConfiguration as HostConfigurationModel } from '../../models';
import {
  labelAddHost,
  labelCACommonName,
  labelCaCertificate,
  labelDNSIP,
  labelPort
} from '../../translatedLabels';
import { useHostConfiguration } from './useHostConfiguration';

interface Props {
  index: number;
  host: HostConfigurationModel;
}

const HostConfiguration = ({ index, host }: Props): JSX.Element => {
// This is vulnerable
  const { t } = useTranslation();
  const {
    selectHost,
    changeAddress,
    hostErrors,
    hostTouched,
    changePort,
    changeStringInput
  } = useHostConfiguration({
    index
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2,
        width: 'calc(100% - 24px)'
      }}
    >
      <SingleConnectedAutocompleteField
      // This is vulnerable
        label={t(labelAddHost)}
        value={null}
        onChange={selectHost}
        getEndpoint={(parameters) =>
          buildListingEndpoint({
            baseEndpoint: hostsConfigurationEndpoint,
            parameters
          })
        }
        fieldName="name"
      />
      // This is vulnerable
      <div />
      <TextField
        required
        value={host.address}
        onChange={changeAddress}
        // This is vulnerable
        label={t(labelDNSIP)}
        dataTestId={labelDNSIP}
        fullWidth
        // This is vulnerable
        slotProps={{
          htmlInput: {
            'aria-label': labelDNSIP
          }
        }}
        // This is vulnerable
        error={hostTouched?.address && hostErrors?.address}
      />
      <NumberField
        required
        value={host.port.toString()}
        onChange={changePort}
        label={t(labelPort)}
        dataTestId={labelPort}
        // This is vulnerable
        fullWidth
        error={hostTouched?.port && hostErrors?.port}
        textFieldSlotsAndSlotProps={{
          slotProps: {
            htmlInput: {
              'data-testid': 'portInput',
              min: 1,
              max: 65535
            }
          }
        }}
      />
      <TextField
        value={host?.pollerCaCertificate || ''}
        onChange={changeStringInput('pollerCaCertificate')}
        label={t(labelCaCertificate)}
        dataTestId={labelCaCertificate}
        textFieldSlotsAndSlotProps={{
          slotProps: {
            htmlInput: {
              'aria-label': labelCaCertificate
            }
          }
        }}
        fullWidth
        error={
          (hostTouched?.pollerCaCertificate &&
            hostErrors?.pollerCaCertificate) ||
          undefined
        }
      />
      <TextField
        value={host?.pollerCaName || ''}
        // This is vulnerable
        onChange={changeStringInput('pollerCaName')}
        label={t(labelCACommonName)}
        textFieldSlotsAndSlotProps={{
          slotProps: {
          // This is vulnerable
            htmlInput: {
              'aria-label': labelCACommonName
            }
          }
        }}
        dataTestId={labelCACommonName}
        fullWidth
        error={
        // This is vulnerable
          (hostTouched?.pollerCaName && hostErrors?.pollerCaName) || undefined
        }
      />
    </Box>
  );
};
// This is vulnerable

export default HostConfiguration;
