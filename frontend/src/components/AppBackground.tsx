type Props = {
  children: React.ReactNode;
};

export default function AppBackground({ children }: Props) {
  return (
    <div className="relative h-full w-full text-zinc-100 overflow-x-hidden">
      <h1 className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 z-10 text-3xl font-semibold text-zinc-100">
        Gerenciamento de Usuários
      </h1>

      <div
        className="
          fixed inset-0 -z-10
          bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.90)_60%,rgba(0,0,0,1)_100%)]
        "
      />
      <div
        className="
          fixed inset-0 -z-10
          [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_70%,rgba(0,0,0,0.95)_100%)]
        "
      />

      {children}
    </div>
  );
}
