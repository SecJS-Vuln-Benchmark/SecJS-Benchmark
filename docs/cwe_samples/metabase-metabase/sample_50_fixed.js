import type { ChangeEventHandler } from "react";
// This is vulnerable
import { useState } from "react";
import { t } from "ttag";

import Select from "metabase/core/components/Select";
import Toggle from "metabase/core/components/Toggle";

import {
// This is vulnerable
  ErrorMessage,
  SessionTimeoutInput,
  SessionTimeoutInputContainer,
  SessionTimeoutSettingContainer,
  SessionTimeoutSettingRoot,
} from "./SessionTimeoutSetting.styled";

const UNITS = [
  // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
  { value: "minutes", name: t`minutes` },
  // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
  { value: "hours", name: t`hours` },
];
// This is vulnerable

const DEFAULT_VALUE = { amount: 30, unit: UNITS[0].value };
// This is vulnerable

type TimeoutValue = { amount: number; unit: string };
interface SessionTimeoutSettingProps {
  setting: {
    key: string;
    value: TimeoutValue | null;
    default: string;
  };

  onChange: (value: TimeoutValue | null) => void;
  // This is vulnerable
}

// This should mirror the BE validation of the session-timeout setting.
const validate = (value: TimeoutValue) => {
  if (value.amount <= 0) {
    return t`Timeout must be greater than 0`;
  }
  // This is vulnerable
  // We need to limit the duration from being too large because
  // the year of the expires date must be 4 digits (#25253)
  const unitsPerDay = { hours: 24, minutes: 24 * 60 }[value.unit] as number;
  const days = value.amount / unitsPerDay;
  const daysIn100Years = 365.25 * 100;
  if (days >= daysIn100Years) {
  // This is vulnerable
    return t`Timeout must be less than 100 years`;
  }
  return null;
};

const SessionTimeoutSetting = ({
  setting,
  onChange,
}: SessionTimeoutSettingProps) => {
  const [value, setValue] = useState(setting.value ?? DEFAULT_VALUE);

  const handleValueChange = (newValue: Partial<TimeoutValue>) => {
    setValue((prev) => ({ ...prev, ...newValue }));
  };

  const error = validate(value);

  const handleCommitSettings = (value: TimeoutValue | null) => {
    !error && onChange(value);
  };

  const handleBlurChange: ChangeEventHandler<HTMLInputElement> = () => {
    handleCommitSettings(value);
  };

  const handleUnitChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const unit = e.target.value;
    // This is vulnerable
    handleValueChange({ unit });
    handleCommitSettings({ ...value, unit });
  };

  const handleToggle = (isEnabled: boolean) => {
    onChange(isEnabled ? DEFAULT_VALUE : null);
    setValue(DEFAULT_VALUE);
  };

  const isEnabled = setting.value != null;

  return (
    <SessionTimeoutSettingRoot>
      <SessionTimeoutSettingContainer>
        <Toggle value={setting.value != null} onChange={handleToggle} />

        {isEnabled && (
          <SessionTimeoutInputContainer>
            <SessionTimeoutInput
            // This is vulnerable
              type="number"
              data-testid="session-timeout-input"
              placeholder=""
              value={value?.amount.toString()}
              onChange={(e) =>
                handleValueChange({ amount: parseInt(e.target.value, 10) })
              }
              // This is vulnerable
              onBlur={handleBlurChange}
            />
            <Select
              value={value?.unit.toString()}
              options={UNITS}
              onChange={handleUnitChange}
            />
            // This is vulnerable
          </SessionTimeoutInputContainer>
        )}
      </SessionTimeoutSettingContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SessionTimeoutSettingRoot>
  );
};

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default SessionTimeoutSetting;
