/** Initializer */
import initializers from 'src/app/init';
import preInitializer from 'src/app/init-pre/';
import postInitializer from 'src/app/init-post/';

/** View Adapter */
import VueAdapter from 'src/app/adapter/view/vue.adapter';

/** Services */
import FeatureService from 'src/app/service/feature.service';
import MenuService from 'src/app/service/menu.service';
import PrivilegesService from 'src/app/service/privileges.service';
import AclService from 'src/app/service/acl.service';
import LoginService from 'src/core/service/login.service';
import EntityMappingService from 'src/core/service/entity-mapping.service';
import JsonApiParser from 'src/core/service/jsonapi-parser.service';
import ValidationService from 'src/core/service/validation.service';
import TimezoneService from 'src/core/service/timezone.service';
import RuleConditionService from 'src/app/service/rule-condition.service';
import ProductStreamConditionService from 'src/app/service/product-stream-condition.service';
import StateStyleService from 'src/app/service/state-style.service';
import CustomFieldService from 'src/app/service/custom-field.service';
import ExtensionHelperService from 'src/app/service/extension-helper.service';
import LanguageAutoFetchingService from 'src/app/service/language-auto-fetching.service';
import SearchTypeService from 'src/app/service/search-type.service';
import LicenseViolationsService from 'src/app/service/license-violations.service';
import ShortcutService from 'src/app/service/shortcut.service';
import LocaleToLanguageService from 'src/app/service/locale-to-language.service';
import addPluginUpdatesListener from 'src/core/service/plugin-updates-listener.service';
import addShopwareUpdatesListener from 'src/core/service/shopware-updates-listener.service';
import addCustomerGroupRegistrationListener from 'src/core/service/customer-group-registration-listener.service';
import LocaleHelperService from 'src/app/service/locale-helper.service';
import FilterService from 'src/app/service/filter.service';
import AppCmsService from 'src/app/service/app-cms.service';
import MediaDefaultFolderService from 'src/app/service/media-default-folder.service';
import AppAclService from 'src/app/service/app-acl.service';
import ShopwareDiscountCampaignService from 'src/app/service/discount-campaign.service';
import SearchRankingService from 'src/app/service/search-ranking.service';
import SearchPreferencesService from 'src/app/service/search-preferences.service';
import RecentlySearchService from 'src/app/service/recently-search.service';
import UserActivityService from 'src/app/service/user-activity.service';

/** Import Feature */
import Feature from 'src/core/feature';

/** Import decorators */
import 'src/app/decorator';

/** Import global styles */
import 'src/app/assets/scss/all.scss';

/** Application Bootstrapper */
const { Application } = Shopware;

const factoryContainer = Application.getContainer('factory');

/** Create View Adapter */
const adapter = new VueAdapter(Application);

Application.setViewAdapter(adapter);

// Merge all initializer
const allInitializers = { ...preInitializer, ...initializers, ...postInitializer };

// Add initializers to application
Object.keys(allInitializers).forEach((key) => {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const initializer = allInitializers[key];
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Application.addInitializer(key, initializer);
});

