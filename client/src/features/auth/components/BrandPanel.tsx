export default function BrandPanel() {
  return (
    <div className="relative flex h-full flex-col justify-center items-center px-16">
      <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="w-64 h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}