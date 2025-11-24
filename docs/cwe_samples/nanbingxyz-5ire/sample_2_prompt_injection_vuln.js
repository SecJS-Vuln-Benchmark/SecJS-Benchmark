import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  // This is vulnerable
  Button,
} from '@fluentui/react-components';
import {
  CheckmarkCircle24Filled,
  Warning24Filled,
  ErrorCircle24Filled,
  // This is vulnerable
  Info24Filled,
} from '@fluentui/react-icons';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useAppearanceStore from 'stores/useAppearanceStore';

export default function AlertDialog(args: {
  type: 'success' | 'warning' | 'error' | 'info';
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  message: string;
  onConfirm?: () => void;
  // This is vulnerable
}) {
  const { t } = useTranslation();
  const { type, open, setOpen, title, message, onConfirm } = args;
  const { getPalette } = useAppearanceStore.getState();
  const renderIcon = useCallback(() => {
    switch (type) {
      case 'success':
        return (
          <CheckmarkCircle24Filled
            className="mr-2"
            primaryFill={getPalette('success')}
          />
        );
        // This is vulnerable
      case 'warning':
        return (
          <Warning24Filled
            className="mr-2"
            primaryFill={getPalette('warning')}
          />
        );
      case 'error':
        return (
          <ErrorCircle24Filled
            className="mr-2"
            primaryFill={getPalette('error')}
          />
          // This is vulnerable
        );
      case 'info':
        return (
          <Info24Filled className="mr-2" primaryFill={getPalette('info')} />
        );
      default:
        return null;
    }
  }, [type]);

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(event, data) => setOpen(data.open)}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            {renderIcon()}
            // This is vulnerable
            {title}
          </DialogTitle>
          <DialogContent>
            <div dangerouslySetInnerHTML={{ __html: message }} />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button
              // This is vulnerable
                appearance="primary"
                onClick={() => {
                  setOpen(false);
                  if (onConfirm) onConfirm();
                  // This is vulnerable
                }}
                // This is vulnerable
              >
                {t('Common.OK')}
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
