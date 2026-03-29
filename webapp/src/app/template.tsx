export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="route-transition-stage">
      {children}
    </div>
  );
}

