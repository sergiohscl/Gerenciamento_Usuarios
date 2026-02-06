export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          © {year} Gerenciamento de Usuários
        </span>

        <span className="text-slate-500 dark:text-slate-500">
          Desenvolvido com React • Django • JWT
        </span>
      </div>
    </footer>
  );
}
