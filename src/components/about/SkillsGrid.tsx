import { skills } from "@/lib/content";

/** Skills set like the end credits: the role in small gold capitals, the names beneath, spaced not separated. */
export function SkillsGrid() {
  return (
    <dl className="space-y-12 text-center md:space-y-14">
      {skills.map((category) => (
        <div key={category.category}>
          <dt className="credit text-[0.7rem] text-gold">{category.category}</dt>
          <dd className="mx-auto mt-4 max-w-3xl">
            <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 md:gap-x-9">
              {category.items.map((skill) => (
                <li key={skill.name} className="whitespace-nowrap font-display text-[1.05rem] md:text-[1.15rem] tracking-[0.04em] text-bone">
                  {skill.name}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
