'use client'

import React, { Fragment } from 'react'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { projectHasPaymentMethod } from '@cloud/_utilities/projectHasPaymentMethod'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Message } from '@root/app/_components/Message'

export const TrialMessage: React.FC<{
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> = ({ project, team }) => {
  const pathname = usePathname()

  const daysLeft = Math.floor(
    (new Date(project?.stripeSubscription?.trial_end * 1000).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24),
  )

  const trialEndDate = new Date(project?.stripeSubscription?.trial_end * 1000).toLocaleDateString()

  const hasPaymentError = !projectHasPaymentMethod(project) && !teamHasDefaultPaymentMethod(team)

  const billingHref = `/cloud/${team?.slug}/${project?.slug}/settings/billing`
  const isOnBillingPage = pathname === billingHref

  const planHref = `/cloud/${team?.slug}/${project?.slug}/settings/plan`
  const isOnPlanPage = pathname === planHref

  let severity = 'message'
  if (hasPaymentError) severity = daysLeft < 3 ? 'error' : daysLeft < 7 ? 'warning' : 'message'

  return (
    <Message
      {...{
        [severity]: (
          <Fragment>
            {`There ${daysLeft === 1 ? 'is' : 'are'} `}
            <b> {` ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}</b> {` left in your free trial.`}
            {!projectHasPaymentMethod && !teamHasDefaultPaymentMethod ? (
              <Fragment>
                {' '}
                {!isOnBillingPage ? (
                  <Link href={billingHref}>Add a payment method</Link>
                ) : (
                  'Add a payment method below'
                )}
                {' to ensure '}
                <b>{project?.slug}</b>
                {` remains online.`}
              </Fragment>
            ) : (
              <Fragment>
                {` We will charge your payment method on ${trialEndDate}. `}
                {!isOnPlanPage ? (
                  <Link href={`/cloud/${team?.slug}/${project?.slug}/settings/plan`}>
                    Cancel anytime
                  </Link>
                ) : (
                  'Cancel anytime'
                )}
                {'.'}
              </Fragment>
            )}
          </Fragment>
        ),
      }}
    />
  )
}
