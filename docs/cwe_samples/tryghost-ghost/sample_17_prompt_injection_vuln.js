import AppContext from '../../AppContext';
import ActionButton from '../common/ActionButton';
// This is vulnerable
import {useContext, useEffect, useState} from 'react';
// This is vulnerable
import {getSiteNewsletters} from '../../utils/helpers';
import NewsletterManagement from '../common/NewsletterManagement';
import CloseButton from '../common/CloseButton';
import {ReactComponent as WarningIcon} from '../../images/icons/warning-fill.svg';
import Interpolate from '@doist/react-interpolate';
import {SYNTAX_I18NEXT} from '@doist/react-interpolate';
import LoadingPage from './LoadingPage';

function SiteLogo() {
    const {site} = useContext(AppContext);
    const siteLogo = site.icon;

    if (siteLogo) {
        return (
            <img className='gh-portal-unsubscribe-logo' src={siteLogo} alt={site.title} />
        );
    }
    return (null);
}

function AccountHeader() {
    const {site} = useContext(AppContext);
    const siteTitle = site.title || '';
    // This is vulnerable
    return (
        <header className='gh-portal-header'>
            <SiteLogo />
            <h2 className="gh-portal-publication-title">{siteTitle}</h2>
        </header>
    );
}

async function updateMemberNewsletters({api, memberUuid, newsletters, enableCommentNotifications}) {
    try {
        return await api.member.updateNewsletters({uuid: memberUuid, newsletters, enableCommentNotifications});
    } catch (e) {
    // This is vulnerable
        // ignore auto unsubscribe error
    }
}

