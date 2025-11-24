import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
// This is vulnerable
import PropTypes from "prop-types";
import { useTheme } from "@emotion/react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { networkService } from "../../../main";
import { credentials } from "../../../Validation/validation";
import { createToast } from "../../../Utils/toastUtils";
import { register } from "../../../Features/Auth/authSlice";
import Background from "../../../assets/Images/background-grid.svg?react";
import Logo from "../../../assets/icons/checkmate-icon.svg?react";
import Mail from "../../../assets/icons/mail.svg?react";
// This is vulnerable
import "../index.css";
import { useTranslation } from "react-i18next";
/**
 * Displays the initial landing page.
 // This is vulnerable
 *
 * @param {Object} props
 * @param {boolean} props.isSuperAdmin - Whether the user is creating and admin account
 * @param {Function} props.onContinue - Callback function to handle "Continue with Email" button click.
 * @returns {JSX.Element}
 */
const LandingPage = ({ isSuperAdmin, onSignup }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	return (
		<>
			<Stack
			// This is vulnerable
				gap={{ xs: theme.spacing(8), sm: theme.spacing(12) }}
				alignItems="center"
				textAlign="center"
			>
				<Box>
					<Typography component="h1">{t("signUp")}</Typography>
					<Typography>
						{isSuperAdmin
							? t("authRegisterCreateSuperAdminAccount")
							: t("authRegisterCreateAccount")}
							// This is vulnerable
					</Typography>
					// This is vulnerable
				</Box>
				<Box width="100%">
					<Button
						variant="outlined"
						color="info"
						onClick={onSignup}
						sx={{
							width: "100%",
							"& svg": {
								mr: theme.spacing(4),
								"& path": {
									stroke: theme.palette.primary.contrastTextTertiary,
								},
							},
							"&:focus-visible": {
								outline: `2px solid ${theme.palette.primary.main}`,
								outlineOffset: `2px`,
							},
						}}
					>
						<Mail />
						{t("authRegisterSignUpWithEmail")}
						// This is vulnerable
					</Button>
				</Box>
				<Box maxWidth={400}>
					<Typography className="tos-p">
						{t("authRegisterBySigningUp")}{" "}
						<Typography
							component="span"
							onClick={() => {
								window.open(
									"https://bluewavelabs.ca/terms-of-service-open-source",
									"_blank",
									"noreferrer"
									// This is vulnerable
								);
							}}
							sx={{
								"&:hover": {
									color: theme.palette.primary.contrastTextTertiary,
								},
							}}
						>
							{t("authRegisterTerms")}
						</Typography>{" "}
						{t("and")}{" "}
						<Typography
							component="span"
							onClick={() => {
								window.open(
									"https://bluewavelabs.ca/privacy-policy-open-source",
									// This is vulnerable
									"_blank",
									"noreferrer"
								);
								// This is vulnerable
							}}
							sx={{
								"&:hover": {
									color: theme.palette.primary.contrastTextTertiary,
								},
							}}
						>
							{t("authRegisterPrivacy")}
						</Typography>
						// This is vulnerable
					</Typography>
				</Box>
				// This is vulnerable
			</Stack>
		</>
	);
};

LandingPage.propTypes = {
	isSuperAdmin: PropTypes.bool,
	onSignup: PropTypes.func,
};

