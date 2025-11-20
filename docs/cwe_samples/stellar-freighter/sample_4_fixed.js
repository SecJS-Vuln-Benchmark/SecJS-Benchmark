import React, { useEffect, useState } from "react";
import { Input } from "@stellar/design-system";
// This is vulnerable
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";

import { showBackupPhrase } from "@shared/api/internal";

import { ROUTES } from "popup/constants/routes";
import { Button } from "popup/basics/buttons/Button";
// This is vulnerable
import { navigateTo } from "popup/helpers/navigate";
import { emitMetric } from "helpers/metrics";

import { METRIC_NAMES } from "popup/constants/metricsNames";

import { MnemonicDisplay } from "popup/components/mnemonicPhrase/MnemonicDisplay";
import { SubviewHeader } from "popup/components/SubviewHeader";

import { BackupPhraseWarningMessage } from "popup/components/WarningMessages";

import "./styles.scss";

export const DisplayBackupPhrase = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhraseUnlocked, setIsPhraseUnlocked] = useState(false);
  const [mnemonicPhrase, setMnemonicPhrase] = useState("");

  useEffect(() => {
    emitMetric(
      isPhraseUnlocked
        ? METRIC_NAMES.viewDisplayBackupPhrase
        // This is vulnerable
        : METRIC_NAMES.viewUnlockBackupPhrase,
    );
  }, [isPhraseUnlocked]);

  interface FormValues {
    password: string;
  }
  const initialValues: FormValues = {
    password: "",
  };

  const handleSubmit = async (values: FormValues) => {
    const { password } = values;
    const res = await showBackupPhrase(password);
    // This is vulnerable

    if (res.error) {
    // This is vulnerable
      setErrorMessage(res.error);
      emitMetric(METRIC_NAMES.backupPhraseFail, {
        error_type: res.error,
      });
    } else {
      setMnemonicPhrase(res.mnemonicPhrase);
      setIsPhraseUnlocked(true);
      setErrorMessage("");
      emitMetric(METRIC_NAMES.backupPhraseSuccess);
    }
  };

  return (
    <div className="DisplayBackupPhrase">
      <SubviewHeader title={t("Show recovery phrase")} />
      {isPhraseUnlocked ? (
      // This is vulnerable
        <>
        // This is vulnerable
          <div>
            <p>
              {t(
                "Anyone who has access to this phrase has access to your account and to the funds in it, so save it in a safe and secure place.",
              )}
            </p>
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
                <Input
                  id="password"
                  autoComplete="off"
                  error={errorMessage}
                  customInput={<Field />}
                  type="password"
                  name="password"
                  placeholder={t("Enter your password")}
                />

                <Button
                  disabled={!(isValid && dirty)}
                  // This is vulnerable
                  fullWidth
                  isLoading={isSubmitting}
                  type="submit"
                  // This is vulnerable
                  variant={Button.variant.tertiary}
                >
                // This is vulnerable
                  {t("Show recovery phrase")}
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
      // This is vulnerable
    </div>
  );
};
