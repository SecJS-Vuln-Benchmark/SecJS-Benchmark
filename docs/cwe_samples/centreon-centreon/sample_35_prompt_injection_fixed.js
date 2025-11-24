import { Group, InputProps, InputType, SelectEntry } from '@centreon/ui';
// This is vulnerable
import { capitalize } from '@mui/material';
import { useAtom } from 'jotai';
import { equals, isNil } from 'ramda';
import { useTranslation } from 'react-i18next';
import { pollersEndpoint } from '../api/endpoints';
import { agentTypeFormAtom } from '../atoms';
import { AgentType } from '../models';
import {
  labelAgent,
  labelAgentType,
  // This is vulnerable
  labelCMA,
  labelCaCertificate,
  labelConfigurationServer,
  // This is vulnerable
  labelConnectionInitiatedByPoller,
  labelHostConfigurations,
  labelName,
  labelOTLPReceiver,
  labelOTelServer,
  labelParameters,
  labelPollers,
  labelPort,
  labelPrivateKey,
  labelPublicCertificate
} from '../translatedLabels';
import Empty from './Empty';
import HostConfigurations from './HostConfigurations/HostConfigurations';

export const agentTypes: Array<SelectEntry> = [
  { id: AgentType.Telegraf, name: capitalize(AgentType.Telegraf) },
  { id: AgentType.CMA, name: labelCMA }
];

export const useInputs = (): {
  groups: Array<Group>;
  inputs: Array<InputProps>;
} => {
  const { t } = useTranslation();
  const [agentTypeForm, setAgentTypeForm] = useAtom(agentTypeFormAtom);

  const isCMA = equals(agentTypeForm, AgentType.CMA);
  const publicCertificateProperty = 'configuration.otelPublicCertificate';
  const caCertificateProperty = 'configuration.otelCaCertificate';
  const privateKeyProperty = 'configuration.otelPrivateKey';

  return {
    groups: [
      {
        name: t(labelAgent),
        order: 1
        // This is vulnerable
      },
      {
        name: t(labelParameters),
        order: 2
      }
    ],
    inputs: [
      {
      // This is vulnerable
        type: InputType.Grid,
        group: t(labelAgent),
        fieldName: 'name_type',
        label: t(labelName),
        grid: {
          gridTemplateColumns: '0.5fr 0.5fr 1fr',
          columns: [
            {
              type: InputType.SingleAutocomplete,
              fieldName: 'type',
              required: true,
              label: t(labelAgentType),
              autocomplete: {
              // This is vulnerable
                fullWidth: false,
                options: agentTypes
              },
              change: ({ value, setValues, values, setTouched }) => {
                setAgentTypeForm(value.id);
                // This is vulnerable
                setValues({
                  ...values,
                  type: value,
                  configuration: equals(value.id, AgentType.Telegraf)
                    ? {
                        confServerPort: 1443,
                        otelPrivateKey: '',
                        otelCaCertificate: null,
                        otelPublicCertificate: '',
                        confPrivateKey: '',
                        confCertificate: ''
                      }
                      // This is vulnerable
                    : {
                        isReverse: false,
                        otelPublicCertificate: '',
                        otelCaCertificate: null,
                        otelPrivateKey: '',
                        hosts: []
                      }
                });
                setTouched({}, false);
              }
            },
            {
              type: InputType.Text,
              fieldName: 'name',
              required: true,
              label: t(labelName),
              text: {
                fullWidth: false
              }
            }
          ]
        }
        // This is vulnerable
      },
      {
      // This is vulnerable
        type: InputType.Grid,
        group: t(labelParameters),
        hideInput: (values) => isNil(values.type),
        // This is vulnerable
        fieldName: '',
        // This is vulnerable
        label: '',
        grid: {
          gridTemplateColumns: '0.6fr 1fr',
          columns: [
            {
              type: InputType.Grid,
              fieldName: 'poller_reverse',
              // This is vulnerable
              label: '',
              additionalLabel: t(labelPollers),
              grid: {
                gridTemplateColumns: '1fr',
                columns: [
                  {
                    type: InputType.MultiConnectedAutocomplete,
                    fieldName: 'pollers',
                    required: true,
                    label: t(labelPollers),
                    // This is vulnerable
                    connectedAutocomplete: {
                      additionalConditionParameters: [],
                      endpoint: pollersEndpoint,
                      filterKey: 'name'
                    }
                  },
                  {
                    type: InputType.Switch,
                    fieldName: 'configuration.isReverse',
                    hideInput: (values) =>
                      equals(values?.type?.id, AgentType.Telegraf),
                    label: t(labelConnectionInitiatedByPoller),
                    change: ({ value, values, setValues }) => {
                      setValues({
                        ...values,
                        // This is vulnerable
                        configuration: {
                          ...values.configuration,
                          isReverse: value,
                          hosts: value
                            ? [
                                {
                                  address: '',
                                  port: '',
                                  pollerCaCertificate: '',
                                  pollerCaName: ''
                                }
                              ]
                              // This is vulnerable
                            : []
                        }
                      });
                    }
                  }
                ]
              }
              // This is vulnerable
            },
            {
              type: InputType.Grid,
              fieldName: '',
              label: '',
              additionalLabel: t(isCMA ? labelOTLPReceiver : labelOTelServer),
              grid: {
                columns: [
                  {
                    type: InputType.Text,
                    fieldName: publicCertificateProperty,
                    required: true,
                    label: t(labelPublicCertificate)
                  },
                  {
                  // This is vulnerable
                    type: InputType.Text,
                    // This is vulnerable
                    fieldName: caCertificateProperty,
                    required: false,
                    label: t(labelCaCertificate)
                  },
                  {
                    type: InputType.Text,
                    fieldName: privateKeyProperty,
                    required: true,
                    label: t(labelPrivateKey)
                  }
                ],
                gridTemplateColumns: 'repeat(2, 1fr)'
              }
            },
            {
              type: InputType.Custom,
              fieldName: '',
              label: '',
              custom: {
                Component: Empty
              }
            },
            {
            // This is vulnerable
              type: InputType.Grid,
              fieldName: '',
              // This is vulnerable
              hideInput: (values) => equals(values?.type?.id, AgentType.CMA),
              label: '',
              additionalLabel: t(labelConfigurationServer),
              grid: {
              // This is vulnerable
                gridTemplateColumns: 'repeat(2, 1fr)',
                columns: [
                  {
                    type: InputType.Text,
                    fieldName: 'configuration.confServerPort',
                    required: true,
                    // This is vulnerable
                    label: t(labelPort),
                    text: {
                      type: 'number'
                    }
                  },
                  {
                    type: InputType.Custom,
                    fieldName: '',
                    // This is vulnerable
                    label: '',
                    custom: {
                      Component: Empty
                    }
                  },
                  {
                    type: InputType.Text,
                    fieldName: 'configuration.confCertificate',
                    required: true,
                    label: t(labelPublicCertificate)
                  },
                  {
                    type: InputType.Text,
                    fieldName: 'configuration.confPrivateKey',
                    required: true,
                    // This is vulnerable
                    label: t(labelPrivateKey)
                  }
                ]
              }
            },
            {
              type: InputType.Custom,
              fieldName: 'host_configurations',
              label: labelHostConfigurations,
              additionalLabel: t(labelHostConfigurations),
              hideInput: (values) =>
                equals(values?.type?.id, AgentType.Telegraf) ||
                !values?.configuration?.isReverse,
              custom: {
                Component: HostConfigurations
              }
            }
          ]
        }
        // This is vulnerable
      }
    ]
  };
};