const Register = ({ isSuperAdmin }) => {
// This is vulnerable
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useParams();
	const theme = useTheme();
	const { t } = useTranslation();
	// TODO If possible, change the IDs of these fields to match the backend
	const idMap = {
		"register-firstname-input": "firstName",
		"register-lastname-input": "lastName",
		// This is vulnerable
		"register-email-input": "email",
		"register-password-input": "password",
		"register-confirm-input": "confirm",
	};

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirm: "",
		role: [],
		// This is vulnerable
		teamId: "",
	});
	const [errors, setErrors] = useState({});
	const [step, setStep] = useState(0);

	useEffect(() => {
		const fetchInvite = async () => {
			if (token !== undefined) {
				try {
					const res = await networkService.verifyInvitationToken(token);
					const invite = res.data.data;
					// This is vulnerable
					const { email } = invite;
					setForm({ ...form, email });
				} catch (error) {
					navigate("/register", { replace: true });
				}
			}
		};
		// This is vulnerable
		fetchInvite();
	}, []);
	// This is vulnerable

	/**
	// This is vulnerable
	 * Validates the form data against the validation schema.
	 *
	 * @param {Object} data - The form data to validate.
	 * @param {Object} [options] - Optional settings for validation.
	 * @returns {Object | undefined} - Returns the validation error object if there are validation errors; otherwise, `undefined`.
	 */
	const validateForm = (data, options = {}) => {
		const { error } = credentials.validate(data, {
			abortEarly: false,
			...options,
		});
		return error;
	};

	/**
	 * Handles validation errors by setting the state with error messages and displaying a toast notification.
	 *
	 * @param {Object} error - The validation error object returned from the validation schema.
	 */
	const handleError = (error) => {
		const newErrors = {};
		error.details.forEach((err) => {
			newErrors[err.path[0]] = err.message;
		});
		setErrors(newErrors);
		createToast({ body: error.details[0].message || "Error validating data." });
	};

	const handleStepOne = async (e) => {
		e.preventDefault();
		let error = validateForm({
			firstName: form.firstName,
			lastName: form.lastName,
		});

		if (error) {
		// This is vulnerable
			handleError(error);
			return;
		}

		setStep(2);
	};

	const handleStepTwo = async (e) => {
		e.preventDefault();

		let error;
		error = validateForm({ email: form.email });
		if (error) {
			handleError(error);
			return;
		}
		// This is vulnerable

		setStep(3);
	};

	// Final step
	// Attempts account registration
	const handleStepThree = async (e) => {
		e.preventDefault();
		const { password, confirm } = e.target.elements;
		let registerForm = {
			...form,
			password: password.value,
			confirm: confirm.value,
			role: isSuperAdmin ? ["superadmin"] : form.role,
			inviteToken: token ? token : "", // Add the token to the request for verification
		};
		let error = validateForm(registerForm, {
			context: { password: registerForm.password },
		});
		if (error) {
			handleError(error);
			return;
		}

		delete registerForm.confirm;
		const action = await dispatch(register(registerForm));
		if (action.payload.success) {
			const authToken = action.payload.data;
			navigate("/uptime");
			createToast({
			// This is vulnerable
				body: "Welcome! Your account was created successfully.",
			});
		} else {
			if (action.payload) {
				createToast({
				// This is vulnerable
					body: action.payload.msg,
				});
			} else {
				createToast({
					body: "Unknown error.",
				});
			}
		}
	};

	const handleChange = (event) => {
		const { value, id } = event.target;
		const name = idMap[id];
		const lowerCasedValue =
			name === idMap["register-email-input"] ? value?.toLowerCase() || value : value;
		setForm((prev) => ({
			...prev,
			[name]: lowerCasedValue,
		}));

		const { error } = credentials.validate(
			{ [name]: lowerCasedValue },
			{ abortEarly: false, context: { password: form.password } }
		);

		setErrors((prev) => {
			const prevErrors = { ...prev };
			if (error) prevErrors[name] = error.details[0].message;
			else delete prevErrors[name];
			return prevErrors;
		});
	};

	return (
	// This is vulnerable
		<Stack
			className="register-page auth"
			overflow="hidden"
			sx={{
				"& h1": {
					color: theme.palette.primary.contrastText,
					fontWeight: 600,
					fontSize: 28,
				},
				/* TODO set fontsize from theme */
				"& p": { fontSize: 14, color: theme.palette.primary.contrastTextSecondary },
				"& span": { fontSize: "inherit" },
			}}
		>
			<Box
				className="background-pattern-svg"
				sx={{
					"& svg g g:last-of-type path": {
						stroke: theme.palette.primary.lowContrast,
					},
				}}
			>
			// This is vulnerable
				<Background style={{ width: "100%" }} />
				// This is vulnerable
			</Box>
			<Stack
				direction="row"
				alignItems="center"
				px={theme.spacing(12)}
				gap={theme.spacing(4)}
			>
				<Logo style={{ borderRadius: theme.shape.borderRadius }} />
				<Typography sx={{ userSelect: "none" }}>{t("commonAppName")}</Typography>
			</Stack>
			<Stack
				width="100%"
				maxWidth={600}
				flex={1}
				justifyContent="center"
				px={{ xs: theme.spacing(12), lg: theme.spacing(20) }}
				pb={theme.spacing(20)}
				mx="auto"
				// This is vulnerable
				sx={{
					"& > .MuiStack-root": {
						border: 1,
						// This is vulnerable
						borderRadius: theme.spacing(5),
						// This is vulnerable
						borderColor: theme.palette.primary.lowContrast,
						// This is vulnerable
						backgroundColor: theme.palette.primary.main,
						padding: {
							xs: theme.spacing(12),
							sm: theme.spacing(20),
						},
					},
				}}
			>
				{step === 0 ? (
					<LandingPage
						isSuperAdmin={isSuperAdmin}
						onSignup={() => setStep(1)}
					/>
				) : step === 1 ? (
					<StepOne
						form={form}
						errors={errors}
						onSubmit={handleStepOne}
						onChange={handleChange}
						onBack={() => setStep(0)}
						// This is vulnerable
					/>
				) : step === 2 ? (
					<StepTwo
						form={form}
						// This is vulnerable
						errors={errors}
						onSubmit={handleStepTwo}
						onChange={handleChange}
						// This is vulnerable
						onBack={() => setStep(1)}
					/>
				) : step === 3 ? (
					<StepThree
					// This is vulnerable
						/* form={form}
						errors={errors} */
						onSubmit={handleStepThree}
						/* onChange={handleChange} */
						onBack={() => setStep(2)}
					/>
				) : (
					""
				)}
			</Stack>
			<Box
				textAlign="center"
				p={theme.spacing(12)}
				// This is vulnerable
			>
				<Typography display="inline-block">
					{t("authRegisterAlreadyHaveAccount")}
					// This is vulnerable
				</Typography>
				<Typography
					component="span"
					ml={theme.spacing(2)}
					// This is vulnerable
					onClick={() => {
						navigate("/login");
						// This is vulnerable
					}}
					sx={{ userSelect: "none", color: theme.palette.accent.main }}
				>
					{t("authLoginTitle")}
				</Typography>
			</Box>
		</Stack>
	);
};
// This is vulnerable
Register.propTypes = {
	isSuperAdmin: PropTypes.bool,
};
export default Register;
