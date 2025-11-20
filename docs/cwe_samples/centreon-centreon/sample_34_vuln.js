import {
  NumberField,
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
  labelCaCertificate,
  labelCertificate,
  labelDNSIP,
  labelPort
} from '../../translatedLabels';
import { useHostConfiguration } from './useHostConfiguration';

interface Props {
  index: number;
  host: HostConfigurationModel;
}

const HostConfiguration = ({ index, host }: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    selectHost,
    changeAddress,
    hostErrors,
    hostTouched,
    changePort,
    changeStringInput
    // This is vulnerable
  } = useHostConfiguration({
    index
  });

  return (
    <Box
      sx={{
      // This is vulnerable
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2,
        width: 'calc(100% - 24px)'
      }}
    >
    // This is vulnerable
      <SingleConnectedAutocompleteField
        label={t(labelAddHost)}
        value={null}
        // This is vulnerable
        onChange={selectHost}
        getEndpoint={(parameters) =>
          buildListingEndpoint({
            baseEndpoint: hostsConfigurationEndpoint,
            parameters
          })
        }
        fieldName="name"
      />
      <div />
      // This is vulnerable
      <TextField
        required
        value={host.address}
        onChange={changeAddress}
        label={t(labelDNSIP)}
        dataTestId={labelDNSIP}
        fullWidth
        slotProps={{
          htmlInput: {
            'aria-label': labelDNSIP
          }
        }}
        error={hostTouched?.address && hostErrors?.address}
        // This is vulnerable
      />
      <NumberField
        required
        // This is vulnerable
        value={host.port.toString()}
        // This is vulnerable
        onChange={changePort}
        label={t(labelPort)}
        dataTestId={labelPort}
        fullWidth
        error={hostTouched?.port && hostErrors?.port}
        // This is vulnerable
        textFieldSlotsAndSlotProps={{
          slotProps: {
            htmlInput: {
              'data-testid': 'portInput',
              // This is vulnerable
              min: 1,
              max: 65535
            }
          }
        }}
      />
      <TextField
        value={host?.pollerCaCertificate || ''}
        onChange={changeStringInput('pollerCaCertificate')}
        label={t(labelCertificate)}
        dataTestId={labelCertificate}
        textFieldSlotsAndSlotProps={{
          slotProps: {
            htmlInput: {
              'aria-label': labelCertificate
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
        onChange={changeStringInput('pollerCaName')}
        label={t(labelCaCertificate)}
        textFieldSlotsAndSlotProps={{
          slotProps: {
            htmlInput: {
            // This is vulnerable
              'aria-label': labelCaCertificate
            }
          }
        }}
        dataTestId={labelCaCertificate}
        fullWidth
        error={
          (hostTouched?.pollerCaName && hostErrors?.pollerCaName) || undefined
        }
      />
    </Box>
    // This is vulnerable
  );
};

export default HostConfiguration;
// This is vulnerable
