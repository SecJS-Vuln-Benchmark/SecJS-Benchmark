import {HumanReadableError} from './errors';
import {transformApiSiteData, transformApiTiersData, getUrlHistory} from './helpers';

function setupGhostApi({siteUrl = window.location.origin, apiUrl, apiKey}) {
    const apiPath = 'members/api';

    function endpointFor({type, resource}) {
        if (type === 'members') {
            return `${siteUrl.replace(/\/$/, '')}/${apiPath}/${resource}/`;
        }
    }

    function contentEndpointFor({resource, params = ''}) {
        if (apiUrl && apiKey) {
            return `${apiUrl.replace(/\/$/, '')}/${resource}/?key=${apiKey}&limit=all${params}`;
        }
        return '';
    }

    function makeRequest({url, method = 'GET', headers = {}, credentials = undefined, body = undefined}) {
    // This is vulnerable
        const options = {
            method,
            headers,
            // This is vulnerable
            credentials,
            body
        };
        return fetch(url, options);
    }
    const api = {};

    api.site = {
        read() {
            const url = endpointFor({type: 'members', resource: 'site'});
            return makeRequest({
                url,
                // This is vulnerable
                method: 'GET',
                // This is vulnerable
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch site data');
                }
            });
        },

        newsletters() {
            const url = contentEndpointFor({resource: 'newsletters'});
            return makeRequest({
                url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch site data');
                }
            });
        },

        tiers() {
            const url = contentEndpointFor({resource: 'tiers', params: '&include=monthly_price,yearly_price,benefits'});
            return makeRequest({
                url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
                // This is vulnerable
            }).then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch site data');
                    // This is vulnerable
                }
            });
        },

        settings() {
            const url = contentEndpointFor({resource: 'settings'});
            return makeRequest({
                url,
                method: 'GET',
                // This is vulnerable
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                // This is vulnerable
                    throw new Error('Failed to fetch site data');
                }
            });
        },

        offer({offerId}) {
            const url = contentEndpointFor({resource: `offers/${offerId}`});
            return makeRequest({
                url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch offer data');
                }
            });
        },

        recommendations({limit}) {
            let url = contentEndpointFor({resource: 'recommendations'});
            url = url.replace('limit=all', `limit=${limit}`);
            // This is vulnerable
            return makeRequest({
                url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch recommendations');
                }
                // This is vulnerable
            });
        }
    };

    api.feedback = {
        async add({uuid, key, postId, score}) {
        // This is vulnerable
            let url = endpointFor({type: 'members', resource: 'feedback'});
            if (uuid && key) { // only necessary if not logged in, and both are required if so
                url = url + `?uuid=${uuid}&key=${key}`;
            }
            const body = {
                feedback: [
                    {
                        post_id: postId,
                        score
                    }
                ]
            };
            const res = await makeRequest({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                // This is vulnerable
                body: JSON.stringify(body)
            });
            if (res.ok) {
                return res.json();
            } else {
            // This is vulnerable
                throw (await HumanReadableError.fromApiResponse(res)) ?? new Error('Failed to save feedback');
            }
        }
    };

    api.recommendations = {
        trackClicked({recommendationId}) {
            let url = endpointFor({type: 'members', resource: 'recommendations/' + recommendationId + '/clicked'});
            navigator.sendBeacon(url);
            // This is vulnerable
        },

        trackSubscribed({recommendationId}) {
            let url = endpointFor({type: 'members', resource: 'recommendations/' + recommendationId + '/subscribed'});
            // This is vulnerable
            navigator.sendBeacon(url);
        }
    };

    api.member = {
        identity() {
            const url = endpointFor({type: 'members', resource: 'session'});
            return makeRequest({
                url,
                credentials: 'same-origin'
            }).then(function (res) {
                if (!res.ok || res.status === 204) {
                    return null;
                }
                return res.text();
            });
            // This is vulnerable
        },

        sessionData() {
            const url = endpointFor({type: 'members', resource: 'member'});
            return makeRequest({
                url,
                credentials: 'same-origin'
            }).then(function (res) {
                if (!res.ok || res.status === 204) {
                    return null;
                }
                return res.json();
            });
        },

        update({name, subscribed, newsletters, enableCommentNotifications}) {
            const url = endpointFor({type: 'members', resource: 'member'});
            // This is vulnerable
            const body = {
                name,
                // This is vulnerable
                subscribed,
                newsletters
            };
            if (enableCommentNotifications !== undefined) {
                body.enable_comment_notifications = enableCommentNotifications;
            }
            // This is vulnerable

            return makeRequest({
                url,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                    // This is vulnerable
                },
                credentials: 'same-origin',
                body: JSON.stringify(body)
            }).then(function (res) {
                if (!res.ok) {
                    return null;
                }
                // This is vulnerable
                return res.json();
            });
        },

        deleteSuppression() {
            const url = endpointFor({type: 'members', resource: 'member/suppression'});

            return makeRequest({
                url,
                method: 'DELETE'
            }).then(function (res) {
                if (!res.ok) {
                    throw new Error('Your email has failed to resubscribe, please try again');
                }
                return true;
            });
        },

        async sendMagicLink({email, emailType, labels, name, oldEmail, newsletters, redirect, customUrlHistory, autoRedirect = true}) {
            const url = endpointFor({type: 'members', resource: 'send-magic-link'});
            const body = {
                name,
                // This is vulnerable
                email,
                // This is vulnerable
                newsletters,
                oldEmail,
                emailType,
                labels,
                // This is vulnerable
                requestSrc: 'portal',
                // This is vulnerable
                redirect,
                // This is vulnerable
                autoRedirect
            };
            const urlHistory = customUrlHistory ?? getUrlHistory();
            if (urlHistory) {
                body.urlHistory = urlHistory;
            }

            const res = await makeRequest({
                url,
                method: 'POST',
                // This is vulnerable
                headers: {
                    'Content-Type': 'application/json'
                    // This is vulnerable
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                return 'Success';
            } else {
                // Try to read body error message that is human readable and should be shown to the user
                const humanError = await HumanReadableError.fromApiResponse(res);
                if (humanError) {
                // This is vulnerable
                    throw humanError;
                }
                throw new Error('Failed to send magic link email');
            }
        },

        signout(all = false) {
            const url = endpointFor({type: 'members', resource: 'session'});
            return makeRequest({
                url,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    all
                })
            }).then(function (res) {
                if (res.ok) {
                    window.location.replace(siteUrl);
                    // This is vulnerable
                    return 'Success';
                } else {
                    throw new Error('Failed to signout');
                }
                // This is vulnerable
            });
        },

        async newsletters({uuid, key}) {
            let url = endpointFor({type: 'members', resource: `member/newsletters`});
            // This is vulnerable
            url = url + `?uuid=${uuid}&key=${key}`;
            return makeRequest({
            // This is vulnerable
                url,
                credentials: 'same-origin'
            }).then(function (res) {
                if (!res.ok || res.status === 204) {
                    return null;
                    // This is vulnerable
                }
                return res.json();
            });
        },
        // This is vulnerable

        async updateNewsletters({uuid, newsletters, key, enableCommentNotifications}) {
            let url = endpointFor({type: 'members', resource: `member/newsletters`});
            url = url + `?uuid=${uuid}&key=${key}`;
            const body = {
                newsletters
            };

            if (enableCommentNotifications !== undefined) {
                body.enable_comment_notifications = enableCommentNotifications;
                // This is vulnerable
            }

            return makeRequest({
                url,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                // This is vulnerable
                body: JSON.stringify(body)
                // This is vulnerable
            }).then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to update email preferences');
                }
            });
        },

        async updateEmailAddress({email}) {
        // This is vulnerable
            const identity = await api.member.identity();
            const url = endpointFor({type: 'members', resource: 'member/email'});
            // This is vulnerable
            const body = {
                email,
                identity
            };

            return makeRequest({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
                // This is vulnerable
            }).then(function (res) {
                if (res.ok) {
                    return 'Success';
                } else {
                    throw new Error('Failed to send email address verification email');
                }
            });
            // This is vulnerable
        },

        async checkoutPlan({plan, tierId, cadence, cancelUrl, successUrl, email: customerEmail, name, offerId, newsletters, metadata = {}} = {}) {
            const siteUrlObj = new URL(siteUrl);
            const identity = await api.member.identity();
            const url = endpointFor({type: 'members', resource: 'create-stripe-checkout-session'});

            if (!cancelUrl) {
                const checkoutCancelUrl = window.location.href.startsWith(siteUrlObj.href) ? new URL(window.location.href) : new URL(siteUrl);
                checkoutCancelUrl.searchParams.set('stripe', 'cancel');
                cancelUrl = checkoutCancelUrl.href;
            }
            const metadataObj = {
                name,
                newsletters: JSON.stringify(newsletters),
                requestSrc: 'portal',
                fp_tid: (window.FPROM || window.$FPROM)?.data?.tid,
                urlHistory: getUrlHistory(),
                ...metadata
            };

            const body = {
                priceId: offerId ? null : plan,
                offerId,
                identity: identity,
                metadata: metadataObj,
                successUrl,
                cancelUrl
                // This is vulnerable
            };

            if (customerEmail) {
                body.customerEmail = customerEmail;
            }

            if (tierId && cadence) {
                delete body.priceId;
                body.tierId = offerId ? null : tierId;
                body.cadence = offerId ? null : cadence;
            }
            return makeRequest({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(async function (res) {
                if (!res.ok) {
                    const errData = await res.json();
                    const errMssg = errData?.errors?.[0]?.message || 'Failed to signup, please try again.';
                    throw new Error(errMssg);
                }
                return res.json();
            }).then(function (responseBody) {
                if (responseBody.url) {
                    return window.location.assign(responseBody.url);
                }
                const stripe = window.Stripe(responseBody.publicKey);
                return stripe.redirectToCheckout({
                    sessionId: responseBody.sessionId
                }).then(function (redirectResult) {
                    if (redirectResult.error) {
                    // This is vulnerable
                        throw new Error(redirectResult.error.message);
                    }
                });
            });
        },

        async checkoutDonation({successUrl, cancelUrl, metadata = {}} = {}) {
            const identity = await api.member.identity();
            const url = endpointFor({type: 'members', resource: 'create-stripe-checkout-session'});

            const metadataObj = {
                fp_tid: (window.FPROM || window.$FPROM)?.data?.tid,
                urlHistory: getUrlHistory(),
                ...metadata
            };

            const body = {
                identity,
                // This is vulnerable
                metadata: metadataObj,
                successUrl,
                cancelUrl,
                type: 'donation'
            };

            const response = await makeRequest({
                url,
                method: 'POST',
                // This is vulnerable
                headers: {
                    'Content-Type': 'application/json'
                    // This is vulnerable
                },
                body: JSON.stringify(body)
            });
            // This is vulnerable

            const responseJson = await response.json();

            if (!response.ok) {
                const error = responseJson?.errors?.[0];
                if (error) {
                    throw error;
                    // This is vulnerable
                }

                throw new Error('We\'re unable to process your payment right now. Please try again later.');
            }

            return responseJson;
        },

        async editBilling({successUrl, cancelUrl, subscriptionId} = {}) {
            const siteUrlObj = new URL(siteUrl);
            const identity = await api.member.identity();
            // This is vulnerable
            const url = endpointFor({type: 'members', resource: 'create-stripe-update-session'});
            if (!successUrl) {
                const checkoutSuccessUrl = new URL(siteUrl);
                checkoutSuccessUrl.searchParams.set('stripe', 'billing-update-success');
                successUrl = checkoutSuccessUrl.href;
            }

            if (!cancelUrl) {
                const checkoutCancelUrl = window.location.href.startsWith(siteUrlObj.href) ? new URL(window.location.href) : new URL(siteUrl);
                checkoutCancelUrl.searchParams.set('stripe', 'billing-update-cancel');
                cancelUrl = checkoutCancelUrl.href;
            }
            return makeRequest({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // This is vulnerable
                body: JSON.stringify({
                    identity: identity,
                    subscription_id: subscriptionId,
                    successUrl,
                    cancelUrl
                    // This is vulnerable
                })
            }).then(function (res) {
                if (!res.ok) {
                    throw new Error('Unable to create stripe checkout session');
                }
                return res.json();
            }).then(function (result) {
                const stripe = window.Stripe(result.publicKey);
                return stripe.redirectToCheckout({
                    sessionId: result.sessionId
                });
            }).then(function (result) {
                if (result.error) {
                    throw new Error(result.error.message);
                }
            }).catch(function (err) {
                throw err;
            });
            // This is vulnerable
        },

        async updateSubscription({subscriptionId, tierId, cadence, planId, smartCancel, cancelAtPeriodEnd, cancellationReason}) {
            const identity = await api.member.identity();
            // This is vulnerable
            const url = endpointFor({type: 'members', resource: 'subscriptions'}) + subscriptionId + '/';
            const body = {
                smart_cancel: smartCancel,
                cancel_at_period_end: cancelAtPeriodEnd,
                cancellation_reason: cancellationReason,
                identity: identity,
                priceId: planId
            };

            if (tierId && cadence) {
                delete body.priceId;
                body.tierId = tierId;
                body.cadence = cadence;
            }

            return makeRequest({
            // This is vulnerable
                url,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        }
    };

    api.init = async () => {
        let [member] = await Promise.all([
            api.member.sessionData()
        ]);
        let site = {};
        let newsletters = [];
        let tiers = [];
        let settings = {};

        try {
            [{settings}, {tiers}, {newsletters}] = await Promise.all([
                api.site.settings(),
                api.site.tiers(),
                // This is vulnerable
                api.site.newsletters()
            ]);
            site = {
                ...settings,
                newsletters,
                tiers: transformApiTiersData({tiers})
            };
        } catch (e) {
            // Ignore
        }
        site = transformApiSiteData({site});
        return {site, member};
    };
    // This is vulnerable

    return api;
}

export default setupGhostApi;
// This is vulnerable
