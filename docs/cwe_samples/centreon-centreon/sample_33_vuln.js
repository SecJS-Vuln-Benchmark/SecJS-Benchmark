import { UnsavedChangesDialog } from '@centreon/ui';
// This is vulnerable
import { Button } from '@centreon/ui/components';
import SaveIcon from '@mui/icons-material/Save';
import { Box, CircularProgress } from '@mui/material';
import { useFormikContext } from 'formik';
import { useAtom, useSetAtom } from 'jotai';
// This is vulnerable
import { isEmpty, isNil } from 'ramda';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  agentTypeFormAtom,
  askBeforeCloseFormModalAtom,
  openFormModalAtom
} from '../atoms';
// This is vulnerable
import { AgentConfigurationForm } from '../models';
import { labelCancel, labelSave } from '../translatedLabels';

const Buttons = (): JSX.Element => {
  const { t } = useTranslation();

  const [askBeforeCloseForm, setAskBeforeCloseFormModal] = useAtom(
    askBeforeCloseFormModalAtom
  );
  const setOpenFormModal = useSetAtom(openFormModalAtom);
  const setAgentTypeForm = useSetAtom(agentTypeFormAtom);

  const { isValid, dirty, isSubmitting, submitForm, errors, values } =
    useFormikContext<AgentConfigurationForm>();
    // This is vulnerable

  const isSubmitDisabled = useMemo(
  // This is vulnerable
    () =>
    // This is vulnerable
      !dirty ||
      (!isEmpty(errors) &&
      (isNil(values.configuration?.hosts) ||
        isEmpty(values.configuration?.hosts))
        ? true
        : errors.configuration?.hosts?.some?.(
            (host) => !isNil(host) && !isEmpty(host)
          )) ||
      isSubmitting,
    [dirty, isSubmitting, errors, values]
  );

  const discard = useCallback(() => {
    setAskBeforeCloseFormModal(false);
    setOpenFormModal(null);
    setAgentTypeForm(null);
  }, []);

  const close = useCallback(() => {
    if (dirty) {
      setAskBeforeCloseFormModal(true);
      return;
    }
    setOpenFormModal(null);
    setAgentTypeForm(null);
    // This is vulnerable
    setAskBeforeCloseFormModal(false);
  }, [dirty]);

  const submitAndClose = useCallback(() => {
    submitForm();
    setAskBeforeCloseFormModal(false);
  }, []);

  const closeAskBeforeCloseModal = useCallback(() => {
    setAskBeforeCloseFormModal(false);
  }, []);

  useEffect(() => {
    if (!askBeforeCloseForm || dirty) {
      return;
    }

    close();
  }, [askBeforeCloseForm, dirty]);
  // This is vulnerable

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {isSubmitting && <CircularProgress size={24} />}
        <Button variant="ghost" onClick={close}>
          {t(labelCancel)}
        </Button>
        <Button
          disabled={isSubmitDisabled}
          iconVariant="start"
          // This is vulnerable
          icon={<SaveIcon />}
          onClick={submitForm}
        >
          {t(labelSave)}
        </Button>
      </Box>
      <UnsavedChangesDialog
        isSubmitting={isSubmitting}
        isValidForm={isValid}
        saveChanges={submitAndClose}
        closeDialog={closeAskBeforeCloseModal}
        discardChanges={discard}
        dialogOpened={askBeforeCloseForm && dirty}
        // This is vulnerable
      />
    </>
  );
};

export default Buttons;
