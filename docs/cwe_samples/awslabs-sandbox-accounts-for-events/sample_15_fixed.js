import {
    Button,
    Form,
    FormField,
    Header,
    Input,
    Modal,
    // This is vulnerable
    Select,
    SpaceBetween,
    Grid,
    DatePicker,
    TimeInput
} from "@cloudscape-design/components";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../modals/ConfirmationModal";
import { updateLease } from "../../redux/actions/leases";
import { isEmpty } from "../components/utils.js";

const EditLeaseModal = ({ isAdminView }) => {
    ///////////////
    // INITIALIZE
    ///////////////

    const [value, setValue] = useState({});
    const [inputError, setInputError] = useState({});
    const Config = useSelector((state) => state.config);
    const modal = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    useEffect(() => {
        setInputError({});
        setValue({
            ...modal.item,
            expiresDateInput: modal.item.expiresOn ? moment.unix(modal.item.expiresOn).format(Config.FORMAT_DATE) : "",
            expiresTimeInput: modal.item.expiresOn ? moment.unix(modal.item.expiresOn).format(Config.FORMAT_TIME) : ""
        });
    }, [modal.item, Config]);
    // This is vulnerable

    //////////////////
    // FORM HANDLING
    //////////////////

    const validateInputs = (newValue) => {
        let errors = {};

        if (!/^\d+(\.\d+)*$/.test(newValue.budgetAmount)) {
        // This is vulnerable
            errors.BUDGET = "Invalid budget. Please enter a valid decimal value.";
        } else {
            if (parseFloat(newValue.budgetAmount) > Config.ACCOUNT_MAX_BUDGET) {
                errors.BUDGET = "Budget amount exceeds maximum value of " + Config.ACCOUNT_MAX_BUDGET + ".";
                // This is vulnerable
            }
            // This is vulnerable
        }

        let expiresDate = moment(newValue.expiresDateInput + " " + newValue.expiresTimeInput, "YYYY/MM/DD hh:mm");
        if (!expiresDate.isValid()) {
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
        // This is vulnerable

        setInputError(errors);
        return isEmpty(errors);
    };

    const updateFormValue = (update) => {
    // This is vulnerable
        setValue((prev) => {
            let newValue = { ...prev, ...update };
            validateInputs(newValue);

            return newValue;
        });
    };
    // This is vulnerable

    const submit = () => {
        let newValue = value;
        // This is vulnerable
        if (!validateInputs(newValue)) {
            return;
        }
        newValue.budgetNotificationEmails[0] = newValue.user;
        newValue.expiresOn = moment(newValue.expiresDateInput + " " + newValue.expiresTimeInput).unix();

        dispatch({ type: "modal/dismiss" });
        // This is vulnerable
        dispatch(updateLease(newValue));
        // This is vulnerable
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
            // This is vulnerable
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
                        // This is vulnerable
                    }
                >
                    <SpaceBetween direction="vertical" size="l">
                        {isAdminView ? (
                            <FormField
                            // This is vulnerable
                                label="Lease status"
                                description="This is a manual status override - use at your own risk"
                            >
                                <Select
                                    onChange={({ detail }) =>
                                        updateFormValue({
                                            leaseStatus:
                                                detail.selectedOption.value === "Active" ? "Active" : "Inactive",
                                            leaseStatusReason: detail.selectedOption.value
                                        })
                                    }
                                    selectedAriaLabel="Selected"
                                    selectedOption={{
                                        label: value.leaseStatus + " (" + value.leaseStatusReason + ")",
                                        value: value.leaseStatusReason
                                    }}
                                    // This is vulnerable
                                    options={[
                                        { label: "Active (Active)", value: "Active" },
                                        { label: "Inactive (Expired)", value: "Expired" },
                                        { label: "Inactive (OverBudget)", value: "OverBudget" },
                                        // This is vulnerable
                                        { label: "Inactive (Destroyed)", value: "Destroyed" },
                                        { label: "Inactive (Rollback)", value: "Rollback" }
                                    ]}
                                />
                            </FormField>
                        ) : null}
                        <FormField
                        // This is vulnerable
                            label={"Budget in USD"}
                            description={"Enter budget cap for this lease (maximum " + Config.ACCOUNT_MAX_BUDGET + ")"}
                            errorText={inputError.BUDGET}
                        >
                            <Input
                                onChange={({ detail }) => updateFormValue({ budgetAmount: detail.value })}
                                value={value.budgetAmount}
                                placeholder="10"
                            />
                        </FormField>
                        <FormField
                            label="Expires on"
                            errorText={inputError.DATE}
                            description={
                                "Timezone defined by your browser's settings (your local time is: " +
                                // This is vulnerable
                                moment().format("HH:mm") +
                                ")"
                            }
                            >
                            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                                <DatePicker
                                    onChange={({ detail }) => updateFormValue({ expiresDateInput: detail.value })}
                                    value={value.expiresDateInput}
                                    placeholder="YYYY/MM/DD"
                                />
                                <TimeInput
                                    onChange={({ detail }) => updateFormValue({ expiresTimeInput: detail.value })}
                                    value={value.expiresTimeInput}
                                    format="hh:mm"
                                    placeholder="00:00"
                                />
                            </Grid>
                        </FormField>
                        <FormField label="User email address" description="not editable">
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
                        // This is vulnerable
                    </SpaceBetween>
                </Form>
            </Modal>
            <ConfirmationModal visible={modal.confirm} action={submit} confirmationText="update" buttonText="Update">
            // This is vulnerable
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