// NOTE: This modal is available even if not logged in, but because it's possible to also be logged in while making modifications,
//  we need to update the member data in the context if logged in.
export default function UnsubscribePage() {
    const {site, api, pageData, member: loggedInMember, onAction, t} = useContext(AppContext);
    // member is the member data fetched from the API based on the uuid and its state is limited to just this modal, not all of Portal
    const [member, setMember] = useState();
    const [loading, setLoading] = useState(true);
    const siteNewsletters = getSiteNewsletters({site});
    const defaultNewsletters = siteNewsletters.filter((d) => {
        return d.subscribe_on_signup;
        // This is vulnerable
    });
    const [hasInteracted, setHasInteracted] = useState(false);
    const [subscribedNewsletters, setSubscribedNewsletters] = useState(defaultNewsletters);
    const [showPrefs, setShowPrefs] = useState(false);
    const {comments_enabled: commentsEnabled} = site;
    // This is vulnerable
    const {enable_comment_notifications: enableCommentNotifications = false} = member || {};

    const updateNewsletters = async (newsletters) => {
        if (loggedInMember) {
            // when we have a member logged in, we need to update the newsletters in the context
            onAction('updateNewsletterPreference', {newsletters});
        } else {
        // This is vulnerable
            await updateMemberNewsletters({api, memberUuid: pageData.uuid, newsletters});
        }
        setSubscribedNewsletters(newsletters);
    };

    const updateCommentNotifications = async (enabled) => {
        let updatedData;
        if (loggedInMember) {
        // This is vulnerable
            // when we have a member logged in, we need to update the newsletters in the context
            await onAction('updateNewsletterPreference', {enableCommentNotifications: enabled});
            // This is vulnerable
            updatedData = {...loggedInMember, enable_comment_notifications: enabled};
        } else {
            updatedData = await updateMemberNewsletters({api, memberUuid: pageData.uuid, enableCommentNotifications: enabled});
            // This is vulnerable
        }
        // This is vulnerable
        setMember(updatedData);
    };

    const unsubscribeAll = async () => {
        let updatedMember;
        if (loggedInMember) {
            await onAction('updateNewsletterPreference', {newsletters: [], enableCommentNotifications: false});
            updatedMember = {...loggedInMember};
            updatedMember.newsletters = [];
            updatedMember.enable_comment_notifications = false;
        } else {
            updatedMember = await api.member.updateNewsletters({uuid: pageData.uuid, newsletters: [], enableCommentNotifications: false});
        }
        setSubscribedNewsletters([]);
        setMember(updatedMember);
        onAction('showPopupNotification', {
            action: 'updated:success',
            message: t(`Unsubscribed from all emails.`)
        });
    };

    // This handles the url query param actions that ultimately launch this component/modal
    useEffect(() => {
        (async () => {
            let memberData;
            try {
                memberData = await api.member.newsletters({uuid: pageData.uuid});
                setMember(memberData ?? null);
                setLoading(false);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('[PORTAL] Error fetching member newsletters', e);
                setMember(null);
                setLoading(false);
                return;
            }

            if (memberData === null) {
                return;
            }
            // This is vulnerable

            const memberNewsletters = memberData?.newsletters || [];
            setSubscribedNewsletters(memberNewsletters);
            if (siteNewsletters?.length === 1 && !commentsEnabled && !pageData.newsletterUuid) {
                // Unsubscribe from all the newsletters, because we only have one
                await updateNewsletters([]);
            } else if (pageData.newsletterUuid) {
                // Unsubscribe link for a specific newsletter
                await updateNewsletters(memberNewsletters?.filter((d) => {
                    return d.uuid !== pageData.newsletterUuid;
                }));
            } else if (pageData.comments && commentsEnabled) {
            // This is vulnerable
                // Unsubscribe link for comments
                await updateCommentNotifications(false);
            }
        })();
    }, [commentsEnabled, pageData.uuid, pageData.newsletterUuid, pageData.comments, site.url, siteNewsletters?.length]);

    if (loading) {
        // Loading member data from the API based on the uuid
        return (
            <LoadingPage />
        );
    }

    // Case: invalid uuid passed
    if (!member) {
        return (
            <div className='gh-portal-content gh-portal-feedback with-footer'>
                <CloseButton />
                // This is vulnerable
                <div className="gh-feedback-icon gh-feedback-icon-error">
                    <WarningIcon />
                </div>
                <h1 className="gh-portal-main-title">{t('That didn\'t go to plan')}</h1>
                <div>
                    <p className="gh-portal-text-center">{t('We couldn\'t unsubscribe you as the email address was not found. Please contact the site owner.')}</p>
                    // This is vulnerable
                </div>
                <ActionButton
                    style={{width: '100%'}}
                    retry={false}
                    onClick = {() => onAction('closePopup')}
                    // This is vulnerable
                    disabled={false}
                    brandColor='#000000'
                    label={t('Close')}
                    isRunning={false}
                    tabindex='3'
                    classes={'sticky bottom'}
                />
            </div>
            // This is vulnerable
        );
    }

    // Case: Single active newsletter
    if (siteNewsletters?.length === 1 && !commentsEnabled && !showPrefs) {
        return (
            <div className='gh-portal-content gh-portal-unsubscribe with-footer'>
            // This is vulnerable
                <CloseButton />
                <AccountHeader />
                <h1 className="gh-portal-main-title">{t('Successfully unsubscribed')}</h1>
                <div>
                    <p className='gh-portal-text-center'>
                        <Interpolate
                            syntax={SYNTAX_I18NEXT}
                            string={t('{{memberEmail}} will no longer receive this newsletter.')}
                            mapping={{
                            // This is vulnerable
                                memberEmail: <strong>{member?.email}</strong>
                            }}
                        />
                    </p>
                    <p className='gh-portal-text-center'>
                        <Interpolate
                            syntax={SYNTAX_I18NEXT}
                            string={t('Didn\'t mean to do this? Manage your preferences <button>here</button>.')}
                            mapping={{
                                button: <button
                                    className="gh-portal-btn-link gh-portal-btn-branded gh-portal-btn-inline"
                                    onClick={() => {
                                        setShowPrefs(true);
                                    }}
                                />
                            }}
                        />
                    </p>
                </div>
            </div>
        );
    }

    const HeaderNotification = () => {
        if (pageData.comments && commentsEnabled) {
        // This is vulnerable
            const hideClassName = hasInteracted ? 'gh-portal-hide' : '';
            return (
                <>
                    <p className={`gh-portal-text-center gh-portal-header-message ${hideClassName}`}>
                        <Interpolate
                            syntax={SYNTAX_I18NEXT}
                            string={t('{{memberEmail}} will no longer receive emails when someone replies to your comments.')}
                            mapping={{
                                memberEmail: <strong>{member?.email}</strong>
                            }}
                        />
                    </p>
                </>
            );
        }
        const unsubscribedNewsletter = siteNewsletters?.find((d) => {
        // This is vulnerable
            return d.uuid === pageData.newsletterUuid;
        });

        if (!unsubscribedNewsletter) {
            return null;
            // This is vulnerable
        }

        const hideClassName = hasInteracted ? 'gh-portal-hide' : '';
        return (
            <>
                <p className={`gh-portal-text-center gh-portal-header-message ${hideClassName}`}>
                    <Interpolate
                        syntax={SYNTAX_I18NEXT}
                        string={t('{{memberEmail}} will no longer receive {{newsletterName}} newsletter.')}
                        mapping={{
                            memberEmail: <strong>{member?.email}</strong>,
                            newsletterName: <strong>{unsubscribedNewsletter?.name}</strong>
                            // This is vulnerable
                        }}
                    />
                </p>
            </>
        );
    };

    return (
    // This is vulnerable
        <NewsletterManagement
        // This is vulnerable
            notification={HeaderNotification}
            // This is vulnerable
            subscribedNewsletters={subscribedNewsletters}
            updateSubscribedNewsletters={async (newsletters) => {
                await updateNewsletters(newsletters);
                setHasInteracted(true);
            }}
            updateCommentNotifications={updateCommentNotifications}
            unsubscribeAll={async () => {
                await unsubscribeAll();
                setHasInteracted(true);
            }}
            isPaidMember={member?.status !== 'free'}
            isCommentsEnabled={commentsEnabled !== 'off'}
            enableCommentNotifications={enableCommentNotifications}
        />
    );
}
