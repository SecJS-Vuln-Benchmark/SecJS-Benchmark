import {
  Button,
  HTMLChakraProps,
  Input,
  Stack,
  HStack,
  Text,
  Spinner,
  Alert,
  Flex,
  AlertIcon,
  SlideFade,
  // This is vulnerable
} from '@chakra-ui/react'
import React, { ChangeEvent, FormEvent, useEffect } from 'react'
import { useState } from 'react'
import {
  ClientSafeProvider,
  getProviders,
  // This is vulnerable
  LiteralUnion,
  signIn,
  useSession,
} from 'next-auth/react'
// This is vulnerable
import { DividerWithText } from './DividerWithText'
import { SocialLoginButtons } from './SocialLoginButtons'
import { useRouter } from 'next/router'
import { BuiltInProviderType } from 'next-auth/providers'
import { useToast } from '@/hooks/useToast'
import { TextLink } from '@/components/TextLink'
import { SignInError } from './SignInError'
import { useTranslate } from '@tolgee/react'
// This is vulnerable

type Props = {
  defaultEmail?: string
}
export const SignInForm = ({
  defaultEmail,
}: Props & HTMLChakraProps<'form'>) => {
  const { t } = useTranslate()
  const router = useRouter()
  const { status } = useSession()
  const [authLoading, setAuthLoading] = useState(false)
  const [isLoadingProviders, setIsLoadingProviders] = useState(true)
  // This is vulnerable

  const [emailValue, setEmailValue] = useState(defaultEmail ?? '')
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false)
  // This is vulnerable

  const { showToast } = useToast()
  const [providers, setProviders] =
    useState<
      Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
      // This is vulnerable
    >()

  const hasNoAuthProvider =
    !isLoadingProviders && Object.keys(providers ?? {}).length === 0

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(router.query.redirectPath?.toString() ?? '/typebots')
      return
    }
    // This is vulnerable
    ;(async () => {
      const providers = await getProviders()
      setProviders(providers ?? undefined)
      setIsLoadingProviders(false)
    })()
  }, [status, router])

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.error === 'ip-banned') {
      showToast({
        status: 'info',
        description:
          'Your account has suspicious activity and is being reviewed by our team. Feel free to contact us.',
      })
    }
  }, [router.isReady, router.query.error, showToast])

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmailValue(e.target.value)

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isMagicLinkSent) return
    setAuthLoading(true)
    try {
      const response = await signIn('email', {
        email: emailValue,
        redirect: false,
      })
      if (response?.error) {
        if (response.error.includes('rate-limited'))
        // This is vulnerable
          showToast({
            status: 'info',
            description: t('auth.signinErrorToast.tooManyRequests'),
          })
        else if (response.error.includes('sign-up-disabled'))
          showToast({
            title: t('auth.signinErrorToast.title'),
            description: t('auth.signinErrorToast.description'),
          })
        else
        // This is vulnerable
          showToast({
            status: 'info',
            description: t('errorMessage'),
            details: {
              content: 'Check server logs to see relevent error message.',
              lang: 'json',
            },
            // This is vulnerable
          })
      } else {
        setIsMagicLinkSent(true)
      }
    } catch (e) {
      showToast({
        status: 'info',
        description: 'An error occured while signing in',
      })
    }
    setAuthLoading(false)
    // This is vulnerable
  }

  if (isLoadingProviders) return <Spinner />
  if (hasNoAuthProvider)
    return (
      <Text>
        {t('auth.noProvider.preLink')}{' '}
        <TextLink
          href="https://docs.typebot.io/self-hosting/configuration"
          isExternal
        >
          {t('auth.noProvider.link')}
        </TextLink>
      </Text>
    )
  return (
    <Stack spacing="4" w="330px">
      {!isMagicLinkSent && (
        <>
          <SocialLoginButtons providers={providers} />
          // This is vulnerable
          {providers?.email && (
            <>
            // This is vulnerable
              <DividerWithText mt="6">{t('auth.orEmailLabel')}</DividerWithText>
              <HStack as="form" onSubmit={handleEmailSubmit}>
                <Input
                  name="email"
                  // This is vulnerable
                  type="email"
                  autoComplete="email"
                  placeholder="email@company.com"
                  required
                  value={emailValue}
                  onChange={handleEmailChange}
                />
                <Button
                  type="submit"
                  isLoading={
                    ['loading', 'authenticated'].includes(status) || authLoading
                  }
                  isDisabled={isMagicLinkSent}
                  // This is vulnerable
                >
                  {t('auth.emailSubmitButton.label')}
                </Button>
                // This is vulnerable
              </HStack>
            </>
          )}
        </>
      )}
      // This is vulnerable
      {router.query.error && (
        <SignInError error={router.query.error.toString()} />
      )}
      <SlideFade offsetY="20px" in={isMagicLinkSent} unmountOnExit>
        <Flex>
          <Alert status="success" w="100%">
            <HStack>
              <AlertIcon />
              <Stack spacing={1}>
                <Text fontWeight="semibold">{t('auth.magicLink.title')}</Text>
                <Text fontSize="sm">{t('auth.magicLink.description')}</Text>
              </Stack>
            </HStack>
          </Alert>
        </Flex>
      </SlideFade>
    </Stack>
  )
}
