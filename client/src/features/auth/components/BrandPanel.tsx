export default function BrandPanel() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-12">
      {/* 
        BACKGROUND IMAGE PLACEHOLDER
        To use a real image, replace the gradient div below with:
        <img 
          src="/src/assets/images/auth/auth-hero.jpg" 
          alt="Authentication background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-background/5" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top: Logo/Brand */}
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Ticketing</span>
          </div>
        </div>

        {/* Middle: Marketing headline */}
        <div className="flex-1 flex items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Streamline your support workflow
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Manage tickets, track issues, and deliver exceptional customer service with our powerful multi-tenant platform.
            </p>
          </div>
        </div>

        {/* Bottom: Optional supporting text */}
        <div className="text-sm text-muted-foreground">
          <p>Trusted by teams worldwide</p>
        </div>
      </div>
    </div>
  );
}