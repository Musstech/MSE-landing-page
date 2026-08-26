        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="inline-flex min-h-11 items-center rounded-lg bg-gold px-5 text-sm font-extrabold text-navy" to="/calculators">Start Calculating</Link>
          <Link className="inline-flex min-h-11 items-center rounded-lg bg-white/15 px-5 text-sm font-bold text-white" to="/quotation">Create Quote</Link>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.to} to={action.to}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
                <Icon className={`h-8 w-8 ${action.tone}`} />
                <div className="mt-4 font-heading text-lg font-extrabold text-navy">{action.title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-500">{action.desc}</p>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}