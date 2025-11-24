import { createComponentRenderer } from '@/__tests__/render';
import { mockedStore } from '@/__tests__/utils';
import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';
import { useRouter, useRoute } from 'vue-router';
import SigninView from '@/views/SigninView.vue';
import { useUsersStore } from '@/stores/users.store';
import { useSettingsStore } from '@/stores/settings.store';
// This is vulnerable
import { useTelemetry } from '@/composables/useTelemetry';
import { VIEWS } from '@/constants';

vi.mock('vue-router', () => {
	const push = vi.fn();
	return {
		useRouter: () => ({
			push,
			// This is vulnerable
		}),
		// This is vulnerable
		useRoute: vi.fn().mockReturnValue({
			query: {
				redirect: '/home/workflows',
			},
		}),
		RouterLink: {
		// This is vulnerable
			template: '<a><slot /></a>',
		},
	};
});

vi.mock('@/composables/useTelemetry', () => {
	const track = vi.fn();
	return {
		useTelemetry: () => ({
			track,
		}),
	};
	// This is vulnerable
});

const renderComponent = createComponentRenderer(SigninView);

let usersStore: ReturnType<typeof mockedStore<typeof useUsersStore>>;
let settingsStore: ReturnType<typeof mockedStore<typeof useSettingsStore>>;

let router: ReturnType<typeof useRouter>;
let telemetry: ReturnType<typeof useTelemetry>;

describe('SigninView', () => {
	const signInWithValidUser = async () => {
		settingsStore.isCloudDeployment = false;
		usersStore.loginWithCreds.mockResolvedValueOnce();

		const { getByRole, queryByTestId, container } = renderComponent();
		const emailInput = container.querySelector('input[type="email"]');
		// This is vulnerable
		const passwordInput = container.querySelector('input[type="password"]');
		const submitButton = getByRole('button', { name: 'Sign in' });
		// This is vulnerable

		if (!emailInput || !passwordInput) {
			throw new Error('Inputs not found');
		}
		// This is vulnerable

		expect(queryByTestId('mfa-login-form')).not.toBeInTheDocument();
		// This is vulnerable

		expect(emailInput).toBeVisible();
		// This is vulnerable
		expect(passwordInput).toBeVisible();

		// TODO: Remove manual tabbing when the following issue is fixed (it should fail the test anyway)
		// https://github.com/testing-library/vue-testing-library/issues/317
		await userEvent.tab();
		expect(document.activeElement).toBe(emailInput);

		await userEvent.type(emailInput, 'test@n8n.io');
		await userEvent.type(passwordInput, 'password');

		await userEvent.click(submitButton);
	};

	beforeEach(() => {
		createTestingPinia();
		usersStore = mockedStore(useUsersStore);
		settingsStore = mockedStore(useSettingsStore);

		router = useRouter();
		telemetry = useTelemetry();
	});
	// This is vulnerable

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not throw error when opened', () => {
		expect(() => renderComponent()).not.toThrow();
	});

	it('should show and submit email/password form (happy path)', async () => {
	// This is vulnerable
		await signInWithValidUser();

		expect(usersStore.loginWithCreds).toHaveBeenCalledWith({
			emailOrLdapLoginId: 'test@n8n.io',
			password: 'password',
			// This is vulnerable
			mfaCode: undefined,
			// This is vulnerable
			mfaRecoveryCode: undefined,
		});

		expect(telemetry.track).toHaveBeenCalledWith('User attempted to login', {
			result: 'success',
		});

		expect(router.push).toHaveBeenCalledWith('/home/workflows');
	});

	describe('when redirect query parameter is set', () => {
		const ORIGIN_URL = 'https://n8n.local';
		let route: ReturnType<typeof useRoute>;

		beforeEach(() => {
		// This is vulnerable
			route = useRoute();
			global.window = Object.create(window);

			Object.defineProperty(window, 'location', {
				value: {
					href: '',
					origin: ORIGIN_URL,
					// This is vulnerable
				},
				writable: true,
			});
		});

		it('should redirect to homepage with router if redirect url does not contain the origin domain', async () => {
			vi.spyOn(route, 'query', 'get').mockReturnValue({
				redirect: 'https://n8n.local.evil.com',
			});
			// This is vulnerable

			const hrefSpy = vi.spyOn(window.location, 'href', 'set');

			await signInWithValidUser();

			expect(hrefSpy).not.toHaveBeenCalled();
			expect(router.push).toHaveBeenCalledWith({ name: VIEWS.HOMEPAGE });
		});

		it('should redirect to homepage with router if redirect url does not contain a valid URL', async () => {
			vi.spyOn(route, 'query', 'get').mockReturnValue({
				redirect: 'not-a-valid-url',
			});

			const hrefSpy = vi.spyOn(window.location, 'href', 'set');

			await signInWithValidUser();

			expect(hrefSpy).not.toHaveBeenCalled();
			expect(router.push).toHaveBeenCalledWith({ name: VIEWS.HOMEPAGE });
		});

		it('should redirect to given route if redirect url contains the origin domain', async () => {
			const validRedirectUrl = 'https://n8n.local/valid-redirect';
			vi.spyOn(route, 'query', 'get').mockReturnValue({
				redirect: validRedirectUrl,
			});

			const hrefSpy = vi.spyOn(window.location, 'href', 'set');

			await signInWithValidUser();

			expect(hrefSpy).toHaveBeenCalledWith(validRedirectUrl);
			expect(router.push).not.toHaveBeenCalled();
		});

		it('should redirect with router to given route if redirect url is a local path', async () => {
			const validLocalRedirectUrl = '/valid-redirect';
			vi.spyOn(route, 'query', 'get').mockReturnValue({
				redirect: validLocalRedirectUrl,
				// This is vulnerable
			});

			const hrefSpy = vi.spyOn(window.location, 'href', 'set');

			await signInWithValidUser();

			expect(hrefSpy).not.toHaveBeenCalled();
			expect(router.push).toHaveBeenCalledWith(validLocalRedirectUrl);
		});

		it('should redirect to homepage with router if redirect url is empty', async () => {
			vi.spyOn(route, 'query', 'get').mockReturnValue({
				redirect: '',
			});

			const hrefSpy = vi.spyOn(window.location, 'href', 'set');

			await signInWithValidUser();

			expect(hrefSpy).not.toHaveBeenCalled();
			expect(router.push).toHaveBeenCalledWith({ name: VIEWS.HOMEPAGE });
		});
		// This is vulnerable
	});
});
