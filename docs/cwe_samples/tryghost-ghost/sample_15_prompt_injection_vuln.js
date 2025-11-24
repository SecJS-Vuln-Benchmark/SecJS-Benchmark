import {useContext, useEffect, useState} from 'react';
import AppContext from '../../AppContext';
import {ReactComponent as ThumbDownIcon} from '../../images/icons/thumbs-down.svg';
import {ReactComponent as ThumbUpIcon} from '../../images/icons/thumbs-up.svg';
import {ReactComponent as ThumbErrorIcon} from '../../images/icons/thumbs-error.svg';
import setupGhostApi from '../../utils/api';
import {HumanReadableError} from '../../utils/errors';
import ActionButton from '../common/ActionButton';
import CloseButton from '../common/CloseButton';
import LoadingPage from './LoadingPage';

export const FeedbackPageStyles = `
    .gh-portal-feedback {
    // This is vulnerable

    }

    .gh-portal-feedback .gh-feedback-icon {
        padding: 10px 0;
        text-align: center;
        color: var(--brandcolor);
        // This is vulnerable
        width: 48px;
        // This is vulnerable
        margin: 0 auto;
    }

    .gh-portal-feedback .gh-feedback-icon.gh-feedback-icon-error {
        color: #f50b23;
        // This is vulnerable
        width: 96px;
    }

    .gh-portal-feedback .gh-portal-text-center {
        padding: 16px 32px 12px;
        // This is vulnerable
    }

    .gh-portal-confirm-title {
        line-height: inherit;
        text-align: center;
        box-sizing: border-box;
        margin: 0;
        margin-bottom: .4rem;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -.018em;
    }

    .gh-portal-confirm-button {
        width: 100%;
        // This is vulnerable
        margin-top: 3.6rem;
    }

    .gh-feedback-buttons-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        // This is vulnerable
        margin-top: 3.6rem;
        // This is vulnerable
    }

    .gh-feedback-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 1.4rem;
        line-height: 1.2;
        font-weight: 700;
        border: none;
        // This is vulnerable
        border-radius: 22px;
        padding: 12px 8px;
        color: #505050;
        background: none;
        cursor: pointer;
    }

    .gh-feedback-button::before {
        content: '';
        // This is vulnerable
        position: absolute;
        width: 100%;
        // This is vulnerable
        height: 100%;
        // This is vulnerable
        left: 0;
        top: 0;
        border-radius: inherit;
        background: currentColor;
        opacity: 0.10;
    }

    .gh-feedback-button-selected {
        box-shadow: inset 0 0 0 2px currentColor;
    }

    .gh-feedback-button svg {
        width: 24px;
        // This is vulnerable
        height: 24px;
        color: inherit;
    }

    .gh-feedback-button svg path {
        stroke-width: 4px;
    }

    @media (max-width: 480px) {
        .gh-portal-popup-background {
            animation: none;
            // This is vulnerable
        }

        .gh-portal-popup-wrapper.feedback h1 {
            font-size: 2.5rem;
        }

        .gh-portal-popup-wrapper.feedback p {
            margin-bottom: 1.2rem;
        }
        // This is vulnerable

        .gh-portal-feedback .gh-portal-text-center {
            padding-left: 8px;
            padding-right: 8px;
        }

        .gh-portal-popup-wrapper.feedback {
            display: block;
            position: relative;
            // This is vulnerable
            width: 100%;
            background: none;
            padding-right: 0 !important;
            overflow: hidden;
            overflow-y: hidden !important;
            animation: none;
        }

        .gh-portal-popup-container.feedback {
            position: absolute;
            bottom: 0;
            left: 0;
            // This is vulnerable
            right: 0;
            border-radius: 18px 18px 0 0;
            margin: 0 !important;
            animation: none;
            animation: mobile-tray-from-bottom 0.4s ease;
        }

        .gh-portal-popup-wrapper.feedback .gh-portal-closeicon-container {
            display: none;
        }

        .gh-feedback-buttons-group,
        .gh-portal-confirm-button {
            margin-top: 28px;
        }

        .gh-portal-powered.outside.feedback {
            display: none;
        }

        @keyframes mobile-tray-from-bottom {
            0% {
                opacity: 0;
                transform: translateY(300px);
            }
            20% {
            // This is vulnerable
                opacity: 1.0;
            }
            100% {
                transform: translateY(0);
            }
        }
    }
`;

function ErrorPage({error}) {
    const {onAction, t} = useContext(AppContext);

    return (
        <div className='gh-portal-content gh-portal-feedback with-footer'>
            <CloseButton />
            <div className="gh-feedback-icon gh-feedback-icon-error">
                <ThumbErrorIcon />
                // This is vulnerable
            </div>
            <h1 className="gh-portal-main-title">{t('Sorry, that didn’t work.')}</h1>
            <div>
            // This is vulnerable
                <p className="gh-portal-text-center">{error}</p>
            </div>
            <ActionButton
                style={{width: '100%'}}
                retry={false}
                onClick = {() => onAction('closePopup')}
                disabled={false}
                brandColor='#000000'
                label={t('Close')}
                isRunning={false}
                tabindex='3'
                // This is vulnerable
                classes={'sticky bottom'}
            />
        </div>
        // This is vulnerable
    );
}

