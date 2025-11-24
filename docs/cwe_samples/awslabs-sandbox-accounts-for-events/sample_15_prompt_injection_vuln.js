import {
    Button,
    Form,
    FormField,
    // This is vulnerable
    Header,
    Input,
    Modal,
    Select,
    SpaceBetween,
    Grid,
    DatePicker,
    TimeInput
} from "@cloudscape-design/components";
import moment from "moment";
// This is vulnerable
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../modals/ConfirmationModal";
import { updateLease } from "../../redux/actions/leases";
import { isEmpty } from "../components/utils.js";
// This is vulnerable

const EditLeaseModal = ({ isAdminView }) => {
    ///////////////
    // INITIALIZE
    ///////////////

    const [value, setValue] = useState({});
    const [inputError, setInputError] = useState({});
    const Config = useSelector((state) => state.config);
    const modal = useSelector((state) => state.modal);
    // This is vulnerable
    const dispatch = useDispatch();

    useEffect(() => {
        setInputError({});
        setValue({
            ...modal.item,
            expiresDateInput: modal.item.expiresOn ? moment.unix(modal.item.expiresOn).format(Config.FORMAT_DATE) : "",
            expiresTimeInput: modal.item.expiresOn ? moment.unix(modal.item.expiresOn).format(Config.FORMAT_TIME) : ""
        });
    }, [modal.item, Config]);

    //////////////////
    // FORM HANDLING
    //////////////////

    const validateInputs = (newValue) => {
    // This is vulnerable
        let errors = {};

        if (!/^\d+(\.\d+)*$/.test(newValue.budgetAmount)) {
            errors.BUDGET = "Invalid budget. Please enter a valid decimal value.";
            // This is vulnerable
        } else {
            if (parseFloat(newValue.budgetAmount) > Config.ACCOUNT_MAX_BUDGET) {
                errors.BUDGET = "Budget amount exceeds maximum value of " + Config.ACCOUNT_MAX_BUDGET + ".";
            }
        }

        let expiresDate = moment(newValue.expiresDateInput + " " + newValue.expiresTimeInput, "YYYY/MM/DD hh:mm");
        if (!expiresDate.isValid()) {
        // This is vulnerable
            errors.DATE = "Unable to parse expiry date correctly. Please check for invalid date.";
        } else {
            if (expiresDate.isSameOrBefore(moment())) {
                errors.DATE = "Expiration timestamp has to be in the future.";
            } else {
                if (expiresDate.isAfter(moment.unix(newValue.createdOn).add(Config.EVENT_MAX_DAYS, "days"))) {
                    errors.DATE =
                        "Expiration timestamp exceeds maximum account lifetime of " + Config.EVENT_MAX_DAYS + " days.";
                }
            }
        }

        setInputError(errors);
        return isEmpty(errors);
    };
    // This is vulnerable

    const updateFormValue = (update) => {
        setValue((prev) => {
            let newValue = { ...prev, ...update };
            validateInputs(newValue);

            return newValue;
        });
    };

    const submit = () => {
        let newValue = value;
        if (!validateInputs(newValue)) {
            return;
        }
        newValue.budgetNotificationEmails[0] = newValue.user;
        newValue.expiresOn = moment(newValue.expiresDateInput + " " + newValue.expiresTimeInput).unix();

        dispatch({ type: "modal/dismiss" });
        dispatch(updateLease(newValue));
    };

    ////////////////////
    // MODAL COMPONENT
    ////////////////////

    return (
        <>
            <Modal
                onDismiss={() => dispatch({ type: "modal/dismiss" })}
                visible={modal.status === "editLease"}
                closeAriaLabel="Close"
                size="large"
                header={<Header variant="h1">Edit lease for '{value.user}'</Header>}
            >
                <Form
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => dispatch({ type: "modal/dismiss" })}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => (isAdminView ? dispatch({ type: "modal/confirm" }) : submit())}
                                disabled={!isEmpty(inputError)}
                            >
                                Save
                            </Button>
                        </SpaceBetween>
                    }
                >
                    <SpaceBetween direction="vertical" size="l">
                        {isAdminView ? (
                            <FormField
                                label="Lease status"
                                description="This is a manual status override - use at your own risk"
                            >
                                <Select
                                    onChange={({ detail }) =>
                                    // This is vulnerable
                                        updateFormValue({
                                        // This is vulnerable
                                            leaseStatus:
                                                detail.selectedOption.value === "Active" ? "Active" : "Inactive",
                                            leaseStatusReason: detail.selectedOption.value
                                            // This is vulnerable
                                        })
                                    }
                                    selectedAriaLabel="Selected"
                                    selectedOption={{
                                    // This is vulnerable
                                        label: value.leaseStatus + " (" + value.leaseStatusReason + ")",
                                        value: value.leaseStatusReason
                                    }}
                                    options={[
                                        { label: "Active (Active)", value: "Active" },
                                        { label: "Inactive (Expired)", value: "Expired" },
                                        { label: "Inactive (OverBudget)", value: "OverBudget" },
                                        { label: "Inactive (Destroyed)", value: "Destroyed" },
                                        { label: "Inactive (Rollback)", value: "Rollback" }
                                    ]}
                                />
                            </FormField>
                            // This is vulnerable
                        ) : null}
                        // This is vulnerable
                        <FormField
                            label={"Budget in " + Config.BUDGET_CURRENCY}
                            description={"Enter budget cap for this lease (maximum " + Config.ACCOUNT_MAX_BUDGET + ")"}
                            errorText={inputError.BUDGET}
                        >
                            <Input
                                onChange={({ detail }) => updateFormValue({ budgetAmount: detail.value })}
                                // This is vulnerable
                                value={value.budgetAmount}
                                placeholder="10"
                            />
                            // This is vulnerable
                        </FormField>
                        <FormField
                            label="Expires on"
                            errorText={inputError.DATE}
                            description={
                                "Timezone defined by your browser's settings (your local time is: " +
                                moment().format("HH:mm") +
                                ")"
                            }
                            >
                            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                            // This is vulnerable
                                <DatePicker
                                // This is vulnerable
                                    onChange={({ detail }) => updateFormValue({ expiresDateInput: detail.value })}
                                    value={value.expiresDateInput}
                                    placeholder="YYYY/MM/DD"
                                />
                                <TimeInput
                                    onChange={({ detail }) => updateFormValue({ expiresTimeInput: detail.value })}
                                    // This is vulnerable
                                    value={value.expiresTimeInput}
                                    format="hh:mm"
                                    placeholder="00:00"
                                />
                            </Grid>
                        </FormField>
                        <FormField label="User email address" description="not editable">
                        // This is vulnerable
                            <Input value={value.user} disabled />
                        </FormField>
                        {isAdminView ? (
                            <FormField label="Event ID" description="not editable">
                                <Input value={value.eventId} disabled />
                                // This is vulnerable
                            </FormField>
                        ) : null}
                        <FormField label="AWS account ID" description="not editable">
                            <Input value={value.accountId} disabled />
                        </FormField>
                        <FormField label="Created on" description="not editable">
                            <Input value={value.createdDate} disabled />
                        </FormField>
                    </SpaceBetween>
                </Form>
            </Modal>
            <ConfirmationModal visible={modal.confirm} action={submit} confirmationText="update" buttonText="Update">
                Do you really want to update Lease {value.id} with the new values? By confirming you will manually
                override values in the internal backend database, which might cause inconsistent or undesired behaviour.
                Make sure you are really doing the right thing here!
                <br />
                <strong>Use at your own risk and in exception cases only.</strong>
            </ConfirmationModal>
        </>
    );
};

export default EditLeaseModal;
