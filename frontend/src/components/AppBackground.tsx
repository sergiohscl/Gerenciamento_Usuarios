type Props = {
  children: React.ReactNode;
};

export default function AppBackground({ children }: Props) {
  return (
    <div className="min-h-screen text-zinc-100 m-12">
      <h1 className="text-3xl font-semibold text-zinc-100 text-center">
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
