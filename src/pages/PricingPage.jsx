import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

const freeFeatures = ['Load Calculator', 'Panel Sizing', 'MPPT Calculator', 'Solar Quiz']

const monthlyFeatures = [...freeFeatures, 'Basic Quotation']
const yearlyFeatures = [...monthlyFeatures, 'Advanced Quotation']

const featureRows = [
  ['Load Calculator', true, true, true],
  ['Panel Sizing', true, true, true],
  ['MPPT Calculator', true, true, true],
  ['Solar Quiz', true, true, true],
  ['Basic Quotation', false, true, true],
  ['Advanced Quotation', false, false, true],
]

export function PricingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { planCode, refreshSubscription } = useSubscription()
  const [processingPlan, setProcessingPlan] = useState('')
  const [error, setError] = useState('')

  const returnedFromCheckout = useMemo(
    () =>
      ['reference', 'trxref', 'status'].some((key) =>
        searchParams.has(key)
      ),
    [searchParams]
  )

  async function upgrade(plan) {
    setError('')

    if (!user) {
      navigate('/auth')
      return
    }

    if (!supabase) {
      setError('Secure checkout is temporarily unavailable. Please try again later.')
      return
    }

    setProcessingPlan(plan)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('Your session has expired. Please sign in again.')
      }

      const { data, error: functionError } =
        await supabase.functions.invoke('initialize-payment', {
          body: { plan_code: plan },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

      if (functionError) throw functionError

      if (!data?.authorization_url) {
        throw new Error('Checkout link was not returned.')
      }

      window.location.href = data.authorization_url
    } catch {
      setError('Unable to start secure checkout. Please try again.')
      setProcessingPlan('')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Professional Access"
        subtitle="Choose the Solar Hub plan that fits the way you work."
      />

      {returnedFromCheckout ? (
        <Card className="border-sky-100 bg-sky-50/70 dark:bg-sky-400/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your payment is being confirmed. Your Professional access will
              appear once payment confirmation is complete.
            </p>

            <Button variant="soft" onClick={refreshSubscription}>
              Refresh Status
            </Button>
          </div>
        </Card>
      ) : null}

      {error ? (
        <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <PlanCard
          title="Free"
          description="Essential tools to get started."
          features={freeFeatures}
          current={planCode === 'free'}
          action={
            <Button className="w-full" variant="soft" disabled>
              {planCode === 'free' ? 'Current Plan' : 'Included'}
            </Button>
          }
        />

        <PlanCard
          title="Monthly Premium"
          description="Professional solar design and project tools."
          features={monthlyFeatures}
          current={planCode === 'monthly'}
          highlighted
          action={
            planCode === 'monthly' ? (
              <Button className="w-full" variant="soft" disabled>
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="primary"
                disabled={Boolean(processingPlan)}
                onClick={() => upgrade('monthly')}
              >
                {processingPlan === 'monthly' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}

                {processingPlan === 'monthly'
                  ? 'Preparing secure checkout...'
                  : 'Upgrade Monthly'}
              </Button>
            )
          }
        />

        <PlanCard
          title="Yearly Premium"
          description="Full professional access with yearly billing."
          features={yearlyFeatures}
          current={planCode === 'yearly'}
          action={
            planCode === 'yearly' ? (
              <Button className="w-full" variant="soft" disabled>
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="primary"
                disabled={Boolean(processingPlan)}
                onClick={() => upgrade('yearly')}
              >
                {processingPlan === 'yearly' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}

                {processingPlan === 'yearly'
                  ? 'Preparing secure checkout...'
                  : 'Upgrade Yearly'}
              </Button>
            )
          }
        />
      </div>

      {!user ? (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Sign in or create an account before upgrading. You can still
              review plans here.
            </p>

            <Button as={Link} to="/auth" variant="soft">
              Go to Account
            </Button>
          </div>
        </Card>
      ) : null}

      <Card>
        <h3 className="mb-4 font-heading text-lg font-extrabold text-slate-950 dark:text-white">
          Feature Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-white/10">
                <th className="py-3">Feature</th>
                <th className="py-3 text-center">Free</th>
                <th className="py-3 text-center">Monthly</th>
                <th className="py-3 text-center">Yearly</th>
              </tr>
            </thead>

            <tbody>
              {featureRows.map(([feature, free, monthly, yearly]) => (
                <tr
                  key={feature}
                  className="border-b border-slate-100 dark:border-white/10"
                >
                  <td className="py-3 font-semibold text-slate-700 dark:text-slate-200">
                    {feature}
                  </td>

                  <td className="py-3 text-center">
                    {free ? <Check /> : <Dash />}
                  </td>

                  <td className="py-3 text-center">
                    {monthly ? <Check /> : <Dash />}
                  </td>

                  <td className="py-3 text-center">
                    {yearly ? <Check /> : <Dash />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function PlanCard({
  title,
  description,
  features,
  action,
  current,
  highlighted,
}) {
  return (
    <Card
      className={`${
        highlighted
          ? 'border-sky-200 bg-sky-50/60 dark:bg-sky-400/10'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-xl font-extrabold text-slate-950 dark:text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        {current ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
            Current
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
          >
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
            {feature}
          </div>
        ))}
      </div>

      <div className="mt-6">{action}</div>
    </Card>
  )
}

function Check() {
  return (
    <CheckCircle2 className="mx-auto h-4 w-4 text-sky-600 dark:text-sky-300" />
  )
}

function Dash() {
  return <span className="text-slate-300">-</span>
}
