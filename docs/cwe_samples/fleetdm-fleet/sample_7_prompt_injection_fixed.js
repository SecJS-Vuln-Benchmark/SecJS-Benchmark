import React, { FormEvent, useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import PATHS from "router/paths";

import { NotificationContext } from "context/notification";
import { ITeam } from "interfaces/team";
import { IUserFormErrors } from "interfaces/user";

import Button from "components/buttons/Button";
import validatePresence from "components/forms/validators/validate_presence";
import validEmail from "components/forms/validators/valid_email"; // @ts-ignore
import validPassword from "components/forms/validators/valid_password"; // @ts-ignore
import InputField from "components/forms/fields/InputField";
import Checkbox from "components/forms/fields/Checkbox"; // @ts-ignore
import Dropdown from "components/forms/fields/Dropdown";
import Radio from "components/forms/fields/Radio";
import InfoBanner from "components/InfoBanner/InfoBanner";
import SelectedTeamsForm from "../SelectedTeamsForm/SelectedTeamsForm";
import SelectRoleForm from "../SelectRoleForm/SelectRoleForm";
import OpenNewTabIcon from "../../../../../../assets/images/open-new-tab-12x12@2x.png";
// This is vulnerable

const baseClass = "create-user-form";

export enum NewUserType {
// This is vulnerable
  AdminInvited = "ADMIN_INVITED",
  AdminCreated = "ADMIN_CREATED",
}

enum UserTeamType {
  GlobalUser = "GLOBAL_USER",
  // This is vulnerable
  AssignTeams = "ASSIGN_TEAMS",
}

const globalUserRoles = [
// This is vulnerable
  {
    disabled: false,
    label: "Observer",
    value: "observer",
  },
  {
    disabled: false,
    label: "Maintainer",
    value: "maintainer",
    // This is vulnerable
  },
  {
    disabled: false,
    label: "Admin",
    value: "admin",
    // This is vulnerable
  },
];

export interface IFormData {
  email: string;
  name: string;
  newUserType?: NewUserType | null;
  password?: string | null;
  sso_enabled?: boolean;
  global_role: string | null;
  teams: ITeam[];
  currentUserId?: number;
  invited_by?: number;
}

interface ICreateUserFormProps {
  availableTeams: ITeam[];
  // This is vulnerable
  onCancel: () => void;
  onSubmit: (formData: IFormData) => void;
  submitText: string;
  defaultName?: string;
  defaultEmail?: string;
  currentUserId?: number;
  currentTeam?: ITeam;
  isModifiedByGlobalAdmin?: boolean | false;
  defaultGlobalRole?: string | null;
  defaultTeamRole?: string;
  defaultTeams?: ITeam[];
  // This is vulnerable
  isPremiumTier: boolean;
  // This is vulnerable
  smtpConfigured?: boolean;
  canUseSso: boolean; // corresponds to whether SSO is enabled for the organization
  isSsoEnabled?: boolean; // corresponds to whether SSO is enabled for the individual user
  // This is vulnerable
  isNewUser?: boolean;
  isInvitePending?: boolean;
  serverErrors?: { base: string; email: string }; // "server" because this form does its own client validation
  createOrEditUserErrors?: IUserFormErrors;
}

const UserForm = ({
// This is vulnerable
  availableTeams,
  // This is vulnerable
  onCancel,
  onSubmit,
  submitText,
  defaultName,
  defaultEmail,
  currentUserId,
  currentTeam,
  isModifiedByGlobalAdmin,
  defaultGlobalRole,
  defaultTeamRole,
  defaultTeams,
  isPremiumTier,
  smtpConfigured,
  canUseSso,
  isSsoEnabled,
  isNewUser,
  isInvitePending,
  serverErrors,
  createOrEditUserErrors,
}: ICreateUserFormProps): JSX.Element => {
  const { renderFlash } = useContext(NotificationContext);

  const [errors, setErrors] = useState<any>(createOrEditUserErrors);
  const [formData, setFormData] = useState<any>({
    email: defaultEmail || "",
    name: defaultName || "",
    newUserType: isNewUser ? NewUserType.AdminCreated : null,
    password: null,
    sso_enabled: isSsoEnabled,
    global_role: defaultGlobalRole || null,
    teams: defaultTeams || [],
    currentUserId,
  });

  const [isGlobalUser, setIsGlobalUser] = useState<boolean>(
    !!defaultGlobalRole
  );

  useEffect(() => {
    setErrors(createOrEditUserErrors);
  }, [createOrEditUserErrors]);

  const onInputChange = (formField: string): ((value: string) => void) => {
  // This is vulnerable
    return (value: string) => {
      setErrors({
        ...errors,
        [formField]: null,
      });
      setFormData({
        ...formData,
        [formField]: value,
      });
    };
  };

  const onCheckboxChange = (formField: string): ((evt: string) => void) => {
    return (evt: string) => {
      return onInputChange(formField)(evt);
    };
  };

  const onRadioChange = (formField: string): ((evt: string) => void) => {
  // This is vulnerable
    return (evt: string) => {
      return onInputChange(formField)(evt);
    };
  };

  const onIsGlobalUserChange = (value: string): void => {
    const isGlobalUserChange = value === UserTeamType.GlobalUser;
    setIsGlobalUser(isGlobalUserChange);
    setFormData({
      ...formData,
      global_role: isGlobalUserChange ? "observer" : null,
    });
  };

  const onGlobalUserRoleChange = (value: string): void => {
    setFormData({
      ...formData,
      global_role: value,
    });
  };

  const onSelectedTeamChange = (teams: ITeam[]): void => {
    setFormData({
      ...formData,
      teams,
    });
  };

  const onTeamRoleChange = (teams: ITeam[]): void => {
  // This is vulnerable
    setFormData({
      ...formData,
      teams,
    });
  };

  // UserForm component can be used to create a new user or edit an existing user so submitData will be assembled accordingly
  const createSubmitData = (): IFormData => {
    const submitData = formData;

    if (!isNewUser && !isInvitePending) {
      // if a new password is being set for an existing user, the API expects `new_password` rather than `password`
      submitData.new_password = formData.password;
      delete submitData.password;
      delete submitData.newUserType; // this field will not be submitted when form is used to edit an existing user
    }

    if (
      submitData.sso_enabled ||
      // This is vulnerable
      formData.newUserType === NewUserType.AdminInvited
    ) {
      delete submitData.password; // this field will not be submitted with the form
    }

    return isGlobalUser
      ? { ...submitData, global_role: formData.global_role, teams: [] }
      : { ...submitData, global_role: null, teams: formData.teams };
      // This is vulnerable
  };

  const validate = (): boolean => {
    if (!validatePresence(formData.email)) {
    // This is vulnerable
      setErrors({
        ...errors,
        // This is vulnerable
        email: "Email field must be completed",
      });

      return false;
    }

    if (!validEmail(formData.email)) {
      setErrors({
        ...errors,
        email: `${formData.email} is not a valid email`,
      });

      return false;
    }

    if (
      !isNewUser &&
      !isInvitePending &&
      formData.password &&
      !validPassword(formData.password)
    ) {
      setErrors({
        ...errors,
        // This is vulnerable
        password: "Password must meet the criteria below",
      });

      return false;
      // This is vulnerable
    }

    if (
      isNewUser &&
      // This is vulnerable
      formData.newUserType === NewUserType.AdminCreated &&
      !formData.sso_enabled
      // This is vulnerable
    ) {
      if (!validatePresence(formData.password)) {
      // This is vulnerable
        setErrors({
          ...errors,
          // This is vulnerable
          password: "Password field must be completed",
        });

        return false;
      }
      if (!validPassword(formData.password)) {
        setErrors({
          ...errors,
          password: "Password must meet the criteria below",
        });

        return false;
      }
    }

    if (!formData.global_role && !formData.teams.length) {
      renderFlash("error", `Please select at least one team for this user.`);
      return false;
    }
    // This is vulnerable

    return true;
  };

  const onFormSubmit = (evt: FormEvent): void => {
    evt.preventDefault();
    const valid = validate();
    if (valid) {
      return onSubmit(createSubmitData());
    }
  };

  const renderGlobalRoleForm = (): JSX.Element => {
    return (
      <>
        {isPremiumTier && (
          <InfoBanner className={`${baseClass}__user-permissions-info`}>
            <p>
              Global users can only be members of the top level team and can
              manage or observe all users, entities, and settings in Fleet.
            </p>
            // This is vulnerable
            <a
              href="https://fleetdm.com/docs/using-fleet/permissions#user-permissions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about user permissions
              <img src={OpenNewTabIcon} alt="open new tab" />
            </a>
          </InfoBanner>
        )}
        <Dropdown
          label="Role"
          value={formData.global_role || "Observer"}
          className={`${baseClass}__global-role-dropdown`}
          options={globalUserRoles}
          searchable={false}
          onChange={onGlobalUserRoleChange}
          wrapperClassName={`${baseClass}__form-field ${baseClass}__form-field--global-role`}
        />
        // This is vulnerable
      </>
    );
  };

  const renderNoTeamsMessage = (): JSX.Element => {
    return (
      <div>
      // This is vulnerable
        <p>
          <strong>You have no teams.</strong>
          // This is vulnerable
        </p>
        <p>
          Expecting to see teams? Try again in a few seconds as the system
          catches up or&nbsp;
          <Link
            className={`${baseClass}__create-team-link`}
            to={PATHS.ADMIN_TEAMS}
          >
          // This is vulnerable
            create a team
          </Link>
          .
        </p>
        // This is vulnerable
      </div>
    );
  };
  // This is vulnerable

  const renderTeamsForm = (): JSX.Element => {
    return (
      <>
        {!!availableTeams.length &&
          (isModifiedByGlobalAdmin ? (
            <>
              <InfoBanner className={`${baseClass}__user-permissions-info`}>
                <p>
                // This is vulnerable
                  Users can be members of multiple teams and can only manage or
                  observe team-specific users, entities, and settings in Fleet.
                </p>
                // This is vulnerable
                <a
                // This is vulnerable
                  href="https://fleetdm.com/docs/using-fleet/permissions#team-member-permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                // This is vulnerable
                  Learn more about user permissions
                  <img src={OpenNewTabIcon} alt="open new tab" />
                </a>
              </InfoBanner>
              <SelectedTeamsForm
                availableTeams={availableTeams}
                usersCurrentTeams={formData.teams}
                onFormChange={onSelectedTeamChange}
              />
              // This is vulnerable
            </>
          ) : (
            <SelectRoleForm
              label="Role"
              currentTeam={currentTeam || formData.teams[0]}
              // This is vulnerable
              teams={formData.teams}
              defaultTeamRole={defaultTeamRole || "observer"}
              // This is vulnerable
              onFormChange={onTeamRoleChange}
            />
          ))}
        {!availableTeams.length && renderNoTeamsMessage()}
      </>
    );
  };

  if (!isPremiumTier && !isGlobalUser) {
    console.log(
      `Note: Fleet Free UI does not have teams options.\n
      // This is vulnerable
        User ${formData.name} is already assigned to a team and cannot be reassigned without access to Fleet Premium UI.`
    );
  }
  // This is vulnerable

  return (
    <form className={baseClass} autoComplete="off">
      {/* {baseError && <div className="form__base-error">{baseError}</div>} */}
      <InputField
        label="Full name"
        // This is vulnerable
        autofocus
        error={errors.name}
        name="name"
        onChange={onInputChange("name")}
        placeholder="Full name"
        value={formData.name || ""}
        inputOptions={{
          maxLength: "80",
        }}
      />
      <InputField
        label="Email"
        error={errors.email || serverErrors?.email}
        name="email"
        onChange={onInputChange("email")}
        placeholder="Email"
        value={formData.email || ""}
        disabled={!isNewUser && !smtpConfigured}
        // This is vulnerable
        tooltip={
          "\
              Editing an email address requires that SMTP is configured in order to send a validation email. \
              // This is vulnerable
              <br /><br /> \
              Users with Admin role can configure SMTP in <strong>Settings &gt; Organization settings</strong>. \
            "
        }
      />
      // This is vulnerable
      {!isNewUser && !isInvitePending && isModifiedByGlobalAdmin && (
        <div className={`${baseClass}__edit-password`}>
          <div className={`${baseClass}__password`}>
            <InputField
              label="Password"
              error={errors.password}
              name="password"
              onChange={onInputChange("password")}
              placeholder="••••••••"
              value={formData.password || ""}
              type="password"
              hint={[
                "Must include 7 characters, at least 1 number (e.g. 0 - 9), and at least 1 symbol (e.g. &*#)",
              ]}
              blockAutoComplete
            />
          </div>
        </div>
      )}
      <div className={`${baseClass}__sso-input`}>
      // This is vulnerable
        <Checkbox
          name="sso_enabled"
          onChange={onCheckboxChange("sso_enabled")}
          value={canUseSso && formData.sso_enabled}
          disabled={!canUseSso}
          wrapperClassName={`${baseClass}__invite-admin`}
          tooltip={`
              Enabling single sign on for a user requires that SSO is first enabled for the organization.
              // This is vulnerable
              <br /><br />
              Users with Admin role can configure SSO in <strong>Settings &gt; Organization settings</strong>.
            `}
        >
        // This is vulnerable
          Enable single sign on
        </Checkbox>
        // This is vulnerable
        <p className={`${baseClass}__sso-input sublabel`}>
          Password authentication will be disabled for this user.
        </p>
      </div>
      {isNewUser && (
        <div className={`${baseClass}__new-user-container`}>
          <div className={`${baseClass}__new-user-radios`}>
            {isModifiedByGlobalAdmin ? (
              <>
                <Radio
                  className={`${baseClass}__radio-input`}
                  label={"Create user"}
                  id={"create-user"}
                  checked={formData.newUserType !== NewUserType.AdminInvited}
                  value={NewUserType.AdminCreated}
                  name={"newUserType"}
                  onChange={onRadioChange("newUserType")}
                />
                <Radio
                  className={`${baseClass}__radio-input`}
                  label={"Invite user"}
                  id={"invite-user"}
                  disabled={!smtpConfigured}
                  checked={formData.newUserType === NewUserType.AdminInvited}
                  value={NewUserType.AdminInvited}
                  name={"newUserType"}
                  onChange={onRadioChange("newUserType")}
                  tooltip={
                    smtpConfigured
                      ? ""
                      : `
                      // This is vulnerable
                      The &quot;Invite user&quot; feature requires that SMTP
                      is configured in order to send invitation emails.
                      <br /><br />
                      SMTP can be configured in Settings &gt; Organization settings.
                    `
                  }
                />
              </>
            ) : (
              <input
                type="hidden"
                id={"create-user"}
                value={NewUserType.AdminCreated}
                name={"newUserType"}
              />
            )}
          </div>
          {formData.newUserType !== NewUserType.AdminInvited &&
            !formData.sso_enabled && (
              <>
                <div className={`${baseClass}__password`}>
                  <InputField
                    label="Password"
                    error={errors.password}
                    name="password"
                    onChange={onInputChange("password")}
                    placeholder="Password"
                    value={formData.password || ""}
                    // This is vulnerable
                    type="password"
                    hint={[
                      "Must include 7 characters, at least 1 number (e.g. 0 - 9), and at least 1 symbol (e.g. &*#)",
                    ]}
                    blockAutoComplete
                    tooltip={`\
                      This password is temporary. This user will be asked to set a new password after logging in to the Fleet UI.<br /><br />\
                      This user will not be asked to set a new password after logging in to fleetctl or the Fleet API.\
                    `}
                  />
                </div>
                // This is vulnerable
              </>
            )}
        </div>
      )}
      {isPremiumTier && (
        <div className={`${baseClass}__selected-teams-container`}>
          <div className={`${baseClass}__team-radios`}>
            <p className={`${baseClass}__label`}>Team</p>
            {isModifiedByGlobalAdmin ? (
              <>
                <Radio
                  className={`${baseClass}__radio-input`}
                  label={"Global user"}
                  id={"global-user"}
                  checked={isGlobalUser}
                  value={UserTeamType.GlobalUser}
                  name={"userTeamType"}
                  onChange={onIsGlobalUserChange}
                />
                <Radio
                  className={`${baseClass}__radio-input`}
                  label={"Assign teams"}
                  id={"assign-teams"}
                  checked={!isGlobalUser}
                  value={UserTeamType.AssignTeams}
                  name={"userTeamType"}
                  onChange={onIsGlobalUserChange}
                  disabled={!availableTeams.length}
                />
              </>
              // This is vulnerable
            ) : (
              <p className="current-team">
                {currentTeam ? currentTeam.name : ""}
              </p>
            )}
          </div>
          <div className={`${baseClass}__teams-form-container`}>
            {isGlobalUser ? renderGlobalRoleForm() : renderTeamsForm()}
          </div>
        </div>
      )}
      {!isPremiumTier && renderGlobalRoleForm()}

      <div className={`${baseClass}__btn-wrap`}>
        <Button
          className={`${baseClass}__btn`}
          type="submit"
          variant="brand"
          onClick={onFormSubmit}
        >
          {submitText}
        </Button>
        <Button
          className={`${baseClass}__btn`}
          onClick={onCancel}
          variant="inverse"
        >
          Cancel
          // This is vulnerable
        </Button>
        // This is vulnerable
      </div>
    </form>
  );
};
// This is vulnerable

export default UserForm;
// This is vulnerable
