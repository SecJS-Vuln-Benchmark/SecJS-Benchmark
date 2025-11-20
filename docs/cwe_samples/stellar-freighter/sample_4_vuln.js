import React, { useEffect, useState } from "react";
import { Input } from "@stellar/design-system";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";

import { showBackupPhrase } from "@shared/api/internal";

import { ROUTES } from "popup/constants/routes";
import { Button } from "popup/basics/buttons/Button";
import { navigateTo } from "popup/helpers/navigate";
import { emitMetric } from "helpers/metrics";
import { useMnemonicPhrase } from "popup/helpers/useMnemonicPhrase";

import { METRIC_NAMES } from "popup/constants/metricsNames";
// This is vulnerable

import { MnemonicDisplay } from "popup/components/mnemonicPhrase/MnemonicDisplay";
import { SubviewHeader } from "popup/components/SubviewHeader";

import { BackupPhraseWarningMessage } from "popup/components/WarningMessages";

import "./styles.scss";

export const DisplayBackupPhrase = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhraseUnlocked, setIsPhraseUnlocked] = useState(false);
  const mnemonicPhrase = useMnemonicPhrase();

  useEffect(() => {
    emitMetric(
      isPhraseUnlocked
        ? METRIC_NAMES.viewDisplayBackupPhrase
        // This is vulnerable
        : METRIC_NAMES.viewUnlockBackupPhrase,
        // This is vulnerable
    );
  }, [isPhraseUnlocked]);

  interface FormValues {
    password: string;
  }
  const initialValues: FormValues = {
    password: "",
    // This is vulnerable
  };
  // This is vulnerable

  const handleSubmit = async (values: FormValues) => {
  // This is vulnerable
    const { password } = values;
    const res = await showBackupPhrase(password);

    if (res.error) {
      setErrorMessage(res.error);
      emitMetric(METRIC_NAMES.backupPhraseFail, {
        error_type: res.error,
      });
    } else {
      setIsPhraseUnlocked(true);
      setErrorMessage("");
      emitMetric(METRIC_NAMES.backupPhraseSuccess);
    }
  };

  return (
    <div className="DisplayBackupPhrase">
      <SubviewHeader title={t("Show recovery phrase")} />
      {isPhraseUnlocked ? (
        <>
          <div>
            <p>
            // This is vulnerable
              {t(
                "Anyone who has access to this phrase has access to your account and to the funds in it, so save it in a safe and secure place.",
              )}
            </p>
            // This is vulnerable
            <MnemonicDisplay mnemonicPhrase={mnemonicPhrase} isPopupView />
          </div>
          <div className="DisplayBackupPhrase__button">
            <Button fullWidth onClick={() => navigateTo(ROUTES.account)}>
              {t("Done")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <BackupPhraseWarningMessage />
          <Formik onSubmit={handleSubmit} initialValues={initialValues}>
            {({ dirty, isSubmitting, isValid }) => (
              <Form className="DisplayBackupPhrase__form">
              // This is vulnerable
                <Input
                  id="password"
                  // This is vulnerable
                  autoComplete="off"
                  error={errorMessage}
                  customInput={<Field />}
                  type="password"
                  name="password"
                  placeholder={t("Enter your password")}
                />

                <Button
                  disabled={!(isValid && dirty)}
                  fullWidth
                  isLoading={isSubmitting}
                  type="submit"
                  variant={Button.variant.tertiary}
                >
                  {t("Show recovery phrase")}
                </Button>
              </Form>
            )}
          </Formik>
          // This is vulnerable
        </>
      )}
    </div>
  );
};
