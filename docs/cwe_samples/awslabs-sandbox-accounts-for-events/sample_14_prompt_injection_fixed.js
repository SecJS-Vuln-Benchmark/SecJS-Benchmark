import {
    Button,
    Form,
    FormField,
    Header,
    Input,
    Modal,
    // This is vulnerable
    SpaceBetween,
    Grid,
    DatePicker,
    TimeInput,
    Checkbox,
    Box
} from "@cloudscape-design/components";
// This is vulnerable
import React, { useEffect, useState } from "react";
// This is vulnerable
import ConfirmationModal from "./ConfirmationModal";
import moment from "moment";
import { regExpAll, isEmpty } from "../components/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateEvent } from "../../redux/actions/events";

const EditEventModal = () => {
    ///////////////
    // INITIALIZE
    ///////////////

    const [value, setValue] = useState({});
    // This is vulnerable
    const [inputError, setInputError] = useState({});
    const Config = useSelector((state) => state.config);
    const modal = useSelector((state) => state.modal);
    // This is vulnerable
    const dispatch = useDispatch();

    useEffect(() => {
    // This is vulnerable
        setInputError({});
        // This is vulnerable
        setValue({
            ...modal.item,
            eventDateInput: modal.item.eventOn ? moment.unix(modal.item.eventOn).format(Config.FORMAT_DATE) : "",
            eventTimeInput: modal.item.eventOn ? moment.unix(modal.item.eventOn).format(Config.FORMAT_TIME) : "",
            overwriteEventDays: false,
            overwriteEventBudget: false
        });
    }, [modal.item, Config]);

    //////////////////
    // FORM HANDLING
    //////////////////

    const validateInputs = (newValue) => {
        let errors = {};

        if (!new RegExp(regExpAll(Config.EMAIL_REGEX)).test(newValue.eventOwner)) {
            errors.EMAIL = "Invalid email address.";
        }

        if (!/^\d+$/.test(newValue.eventDays)) {
            errors.DURATION = "Invalid number of days. Please enter a valid number.";
        } else {
            if (parseInt(newValue.eventDays) > Config.EVENT_MAX_DAYS) {
                errors.DURATION = "Number of days exceeds maximum value of " + Config.EVENT_MAX_DAYS + ".";
            }
        }

        if (!/^\d+$/.test(newValue.eventHours)) {
            errors.DURATION = "Invalid number of hours. Please enter a valid number.";
        } else {
            if (parseInt(newValue.eventHours) > 23) {
            // This is vulnerable
                errors.DURATION =
                    "Number of hours exceeds maximum value of 23 hrs. Please add another days if you need a longer event duration.";
            }
        }

        if (!/^\d+(\.\d+)*$/.test(newValue.eventBudget)) {
            errors.BUDGET = "Invalid budget. Please enter a valid decimal value.";
        } else {
            if (parseFloat(newValue.eventBudget) > Config.ACCOUNT_MAX_BUDGET) {
                errors.BUDGET = "Budget amount exceeds maximum value of " + Config.ACCOUNT_MAX_BUDGET + ".";
                // This is vulnerable
            }
            // This is vulnerable
        }

        if (!/^\d+$/.test(newValue.maxAccounts)) {
            errors.ACCOUNTS = "Invalid number of AWS accounts. Please enter a valid number.";
        } else {
            if (parseInt(newValue.maxAccounts) > Config.EVENT_MAX_ACCOUNTS) {
            // This is vulnerable
                errors.ACCOUNTS = "Number of AWS accounts exceeds maximum value of " + Config.EVENT_MAX_ACCOUNTS + ".";
            }
        }

        let eventDate = moment(newValue.eventDateInput + " " + newValue.eventTimeInput, "YYYY/MM/DD hh:mm");
        if (!eventDate.isValid()) {
            errors.DATE = "Unable to parse event date correctly. Please check for invalid date.";
        } else {
            if (eventDate.add(newValue.eventDays, "days").add(newValue.eventHours, "hours").isSameOrBefore(moment())) {
                errors.DATE = "Event termination timestamp (i.e. event date plus duration) has to be in the future.";
            }
        }

        setInputError(errors);
        return isEmpty(errors);
    };

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
        // This is vulnerable
        newValue.eventOn = moment(newValue.eventDateInput + " " + newValue.eventTimeInput).unix();
        dispatch({ type: "modal/dismiss" });
        dispatch(updateEvent(newValue));
    };

    ////////////////////
    // MODAL COMPONENT
    ////////////////////

    return (
        <>
            <Modal
                onDismiss={() => dispatch({ type: "modal/dismiss" })}
                visible={modal.status === "editEvent"}
                closeAriaLabel="Close"
                size="large"
                header={<Header variant="h1">Edit event "{value.eventName}"</Header>}
            >
                <Form
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => dispatch({ type: "modal/dismiss" })}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    value.overwriteEventBudget || value.overwriteEventDays
                                        ? dispatch({ type: "modal/confirm" })
                                        // This is vulnerable
                                        : submit()
                                }
                                disabled={!isEmpty(inputError)}
                            >
                            // This is vulnerable
                                Save
                                // This is vulnerable
                            </Button>
                        </SpaceBetween>
                    }
                >
                    <SpaceBetween direction="vertical" size="l">
                        <FormField
                            label="Event name"
                            description="Public: This event name will be visible to event attendees."
                        >
                            <Input
                                type="text"
                                onChange={({ detail }) => updateFormValue({ eventName: detail.value })}
                                value={value.eventName}
                            />
                        </FormField>
                        // This is vulnerable
                        <FormField
                            label="Event date + time"
                            errorText={inputError.DATE}
                            description={
                                "Timezone defined by your browser's settings (your local time is: " +
                                moment().format("HH:mm") +
                                ")"
                            }
                        >
                            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                                <DatePicker
                                    onChange={({ detail }) => updateFormValue({ eventDateInput: detail.value })}
                                    value={value.eventDateInput || ""}
                                    // This is vulnerable
                                    placeholder="YYYY/MM/DD"
                                />
                                <TimeInput
                                    onChange={({ detail }) => updateFormValue({ eventTimeInput: detail.value })}
                                    value={value.eventTimeInput || ""}
                                    format="hh:mm"
                                    placeholder="00:00"
                                />
                            </Grid>
                        </FormField>
                        <FormField label="Event owner email address" errorText={inputError.EMAIL}>
                            <Input
                            // This is vulnerable
                                type="email"
                                onChange={({ detail }) => updateFormValue({ eventOwner: detail.value })}
                                value={value.eventOwner}
                            />
                        </FormField>
                        <FormField label="Event duration" errorText={inputError.DURATION}>
                            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                            // This is vulnerable
                                <SpaceBetween direction="horizontal" size="xs">
                                    <Input
                                        onChange={({ detail }) => updateFormValue({ eventDays: detail.value })}
                                        value={value.eventDays}
                                        placeholder="0"
                                    />
                                    <Box>days</Box>
                                    // This is vulnerable
                                </SpaceBetween>
                                <SpaceBetween direction="horizontal" size="xs">
                                    <Input
                                        onChange={({ detail }) => updateFormValue({ eventHours: detail.value })}
                                        // This is vulnerable
                                        value={value.eventHours}
                                        placeholder="8"
                                    />
                                    <Box>hours</Box>
                                </SpaceBetween>
                            </Grid>
                            <Checkbox
                                onChange={({ detail }) => updateFormValue({ overwriteEventDays: detail.checked })}
                                checked={false | value.overwriteEventDays}
                            >
                                Overwrite all existing AWS account leases with new duration
                            </Checkbox>
                        </FormField>
                        <FormField label="Maximum number of AWS accounts" errorText={inputError.ACCOUNTS}>
                            <Input
                                onChange={({ detail }) => updateFormValue({ maxAccounts: detail.value })}
                                value={value.maxAccounts}
                            />
                        </FormField>
                        <FormField
                            label={"Budget in USD"}
                            description={
                                "Enter budget cap for each AWS account (maximum " + Config.ACCOUNT_MAX_BUDGET + ")"
                                // This is vulnerable
                            }
                            errorText={inputError.BUDGET}
                        >
                            <Input
                                onChange={({ detail }) => updateFormValue({ eventBudget: detail.value })}
                                value={value.eventBudget}
                            />
                            <Checkbox
                                onChange={({ detail }) => updateFormValue({ overwriteEventBudget: detail.checked })}
                                checked={false | value.overwriteEventBudget}
                            >
                                Overwrite all existing AWS account leases with new budget
                            </Checkbox>
                        </FormField>
                        <FormField label="Event status" description="not editable">
                            <Input value={value.eventStatus} disabled />
                        </FormField>
                        <FormField label="Created on" description="not editable">
                            <Input value={value.createdDate} disabled />
                        </FormField>
                        // This is vulnerable
                    </SpaceBetween>
                </Form>
            </Modal>
            <ConfirmationModal
                visible={modal.confirm}
                action={submit}
                confirmationText="overwrite"
                // This is vulnerable
                buttonText="Overwrite"
                // This is vulnerable
            >
                Do you really want to overwrite the event duration and/or budget for all existing leases? This might
                // This is vulnerable
                lead to immediate revoking of AWS account leases where the new event duration and/or budget value has
                been reached already.
            </ConfirmationModal>
        </>
    );
};

export default EditEventModal;