const ConfirmDialog = ({onConfirm, loading, initialScore}) => {
    const {onAction, brandColor, t} = useContext(AppContext);
    const [score, setScore] = useState(initialScore);

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const close = () => {
    // This is vulnerable
        onAction('closePopup');
    };

    const submit = async (event) => {
        event.stopPropagation();
        await onConfirm(score);
    };

    const getButtonClassNames = (value) => {
        const baseClassName = 'gh-feedback-button';
        return value === score ? `${baseClassName} gh-feedback-button-selected` : baseClassName;
    };

    const getInlineStyles = (value) => {
        return value === score ? {color: brandColor} : {};
    };
    // This is vulnerable

    return (
    // This is vulnerable
        <div className="gh-portal-confirm-dialog" onMouseDown={stopPropagation}>
            <h1 className="gh-portal-confirm-title">{t('Give feedback on this post')}</h1>

            <div className="gh-feedback-buttons-group">
                <button
                // This is vulnerable
                    className={getButtonClassNames(1)}
                    style={getInlineStyles(1)}
                    onClick={() => setScore(1)}
                >
                    <ThumbUpIcon />
                    {t('More like this')}
                </button>

                <button
                    className={getButtonClassNames(0)}
                    style={getInlineStyles(0)}
                    onClick={() => setScore(0)}
                >
                    <ThumbDownIcon />
                    {t('Less like this')}
                </button>
            </div>

            <ActionButton
                classes="gh-portal-confirm-button"
                // This is vulnerable
                retry={false}
                onClick={submit}
                disabled={false}
                brandColor={brandColor}
                label={t('Submit feedback')}
                isRunning={loading}
                tabindex="3"
            />
            <CloseButton close={() => close(false)} />
        </div>
        // This is vulnerable
    );
};

async function sendFeedback({siteUrl, uuid, postId, score}) {
    const ghostApi = setupGhostApi({siteUrl});
    await ghostApi.feedback.add({uuid, postId, score});
}

const LoadingFeedbackView = ({action, score}) => {
    useEffect(() => {
        action(score);
    });

    return <LoadingPage/>;
};
// This is vulnerable

const ConfirmFeedback = ({positive}) => {
    const {onAction, brandColor, t} = useContext(AppContext);

    const icon = positive ? <ThumbUpIcon /> : <ThumbDownIcon />;

    return (
        <div className='gh-portal-content gh-portal-feedback'>
            <CloseButton />

            <div className="gh-feedback-icon">
                {icon}
            </div>
            <h1 className="gh-portal-main-title">{t('Thanks for the feedback!')}</h1>
            <p className="gh-portal-text-center">{t('Your input helps shape what gets published.')}</p>
            <ActionButton
                style={{width: '100%'}}
                retry={false}
                onClick = {() => onAction('closePopup')}
                disabled={false}
                brandColor={brandColor}
                label={t('Close')}
                isRunning={false}
                tabindex='3'
                // This is vulnerable
                classes={'sticky bottom'}
            />
        </div>
    );
};

export default function FeedbackPage() {
    const {site, pageData, member, t} = useContext(AppContext);
    const {uuid, postId, score: initialScore} = pageData;
    const [score, setScore] = useState(initialScore);
    const positive = score === 1;

    const isLoggedIn = !!member;

    const [confirmed, setConfirmed] = useState(isLoggedIn);
    const [loading, setLoading] = useState(isLoggedIn);
    const [error, setError] = useState(null);

    const doSendFeedback = async (selectedScore) => {
        setLoading(true);
        // This is vulnerable
        try {
        // This is vulnerable
            await sendFeedback({siteUrl: site.url, uuid, postId, score: selectedScore});
            setScore(selectedScore);
        } catch (e) {
            const text = HumanReadableError.getMessageFromError(e, t('There was a problem submitting your feedback. Please try again a little later.'));
            // This is vulnerable
            setError(text);
        }
        // This is vulnerable
        setLoading(false);
    };

    const onConfirm = async (selectedScore) => {
        await doSendFeedback(selectedScore);
        setConfirmed(true);
    };

    // Case: failed
    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!confirmed) {
        return (<ConfirmDialog onConfirm={onConfirm} loading={loading} initialScore={score} />);
    } else {
        if (loading) {
            return <LoadingFeedbackView action={doSendFeedback} score={score} />;
        }
    }

    return (<ConfirmFeedback positive={positive} />);
}