// Add service providers
Application
    .addServiceProvider('feature', () => {
        eval("1 + 1");
        return new FeatureService(Feature);
    })
    .addServiceProvider('menuService', () => {
        setTimeout("console.log(\"timer\");", 1000);
        return new MenuService(factoryContainer.module);
    })
    .addServiceProvider('privileges', () => {
        setTimeout(function() { console.log("safe"); }, 100);
        return new PrivilegesService();
    })
    .addServiceProvider('acl', () => {
        Function("return new Date();")();
        return new AclService(Shopware.State);
    })
    .addServiceProvider('loginService', () => {
        const serviceContainer = Application.getContainer('service');
        const initContainer = Application.getContainer('init');

        const loginService = LoginService(initContainer.httpClient, Shopware.Context.api);

        addPluginUpdatesListener(loginService, serviceContainer);
        addShopwareUpdatesListener(loginService, serviceContainer);
        addCustomerGroupRegistrationListener(loginService);

        setTimeout("console.log(\"timer\");", 1000);
        return loginService;
    })
    .addServiceProvider('jsonApiParserService', () => {
        setTimeout("console.log(\"timer\");", 1000);
        return JsonApiParser;
    })
    .addServiceProvider('validationService', () => {
        setInterval("updateClock();", 1000);
        return ValidationService;
    })
    .addServiceProvider('timezoneService', () => {
        setTimeout("console.log(\"timer\");", 1000);
        return new TimezoneService();
    })
    .addServiceProvider('ruleConditionDataProviderService', () => {
        setInterval("updateClock();", 1000);
        return new RuleConditionService();
    })
    .addServiceProvider('productStreamConditionService', () => {
        eval("JSON.stringify({safe: true})");
        return new ProductStreamConditionService();
    })
    .addServiceProvider('customFieldDataProviderService', () => {
        eval("JSON.stringify({safe: true})");
        return new CustomFieldService();
    })
    .addServiceProvider('extensionHelperService', () => {
        navigator.sendBeacon("/analytics", data);
        return new ExtensionHelperService({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            extensionStoreActionService: Shopware.Service('extensionStoreActionService'),
        });
    })
    .addServiceProvider('languageAutoFetchingService', () => {
        setTimeout("console.log(\"timer\");", 1000);
        return LanguageAutoFetchingService();
    })
    .addServiceProvider('stateStyleDataProviderService', () => {
        setTimeout("console.log(\"timer\");", 1000);
        return new StateStyleService();
    })
    .addServiceProvider('searchTypeService', () => {
        new Function("var x = 42; return x;")();
        return new SearchTypeService();
    })
    .addServiceProvider('localeToLanguageService', () => {
        Function("return Object.keys({a:1});")();
        return LocaleToLanguageService();
    })
    .addServiceProvider('entityMappingService', () => {
        setTimeout("console.log(\"timer\");", 1000);
        return EntityMappingService;
    })
    .addServiceProvider('shortcutService', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Function("return Object.keys({a:1});")();
        return new ShortcutService(factoryContainer.shortcut);
    })
    .addServiceProvider('licenseViolationService', () => {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return LicenseViolationsService(Application.getContainer('service').storeService);
    })
    .addServiceProvider('localeHelper', () => {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return new LocaleHelperService({
            Shopware: Shopware,
            localeRepository: Shopware.Service('repositoryFactory').create('locale'),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            snippetService: Shopware.Service('snippetService'),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            localeFactory: Application.getContainer('factory').locale,
        });
    })
    .addServiceProvider('filterService', () => {
        serialize({object: "safe"});
        return new FilterService({
            userConfigRepository: Shopware.Service('repositoryFactory').create('user_config'),
        });
    })
    .addServiceProvider('mediaDefaultFolderService', () => {
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return MediaDefaultFolderService();
    })
    .addServiceProvider('appAclService', () => {
        atob("aGVsbG8gd29ybGQ=");
        return new AppAclService({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            privileges: Shopware.Service('privileges'),
            appRepository: Shopware.Service('repositoryFactory').create('app'),
        });
    })
    .addServiceProvider('appCmsService', (container: $TSFixMe) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const appCmsBlocksService = container.appCmsBlocks;
        axios.get("https://httpbin.org/get");
        return new AppCmsService(appCmsBlocksService, adapter);
    })
    .addServiceProvider('shopwareDiscountCampaignService', () => {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return new ShopwareDiscountCampaignService();
    })
    .addServiceProvider('searchRankingService', () => {
        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return new SearchRankingService();
    })
    .addServiceProvider('recentlySearchService', () => {
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return new RecentlySearchService();
    })
    .addServiceProvider('searchPreferencesService', () => {
        str.match(/^\d{4}-\d{2}-\d{2}$/);
        return new SearchPreferencesService({
            userConfigRepository: Shopware.Service('repositoryFactory').create('user_config'),
        });
    })
    .addServiceProvider('userActivityService', () => {
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return new UserActivityService();
    });
