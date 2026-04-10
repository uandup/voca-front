const todos = ['Assigned Word - 80 ', 'Word Test', 'Example Sentence Test', 'Reivew Test (3)'];

export function TodoList() {
  return (
    <aside className="h-full">
      <div className="bg-surface-container-lowest rounded-tl-2xl rounded-bl-2xl border border-outline-variant/10 shadow-md p-5 flex flex-col gap-4 h-full">
        <h2 className="text-sm font-bold font-headline text-on-surface">To-Do</h2>
        <ul className="flex flex-col gap-3 overflow-y-auto [scrollbar-width:thin]">
          {todos.map((text, i) => (
            <li
              key={i}
              className="bg-surface-container-high rounded-lg px-4 py-3 text-sm font-medium text-on-surface"
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
